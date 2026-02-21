import { AgentConfig, OptimizationContext, KeywordExtractionResult } from '@/lib/ai/strands/types'
import { analyzeJobDescriptionGraph } from '@/lib/ai/strands/jd-refinement-graph'
import { generateJobTitleGraph } from '@/lib/ai/strands/job-title-graph'
import { generateSummaryGraph } from '@/lib/ai/strands/summary-graph'
import { tailorExperienceToJDGraph } from '@/lib/ai/strands/experience-tailoring-graph'
import { sortSkillsGraph } from '@/lib/ai/strands/skills-sorting-graph'
import { extractSkillsGraph } from '@/lib/ai/strands/skills-extraction-graph'
import { generateCoverLetterGraph } from '@/lib/ai/strands/cover-letter-graph'
import { createTailoringAgents } from '@/lib/ai/strands/experience-tailoring/agents'
import { runAgentStream, extractToolOutput } from '@/lib/ai/strands/experience-tailoring/utils'
import type { ResumeData, WorkExperience, SkillGroup } from '@/types'

/**
 * Represents the current progress of the AI generation pipeline.
 */
export interface PipelineProgress {
  currentStep: number
  totalSteps: number
  message: string
  done: boolean
  // Partial results available as each step completes
  refinedJD?: string
  jobTitle?: string
  summary?: string
  workExperiences?: WorkExperience[]
  skills?: SkillGroup[]
  coverLetter?: string
  extractedSkills?: string
}

/**
 * The final results gathered from a completed AI generation pipeline run.
 */
export interface PipelineResult {
  refinedJD: string
  jobTitle: string
  summary: string
  workExperiences: WorkExperience[]
  skills: SkillGroup[]
  coverLetter: string
  extractedSkills: string
}

/**
 * Orchestrates all AI generation jobs in 4 optimised parallel phases:
 *
 * Phase 1 (parallel):
 *   - Refine Job Description
 *   - Extract Skills from raw JD (only needs raw JD, no dependency on refinement)
 *
 * Phase 2a (parallel, after refined JD ready):
 *   - Generate Job Title
 *   - Pre-extract JD keywords (once, shared across all work experiences)
 *
 * Phase 2b (parallel, after Phase 2a):
 *   - Generate Summary
 *   - Sort Skills
 *   - Tailor each Work Experience (serial within this sub-task to avoid rate limiting)
 *
 * Phase 3 (sequential, after Phase 2b):
 *   - Generate Cover Letter (genuinely depends on all prior outputs)
 *
 * This design eliminates redundant JD keyword extraction (was N+1 calls, now 1),
 * removes unnecessary sequential blocking between independent graphs, and preserves
 * the ability to call each individual graph standalone from UI buttons.
 */
export async function runAIGenerationPipeline(
  resumeData: ResumeData,
  jobDescription: string,
  config: AgentConfig,
  onProgress?: (progress: PipelineProgress) => void
): Promise<PipelineResult> {
  const workExperiences = resumeData.workExperience || []

  // Step count: Phase1(2) + Phase2a(2) + Phase2b(1+1+N) + Phase3(1)
  const totalSteps = 7 + workExperiences.length
  let currentStep = 0

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 1 (parallel): JD Refinement  +  Skills Extraction
  //   extractSkillsGraph only needs the raw JD, so it can start immediately.
  //   Running it here saves N_experiences × tailoring_time of waiting later.
  // ─────────────────────────────────────────────────────────────────────────
  currentStep++
  const phase1Step = currentStep
  onProgress?.({
    currentStep: phase1Step,
    totalSteps,
    message: 'Analyzing job description & extracting skills (parallel)...',
    done: false,
  })

  const [refinedJD, extractedSkills] = await Promise.all([
    analyzeJobDescriptionGraph(jobDescription, config, (progress) => {
      if (progress.content && !progress.done) {
        onProgress?.({
          currentStep: phase1Step,
          totalSteps,
          message: progress.content,
          done: false,
        })
      }
    }),
    extractSkillsGraph(jobDescription, config),
  ])

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2a (parallel): Job Title  +  JD Keyword Extraction
  //   Both depend only on refinedJD and produce independent outputs.
  //   Pre-extracting keywords ONCE here means every tailorExperienceToJDGraph
  //   call receives them via OptimizationContext and skips its own extraction.
  // ─────────────────────────────────────────────────────────────────────────
  currentStep++
  const phase2aStep = currentStep
  onProgress?.({
    currentStep: phase2aStep,
    totalSteps,
    message: 'Generating job title & analyzing JD keywords (parallel)...',
    done: false,
    refinedJD,
    extractedSkills,
  })

  const tailoringAgents = createTailoringAgents(config)
  const allAchievements = workExperiences.flatMap((exp) => (exp.keyAchievements || []).map((a) => a.text))

  const keywordExtractionPrompt =
    `Job Description:\n${refinedJD}\n\n` +
    `Overall Resume Achievements:\n${allAchievements.join('\n')}\n\n` +
    `Identify JD keywords missing from the achievements for ATS optimization.`

  const [jobTitle] = await Promise.all([
    generateJobTitleGraph(resumeData, refinedJD, config, (progress) => {
      if (progress.content && !progress.done) {
        onProgress?.({
          currentStep: phase2aStep,
          totalSteps,
          message: progress.content,
          done: false,
          refinedJD,
          extractedSkills,
        })
      }
    }),
    runAgentStream(
      await tailoringAgents.keywordExtractor.stream(keywordExtractionPrompt),
      (p) => {
        if (p.content && !p.done) {
          onProgress?.({
            currentStep: phase2aStep,
            totalSteps,
            message: `JD Strategy: ${p.content}`,
            done: false,
            refinedJD,
            extractedSkills,
          })
        }
      },
      'Extracting Keywords',
      { silentText: true }
    ),
  ])

  const extractedKeywords = extractToolOutput<KeywordExtractionResult>(
    tailoringAgents.keywordExtractor.messages,
    'finalize_keyword_extraction',
    {
      missingKeywords: [],
      criticalKeywords: [],
      niceToHaveKeywords: [],
    }
  )

  const optimizationContext: OptimizationContext = {
    refinedJD,
    keywords: extractedKeywords,
    extractedSkills,
    jobTitle,
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2b (parallel): Summary  +  Skills Sorting  +  Experience Tailoring
  //   All three depend on refinedJD + jobTitle + keywords, but are fully
  //   independent of each other.
  //   • Summary and Skills Sorting run concurrently.
  //   • Experience Tailoring loop remains serial to avoid rate limiting,
  //     but now runs in parallel with Summary and Skills Sorting.
  // ─────────────────────────────────────────────────────────────────────────
  currentStep++
  const phase2bBaseStep = currentStep
  onProgress?.({
    currentStep: phase2bBaseStep,
    totalSteps,
    message: 'Generating summary, sorting skills & tailoring experiences (parallel)...',
    done: false,
    refinedJD,
    jobTitle,
    extractedSkills,
  })

  // Serial experience tailoring sub-task (runs concurrently with summary + skills)
  const tailoringTask = async (): Promise<WorkExperience[]> => {
    const tailored: WorkExperience[] = []
    for (const [i, exp] of workExperiences.entries()) {
      const expStep = phase2bBaseStep + 2 + i // after summary step and skills step
      currentStep = expStep
      onProgress?.({
        currentStep: expStep,
        totalSteps,
        message: `Tailoring ${exp.organization} experience (${i + 1}/${workExperiences.length})...`,
        done: false,
        refinedJD,
        jobTitle,
        extractedSkills,
        workExperiences: [...tailored, ...workExperiences.slice(i)],
      })

      const result = await tailorExperienceToJDGraph(
        exp.description,
        (exp.keyAchievements || []).map((a) => a.text),
        jobTitle,
        exp.organization,
        refinedJD,
        exp.technologies,
        config,
        (progress) => {
          if (progress.content && !progress.done) {
            onProgress?.({
              currentStep: expStep,
              totalSteps,
              message: progress.content,
              done: false,
              refinedJD,
              jobTitle,
              extractedSkills,
              workExperiences: [...tailored, ...workExperiences.slice(i)],
            })
          }
        },
        optimizationContext
      )

      tailored.push({
        ...exp,
        description: result.description,
        keyAchievements: result.achievements.map((text) => ({ text })),
        technologies: result.techStack,
      })
    }
    return tailored
  }

  const summaryStep = phase2bBaseStep
  const skillsSortStep = phase2bBaseStep + 1

  const [summary, skillsResult, tailoredExperiences] = await Promise.all([
    generateSummaryGraph(resumeData, refinedJD, config, (progress) => {
      if (progress.content && !progress.done) {
        onProgress?.({
          currentStep: summaryStep,
          totalSteps,
          message: progress.content,
          done: false,
          refinedJD,
          jobTitle,
          extractedSkills,
        })
      }
    }),
    sortSkillsGraph(resumeData.skills || [], refinedJD, config, (progress) => {
      if (progress.content && !progress.done) {
        onProgress?.({
          currentStep: skillsSortStep,
          totalSteps,
          message: progress.content,
          done: false,
          refinedJD,
          jobTitle,
          extractedSkills,
        })
      }
    }),
    tailoringTask(),
  ])

  // Transform SkillsSortResult back to SkillGroup[]
  // Build a safe lookup map from the skill order result to avoid dynamic bracket access
  const skillOrderMap = new Map<string, string[]>(Object.entries(skillsResult.skillOrder))
  const sortedSkills: SkillGroup[] = skillsResult.groupOrder.map((groupTitle) => {
    const originalGroup = resumeData.skills?.find((g) => g.title === groupTitle)
    const skillsInGroup = skillOrderMap.get(groupTitle) ?? []
    return {
      title: groupTitle,
      skills: skillsInGroup.map((skillText) => ({
        text: skillText,
        highlight: originalGroup?.skills.find((s) => s.text === skillText)?.highlight,
      })),
    }
  })

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 3 (sequential): Cover Letter
  //   Genuinely needs all prior outputs: tailored experiences, sorted skills,
  //   summary, and job title.
  // ─────────────────────────────────────────────────────────────────────────
  currentStep = totalSteps - 1
  onProgress?.({
    currentStep,
    totalSteps,
    message: 'Generating cover letter...',
    done: false,
    refinedJD,
    jobTitle,
    summary,
    workExperiences: tailoredExperiences,
    skills: sortedSkills,
    extractedSkills,
  })

  const coverLetter = await generateCoverLetterGraph(
    { ...resumeData, summary, workExperience: tailoredExperiences, skills: sortedSkills, position: jobTitle },
    refinedJD,
    config,
    (progress) => {
      if (progress.content && !progress.done) {
        onProgress?.({
          currentStep,
          totalSteps,
          message: progress.content,
          done: false,
          refinedJD,
          jobTitle,
          summary,
          workExperiences: tailoredExperiences,
          skills: sortedSkills,
          extractedSkills,
        })
      }
    }
  )

  onProgress?.({
    currentStep: totalSteps,
    totalSteps,
    message: 'AI optimization complete!',
    done: true,
    refinedJD,
    jobTitle,
    summary,
    workExperiences: tailoredExperiences,
    skills: sortedSkills,
    coverLetter,
    extractedSkills,
  })

  return {
    refinedJD,
    jobTitle,
    summary,
    workExperiences: tailoredExperiences,
    skills: sortedSkills,
    coverLetter,
    extractedSkills,
  }
}

import { runAIGenerationPipeline } from '@/lib/ai/strands/pipeline'
import { analyzeJobDescriptionGraph } from '@/lib/ai/strands/jd-refinement-graph'
import { generateJobTitleGraph } from '@/lib/ai/strands/job-title-graph'
import { generateSummaryGraph } from '@/lib/ai/strands/summary-graph'
import { tailorExperienceToJDGraph } from '@/lib/ai/strands/experience-tailoring-graph'
import { sortSkillsGraph } from '@/lib/ai/strands/skills-sorting-graph'
import { extractSkillsGraph } from '@/lib/ai/strands/skills-extraction-graph'
import { generateCoverLetterGraph } from '@/lib/ai/strands/cover-letter-graph'
import type { AgentConfig } from '@/lib/ai/strands/types'
import type { ResumeData } from '@/types'

jest.mock('../jd-refinement-graph', () => ({
  analyzeJobDescriptionGraph: jest.fn(),
}))

jest.mock('../job-title-graph', () => ({
  generateJobTitleGraph: jest.fn(),
}))

jest.mock('../summary-graph', () => ({
  generateSummaryGraph: jest.fn(),
}))

jest.mock('../experience-tailoring-graph', () => ({
  tailorExperienceToJDGraph: jest.fn(),
}))

jest.mock('../skills-sorting-graph', () => ({
  sortSkillsGraph: jest.fn(),
}))

jest.mock('../skills-extraction-graph', () => ({
  extractSkillsGraph: jest.fn(),
}))

jest.mock('../cover-letter-graph', () => ({
  generateCoverLetterGraph: jest.fn(),
}))

jest.mock('../experience-tailoring/agents', () => ({
  createTailoringAgents: jest.fn(() => ({
    keywordExtractor: {
      stream: jest.fn(async () => ({
        toString: () => 'extracted keywords',
      })),
      messages: [],
    },
  })),
}))

jest.mock('../experience-tailoring/utils', () => ({
  runAgentStream: jest.fn(async (stream, cb) => {
    cb({ content: 'Mocked keyword extraction', done: false })
    return 'Mocked output'
  }),
  extractToolOutput: jest.fn(() => ({
    missingKeywords: ['Next.js'],
    criticalKeywords: ['React'],
    niceToHaveKeywords: [],
  })),
}))

describe('runAIGenerationPipeline', () => {
  const mockConfig: AgentConfig = {
    apiKey: 'test-key',
    model: 'gpt-4o-mini',
    apiUrl: 'https://api.openai.com',
    providerType: 'openai-compatible',
  }

  const mockResumeData: ResumeData = {
    name: 'John Doe',
    position: 'Developer',
    email: 'john@example.com',
    contactInformation: '',
    address: '',
    summary: 'Old summary',
    workExperience: [
      {
        organization: 'Corp',
        url: '',
        position: 'Dev',
        startYear: '2020',
        endYear: '2021',
        description: 'Did stuff',
        keyAchievements: [],
      },
    ],
    education: [],
    skills: [{ title: 'Tech', skills: [{ text: 'React' }] }],
    certifications: [],
    languages: [],
    socialMedia: [],
    profilePicture: '',
  }

  const mockJobDescription = 'Seeking a great developer'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('runs the pipeline and returns all expected results', async () => {
    const mockRefinedJD = 'Refined job description: Seeking a great developer.'
    const mockSummary = 'New professional summary tailored to JD.'
    const mockJobTitle = 'Senior Developer'
    const mockTailoredExp = {
      description: 'Polished dev work',
      achievements: ['Won hackathon'],
      techStack: ['Next.js', 'TRPC'],
    }
    const mockSortedSkills = {
      groupOrder: ['Tech'],
      skillOrder: { Tech: ['React'] },
    }
    const mockExtractedSkills = 'Next.js, React, TypeScript'
    const mockCoverLetter = 'Dear Hiring Manager...'

    // Setup mocks
    ;(analyzeJobDescriptionGraph as jest.Mock).mockImplementation(async (jd, config, onProgress) => {
      onProgress({ content: 'Analyzing JD...', done: false })
      return mockRefinedJD
    })
    ;(generateJobTitleGraph as jest.Mock).mockImplementation(async (data, jd, config, onProgress) => {
      onProgress({ content: 'Crafting Job Title...', done: false })
      return mockJobTitle
    })
    ;(generateSummaryGraph as jest.Mock).mockImplementation(async (data, jd, config, onProgress) => {
      onProgress({ content: 'Writing Summary...', done: false })
      return mockSummary
    })
    ;(tailorExperienceToJDGraph as jest.Mock).mockImplementation(
      async (desc, ach, title, org, jd, tech, config, onProgress) => {
        onProgress({ content: 'Tailoring experience...', done: false })
        return mockTailoredExp
      }
    )
    ;(sortSkillsGraph as jest.Mock).mockImplementation(async (skills, jd, config, onProgress) => {
      onProgress({ content: 'Sorting skills...', done: false })
      return mockSortedSkills
    })
    // extractSkillsGraph is called with raw JD only (no progress callback) in Phase 1
    ;(extractSkillsGraph as jest.Mock).mockResolvedValue(mockExtractedSkills)
    ;(generateCoverLetterGraph as jest.Mock).mockImplementation(async (data, jd, config, onProgress) => {
      onProgress({ content: 'Drafting Cover Letter...', done: false })
      return mockCoverLetter
    })

    const onProgress = jest.fn()

    const result = await runAIGenerationPipeline(mockResumeData, mockJobDescription, mockConfig, onProgress)

    // Assert the full result structure
    expect(result).toEqual({
      refinedJD: mockRefinedJD,
      jobTitle: mockJobTitle,
      summary: mockSummary,
      workExperiences: [
        {
          ...mockResumeData.workExperience[0],
          description: mockTailoredExp.description,
          keyAchievements: mockTailoredExp.achievements.map((text) => ({ text })),
          technologies: mockTailoredExp.techStack,
        },
      ],
      skills: [
        {
          title: 'Tech',
          skills: [{ text: 'React', highlight: undefined }],
        },
      ],
      coverLetter: mockCoverLetter,
      extractedSkills: mockExtractedSkills,
    })

    // Phase 1: extractSkillsGraph is called with the raw JD (not refined) — it runs in parallel with JD refinement
    expect(extractSkillsGraph).toHaveBeenCalledWith(mockJobDescription, mockConfig)

    // Phase 2a: job title is called with the refined JD
    expect(analyzeJobDescriptionGraph).toHaveBeenCalledWith(mockJobDescription, mockConfig, expect.any(Function))
    expect(generateJobTitleGraph).toHaveBeenCalledWith(mockResumeData, mockRefinedJD, mockConfig, expect.any(Function))

    // Phase 2b: all three run concurrently — assert each is called correctly
    expect(generateSummaryGraph).toHaveBeenCalledWith(mockResumeData, mockRefinedJD, mockConfig, expect.any(Function))
    expect(sortSkillsGraph).toHaveBeenCalledWith(mockResumeData.skills, mockRefinedJD, mockConfig, expect.any(Function))
    expect(tailorExperienceToJDGraph).toHaveBeenCalledWith(
      expect.any(String), // description
      expect.any(Array), // achievements
      mockJobTitle, // position (generated job title)
      expect.any(String), // organization
      mockRefinedJD, // job description (refined)
      undefined, // technologies
      mockConfig,
      expect.any(Function),
      // OptimizationContext now includes keywords + extractedSkills + jobTitle
      expect.objectContaining({
        refinedJD: mockRefinedJD,
        keywords: expect.any(Object),
        extractedSkills: mockExtractedSkills,
        jobTitle: mockJobTitle,
      })
    )

    // Phase 1 progress: parallel phase message
    expect(onProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Analyzing job description & extracting skills (parallel)...',
      })
    )
    // Phase 2b progress: parallel phase message
    expect(onProgress).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Generating summary, sorting skills & tailoring experiences (parallel)...',
      })
    )
    // Downstream graph progress callbacks bubble up correctly
    expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({ message: 'Analyzing JD...' }))
    expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({ message: 'Writing Summary...' }))
    // Completion
    expect(onProgress).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'AI optimization complete!', done: true })
    )
  })

  it('runs successfully without an onProgress callback', async () => {
    ;(analyzeJobDescriptionGraph as jest.Mock).mockResolvedValue('JD')
    ;(generateJobTitleGraph as jest.Mock).mockResolvedValue('Title')
    ;(generateSummaryGraph as jest.Mock).mockResolvedValue('Summary')
    ;(tailorExperienceToJDGraph as jest.Mock).mockResolvedValue({
      description: 'Desc',
      achievements: ['Ach'],
      techStack: ['Tech'],
    })
    ;(sortSkillsGraph as jest.Mock).mockResolvedValue({ groupOrder: [], skillOrder: {} })
    ;(extractSkillsGraph as jest.Mock).mockResolvedValue('skills text')
    ;(generateCoverLetterGraph as jest.Mock).mockResolvedValue('Letter')

    const result = await runAIGenerationPipeline(mockResumeData, mockJobDescription, mockConfig)

    expect(result.refinedJD).toBe('JD')
    expect(result.summary).toBe('Summary')
  })

  it('handles missing workExperience gracefully', async () => {
    const resumeWithoutExp = {
      ...mockResumeData,
      workExperience: undefined,
    } as unknown as ResumeData
    ;(analyzeJobDescriptionGraph as jest.Mock).mockResolvedValue('JD')
    ;(generateJobTitleGraph as jest.Mock).mockResolvedValue('Title')
    ;(generateSummaryGraph as jest.Mock).mockResolvedValue('Summary')
    ;(tailorExperienceToJDGraph as jest.Mock).mockResolvedValue({
      description: 'Desc',
      achievements: ['Ach'],
      techStack: ['Tech'],
    })
    ;(sortSkillsGraph as jest.Mock).mockResolvedValue({ groupOrder: [], skillOrder: {} })
    ;(extractSkillsGraph as jest.Mock).mockResolvedValue('skills text')
    ;(generateCoverLetterGraph as jest.Mock).mockResolvedValue('Letter')

    const result = await runAIGenerationPipeline(resumeWithoutExp, mockJobDescription, mockConfig)

    expect(result.workExperiences).toEqual([])
    expect(tailorExperienceToJDGraph).not.toHaveBeenCalled()
  })

  it('checks coverage for onProgress skips (done: true or no content)', async () => {
    ;(analyzeJobDescriptionGraph as jest.Mock).mockImplementation(async (jd, config, onProgress) => {
      onProgress({ done: true }) // No content, should skip updating the progress callback
      return 'JD'
    })
    ;(generateJobTitleGraph as jest.Mock).mockResolvedValue('Title')
    ;(generateSummaryGraph as jest.Mock).mockImplementation(async (data, jd, config, onProgress) => {
      onProgress({ content: 'Done writing!', done: true }) // Done is true, should skip
      return 'Summary'
    })
    ;(tailorExperienceToJDGraph as jest.Mock).mockResolvedValue({
      description: 'Desc',
      achievements: ['Ach'],
      techStack: ['Tech'],
    })
    ;(sortSkillsGraph as jest.Mock).mockResolvedValue({ groupOrder: [], skillOrder: {} })
    ;(extractSkillsGraph as jest.Mock).mockResolvedValue('skills text')
    ;(generateCoverLetterGraph as jest.Mock).mockResolvedValue('Letter')

    const onProgress = jest.fn()

    await runAIGenerationPipeline(mockResumeData, mockJobDescription, mockConfig, onProgress)

    expect(onProgress).not.toHaveBeenCalledWith(expect.objectContaining({ message: 'Done writing!' }))
  })

  it('covers skills transformation edge cases (missing group in original or result)', async () => {
    const resumeWithEmptySkills = {
      ...mockResumeData,
      skills: [],
    } as unknown as ResumeData

    const mockSortedSkills = {
      groupOrder: ['NonExistent'],
      skillOrder: { NonExistent: ['React'] },
    }

    ;(analyzeJobDescriptionGraph as jest.Mock).mockResolvedValue('JD')
    ;(generateJobTitleGraph as jest.Mock).mockResolvedValue('Title')
    ;(generateSummaryGraph as jest.Mock).mockResolvedValue('Summary')
    ;(tailorExperienceToJDGraph as jest.Mock).mockResolvedValue({
      description: 'Desc',
      achievements: ['Ach'],
      techStack: ['Tech'],
    })
    ;(sortSkillsGraph as jest.Mock).mockResolvedValue(mockSortedSkills)
    ;(extractSkillsGraph as jest.Mock).mockResolvedValue('skills text')
    ;(generateCoverLetterGraph as jest.Mock).mockResolvedValue('Letter')

    const result = await runAIGenerationPipeline(resumeWithEmptySkills, mockJobDescription, mockConfig)

    expect(result.skills[0]).toEqual({
      title: 'NonExistent',
      skills: [{ text: 'React', highlight: undefined }],
    })
  })
})

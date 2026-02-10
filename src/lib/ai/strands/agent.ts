/**
 * Strands Agent implementation for in-browser use.
 *
 * This module provides functions to run Strands agents directly in the browser
 * using OpenAI-compatible endpoints configured by the user.
 */

import { Agent } from '@strands-agents/sdk'
import { OpenAIModel } from '@strands-agents/sdk/openai'
import { StreamCallback } from '@/types/openai'
import { SkillGroup } from '@/types'
import { SkillsSortResult } from '@/lib/ai/sorting-prompts'

/**
 * Interface for agent configuration pulled from AISettings
 */
interface AgentConfig {
  apiUrl: string
  apiKey: string
  model: string
}

/**
 * Analyzes and improves a job description using a Strands agent.
 *
 * @param jobDescription - The raw job description text
 * @param config - Provider configuration from AISettings
 * @param onProgress - Optional callback for streaming updates
 * @returns The improved job description text
 */
export async function analyzeJobDescription(
  jobDescription: string,
  config: AgentConfig,
  onProgress?: StreamCallback
): Promise<string> {
  // 1. Initialize the OpenAI-compatible model
  const model = new OpenAIModel({
    modelId: config.model,
    // The Strands/OpenAI SDK requires a non-empty API key even for local endpoints.
    // If it's empty, we provide a placeholder.
    apiKey: config.apiKey || 'not-needed',
    clientConfig: {
      baseURL: config.apiUrl,
      dangerouslyAllowBrowser: true, // Required for in-browser SDK usage
    },
  })

  // 2. Create the agent with a specific persona for JD analysis
  const agent = new Agent({
    model,
    systemPrompt:
      'You are a professional recruiting assistant and expert resume tailor. ' +
      'Your task is to analyze the provided job description and improve its clarity, ' +
      'structure, and keywords without losing its original meaning. ' +
      'Format it cleanly with clear sections for Responsibilities, Requirements, and Skills. ' +
      'Only return the improved job description text, no preamble or explanation.',
    printer: false, // We handle output manually via stream/invoke
  })

  if (onProgress) {
    let fullResponse = ''
    // 3. Stream the response for immediate feedback
    for await (const event of agent.stream(jobDescription)) {
      if (
        event.type === 'modelContentBlockDeltaEvent' &&
        'text' in event.delta &&
        typeof event.delta.text === 'string'
      ) {
        fullResponse += event.delta.text
        onProgress({ content: event.delta.text, done: false })
      }
    }
    onProgress({ content: '', done: true })
    return fullResponse
  } else {
    // 4. Simple invocation for non-streaming use cases
    const result = await agent.invoke(jobDescription)

    // Extracts and concatenates all text content from the last message
    return result.toString()
  }
}

/**
 * A multi-agent graph flow that refines a job description through iterative feedback.
 * Uses a Refiner agent and a Reviewer agent.
 *
 * @param jobDescription - The raw job description text
 * @param config - Provider configuration from AISettings
 * @param onProgress - Optional callback for streaming updates and status messages
 * @returns The finalized, refined job description text
 */
export async function analyzeJobDescriptionGraph(
  jobDescription: string,
  config: AgentConfig,
  onProgress?: StreamCallback
): Promise<string> {
  const model = new OpenAIModel({
    modelId: config.model,
    apiKey: config.apiKey || 'not-needed',
    clientConfig: {
      baseURL: config.apiUrl,
      dangerouslyAllowBrowser: true,
    },
  })

  const refiner = new Agent({
    model,
    systemPrompt:
      'You are a Professional JD Refiner. ' +
      'Your goal is to extract and reformat a raw job description into a strict, clean format. ' +
      'RULES:\n' +
      '- NO complex markdown (NO bold, NO italics, NO sub-headers). Use ONLY `#` for titles and `-` for unordered lists.\n' +
      '- Extract or determine the following sections exactly:\n' +
      '  # position-title\n' +
      '  (The job title)\n\n' +
      '  # core-responsibilities\n' +
      '  (Short and crisp list, MAXIMUM 5 items, no repetition)\n\n' +
      '  # desired-qualifications\n' +
      '  (Short and crisp list, MAXIMUM 5 items, no repetition)\n\n' +
      '  # required-skills\n' +
      '  (Technology/tool name list ONLY, e.g., Next.js, Linux, GCP, CI/CD. No full sentences, no extra words. NO maximum limit).\n' +
      'Return ONLY the improved job description text following this structure.',
    printer: false,
  })

  const reviewer = new Agent({
    model,
    systemPrompt:
      'You are a JD Quality Critic. ' +
      'Your task is to strictly review a job description against these criteria:\n' +
      '1. Only `#` and `-` markdown used? (Reject bold/italics).\n' +
      '2. Exactly 4 sections: position-title, core-responsibilities, desired-qualifications, required-skills?\n' +
      '3. Core-responsibilities and Desired-qualifications have <= 5 items?\n' +
      '4. Required-skills is a list of tech names only?\n' +
      'If perfect, start with "APPROVED". Otherwise, list critiques starting with "CRITIQUE:".',
    printer: false,
  })

  let currentJD = jobDescription
  let iteration = 0
  const maxIterations = 2 // 1 initial refine + up to 2 review/refine loops

  if (onProgress)
    onProgress({
      content: '🚀 Starting Multi-Agent Refinement...\n',
      done: false,
    })

  while (iteration <= maxIterations) {
    iteration++

    // Node: Refine
    if (onProgress)
      onProgress({
        content: `\n[Agent: Refiner] (Iteration ${iteration}) Improving JD...\n`,
        done: false,
      })

    const refinePrompt =
      iteration === 1
        ? `Original Job Description:\n\n${currentJD}`
        : `Please refine the JD again based on these critiques:\n\n${currentJD}`

    const refineResult = await refiner.invoke(refinePrompt)
    currentJD = refineResult.toString().trim()

    if (onProgress) {
      // Stream the current version so user sees progress
      onProgress({
        content: `\n--- Refined Version ---\n${currentJD}\n-----------------------\n`,
        done: false,
      })
    }

    // Node: Review
    if (onProgress)
      onProgress({
        content: `\n[Agent: Reviewer] Analyzing quality...\n`,
        done: false,
      })

    const reviewResult = await reviewer.invoke(
      `Review this Job Description:\n\n${currentJD}`
    )
    const reviewText = reviewResult.toString().trim()

    if (reviewText.startsWith('APPROVED')) {
      if (onProgress)
        onProgress({
          content: `\n✅ Approved by Reviewer after ${iteration} iteration(s).\n`,
          done: false,
        })
      break
    } else {
      if (onProgress)
        onProgress({ content: `\n❌ Feedback: ${reviewText}\n`, done: false })
      // Append critiques to guide the next refinement
      currentJD = `Refined JD:\n${currentJD}\n\nCritiques from Reviewer:\n${reviewText}`
    }

    if (iteration > maxIterations) {
      if (onProgress)
        onProgress({
          content: `\n⚠️ Reached max iterations (${maxIterations}). Finalizing.\n`,
          done: false,
        })
    }
  }

  // Strip the internal wrapping if any
  const finalJD = (
    currentJD
      .replace('Refined JD:\n', '')
      .split('\n\nCritiques from Reviewer:')[0] || ''
  ).trim()

  if (onProgress) onProgress({ content: '', done: true })
  return finalJD
}

/**
 * A multi-agent graph flow that sorts resume skills based on job description relevance.
 * Also identifies and adds relevant missing skills.
 *
 * @param skills - The current skill groups
 * @param jobDescription - The target job description
 * @param config - Provider configuration from AISettings
 * @param onProgress - Optional callback for streaming updates
 * @returns The sorted and enhanced SkillsSortResult
 */
export async function sortSkillsGraph(
  skills: SkillGroup[],
  jobDescription: string,
  config: AgentConfig,
  onProgress?: StreamCallback
): Promise<SkillsSortResult> {
  const model = new OpenAIModel({
    modelId: config.model,
    apiKey: config.apiKey || 'not-needed',
    clientConfig: {
      baseURL: config.apiUrl,
      dangerouslyAllowBrowser: true,
    },
  })

  const skillsData = skills.map((group) => ({
    title: group.title,
    skills: (group.skills || []).map((s) => s.text),
  }))

  // Agent 1: The Brain - Analyzes and optimizes (Output: Markdown Report)
  const brain = new Agent({
    model,
    systemPrompt:
      'You are a Skill Sorting Expert (The Brain). ' +
      'Your task is to analyze a job description and determine the most relevant order for resume skills. ' +
      'RULES:\n' +
      '1. Determine the best order for skill groups based on JD relevance.\n' +
      '2. Determine the best order for skills within each group.\n' +
      '3. IDENTIFY MISSING TECH: Find technologies in the JD that are not in the current list.\n' +
      '4. PRESERVE ALL: Never suggest removing an existing skill.\n' +
      'OUTPUT: A clean markdown report with the optimized structure. No JSON yet.',
    printer: false,
  })

  // Agent 2: The Scribe - Converts analysis to JSON (Output: JSON)
  const scribe = new Agent({
    model,
    systemPrompt:
      'You are a Data Architect (The Scribe). ' +
      'Your ONLY task is to convert a skill analysis report and original data into a STRICT JSON format. ' +
      'RULES:\n' +
      '1. Use the optimized order and new skills provided in the analysis.\n' +
      '2. Ensure ALL original groups and skills are included.\n' +
      '3. Output EXCLUSIVELY valid JSON. No preamble, no markdown code blocks.\n' +
      'TARGET FORMAT:\n' +
      '{\n' +
      '  "groupOrder": ["Group 1", "Group 2", ...],\n' +
      '  "skillOrder": {\n' +
      '    "Group 1": ["skillA", "skillB", ...],\n' +
      '    "Group 2": ["skillC", "skillD", ...]\n' +
      '  }\n' +
      '}',
    printer: false,
  })

  // Agent 3: The Editor - Validates data integrity (Output: APPROVED or CRITIQUE)
  const editor = new Agent({
    model,
    systemPrompt:
      'You are a Data Validator (The Editor). ' +
      'Verify the generated skill JSON against the original data.\n' +
      'CRITERIA:\n' +
      '1. Valid JSON syntax?\n' +
      '2. ALL ${skillsData.length} original groups present?\n' +
      '3. NO original skills lost?\n' +
      '4. Proper camelCase or standard tech naming?\n' +
      'If perfect, respond "APPROVED". Otherwise, respond "CRITIQUE: <reasons>".',
    printer: false,
  })

  let iteration = 0
  const maxIterations = 2
  let lastAnalysis = ''
  let lastAttemptedJson = ''
  let lastCritique = ''

  if (onProgress) onProgress({ content: '🧠 [1/3] Brain: Analyzing job description and skills...\n', done: false })

  // STAGE 1: Analysis
  const analysisResult = await brain.invoke(`JOB DESCRIPTION:\n${jobDescription}\n\nCURRENT SKILLS:\n${JSON.stringify(skillsData)}`)
  lastAnalysis = analysisResult.toString().trim()

  if (onProgress) {
    onProgress({ content: `✅ Analysis complete.\n\n✍️ [2/3] Scribe: Constructing JSON output...\n`, done: false })
  }

  // STAGE 2 & 3: Iterative Scribing and Editing
  while (iteration <= maxIterations) {
    iteration++

    const scribePrompt = iteration === 1
      ? `Original Data:\n${JSON.stringify(skillsData)}\n\nOptimization Analysis:\n${lastAnalysis}`
      : `Data review failed. Fix the JSON based on these critiques:\n${lastCritique}\n\nKeep the original optimized structure from the analysis.`

    const scribeResult = await scribe.invoke(scribePrompt)
    const rawJson = scribeResult.toString().trim()
    const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim()
    lastAttemptedJson = cleanedJson

    if (onProgress) onProgress({ content: `🔍 [3/3] Editor: Validating data integrity (Attempt ${iteration})...\n`, done: false })

    const review = await editor.invoke(`Original Data:\n${JSON.stringify(skillsData)}\n\nGenerated JSON:\n${cleanedJson}`)
    const reviewText = review.toString().trim()

    if (reviewText.startsWith('APPROVED')) {
      try {
        const finalJson = JSON.parse(cleanedJson) as SkillsSortResult
        if (onProgress) onProgress({ content: '✨ Skills optimized, structured, and verified.\n', done: true })
        return finalJson
      } catch (e) {
        lastCritique = `CRITIQUE: Error parsing JSON: ${e instanceof Error ? e.message : 'Unknown error'}`
      }
    } else {
      if (onProgress) onProgress({ content: `❌ ${reviewText}\n`, done: false })
      lastCritique = reviewText // Pass critique for next iteration
    }
  }

  // Final fallback
  try {
    const fallback = JSON.parse(lastAttemptedJson.replace(/```json/g, '').replace(/```/g, '').trim())
    if (onProgress) onProgress({ content: '⚠️ Used fallback version (validation partially failed).\n', done: true })
    return fallback as SkillsSortResult
  } catch (e) {
    throw new Error('Failed to generate a valid skill sorting result after multiple attempts.')
  }
}

/**
 * Gemini Document Generation Functions
 * Provides same interface as openai-client.ts for cover letters and summaries
 */

import type { ResumeData } from '@/types'
import type { StreamCallback, AIMessage, AIRequest } from '@/types/ai-provider'
import { GeminiClient, GeminiAPIError } from './gemini-client'
import {
  buildCoverLetterPrompt,
  validateCoverLetter,
  postProcessCoverLetter,
  buildSummaryPrompt,
  validateSummary,
} from './document-prompts'

/**
 * Generates a cover letter using Gemini API with streaming support
 */
export async function generateCoverLetterWithGemini(
  resumeData: ResumeData,
  jobDescription: string,
  apiKey: string,
  model: string,
  onProgress?: StreamCallback
): Promise<string> {
  const client = new GeminiClient({
    providerType: 'gemini',
    apiKey,
    model,
  })

  // Build the prompt
  const prompt = buildCoverLetterPrompt(resumeData, jobDescription)

  // Prepare the request
  const messages: AIMessage[] = [
    {
      role: 'system',
      content:
        'You are a professional cover letter writer with expertise in highlighting candidate strengths and tailoring content to job requirements. You write compelling, specific, and achievement-focused cover letters.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]

  const request: AIRequest = {
    messages,
    temperature: 0.7,
    maxTokens: 8192, // High limit for Gemini 2.5 (thinking mode uses 1200-1500 tokens, leaving plenty for actual content)
    topP: 0.9,
  }

  // ALWAYS use streaming for Gemini to avoid truncation with long responses
  // Provide a no-op callback if none was provided
  const streamCallback: StreamCallback = onProgress || (() => {})
  const generatedContent = await client.generateContentStream(
    request,
    streamCallback
  )

  if (!generatedContent || generatedContent.trim().length === 0) {
    throw new GeminiAPIError(
      'Gemini generated an empty response. Please try rephrasing the job description.',
      'empty_content'
    )
  }

  // Post-process the content
  const processedContent = postProcessCoverLetter(generatedContent)

  // Validate the content
  const validation = validateCoverLetter(processedContent)
  if (!validation.isValid) {
    console.warn('Cover letter validation warnings:', validation.errors)
    // Still return the content, but log warnings
  }

  return processedContent
}

/**
 * Generates a professional summary using Gemini API with streaming support
 */
export async function generateSummaryWithGemini(
  resumeData: ResumeData,
  jobDescription: string,
  apiKey: string,
  model: string,
  onProgress?: StreamCallback
): Promise<string> {
  const client = new GeminiClient({
    providerType: 'gemini',
    apiKey,
    model,
  })

  // Build the prompt
  const prompt = buildSummaryPrompt(resumeData, jobDescription)

  // Prepare the request
  const messages: AIMessage[] = [
    {
      role: 'system',
      content:
        'You are an expert resume writer specializing in creating compelling professional summaries that highlight key achievements and align with job requirements.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]

  const request: AIRequest = {
    messages,
    temperature: 0.7,
    maxTokens: 4096, // High limit for Gemini 2.5 (thinking mode uses 1200-1500 tokens, leaving plenty for actual content)
    topP: 0.9,
  }

  // ALWAYS use streaming for Gemini to avoid truncation with long responses
  // Provide a no-op callback if none was provided
  const streamCallback: StreamCallback = onProgress || (() => {})
  const generatedContent = await client.generateContentStream(
    request,
    streamCallback
  )

  if (!generatedContent || generatedContent.trim().length === 0) {
    throw new GeminiAPIError(
      'Gemini generated an empty response. Please try again.',
      'empty_content'
    )
  }

  // Validate the content
  const validation = validateSummary(generatedContent)
  if (!validation.isValid) {
    console.warn('Summary validation warnings:', validation.errors)
    // Still return the content, but log warnings
  }

  return generatedContent.trim()
}

/**
 * Test Gemini API connection
 */
export async function testGeminiConnection(
  apiKey: string,
  model: string = 'gemini-2.5-flash'
): Promise<boolean> {
  try {
    const client = new GeminiClient({
      providerType: 'gemini',
      apiKey,
      model,
    })

    return await client.testConnection()
  } catch (error) {
    console.error('Gemini connection test failed:', error)
    return false
  }
}

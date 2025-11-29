/**
 * Google Gemini API Client
 * Native integration with Google's Generative AI API
 */

import type {
  GeminiConfig,
  AIRequest,
  AIResponse,
  IAIProvider,
  AIMessage,
} from '@/types/ai-provider'
import type { StreamCallback } from '@/types/openai'

const DEFAULT_GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta'
const REQUEST_TIMEOUT = 120000 // 120 seconds
const MAX_RETRIES = 3 // Retry up to 3 times for 503 errors
const RETRY_DELAY_MS = 1000 // Start with 1 second delay

/**
 * Gemini-specific types
 */
interface GeminiPart {
  text: string
}

interface GeminiContent {
  role?: 'user' | 'model'
  parts: GeminiPart[]
}

interface GeminiRequest {
  contents: GeminiContent[]
  generationConfig?: {
    temperature?: number
    topP?: number
    maxOutputTokens?: number
  }
  systemInstruction?: {
    parts: GeminiPart[]
  }
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[]
    role?: string
  }
  finishReason?: string
  index?: number
}

interface GeminiUsageMetadata {
  promptTokenCount: number
  candidatesTokenCount: number
  totalTokenCount: number
}

interface GeminiResponse {
  candidates: GeminiCandidate[]
  usageMetadata?: GeminiUsageMetadata
  modelVersion?: string
}

/**
 * Custom error class for Gemini API errors
 */
export class GeminiAPIError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'GeminiAPIError'
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry wrapper for fetch calls with exponential backoff
 * Retries on 503 (Service Unavailable) and 429 (Rate Limit) errors
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options)

      // Check for retryable errors
      if (response.status === 503 || response.status === 429) {
        if (attempt < retries) {
          const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt) // Exponential backoff
          console.warn(
            `[Gemini] ${response.status} error, retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`
          )
          await sleep(delayMs)
          continue
        }
      }

      return response
    } catch (error) {
      if (attempt < retries) {
        const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt)
        console.warn(
          `[Gemini] Network error, retrying in ${delayMs}ms (attempt ${attempt + 1}/${retries})...`
        )
        await sleep(delayMs)
        continue
      }
      throw error
    }
  }

  // This shouldn't be reached, but TypeScript needs it
  throw new Error('Retry logic error')
}

/**
 * Gemini API Client implementing IAIProvider interface
 */
export class GeminiClient implements IAIProvider {
  private config: GeminiConfig
  private baseURL: string

  constructor(config: GeminiConfig) {
    this.config = config
    this.baseURL = config.baseURL || DEFAULT_GEMINI_BASE_URL
  }

  /**
   * Convert unified AIMessage format to Gemini format
   */
  private convertMessages(messages: AIMessage[]): {
    contents: GeminiContent[]
    systemInstruction?: { parts: GeminiPart[] }
  } {
    const systemMessages = messages.filter((m) => m.role === 'system')
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    // Combine system messages into systemInstruction
    const systemInstruction =
      systemMessages.length > 0
        ? {
            parts: systemMessages.map((m) => ({ text: m.content })),
          }
        : undefined

    // Convert conversation messages
    const contents: GeminiContent[] = conversationMessages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    return { contents, systemInstruction }
  }

  /**
   * Build Gemini API endpoint URL
   */
  private buildEndpoint(streaming: boolean = false): string {
    const method = streaming ? 'streamGenerateContent' : 'generateContent'
    if (streaming) {
      return `${this.baseURL}/models/${this.config.model}:${method}?alt=sse&key=${this.config.apiKey}`
    }
    return `${this.baseURL}/models/${this.config.model}:${method}?key=${this.config.apiKey}`
  }

  /**
   * Generate content (non-streaming)
   */
  async generateContent(request: AIRequest): Promise<AIResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    try {
      const { contents, systemInstruction } = this.convertMessages(
        request.messages
      )

      const geminiRequest: GeminiRequest = {
        contents,
        generationConfig: {
          temperature: request.temperature,
          topP: request.topP,
          maxOutputTokens: request.maxTokens,
        },
      }

      if (systemInstruction) {
        geminiRequest.systemInstruction = systemInstruction
      }

      const response = await fetchWithRetry(this.buildEndpoint(false), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequest),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `Gemini API request failed with status ${response.status}`

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error?.message || errorMessage
        } catch {
          // Failed to parse error JSON, use status message
        }

        throw new GeminiAPIError(
          errorMessage,
          response.status.toString(),
          response.status
        )
      }

      const data: GeminiResponse = await response.json()

      // Extract content from first candidate
      const parts = data.candidates[0]?.content?.parts
      const content =
        parts
          ?.map((p) => p.text)
          .join('')
          .trim() || ''

      if (!content) {
        // Check if it's due to max tokens in thinking mode
        const finishReason = data.candidates[0]?.finishReason
        if (finishReason === 'MAX_TOKENS') {
          throw new GeminiAPIError(
            'Response exceeded max tokens (likely due to thinking mode). Try increasing maxTokens or using a simpler prompt.',
            'max_tokens_exceeded'
          )
        }

        throw new GeminiAPIError(
          'Gemini generated an empty response. Please try again.',
          'empty_response'
        )
      }

      return {
        content,
        model: data.modelVersion || this.config.model,
        usage: data.usageMetadata
          ? {
              promptTokens: data.usageMetadata.promptTokenCount,
              completionTokens: data.usageMetadata.candidatesTokenCount,
              totalTokens: data.usageMetadata.totalTokenCount,
            }
          : undefined,
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof GeminiAPIError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new GeminiAPIError(
            'Request timed out after 2 minutes. The model may be too slow or the server is overloaded.',
            'timeout'
          )
        }

        if (error.message.includes('fetch')) {
          throw new GeminiAPIError(
            'Unable to connect to Gemini API. Please check your internet connection.',
            'network_error'
          )
        }

        throw new GeminiAPIError(error.message)
      }

      throw new GeminiAPIError('An unexpected error occurred')
    }
  }

  /**
   * Generate content (streaming with SSE)
   */
  async generateContentStream(
    request: AIRequest,
    onProgress: StreamCallback
  ): Promise<string> {
    try {
      const { contents, systemInstruction } = this.convertMessages(
        request.messages
      )

      const geminiRequest: GeminiRequest = {
        contents,
        generationConfig: {
          temperature: request.temperature,
          topP: request.topP,
          maxOutputTokens: request.maxTokens,
        },
      }

      if (systemInstruction) {
        geminiRequest.systemInstruction = systemInstruction
      }

      const response = await fetchWithRetry(this.buildEndpoint(true), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequest),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `Gemini API request failed with status ${response.status}`

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error?.message || errorMessage
        } catch {
          // Failed to parse error JSON
        }

        throw new GeminiAPIError(
          errorMessage,
          response.status.toString(),
          response.status
        )
      }

      if (!response.body) {
        throw new GeminiAPIError('No response body received', 'no_body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let buffer = ''
      let lastFinishReason: string | undefined

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          onProgress({ done: true })
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const jsonStr = trimmed.slice(6) // Remove 'data: ' prefix
          try {
            const chunk: GeminiResponse = JSON.parse(jsonStr)
            const text =
              chunk.candidates[0]?.content?.parts
                ?.map((p) => p.text)
                .join('') || ''

            if (text) {
              fullContent += text

              // Send progress update
              onProgress({
                content: text,
                done: false,
              })
            }

            // Track finish reason
            const finishReason = chunk.candidates[0]?.finishReason
            if (finishReason) {
              lastFinishReason = finishReason
              console.log('[Gemini] Finish reason:', finishReason)
            }
          } catch {
            console.warn('Failed to parse SSE chunk:', jsonStr)
          }
        }
      }

      // Check for empty content and provide context
      if (!fullContent || fullContent.trim().length === 0) {
        if (lastFinishReason === 'MAX_TOKENS') {
          throw new GeminiAPIError(
            'Response exceeded max tokens. The model ran out of space to generate content. Try a simpler prompt or increase maxTokens.',
            'max_tokens_exceeded'
          )
        } else if (lastFinishReason === 'SAFETY') {
          throw new GeminiAPIError(
            'Response was blocked by safety filters. Try rephrasing your request.',
            'safety_filter'
          )
        } else if (lastFinishReason === 'RECITATION') {
          throw new GeminiAPIError(
            'Response was blocked due to potential copyright concerns. Try rephrasing your request.',
            'recitation_blocked'
          )
        }
        throw new GeminiAPIError(
          `Gemini generated an empty response (finish_reason: ${lastFinishReason || 'unknown'}). Please try again.`,
          'empty_response'
        )
      }

      // Log successful completion
      console.log(
        `[Gemini] Streaming complete: ${fullContent.length} chars (finish_reason: ${lastFinishReason || 'STOP'})`
      )

      return fullContent
    } catch (error) {
      if (error instanceof GeminiAPIError) {
        throw error
      }

      if (error instanceof Error) {
        throw new GeminiAPIError(error.message)
      }

      throw new GeminiAPIError('An unexpected error occurred during streaming')
    }
  }

  /**
   * Test connection to Gemini API
   */
  async testConnection(): Promise<boolean> {
    try {
      const testRequest: AIRequest = {
        messages: [{ role: 'user', content: 'Hi' }],
        temperature: 0.1,
        maxTokens: 100, // Gemini 2.5 needs more tokens for thinking mode
      }

      await this.generateContent(testRequest)
      return true
    } catch (error) {
      console.error('Gemini connection test failed:', error)
      return false
    }
  }

  /**
   * Fetch available models
   * Note: Gemini API doesn't provide a models list endpoint like OpenAI
   * Returns common Gemini models instead
   */
  async fetchModels(): Promise<string[]> {
    // Gemini doesn't have a models list endpoint
    // Return common models as fallback
    return [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ]
  }
}

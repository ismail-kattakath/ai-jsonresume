/**
 * AI Provider Router
 * Routes requests to appropriate provider based on configuration
 */

import type { AIConfig, IAIProvider } from '@/types/ai-provider'
import { GeminiClient } from './gemini-client'
import { OpenAICompatibleProvider } from './openai-adapter'

/**
 * Factory function to create appropriate AI provider
 */
export function createAIProvider(config: AIConfig): IAIProvider {
  switch (config.providerType) {
    case 'gemini':
      return new GeminiClient(config)

    case 'openai-compatible':
      return new OpenAICompatibleProvider(config)

    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = config
      throw new Error(
        `Unknown provider type: ${(_exhaustive as AIConfig).providerType}`
      )
  }
}

/**
 * Helper: Test connection for any provider
 */
export async function testProviderConnection(
  config: AIConfig
): Promise<boolean> {
  const provider = createAIProvider(config)
  return provider.testConnection()
}

/**
 * Helper: Fetch models for any provider
 */
export async function fetchProviderModels(config: AIConfig): Promise<string[]> {
  const provider = createAIProvider(config)
  return provider.fetchModels?.() || []
}

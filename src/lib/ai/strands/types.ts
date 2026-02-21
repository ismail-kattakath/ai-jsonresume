import { AIProviderType } from '@/types/ai-provider'

/**
 * Interface for agent configuration pulled from AISettings
 */
export interface AgentConfig {
  apiUrl: string
  apiKey: string
  model: string
  providerType: AIProviderType
}
/**
 * Structured output from the keyword extractor agent.
 */
export interface KeywordExtractionResult {
  missingKeywords: string[]
  criticalKeywords: string[]
  niceToHaveKeywords: string[]
}

/**
 * Shared context for optimization to avoid redundant processing.
 * Values computed once in the pipeline are passed here to prevent
 * downstream graphs and stages from re-running equivalent AI calls.
 */
export interface OptimizationContext {
  refinedJD?: string
  keywords?: KeywordExtractionResult
  extractedSkills?: string
  jobTitle?: string
}

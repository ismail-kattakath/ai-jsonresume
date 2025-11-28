/**
 * AI Provider presets for easy configuration
 */

export interface ProviderPreset {
  name: string
  baseURL: string
  description: string
  supportsModels: boolean // Whether it supports /v1/models endpoint
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    description: 'Official OpenAI API (GPT-4, GPT-4o, GPT-4o-mini)',
    supportsModels: true,
  },
  {
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    description: 'Access 100+ models (Gemini, Claude, GPT, Llama, etc.)',
    supportsModels: true,
  },
  {
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    description: 'Ultra-fast inference (Llama, Mixtral, Gemma)',
    supportsModels: true,
  },
  {
    name: 'Together AI',
    baseURL: 'https://api.together.xyz/v1',
    description: 'Open source models',
    supportsModels: true,
  },
  {
    name: 'Local (LM Studio)',
    baseURL: 'http://localhost:1234/v1',
    description: 'Local AI server (LM Studio, Ollama, etc.)',
    supportsModels: true,
  },
]

export const CUSTOM_PROVIDER: ProviderPreset = {
  name: 'Custom',
  baseURL: '',
  description: 'Enter your own API URL',
  supportsModels: false,
}

/**
 * Get provider preset by base URL
 */
export function getProviderByURL(baseURL: string): ProviderPreset | null {
  return (
    PROVIDER_PRESETS.find(
      (p) => p.baseURL.toLowerCase() === baseURL.toLowerCase()
    ) || null
  )
}

/**
 * Check if a base URL matches a known provider
 */
export function isKnownProvider(baseURL: string): boolean {
  return getProviderByURL(baseURL) !== null
}

/**
 * AI Provider presets for easy configuration
 */

import type { AIProviderType } from '@/types/ai-provider'

export interface ProviderPreset {
  name: string
  baseURL: string
  description: string
  supportsModels: boolean // Whether it supports /v1/models endpoint
  requiresAuth: boolean // Whether it requires API key to list models
  providerType: AIProviderType // Type of provider (openai-compatible or gemini)
  commonModels?: string[] // Common models for this provider (fallback)
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    description: 'Official OpenAI API (GPT-4, GPT-4o, GPT-4o-mini)',
    supportsModels: true,
    requiresAuth: true,
    providerType: 'openai-compatible',
    commonModels: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
    ],
  },
  {
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    description: 'Access 100+ models (Gemini, Claude, GPT, Llama, etc.)',
    supportsModels: true,
    requiresAuth: true,
    providerType: 'openai-compatible',
    commonModels: [
      'google/gemini-2.0-flash-exp',
      'google/gemini-2.0-flash-thinking-exp:free',
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o-mini',
      'deepseek/deepseek-r1',
    ],
  },
  {
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    description: 'Direct Google Gemini API (native, not via OpenRouter)',
    supportsModels: false, // Gemini doesn't have a models list endpoint
    requiresAuth: true,
    providerType: 'gemini',
    commonModels: [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ],
  },
  {
    name: 'xAI (Grok)',
    baseURL: 'https://api.x.ai/v1',
    description: 'xAI Grok models',
    supportsModels: true,
    requiresAuth: true,
    providerType: 'openai-compatible',
    commonModels: ['grok-beta', 'grok-vision-beta'],
  },
  {
    name: 'Local (LM Studio)',
    baseURL: 'http://localhost:1234/v1',
    description: 'Local AI server (LM Studio, Ollama, etc.)',
    supportsModels: true,
    requiresAuth: false,
    providerType: 'openai-compatible',
    commonModels: [
      'llama-3.1-8b-instruct',
      'llama-3.3-70b-instruct',
      'qwen2.5-7b-instruct',
    ],
  },
]

export const CUSTOM_PROVIDER: ProviderPreset = {
  name: 'Custom',
  baseURL: '',
  description: 'Enter your own API URL',
  supportsModels: false,
  requiresAuth: true,
  providerType: 'openai-compatible', // Default to OpenAI-compatible for custom
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

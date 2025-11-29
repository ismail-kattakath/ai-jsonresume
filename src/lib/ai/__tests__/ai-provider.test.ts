/**
 * @jest-environment node
 */

import { createAIProvider } from '../ai-provider'
import { GeminiClient } from '../gemini-client'
import { OpenAICompatibleProvider } from '../openai-adapter'
import type { GeminiConfig, OpenAICompatibleConfig } from '@/types/ai-provider'

// Mock the provider clients
jest.mock('../gemini-client')
jest.mock('../openai-adapter')

describe('AI Provider Factory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createAIProvider', () => {
    it('should create GeminiClient for gemini provider type', () => {
      const config: GeminiConfig = {
        providerType: 'gemini',
        apiKey: 'test-key',
        model: 'gemini-2.5-flash',
      }

      createAIProvider(config)

      expect(GeminiClient).toHaveBeenCalledWith(config)
      expect(GeminiClient).toHaveBeenCalledTimes(1)
    })

    it('should create OpenAICompatibleProvider for openai-compatible provider type', () => {
      const config: OpenAICompatibleConfig = {
        providerType: 'openai-compatible',
        apiKey: 'test-key',
        model: 'gpt-4',
        baseURL: 'https://api.openai.com/v1',
      }

      createAIProvider(config)

      expect(OpenAICompatibleProvider).toHaveBeenCalledWith(config)
      expect(OpenAICompatibleProvider).toHaveBeenCalledTimes(1)
    })

    it('should pass custom baseURL to GeminiClient', () => {
      const config: GeminiConfig = {
        providerType: 'gemini',
        apiKey: 'test-key',
        model: 'gemini-2.5-flash',
        baseURL: 'https://custom.example.com/v1',
      }

      createAIProvider(config)

      expect(GeminiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom.example.com/v1',
        })
      )
    })

    it('should pass all config properties to OpenAICompatibleProvider', () => {
      const config: OpenAICompatibleConfig = {
        providerType: 'openai-compatible',
        apiKey: 'test-key-123',
        model: 'gpt-4o-mini',
        baseURL: 'https://api.openai.com/v1',
      }

      createAIProvider(config)

      expect(OpenAICompatibleProvider).toHaveBeenCalledWith(config)
    })

    it('should create provider with minimal config for Gemini', () => {
      const config: GeminiConfig = {
        providerType: 'gemini',
        apiKey: 'key',
        model: 'gemini-2.5-flash',
      }

      createAIProvider(config)

      expect(GeminiClient).toHaveBeenCalledWith(config)
    })

    it('should create provider with minimal config for OpenAI-compatible', () => {
      const config: OpenAICompatibleConfig = {
        providerType: 'openai-compatible',
        apiKey: 'key',
        model: 'model',
        baseURL: 'https://example.com',
      }

      createAIProvider(config)

      expect(OpenAICompatibleProvider).toHaveBeenCalledWith(config)
    })
  })

  describe('Type Safety', () => {
    it('should ensure GeminiConfig is correctly typed', () => {
      const config: GeminiConfig = {
        providerType: 'gemini',
        apiKey: 'test',
        model: 'gemini-2.5-flash',
      }

      expect(config.providerType).toBe('gemini')
    })

    it('should ensure OpenAICompatibleConfig is correctly typed', () => {
      const config: OpenAICompatibleConfig = {
        providerType: 'openai-compatible',
        apiKey: 'test',
        model: 'gpt-4',
        baseURL: 'https://api.openai.com/v1',
      }

      expect(config.providerType).toBe('openai-compatible')
    })
  })

  describe('Provider Switching', () => {
    it('should allow switching between providers', () => {
      const geminiConfig: GeminiConfig = {
        providerType: 'gemini',
        apiKey: 'gemini-key',
        model: 'gemini-2.5-flash',
      }

      const openaiConfig: OpenAICompatibleConfig = {
        providerType: 'openai-compatible',
        apiKey: 'openai-key',
        model: 'gpt-4',
        baseURL: 'https://api.openai.com/v1',
      }

      createAIProvider(geminiConfig)
      expect(GeminiClient).toHaveBeenCalledTimes(1)

      createAIProvider(openaiConfig)
      expect(OpenAICompatibleProvider).toHaveBeenCalledTimes(1)

      createAIProvider(geminiConfig)
      expect(GeminiClient).toHaveBeenCalledTimes(2)
    })
  })

  describe('Integration with Provider Presets', () => {
    it('should work with Google Gemini preset', () => {
      const config: GeminiConfig = {
        providerType: 'gemini',
        apiKey: 'AIzaSyABC123',
        model: 'gemini-2.5-flash',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      }

      createAIProvider(config)

      expect(GeminiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          providerType: 'gemini',
          baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        })
      )
    })

    it('should work with OpenRouter preset', () => {
      const config: OpenAICompatibleConfig = {
        providerType: 'openai-compatible',
        apiKey: 'sk-or-v1-123',
        model: 'google/gemini-2.5-flash',
        baseURL: 'https://openrouter.ai/api/v1',
      }

      createAIProvider(config)

      expect(OpenAICompatibleProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          providerType: 'openai-compatible',
          baseURL: 'https://openrouter.ai/api/v1',
        })
      )
    })

    it('should work with xAI Grok preset', () => {
      const config: OpenAICompatibleConfig = {
        providerType: 'openai-compatible',
        apiKey: 'xai-key',
        model: 'grok-2',
        baseURL: 'https://api.x.ai/v1',
      }

      createAIProvider(config)

      expect(OpenAICompatibleProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.x.ai/v1',
        })
      )
    })
  })
})

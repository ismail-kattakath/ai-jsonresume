import { Model } from '@strands-agents/sdk'
import { OpenAIModel } from '@strands-agents/sdk/openai'
import { GeminiModel } from '@strands-agents/sdk/gemini'
import { AgentConfig } from './types'

/**
 * Creates a Model instance based on the provided configuration.
 * 
 * @param config - Provider configuration from AISettings
 * @returns An initialized Model instance (OpenAIModel or GeminiModel)
 */
export function createModel(config: AgentConfig): Model {
    if (config.providerType === 'gemini') {
        return new GeminiModel({
            modelId: config.model,
            apiKey: config.apiKey || 'not-needed',
            clientConfig: {
                // If it's a proxy or custom endpoint, otherwise it uses default
                baseUrl: config.apiUrl !== 'https://api.openai.com/v1' ? config.apiUrl : undefined
            }
        })
    }

    // Default to OpenAI / OpenAI-compatible
    return new OpenAIModel({
        modelId: config.model,
        // The Strands/OpenAI SDK requires a non-empty API key even for local endpoints.
        // If it's empty, we provide a placeholder.
        apiKey: config.apiKey || 'not-needed',
        clientConfig: {
            baseURL: config.apiUrl,
            dangerouslyAllowBrowser: true, // Required for in-browser SDK usage
        },
    })
}

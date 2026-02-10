import { OpenAIModel } from '@strands-agents/sdk/openai'
import { AgentConfig } from './types'

/**
 * Creates an OpenAIModel instance based on the provided configuration.
 * 
 * @param config - Provider configuration from AISettings
 * @returns An initialized OpenAIModel instance
 */
export function createModel(config: AgentConfig): OpenAIModel {
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

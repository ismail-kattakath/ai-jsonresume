import { extractSkillsGraph } from '../skills-extraction-graph'
import { Agent } from '@strands-agents/sdk'

// Mock the Strands SDK
jest.mock('@strands-agents/sdk', () => {
    return {
        Agent: jest.fn().mockImplementation(() => ({
            invoke: jest.fn(),
            stream: jest.fn(),
        })),
        Model: jest.fn(),
    }
})

jest.mock('@strands-agents/sdk/openai', () => {
    return {
        OpenAIModel: jest.fn().mockImplementation(() => ({})),
    }
})

jest.mock('@strands-agents/sdk/gemini', () => {
    return {
        GeminiModel: jest.fn().mockImplementation(() => ({})),
    }
})

describe('Skills Extraction', () => {
    const mockConfig = {
        apiUrl: 'http://localhost:1234/v1',
        apiKey: 'test-key',
        model: 'test-model',
        providerType: 'openai-compatible',
    } as any

    const mockJD = 'Looking for a React developer with Postgres experience.'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('extractSkillsGraph', () => {
        it('extracts and returns a comma-separated list of skills', async () => {
            const mockExtraction = 'React, Postgres'
            const mockVerification = 'React, PostgreSQL'
            const mockToString1 = jest.fn().mockReturnValue(mockExtraction)
            const mockToString2 = jest.fn().mockReturnValue(mockVerification)
            const mockInvoke = jest.fn()
                .mockResolvedValueOnce({ toString: mockToString1 })
                .mockResolvedValueOnce({ toString: mockToString2 })

                ; (Agent as jest.Mock).mockImplementation(() => ({
                    invoke: mockInvoke,
                }))

            const onProgress = jest.fn()
            const result = await extractSkillsGraph(mockJD, mockConfig, onProgress)

            expect(Agent).toHaveBeenCalledTimes(2) // Extractor and Verifier
            expect(mockInvoke).toHaveBeenCalledWith(expect.stringContaining(mockJD))
            expect(result).toBe(mockVerification)
            expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({ content: 'Extracting key skills from JD...' }))
            expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({ content: 'Verifying skill accuracy...' }))
        })
    })
})

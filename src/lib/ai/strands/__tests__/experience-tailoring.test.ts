import { tailorExperienceToJDGraph } from '../experience-tailoring-graph'
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

describe('Experience Tailoring', () => {
    const mockConfig: any = {
        apiUrl: 'http://localhost:1234/v1',
        apiKey: 'test-key',
        model: 'test-model',
        providerType: 'openai-compatible',
    }

    const mockExperience = {
        description: 'Developed React apps.',
        achievements: ['Speed optimization', 'Team lead'],
        position: 'Senior Dev',
        organization: 'Tech Co',
    }

    const mockJD = 'Looking for a React expert.'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('tailorExperienceToJDGraph', () => {
        it('tailors experience and returns the result', async () => {
            const mockTailoredDescription = 'Expert React orchestration.'
            const mockTailoredAchievements = ['Optimized core performance', 'Led engineering teams']

            const mockInvoke = jest.fn()
                .mockResolvedValueOnce({ toString: () => 'Analysis: High alignment' }) // Analyzer
                .mockResolvedValueOnce({ toString: () => mockTailoredDescription }) // Description Writer
                .mockResolvedValueOnce({ toString: () => mockTailoredAchievements.join('\n') }) // Achievements Optimizer
                .mockResolvedValueOnce({ toString: () => 'APPROVED' }) // Fact Checker
                .mockResolvedValueOnce({ toString: () => 'APPROVED' }) // Relevance Evaluator

                ; (Agent as jest.Mock).mockImplementation(() => ({
                    invoke: mockInvoke,
                }))

            const onProgress = jest.fn()
            const result = await tailorExperienceToJDGraph(
                mockExperience.description,
                mockExperience.achievements,
                mockExperience.position,
                mockExperience.organization,
                mockJD,
                mockConfig,
                onProgress
            )

            expect(Agent).toHaveBeenCalledTimes(5) // Analyzer, Writer, Optimizer, Fact Checker, Relevance Evaluator
            expect(result.description).toBe(mockTailoredDescription)
            expect(result.achievements).toEqual(mockTailoredAchievements)
            expect(onProgress).toHaveBeenCalled()
        })
    })
})

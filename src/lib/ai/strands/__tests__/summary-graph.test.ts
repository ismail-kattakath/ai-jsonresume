import { generateSummaryGraph } from '@/lib/ai/strands/summary-graph'
import { AgentConfig } from '@/lib/ai/strands/types'

jest.mock('@strands-agents/sdk', () => {
    return {
        Agent: jest.fn().mockImplementation(({ systemPrompt }: any) => ({
            systemPrompt,
            invoke: jest.fn().mockImplementation((prompt: string) => {
                if (systemPrompt.includes('Resume Strategy Analyst')) {
                    if (prompt.includes('JD_TRIGGER_FAIL')) {
                        return Promise.resolve({ toString: () => 'Analyst Brief JD_TRIGGER_FAIL' })
                    }
                    return Promise.resolve({ toString: () => 'Analyst Brief' })
                } else if (systemPrompt.includes('Resume Writer')) {
                    if (prompt.includes('CRITIQUE')) {
                        return Promise.resolve({ toString: () => 'Refined Summary' })
                    }
                    if (prompt.includes('JD_TRIGGER_FAIL')) {
                        return Promise.resolve({ toString: () => 'Bad Draft' })
                    }
                    return Promise.resolve({ toString: () => 'Written Summary' })
                } else if (systemPrompt.includes('Resume Quality Auditor')) {
                    if (prompt.includes('Bad Draft')) {
                        return Promise.resolve({ toString: () => 'CRITIQUE: Bad structure' })
                    }
                    return Promise.resolve({ toString: () => 'APPROVED' })
                }
                return Promise.resolve({ toString: () => 'Default' })
            })
        })),
        tool: jest.fn().mockImplementation((config: any) => config)
    }
})

jest.mock('@/lib/ai/strands/factory', () => ({
    createModel: jest.fn().mockReturnValue('mock-model')
}))

describe('summary-graph', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const mockConfig = { apiKey: 'test' } as AgentConfig

    it('should generate a summary successfully on first try', async () => {
        const mockResumeData = {
            workExperience: [{ startYear: '2020' }],
            skills: [{ title: 'Languages', skills: [{ text: 'TypeScript' }] }]
        }

        const onProgress = jest.fn()
        const result = await generateSummaryGraph(
            mockResumeData as any,
            'Job Description',
            mockConfig,
            onProgress
        )

        expect(result).toBe('Written Summary')
        expect(onProgress).toHaveBeenCalledWith({ content: 'Expert summary generated and verified.', done: true })
    })

    it('should handle missing startYear and workExp robustly', async () => {
        const mockResumeData = {
            workExperience: [{ title: 'Job' }], // Missing start year
            skills: [] // Missing skills
        }

        const onProgress = jest.fn()
        const result = await generateSummaryGraph(
            mockResumeData as any,
            'Job Description',
            mockConfig,
            onProgress
        )

        expect(result).toBe('Written Summary')
    })

    it('should retry generation if audit fails and eventually return refined summary', async () => {
        const mockResumeData = { workExperience: [] }

        const onProgress = jest.fn()
        // JD_TRIGGER_FAIL will cause Analyst to return brief with JD_TRIGGER_FAIL,
        // which causes Writer to produce 'Bad Draft', which Reviewer then critiques.
        const result = await generateSummaryGraph(
            mockResumeData as any,
            'JD_TRIGGER_FAIL',
            mockConfig,
            onProgress
        )

        expect(result).toBe('Refined Summary')
        expect(onProgress).toHaveBeenCalledWith({ content: 'Expert summary generated and verified.', done: true })
    })

    it('should return last summary with warnings after max iterations', async () => {
        const sdk = require('@strands-agents/sdk')
        sdk.Agent.mockImplementation(({ systemPrompt }: any) => ({
            systemPrompt,
            invoke: jest.fn().mockImplementation((prompt: string) => {
                if (systemPrompt.includes('Resume Strategy Analyst')) {
                    return Promise.resolve({ toString: () => 'Analyst' })
                }
                if (systemPrompt.includes('Resume Writer')) {
                    return Promise.resolve({ toString: () => 'Written' })
                }
                // Reviewer ALWAYS critiques to hit iteration limit
                return Promise.resolve({ toString: () => 'CRITIQUE: Keep going' })
            })
        }))

        const mockResumeData = { workExperience: [] }
        const result = await generateSummaryGraph(
            mockResumeData as any,
            'JD',
            mockConfig
        )

        expect(result).toBe('Written')
    })

    it('should extract correct allowed skills and test tool callback', async () => {
        const sdk = require('@strands-agents/sdk')
        let validationCallback: any
        sdk.tool.mockImplementationOnce((config: any) => {
            validationCallback = config.callback
            return config
        })

        const mockResumeData = {
            workExperience: [],
            skills: [{ title: 'L', skills: [{ text: 'React' }, { text: 'Node.js' }] }]
        }

        await generateSummaryGraph(
            mockResumeData as any,
            'JD',
            mockConfig
        )

        const validResult = JSON.parse(validationCallback({ summary: 'Expert in React and Node.js.' }))
        expect(validResult.valid).toBe(true)

        const invalidResult = JSON.parse(validationCallback({ summary: 'Expert in React and Python.' }))
        expect(invalidResult.valid).toBe(false)
        expect(invalidResult.violations).toContain('python')
    })
})

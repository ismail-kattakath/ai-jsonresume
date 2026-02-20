import { generateCoverLetterGraph } from '../cover-letter-graph'
import { AgentConfig } from '../types'

jest.mock('@strands-agents/sdk', () => {
    return {
        Agent: jest.fn().mockImplementation(({ systemPrompt }: any) => ({
            invoke: jest.fn().mockImplementation((prompt: string) => {
                if (systemPrompt.includes('Professional Cover Letter Writer')) {
                    if (prompt.includes('Refine')) {
                        return Promise.resolve({ toString: () => 'Refined Cover Letter' })
                    }
                    return Promise.resolve({ toString: () => 'Draft Cover Letter' })
                } else if (systemPrompt.includes('Master Resume Reviewer')) {
                    if (prompt.includes('Draft Cover Letter') && !prompt.includes('Refined')) {
                        return Promise.resolve({ toString: () => 'CRITIQUE: Needs more punch' })
                    }
                    return Promise.resolve({ toString: () => 'APPROVED' })
                }
                return Promise.resolve({ toString: () => 'Default' })
            })
        }))
    }
})

jest.mock('../factory', () => ({
    createModel: jest.fn().mockReturnValue('mock-model')
}))

describe('cover-letter-graph', () => {
    const mockConfig = { apiKey: 'test' } as AgentConfig
    const mockResumeData = {
        name: 'John Doe',
        summary: 'Dev',
        workExperience: [{ position: 'Dev', organization: 'Corp', keyAchievements: [{ text: 'Did it' }] }],
        skills: [{ title: 'S', skills: [{ text: 'React' }] }]
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should generate a cover letter with refinement', async () => {
        const onProgress = jest.fn()
        const result = await generateCoverLetterGraph(
            mockResumeData as any,
            'JD',
            mockConfig,
            onProgress
        )

        expect(result).toBe('Refined Cover Letter')
        expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({
            content: expect.stringContaining('Refining'),
            done: false
        }))
    })

    it('should generate a cover letter directly if approved', async () => {
        const sdk = require('@strands-agents/sdk')
        sdk.Agent.mockImplementationOnce(() => ({
            invoke: jest.fn().mockResolvedValue({ toString: () => 'Initial Draft' })
        })).mockImplementationOnce(() => ({
            invoke: jest.fn().mockResolvedValue({ toString: () => 'APPROVED' })
        }))

        const result = await generateCoverLetterGraph(
            mockResumeData as any,
            'JD',
            mockConfig
        )

        expect(result).toBe('Initial Draft')
    })

    it('should handle missing experience and skills', async () => {
        const result = await generateCoverLetterGraph(
            { name: 'John' } as any,
            'JD',
            mockConfig
        )
        expect(result).toBeDefined()
    })
})

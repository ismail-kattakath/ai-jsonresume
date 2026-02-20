import { sortTechStackGraph } from '../tech-stack-sorting-graph'
import { AgentConfig } from '../types'

jest.mock('@strands-agents/sdk', () => {
    return {
        Agent: jest.fn().mockImplementation(({ systemPrompt }: any) => {
            let critiqueCount = 0
            return {
                systemPrompt,
                invoke: jest.fn().mockImplementation((prompt: string) => {
                    const sp = (systemPrompt || '').toLowerCase()
                    const p = (prompt || '').toLowerCase()

                    if (sp.includes('brain') || sp.includes('optimization')) {
                        return Promise.resolve({ toString: () => 'Analysis' })
                    }
                    if (sp.includes('scribe') || sp.includes('architect')) {
                        return Promise.resolve({ toString: () => '["React", "Next.js"]' })
                    }
                    if (sp.includes('editor') || sp.includes('validator')) {
                        if (p.includes('retry_trigger') && critiqueCount < 1) {
                            critiqueCount++
                            return Promise.resolve({ toString: () => 'CRITIQUE' })
                        }
                        return Promise.resolve({ toString: () => 'APPROVED' })
                    }
                    return Promise.resolve({ toString: () => 'Default' })
                })
            }
        })
    }
})

describe('tech-stack-sorting-graph', () => {
    beforeEach(() => {
        const AgentMock = require('@strands-agents/sdk').Agent
        AgentMock.mockClear()
        jest.clearAllMocks()
    })

    const mockConfig = { apiKey: 'test' } as AgentConfig

    it('should sort tech stack successfully', async () => {
        const result = await sortTechStackGraph(['React', 'Next.js'], 'JD', mockConfig)
        expect(result).toContain('React')
    })

    it('should retry if editor critiques', async () => {
        const result = await sortTechStackGraph(['React', 'Next.js'], 'RETRY_TRIGGER', mockConfig)
        expect(result).toContain('React')
    })
})

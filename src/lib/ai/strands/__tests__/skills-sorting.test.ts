import { sortSkillsGraph } from '../skills-sorting-graph'
import { SkillGroup } from '@/types'
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

                    if (sp.includes('strategist') || sp.includes('brain')) {
                        return Promise.resolve({ toString: () => 'Analysis' })
                    }
                    if (sp.includes('scribe')) {
                        return Promise.resolve({ toString: () => '{"groupOrder": ["G1"], "skillOrder": {"G1": ["S1"]}}' })
                    }
                    if (sp.includes('reviewer') || sp.includes('editor')) {
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

jest.mock('../factory', () => ({
    createModel: jest.fn().mockReturnValue('mock-model')
}))

describe('skills-sorting-graph', () => {
    beforeEach(() => {
        const AgentMock = require('@strands-agents/sdk').Agent
        AgentMock.mockClear()
        jest.clearAllMocks()
    })

    const mockConfig = {
        apiKey: 'test',
        apiUrl: '',
        model: '',
        providerType: 'openai'
    } as any
    const mockSkills: any[] = [{ title: 'G1', skills: [{ text: 'S1' }] }]

    it('should sort skills successfully', async () => {
        const result = await sortSkillsGraph(mockSkills, 'JD', mockConfig)
        expect(result).toBeDefined()
        expect(result.groupOrder).toContain('G1')
    })

    it('should handle retries if editor critiques', async () => {
        const result = await sortSkillsGraph(mockSkills, 'RETRY_TRIGGER', mockConfig)
        expect(result).toBeDefined()
        expect(result.groupOrder).toContain('G1')
    })
})

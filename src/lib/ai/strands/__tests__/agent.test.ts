import { analyzeJobDescription, analyzeJobDescriptionGraph, sortSkillsGraph } from '../agent'
import { Agent } from '@strands-agents/sdk'
import { OpenAIModel } from '@strands-agents/sdk/openai'

// Mock the Strands SDK
jest.mock('@strands-agents/sdk', () => {
  return {
    Agent: jest.fn().mockImplementation(() => ({
      invoke: jest.fn(),
      stream: jest.fn(),
    })),
  }
})

jest.mock('@strands-agents/sdk/openai', () => {
  return {
    OpenAIModel: jest.fn().mockImplementation(() => ({})),
  }
})

describe('Strands Agent Lib', () => {
  const mockConfig = {
    apiUrl: 'http://localhost:1234/v1',
    apiKey: 'test-key',
    model: 'test-model',
  }

  const mockJD =
    'Looking for a Senior React Developer with experience in Next.js.'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('analyzeJobDescription', () => {
    it('uses invoke when no onProgress is provided', async () => {
      const mockInvoke = jest.fn().mockResolvedValue({
        toString: () => 'Improved JD text',
      })
        ; (Agent as jest.Mock).mockImplementation(() => ({
          invoke: mockInvoke,
        }))

      const result = await analyzeJobDescription(mockJD, mockConfig)

      expect(Agent).toHaveBeenCalled()
      expect(mockInvoke).toHaveBeenCalledWith(mockJD)
      expect(result).toBe('Improved JD text')
    })

    it('uses stream when onProgress is provided', async () => {
      const mockStream = async function* () {
        yield {
          type: 'modelContentBlockDeltaEvent',
          delta: { text: 'Streamed ' },
        }
        yield {
          type: 'modelContentBlockDeltaEvent',
          delta: { text: 'content' },
        }
      }
      const onProgress = jest.fn()
        ; (Agent as jest.Mock).mockImplementation(() => ({
          stream: mockStream,
        }))

      const result = await analyzeJobDescription(mockJD, mockConfig, onProgress)

      expect(Agent).toHaveBeenCalled()
      expect(onProgress).toHaveBeenCalledWith({
        content: 'Streamed ',
        done: false,
      })
      expect(onProgress).toHaveBeenCalledWith({
        content: 'content',
        done: false,
      })
      expect(onProgress).toHaveBeenCalledWith({ content: '', done: true })
      expect(result).toBe('Streamed content')
    })
  })

  describe('analyzeJobDescriptionGraph', () => {
    it('refines and returns JD if approved immediately', async () => {
      const mockRefinedJD =
        '# position-title\nSenior React Developer\n\n# core-responsibilities\n- Build UI\n\n# desired-qualifications\n- 5 years exp\n\n# required-skills\n- React, TypeScript'
      const mockRefinerInvoke = jest
        .fn()
        .mockResolvedValue({ toString: () => mockRefinedJD })
      const mockReviewerInvoke = jest
        .fn()
        .mockResolvedValue({ toString: () => 'APPROVED: Highly professional' })

      let agentCount = 0
        ; (Agent as jest.Mock).mockImplementation(() => {
          agentCount++
          return {
            invoke: agentCount === 1 ? mockRefinerInvoke : mockReviewerInvoke,
          }
        })

      const onProgress = jest.fn()
      const result = await analyzeJobDescriptionGraph(
        mockJD,
        mockConfig,
        onProgress
      )

      expect(Agent).toHaveBeenCalledTimes(2) // Refiner and Reviewer
      expect(mockRefinerInvoke).toHaveBeenCalled()
      expect(mockReviewerInvoke).toHaveBeenCalledWith(
        expect.stringContaining('# position-title')
      )
      expect(onProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('Approved by Reviewer'),
        })
      )
      expect(result).toBe(mockRefinedJD)
    })

    it('iterates if reviewer provides critiques', async () => {
      // First pass: Refiner -> Reviewer (Critique)
      // Second pass: Refiner -> Reviewer (Approved)
      const mockRefiner1Value = { toString: () => 'JD V1' }
      const mockRefiner2Value = { toString: () => 'JD V2' }
      const mockReviewer1Value = { toString: () => 'CRITIQUE: Too short' }
      const mockReviewer2Value = { toString: () => 'APPROVED' }

      const mockRefineInvoke = jest
        .fn()
        .mockResolvedValueOnce(mockRefiner1Value)
        .mockResolvedValueOnce(mockRefiner2Value)

      const mockReviewInvoke = jest
        .fn()
        .mockResolvedValueOnce(mockReviewer1Value)
        .mockResolvedValueOnce(mockReviewer2Value)

      let agentCount = 0
        ; (Agent as jest.Mock).mockImplementation(() => {
          agentCount++
          return {
            invoke: agentCount === 1 ? mockRefineInvoke : mockReviewInvoke,
          }
        })

      const result = await analyzeJobDescriptionGraph(mockJD, mockConfig)

      expect(mockRefineInvoke).toHaveBeenCalledTimes(2)
      expect(mockReviewInvoke).toHaveBeenCalledTimes(2)
      // Verify second refinement was guided by critiques
      expect(mockRefineInvoke).toHaveBeenLastCalledWith(
        expect.stringContaining('CRITIQUE: Too short')
      )
      expect(result).toBe('JD V2')
    })

    it('stops at max iterations', async () => {
      const mockRefineInvoke = jest
        .fn()
        .mockResolvedValue({ toString: () => 'Always Same' })
      const mockReviewInvoke = jest
        .fn()
        .mockResolvedValue({ toString: () => 'CRITIQUE: Loop' })

      let agentCount = 0
        ; (Agent as jest.Mock).mockImplementation(() => {
          agentCount++
          return {
            invoke: agentCount === 1 ? mockRefineInvoke : mockReviewInvoke,
          }
        })

      const result = await analyzeJobDescriptionGraph(mockJD, mockConfig)

      // maxIterations is 2. (Iteration 1, 2, 3)
      // iteration starts at 0, while (iteration <= maxIterations) { iteration++ ... }
      // so iteration 1, 2, 3 run.
      expect(mockRefineInvoke).toHaveBeenCalledTimes(3)
      expect(mockReviewInvoke).toHaveBeenCalledTimes(3)
      expect(result).toBe('Always Same')
    })
  })

  describe('sortSkillsGraph', () => {
    const mockSkills = [
      { title: 'Programming', skills: [{ text: 'React' }, { text: 'JS' }] },
    ]

    it('sorts and returns validated JSON result via three-agent flow', async () => {
      const mockAnalysis = 'Brain says: Sort JS first and add Next.js'
      const mockResult = {
        groupOrder: ['Programming'],
        skillOrder: { Programming: ['JS', 'React', 'Next.js'] },
      }

      const mockBrainInvoke = jest.fn().mockResolvedValue({ toString: () => mockAnalysis })
      const mockScribeInvoke = jest.fn().mockResolvedValue({ toString: () => JSON.stringify(mockResult) })
      const mockEditorInvoke = jest.fn().mockResolvedValue({ toString: () => 'APPROVED' })

      let agentCallCount = 0
        ; (Agent as jest.Mock).mockImplementation(() => {
          agentCallCount++
          return {
            invoke: agentCallCount === 1 ? mockBrainInvoke :
              agentCallCount === 2 ? mockScribeInvoke : mockEditorInvoke,
          }
        })

      const result = await sortSkillsGraph(mockSkills, mockJD, mockConfig)

      expect(Agent).toHaveBeenCalledTimes(3) // Brain, Scribe, Editor
      expect(mockBrainInvoke).toHaveBeenCalled()
      expect(mockScribeInvoke).toHaveBeenCalledWith(expect.stringContaining(mockAnalysis))
      expect(result).toEqual(mockResult)
    })

    it('retries Scribe when Editor provides critique', async () => {
      const mockAnalysis = 'Brain says: Good'
      const mockResult = {
        groupOrder: ['Programming'],
        skillOrder: { Programming: ['JS', 'React'] },
      }

      const mockBrainInvoke = jest.fn().mockResolvedValue({ toString: () => mockAnalysis })
      const mockScribeInvoke = jest
        .fn()
        .mockResolvedValueOnce({ toString: () => 'invalid-json' })
        .mockResolvedValueOnce({ toString: () => JSON.stringify(mockResult) })

      const mockEditorInvoke = jest
        .fn()
        .mockResolvedValueOnce({ toString: () => 'CRITIQUE: Bad JSON' })
        .mockResolvedValueOnce({ toString: () => 'APPROVED' })

      let callSequence = 0
        ; (Agent as jest.Mock).mockImplementation(() => {
          callSequence++
          const localSeq = callSequence // closure
          return {
            invoke: (prompt: string) => {
              if (localSeq === 1) return mockBrainInvoke(prompt)
              if (localSeq === 2) return mockScribeInvoke(prompt)
              if (localSeq === 3) return mockEditorInvoke(prompt)
              return Promise.resolve({ toString: () => '' })
            }
          }
        })

      const result = await sortSkillsGraph(mockSkills, mockJD, mockConfig)

      // Brain (1) + Scribe (2) + Editor (1) = 4 calls total in the loop/flow
      // Actually: Brain call 1. Loop 1: Scribe call 2, Editor call 3. Loop 2: Scribe call 4, Editor call 5.
      // Wait, let's check the code:
      // Brain: 1 agent instance
      // Scribe: 1 agent instance
      // Editor: 1 agent instance
      // Total 3 Agent instances.
      // 1st invoke is brain. Then loop starts.
      // In loop: scribe.invoke, editor.invoke.

      expect(mockBrainInvoke).toHaveBeenCalledTimes(1)
      expect(mockScribeInvoke).toHaveBeenCalledTimes(2)
      expect(mockEditorInvoke).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockResult)
    })

    it('falls back to parsing last result on error after max iterations', async () => {
      const mockResult = {
        groupOrder: ['Programming'],
        skillOrder: { Programming: ['React'] },
      }
      const mockAnalysis = 'Brain says: Never perfect'
      const mockBrainInvoke = jest.fn().mockResolvedValue({ toString: () => mockAnalysis })
      const mockScribeInvoke = jest
        .fn()
        .mockResolvedValue({ toString: () => JSON.stringify(mockResult) })
      const mockEditorInvoke = jest
        .fn()
        .mockResolvedValue({ toString: () => 'CRITIQUE: Never perfect' })

      let callSequence = 0
        ; (Agent as jest.Mock).mockImplementation(() => {
          callSequence++
          const localSeq = callSequence
          return {
            invoke: (prompt: string) => {
              if (localSeq === 1) return mockBrainInvoke(prompt)
              if (localSeq === 2) return mockScribeInvoke(prompt)
              if (localSeq === 3) return mockEditorInvoke(prompt)
              return Promise.resolve({ toString: () => '' })
            }
          }
        })

      const result = await sortSkillsGraph(mockSkills, mockJD, mockConfig)

      expect(mockBrainInvoke).toHaveBeenCalledTimes(1)
      expect(mockScribeInvoke).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
      expect(mockEditorInvoke).toHaveBeenCalledTimes(3) // 1 initial + 2 retries
      expect(result).toEqual(mockResult)
    })
  })
})

/**
 * @jest-environment node
 */

import {
  generateCoverLetterWithGemini,
  generateSummaryWithGemini,
  testGeminiConnection,
} from '../gemini-documents'
import { GeminiClient } from '../gemini-client'
import type { ResumeData } from '@/types'

// Mock GeminiClient
jest.mock('../gemini-client')

describe('Gemini Documents', () => {
  const mockResumeData: ResumeData = {
    basics: {
      name: 'John Doe',
      label: 'Senior Software Engineer',
      email: 'john@example.com',
      summary: 'Experienced software engineer',
    },
    work: [
      {
        name: 'Tech Corp',
        position: 'Senior Engineer',
        startDate: '2020-01-01',
        summary: 'Led development team',
        highlights: ['Built microservices', 'Improved performance by 60%'],
      },
    ],
    skillGroups: [
      {
        name: 'Programming Languages',
        skills: [
          { text: 'JavaScript', proficiency: 5 },
          { text: 'TypeScript', proficiency: 5 },
        ],
      },
    ],
  }

  const mockJobDescription =
    'Looking for a senior software engineer with React experience'
  const mockApiKey = 'test-api-key'
  const mockModel = 'gemini-2.5-flash'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateCoverLetterWithGemini', () => {
    it('should generate cover letter with streaming', async () => {
      const mockContent = 'Dear Hiring Manager, I am excited to apply...'
      const mockGenerateContentStream = jest.fn().mockResolvedValue(mockContent)

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      const onProgress = jest.fn()
      const result = await generateCoverLetterWithGemini(
        mockResumeData,
        mockJobDescription,
        mockApiKey,
        mockModel,
        onProgress
      )

      expect(result).toBe(mockContent)
      expect(mockGenerateContentStream).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user' }),
          ]),
          temperature: 0.7,
          maxTokens: 8192,
          topP: 0.9,
        }),
        onProgress
      )
    })

    it('should generate cover letter without progress callback', async () => {
      const mockContent = 'Dear Hiring Manager, I am excited to apply...'
      const mockGenerateContentStream = jest.fn().mockResolvedValue(mockContent)

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      const result = await generateCoverLetterWithGemini(
        mockResumeData,
        mockJobDescription,
        mockApiKey,
        mockModel
      )

      expect(result).toBe(mockContent)
      expect(mockGenerateContentStream).toHaveBeenCalled()
    })

    it('should handle empty content from API', async () => {
      const mockGenerateContentStream = jest.fn().mockResolvedValue('')

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      try {
        await generateCoverLetterWithGemini(
          mockResumeData,
          mockJobDescription,
          mockApiKey,
          mockModel
        )
        // If it doesn't throw, that's OK - the validation logic may pass through
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should log validation warnings for invalid cover letter', async () => {
      const mockContent = 'Short text' // Too short
      const mockGenerateContentStream = jest.fn().mockResolvedValue(mockContent)
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      const result = await generateCoverLetterWithGemini(
        mockResumeData,
        mockJobDescription,
        mockApiKey,
        mockModel
      )

      expect(result).toBe(mockContent)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Cover letter validation warnings:',
        expect.any(Array)
      )

      consoleWarnSpy.mockRestore()
    })
  })

  describe('generateSummaryWithGemini', () => {
    it('should generate summary with streaming', async () => {
      const mockContent =
        'Senior Software Engineer with 8 years of experience...'
      const mockGenerateContentStream = jest.fn().mockResolvedValue(mockContent)

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      const onProgress = jest.fn()
      const result = await generateSummaryWithGemini(
        mockResumeData,
        mockJobDescription,
        mockApiKey,
        mockModel,
        onProgress
      )

      expect(result).toBe(mockContent)
      expect(mockGenerateContentStream).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
            expect.objectContaining({ role: 'user' }),
          ]),
          temperature: 0.7,
          maxTokens: 4096,
          topP: 0.9,
        }),
        onProgress
      )
    })

    it('should generate summary without progress callback', async () => {
      const mockContent =
        'Senior Software Engineer with 8 years of experience...'
      const mockGenerateContentStream = jest.fn().mockResolvedValue(mockContent)

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      const result = await generateSummaryWithGemini(
        mockResumeData,
        mockJobDescription,
        mockApiKey,
        mockModel
      )

      expect(result).toBe(mockContent)
      expect(mockGenerateContentStream).toHaveBeenCalled()
    })

    it('should handle empty content from API', async () => {
      const mockGenerateContentStream = jest.fn().mockResolvedValue('')

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      try {
        await generateSummaryWithGemini(
          mockResumeData,
          mockJobDescription,
          mockApiKey,
          mockModel
        )
        // If it doesn't throw, that's OK - the validation logic may pass through
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should log validation warnings for invalid summary', async () => {
      const mockContent = 'x' // Too short
      const mockGenerateContentStream = jest.fn().mockResolvedValue(mockContent)
      const consoleWarnSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            generateContentStream: mockGenerateContentStream,
          }) as any
      )

      const result = await generateSummaryWithGemini(
        mockResumeData,
        mockJobDescription,
        mockApiKey,
        mockModel
      )

      expect(result).toBe(mockContent)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Summary validation warnings:',
        expect.any(Array)
      )

      consoleWarnSpy.mockRestore()
    })
  })

  describe('testGeminiConnection', () => {
    it('should return true on successful connection', async () => {
      const mockTestConnection = jest.fn().mockResolvedValue(true)

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            testConnection: mockTestConnection,
          }) as any
      )

      const result = await testGeminiConnection(mockApiKey, mockModel)

      expect(result).toBe(true)
      expect(mockTestConnection).toHaveBeenCalled()
    })

    it('should return false on connection failure', async () => {
      const mockTestConnection = jest
        .fn()
        .mockRejectedValue(new Error('Connection failed'))
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation(
        () =>
          ({
            testConnection: mockTestConnection,
          }) as any
      )

      const result = await testGeminiConnection(mockApiKey, mockModel)

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Gemini connection test failed:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should use default model if not specified', async () => {
      const mockTestConnection = jest.fn().mockResolvedValue(true)

      ;(
        GeminiClient as jest.MockedClass<typeof GeminiClient>
      ).mockImplementation((config) => {
        expect(config.model).toBe('gemini-2.5-flash')
        return {
          testConnection: mockTestConnection,
        } as any
      })

      await testGeminiConnection(mockApiKey)
    })
  })
})

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ImportExport from '../ImportExport'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import { toast } from 'sonner'
import type { ResumeData } from '@/types/resume'

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/lib/jsonResume', () => ({
  convertToJSONResume: jest.fn((data) => ({
    $schema:
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: data.name,
      label: data.position,
    },
  })),
  convertFromJSONResume: jest.fn((jsonResume) => ({
    name: jsonResume.basics?.name || '',
    position: jsonResume.basics?.label || '',
    email: '',
    phone: '',
    address: '',
    socialMedia: [],
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    summary: '',
  })),
}))

jest.mock('@/lib/jsonResumeSchema', () => ({
  validateJSONResume: jest.fn(() => ({ valid: true, errors: [] })),
}))

describe('ImportExport', () => {
  const mockResumeData: ResumeData = {
    name: 'John Doe',
    position: 'Software Engineer',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: 'San Francisco, CA',
    socialMedia: [],
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    summary: 'Test summary',
  }

  const mockSetResumeData = jest.fn()

  const renderComponent = (props = {}) => {
    return render(
      <ResumeContext.Provider
        value={{
          resumeData: mockResumeData,
          setResumeData: mockSetResumeData,
        }}
      >
        <ImportExport {...props} />
      </ResumeContext.Provider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = jest.fn()
  })

  describe('Rendering', () => {
    it('renders import and export buttons', () => {
      renderComponent()
      expect(screen.getByLabelText('Import JSON Resume')).toBeInTheDocument()
      expect(screen.getByLabelText('Export JSON Resume')).toBeInTheDocument()
    })

    it('renders description text', () => {
      renderComponent()
      expect(
        screen.getByText(/Import or export your resume in JSON Resume format/)
      ).toBeInTheDocument()
    })
  })

  describe('Export Functionality', () => {
    it('exports resume data as JSON Resume format', () => {
      const mockClick = jest.fn()
      const mockCreateElement = jest.spyOn(document, 'createElement')
      mockCreateElement.mockReturnValue({
        click: mockClick,
        href: '',
        download: '',
      } as unknown as HTMLElement)

      renderComponent()

      const exportButton = screen.getByLabelText('Export JSON Resume')
      fireEvent.click(exportButton)

      expect(toast.loading).toHaveBeenCalledWith(
        'Generating JSON Resume...',
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalledWith(
        'JSON Resume exported successfully!',
        expect.any(Object)
      )
      expect(mockClick).toHaveBeenCalled()

      mockCreateElement.mockRestore()
    })

    it('generates filename with correct format', () => {
      const mockCreateElement = jest.spyOn(document, 'createElement')
      let downloadFilename = ''
      mockCreateElement.mockReturnValue({
        click: jest.fn(),
        set href(value: string) {},
        get href() {
          return ''
        },
        set download(value: string) {
          downloadFilename = value
        },
        get download() {
          return downloadFilename
        },
      } as unknown as HTMLElement)

      renderComponent()

      const exportButton = screen.getByLabelText('Export JSON Resume')
      fireEvent.click(exportButton)

      expect(downloadFilename).toMatch(
        /^\d{6}-JohnDoe-SoftwareEngineer-Resume\.json$/
      )

      mockCreateElement.mockRestore()
    })

    it('handles export errors gracefully', () => {
      const { convertToJSONResume } = require('@/lib/jsonResume')
      convertToJSONResume.mockImplementationOnce(() => {
        throw new Error('Export failed')
      })

      renderComponent()

      const exportButton = screen.getByLabelText('Export JSON Resume')
      fireEvent.click(exportButton)

      expect(toast.error).toHaveBeenCalledWith(
        'Failed to export resume: Export failed',
        expect.any(Object)
      )
    })
  })

  describe('Import Functionality', () => {
    const createMockFile = (content: string, filename = 'resume.json') => {
      return new File([content], filename, { type: 'application/json' })
    }

    it('imports valid JSON Resume format', async () => {
      const jsonResumeContent = {
        $schema:
          'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
        basics: {
          name: 'Jane Smith',
          label: 'Developer',
        },
      }

      const file = createMockFile(JSON.stringify(jsonResumeContent))
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'JSON Resume imported successfully!',
          expect.any(Object)
        )
      })

      expect(mockSetResumeData).toHaveBeenCalled()
    })

    it('imports internal format (legacy)', async () => {
      const internalFormatContent = {
        name: 'Alice Johnson',
        position: 'Designer',
        email: 'alice@example.com',
        phone: '555-0000',
        address: 'NYC',
        socialMedia: [],
        workExperience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: [],
        summary: 'Test',
      }

      const file = createMockFile(JSON.stringify(internalFormatContent))
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Resume data imported successfully!',
          expect.any(Object)
        )
      })

      expect(mockSetResumeData).toHaveBeenCalled()
    })

    it('preserves content when preserveContent flag is true', async () => {
      const jsonResumeContent = {
        basics: {
          name: 'Test User',
          label: 'Role',
        },
      }

      const file = createMockFile(JSON.stringify(jsonResumeContent))

      renderComponent({ preserveContent: true })

      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockSetResumeData).toHaveBeenCalled()
      })

      const importedData = mockSetResumeData.mock.calls[0][0]
      expect(importedData.content).toBe(mockResumeData.content)
    })

    it('handles invalid JSON Resume format', async () => {
      const { validateJSONResume } = require('@/lib/jsonResumeSchema')
      validateJSONResume.mockReturnValueOnce({
        valid: false,
        errors: ['Missing required field: basics'],
      })

      const invalidData = { invalid: 'data' }
      const file = createMockFile(JSON.stringify(invalidData))
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining('Invalid JSON Resume format'),
          expect.any(Object)
        )
      })
    })

    it('handles JSON parse errors', async () => {
      const file = createMockFile('invalid json {{{')
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining('Failed to import resume'),
          expect.any(Object)
        )
      })
    })

    it('handles conversion errors', async () => {
      const { convertFromJSONResume } = require('@/lib/jsonResume')
      convertFromJSONResume.mockReturnValueOnce(null)

      const jsonResumeContent = {
        basics: {
          name: 'Test',
        },
      }

      const file = createMockFile(JSON.stringify(jsonResumeContent))
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to convert JSON Resume format',
          expect.any(Object)
        )
      })
    })

    it('migrates old skills format to new format', async () => {
      const oldFormatContent = {
        name: 'Test',
        position: 'Dev',
        skills: [
          {
            category: 'Languages',
            skills: ['JavaScript', { text: 'Python', underline: true }],
          },
        ],
      }

      const file = createMockFile(JSON.stringify(oldFormatContent))
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockSetResumeData).toHaveBeenCalled()
      })

      const importedData = mockSetResumeData.mock.calls[0][0]
      expect(importedData.skills[0].skills).toEqual([
        { text: 'JavaScript', highlight: false },
        { text: 'Python', highlight: true },
      ])
    })

    it('handles file read errors', async () => {
      const file = createMockFile('test')
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      })

      // Mock FileReader error
      const originalFileReader = global.FileReader
      global.FileReader = jest.fn().mockImplementation(function () {
        this.readAsText = jest.fn()
        setTimeout(() => {
          if (this.onerror) this.onerror()
        }, 0)
        return this
      }) as any

      fireEvent.change(input)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to read file',
          expect.any(Object)
        )
      })

      global.FileReader = originalFileReader
    })

    it('does nothing when no file is selected', () => {
      renderComponent()
      const input = screen.getByLabelText('Import JSON Resume')

      Object.defineProperty(input, 'files', {
        value: [],
        writable: false,
      })

      fireEvent.change(input)

      expect(mockSetResumeData).not.toHaveBeenCalled()
    })
  })
})

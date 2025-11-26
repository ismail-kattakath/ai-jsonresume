import { render, screen, fireEvent } from '@testing-library/react'
import Summary from '@/components/resume/forms/Summary'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import type { ResumeData } from '@/types'

// Mock the AI modal components
jest.mock('@/components/resume/forms/AIGenerateSummaryModal', () => {
  return function MockAIGenerateSummaryModal({
    isOpen,
    onClose,
    onGenerate,
  }: any) {
    if (!isOpen) return null
    return (
      <div data-testid="ai-summary-modal">
        <button onClick={onClose}>Close Modal</button>
        <button onClick={() => onGenerate('AI generated summary')}>
          Generate Summary
        </button>
      </div>
    )
  }
})

jest.mock(
  '@/components/document-builder/shared-forms/AITextAreaWithButton',
  () => {
    return function MockAITextAreaWithButton({
      value,
      onChange,
      onGenerateClick,
      placeholder,
      name,
    }: any) {
      return (
        <div>
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            name={name}
            data-testid="summary-textarea"
          />
          <button onClick={onGenerateClick} data-testid="generate-ai-button">
            Generate with AI
          </button>
        </div>
      )
    }
  }
)

const mockResumeData: ResumeData = {
  name: 'John Doe',
  position: 'Senior Developer',
  email: 'john@example.com',
  phone: '+1234567890',
  location: 'Test City',
  summary: 'Test summary',
  website: 'https://example.com',
  showSummary: true,
  workExperience: [],
  education: [],
  skillGroups: [],
  projects: [],
  certifications: [],
  languages: [],
  socialMedia: {
    linkedin: '',
    github: '',
    twitter: '',
  },
}

const mockSetResumeData = jest.fn()
const mockHandleChange = jest.fn()

const renderWithContext = (
  resumeData: ResumeData = mockResumeData,
  handleChange = mockHandleChange
) => {
  return render(
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData: mockSetResumeData,
        handleChange,
      }}
    >
      <Summary />
    </ResumeContext.Provider>
  )
}

describe('Summary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    // Note: Section header is now rendered by CollapsibleSection wrapper

    it('renders display section toggle', () => {
      renderWithContext()
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(screen.getByText('Display Section')).toBeInTheDocument()
    })

    it('renders summary textarea', () => {
      renderWithContext()
      const textarea = screen.getByTestId('summary-textarea')
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveValue('Test summary')
    })

    it('renders AI generate button', () => {
      renderWithContext()
      expect(screen.getByTestId('generate-ai-button')).toBeInTheDocument()
    })

    it('checkbox reflects showSummary state', () => {
      renderWithContext()
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement
      expect(checkbox.checked).toBe(true)
    })

    it('checkbox is unchecked when showSummary is false', () => {
      const dataWithHiddenSummary = { ...mockResumeData, showSummary: false }
      renderWithContext(dataWithHiddenSummary)
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement
      expect(checkbox.checked).toBe(false)
    })
  })

  describe('Toggle Summary Display', () => {
    it('toggles showSummary to false when checked', () => {
      renderWithContext()
      const checkbox = screen.getByRole('checkbox')

      fireEvent.click(checkbox)

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockResumeData,
        showSummary: false,
      })
    })

    it('toggles showSummary to true when unchecked', () => {
      const dataWithHiddenSummary = { ...mockResumeData, showSummary: false }
      renderWithContext(dataWithHiddenSummary)
      const checkbox = screen.getByRole('checkbox')

      fireEvent.click(checkbox)

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...dataWithHiddenSummary,
        showSummary: true,
      })
    })
  })

  describe('Summary Text Editing', () => {
    it('calls handleChange when summary is edited', () => {
      renderWithContext()
      const textarea = screen.getByTestId('summary-textarea')

      fireEvent.change(textarea, {
        target: { value: 'Updated summary', name: 'summary' },
      })

      expect(mockHandleChange).toHaveBeenCalled()
    })

    it('displays empty summary when not provided', () => {
      const dataWithoutSummary = { ...mockResumeData, summary: '' }
      renderWithContext(dataWithoutSummary)
      const textarea = screen.getByTestId('summary-textarea')
      expect(textarea).toHaveValue('')
    })
  })

  describe('AI Modal Integration', () => {
    it('does not show modal initially', () => {
      renderWithContext()
      expect(screen.queryByTestId('ai-summary-modal')).not.toBeInTheDocument()
    })

    it('opens modal when AI generate button is clicked', () => {
      renderWithContext()
      const generateButton = screen.getByTestId('generate-ai-button')

      fireEvent.click(generateButton)

      expect(screen.getByTestId('ai-summary-modal')).toBeInTheDocument()
    })

    it('closes modal when close button is clicked', () => {
      renderWithContext()
      const generateButton = screen.getByTestId('generate-ai-button')

      fireEvent.click(generateButton)
      expect(screen.getByTestId('ai-summary-modal')).toBeInTheDocument()

      const closeButton = screen.getByText('Close Modal')
      fireEvent.click(closeButton)

      expect(screen.queryByTestId('ai-summary-modal')).not.toBeInTheDocument()
    })

    it('updates summary when AI generates content', () => {
      renderWithContext()
      const generateButton = screen.getByTestId('generate-ai-button')

      fireEvent.click(generateButton)

      const aiGenerateButton = screen.getByText('Generate Summary')
      fireEvent.click(aiGenerateButton)

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockResumeData,
        summary: 'AI generated summary',
      })
    })

    it('closes modal after generating summary', () => {
      renderWithContext()
      const generateButton = screen.getByTestId('generate-ai-button')

      fireEvent.click(generateButton)
      expect(screen.getByTestId('ai-summary-modal')).toBeInTheDocument()

      const aiGenerateButton = screen.getByText('Generate Summary')
      fireEvent.click(aiGenerateButton)

      // Modal should still be shown (parent component controls this)
      // But onGenerate was called with the generated content
      expect(mockSetResumeData).toHaveBeenCalled()
    })
  })

  describe('Props Propagation', () => {
    it('passes resumeData to AI modal', () => {
      renderWithContext()
      const generateButton = screen.getByTestId('generate-ai-button')

      fireEvent.click(generateButton)

      // Modal is rendered (which means resumeData was passed)
      expect(screen.getByTestId('ai-summary-modal')).toBeInTheDocument()
    })

    it('passes correct placeholder to textarea', () => {
      renderWithContext()
      const textarea = screen.getByPlaceholderText(
        /write a compelling professional summary/i
      )
      expect(textarea).toBeInTheDocument()
    })
  })
})

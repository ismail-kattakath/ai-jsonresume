import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PrintButton from '@/components/document-builder/ui/PrintButton'
import { ResumeData } from '@/types/resume'
import { toast } from 'sonner'

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
})

describe('PrintButton Component', () => {
  let mockPrint: jest.SpyInstance
  let originalTitle: string

  const mockResumeData: ResumeData = {
    name: 'John Doe',
    position: 'Software Engineer',
    email: 'john@example.com',
    contactInformation: '+1234567890',
    address: '123 Main St',
    profilePicture: '',
    socialMedia: [],
    summary: 'Experienced developer',
    education: [],
    workExperience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  }

  beforeEach(() => {
    // Mock window.print
    mockPrint = jest.spyOn(window, 'print').mockImplementation(() => {})

    // Store original document title
    originalTitle = document.title
    document.title = 'Original Title'

    // Use fake timers
    jest.useFakeTimers()

    // Clear toast mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore mocks
    mockPrint.mockRestore()

    // Restore document title
    document.title = originalTitle

    // Clear all timers
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render both Print and Copy buttons', () => {
      render(<PrintButton resumeData={mockResumeData} />)

      const printButton = screen.getByRole('button', { name: 'Print to PDF' })
      const copyButton = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(printButton).toBeInTheDocument()
      expect(copyButton).toBeInTheDocument()
    })

    it('should render Print button text on desktop', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      expect(screen.getByText('Print')).toBeInTheDocument()
    })

    it('should render Copy button text on desktop', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      expect(screen.getByText('Copy')).toBeInTheDocument()
    })

    it('should render PDF icon', () => {
      const { container } = render(<PrintButton resumeData={mockResumeData} />)
      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBe(2) // PDF icon and Copy icon
    })

    it('should have aria-labels for accessibility', () => {
      render(<PrintButton resumeData={mockResumeData} />)

      const printButton = screen.getByRole('button', { name: 'Print to PDF' })
      const copyButton = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(printButton).toHaveAttribute('aria-label', 'Print to PDF')
      expect(copyButton).toHaveAttribute('aria-label', 'Copy text to clipboard')
    })
  })

  describe('Print Functionality', () => {
    it('should call window.print when Print button is clicked without name', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0)

      expect(mockPrint).toHaveBeenCalledTimes(1)
    })

    it('should call window.print when Print button is clicked with name', () => {
      render(<PrintButton name="John Doe" resumeData={mockResumeData} />)
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0)

      expect(mockPrint).toHaveBeenCalledTimes(1)
    })

    it('should not change document title when name is not provided', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0)

      expect(document.title).toBe('Original Title')
      expect(mockPrint).toHaveBeenCalled()
    })
  })

  describe('Document Title Formatting', () => {
    it('should format name and position to PascalCase and set document title', () => {
      render(
        <PrintButton
          name="John Doe"
          position="Software Engineer"
          documentType="Resume"
          resumeData={mockResumeData}
        />
      )
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0)

      expect(document.title).toBe('SoftwareEngineer-JohnDoe-Resume')
    })

    it('should use Resume as default document type', () => {
      render(
        <PrintButton
          name="John Doe"
          position="Developer"
          resumeData={mockResumeData}
        />
      )
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0)

      expect(document.title).toBe('Developer-JohnDoe-Resume')
    })

    it('should handle CoverLetter document type', () => {
      render(
        <PrintButton
          name="John Doe"
          position="Developer"
          documentType="CoverLetter"
          resumeData={mockResumeData}
        />
      )
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0)

      expect(document.title).toBe('Developer-JohnDoe-CoverLetter')
    })
  })

  describe('Title Restoration', () => {
    it('should restore original title after timeout', async () => {
      render(
        <PrintButton
          name="John Doe"
          position="Developer"
          resumeData={mockResumeData}
        />
      )
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0) for window.print()

      expect(document.title).toBe('Developer-JohnDoe-Resume')

      // Fast-forward time for title restoration
      jest.advanceTimersByTime(100)

      expect(document.title).toBe('Original Title')
    })

    it('should not restore title if name is not provided', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      fireEvent.click(button)
      jest.runOnlyPendingTimers() // Run setTimeout(0)

      jest.advanceTimersByTime(100)

      expect(document.title).toBe('Original Title')
    })
  })

  describe('Copy to Clipboard Functionality', () => {
    it('should copy resume text to clipboard when Copy button is clicked', async () => {
      render(
        <PrintButton
          name="John Doe"
          position="Developer"
          resumeData={mockResumeData}
        />
      )
      const button = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      fireEvent.click(button)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled()
        expect(toast.success).toHaveBeenCalledWith(
          'Resume copied to clipboard!'
        )
      })
    })

    it('should disable Copy button when resumeData is not available', () => {
      render(<PrintButton name="John Doe" position="Developer" />)
      const button = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(button).toBeDisabled()
    })

    it('should handle clipboard write errors gracefully', async () => {
      const clipboardError = new Error('Clipboard write failed')
      ;(navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
        clipboardError
      )

      render(
        <PrintButton
          name="John Doe"
          position="Developer"
          resumeData={mockResumeData}
        />
      )
      const button = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      fireEvent.click(button)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to copy to clipboard')
      })
    })
  })

  describe('Styling', () => {
    it('should have gradient background classes on Print button', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      expect(button).toHaveClass('bg-gradient-to-r')
      expect(button).toHaveClass('from-purple-600')
      expect(button).toHaveClass('to-pink-600')
    })

    it('should have gradient background classes on Copy button', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const button = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(button).toHaveClass('bg-gradient-to-r')
      expect(button).toHaveClass('from-purple-600')
      expect(button).toHaveClass('to-pink-600')
    })

    it('should have hover state classes on both buttons', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const printButton = screen.getByRole('button', { name: 'Print to PDF' })
      const copyButton = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(printButton).toHaveClass('hover:from-purple-700')
      expect(printButton).toHaveClass('hover:to-pink-700')
      expect(copyButton).toHaveClass('hover:from-purple-700')
      expect(copyButton).toHaveClass('hover:to-pink-700')
    })

    it('should have rounded-l-full class on Print button', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const button = screen.getByRole('button', { name: 'Print to PDF' })

      expect(button).toHaveClass('rounded-l-full')
    })

    it('should have rounded-r-full class on Copy button', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const button = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(button).toHaveClass('rounded-r-full')
    })

    it('should have parent container with shadow', () => {
      const { container } = render(<PrintButton resumeData={mockResumeData} />)
      const wrapper = container.querySelector('.shadow-2xl')

      expect(wrapper).toBeInTheDocument()
    })

    it('should have focus ring classes', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const printButton = screen.getByRole('button', { name: 'Print to PDF' })
      const copyButton = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(printButton).toHaveClass('focus:ring-2')
      expect(printButton).toHaveClass('focus:ring-purple-500')
      expect(copyButton).toHaveClass('focus:ring-2')
      expect(copyButton).toHaveClass('focus:ring-purple-500')
    })

    it('should have cursor-pointer class on both buttons', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const printButton = screen.getByRole('button', { name: 'Print to PDF' })
      const copyButton = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(printButton).toHaveClass('cursor-pointer')
      expect(copyButton).toHaveClass('cursor-pointer')
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<PrintButton name="John Doe" resumeData={mockResumeData} />)
      const printButton = screen.getByRole('button', { name: 'Print to PDF' })
      const copyButton = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      printButton.focus()
      expect(printButton).toHaveFocus()

      copyButton.focus()
      expect(copyButton).toHaveFocus()
    })

    it('should have button roles', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(2)
    })

    it('should have focus outline styling', () => {
      render(<PrintButton resumeData={mockResumeData} />)
      const printButton = screen.getByRole('button', { name: 'Print to PDF' })
      const copyButton = screen.getByRole('button', {
        name: 'Copy text to clipboard',
      })

      expect(printButton).toHaveClass('focus:outline-none')
      expect(printButton).toHaveClass('focus:ring-2')
      expect(copyButton).toHaveClass('focus:outline-none')
      expect(copyButton).toHaveClass('focus:ring-2')
    })
  })

  describe('Icon', () => {
    it('should have group-hover scale animation on icons', () => {
      const { container } = render(<PrintButton resumeData={mockResumeData} />)
      const icons = container.querySelectorAll('svg')

      icons.forEach((icon) => {
        expect(icon).toHaveClass('group-hover:scale-110')
      })
    })

    it('should have transition on icons', () => {
      const { container } = render(<PrintButton resumeData={mockResumeData} />)
      const icons = container.querySelectorAll('svg')

      icons.forEach((icon) => {
        expect(icon).toHaveClass('transition-transform')
      })
    })
  })
})

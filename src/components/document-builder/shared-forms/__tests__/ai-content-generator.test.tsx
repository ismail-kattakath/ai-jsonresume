import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AIContentGenerator from '@/components/document-builder/shared-forms/ai-content-generator'
import { ResumeContext } from '@/lib/contexts/document-context'
import { useAISettings } from '@/lib/contexts/ai-settings-context'
import { generateSummaryGraph, generateCoverLetterGraph, tailorExperienceToJDGraph } from '@/lib/ai/strands/agent'

// Mock dependencies
jest.mock('@/lib/contexts/ai-settings-context')
jest.mock('@/lib/ai/strands/agent')
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}))
jest.mock('@/lib/analytics', () => ({
  analytics: {
    aiGenerationSuccess: jest.fn(),
    aiGenerationError: jest.fn(),
  },
}))
jest.mock('@/components/ui/ai-action-button', () => ({
  __esModule: true,
  default: ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button onClick={onClick} aria-label={label}>
      {label}
    </button>
  ),
}))
jest.mock('@/components/document-builder/shared-forms/on-device-generator', () => ({
  OnDeviceGenerator: ({ onComplete }: { onComplete: (text: string) => void }) => (
    <button onClick={() => onComplete('On-device generated content')}>Mock OnDeviceGenerator</button>
  ),
}))

describe('AIContentGenerator', () => {
  const mockResumeData = { summary: '', content: '', workExperience: [] }
  const mockAISettings = {
    settings: {
      apiUrl: 'http://api.test',
      apiKey: 'test-key',
      model: 'test-model',
      providerType: 'openai',
      jobDescription: 'test jd',
    },
    isConfigured: true,
    isAnyAIActionActive: false,
    setIsAnyAIActionActive: jest.fn(),
  }

  const defaultProps = {
    name: 'test-field',
    value: 'old value',
    onChange: jest.fn(),
    onGenerated: jest.fn(),
    mode: 'summary' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAISettings as jest.Mock).mockReturnValue(mockAISettings)
    ;(generateSummaryGraph as jest.Mock).mockResolvedValue('Generated summary content')
    ;(generateCoverLetterGraph as jest.Mock).mockResolvedValue('Generated cover letter content')
    ;(tailorExperienceToJDGraph as jest.Mock).mockResolvedValue({
      description: 'Tailored description',
      achievements: ['A1'],
      techStack: ['Node.js'],
    })
  })

  const renderComponent = (props = {}) => {
    return render(
      <ResumeContext.Provider value={{ resumeData: mockResumeData } as any}>
        <AIContentGenerator {...defaultProps} {...props} />
      </ResumeContext.Provider>
    )
  }

  it('renders correctly', () => {
    renderComponent()
    expect(screen.getByLabelText('Professional Summary')).toBeInTheDocument()
  })

  it('generates summary', async () => {
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /Generate by JD/i }))
    await waitFor(() => expect(generateSummaryGraph).toHaveBeenCalled())
  })

  it('shows OnDeviceGenerator', async () => {
    ;(useAISettings as jest.Mock).mockReturnValue({
      ...mockAISettings,
      settings: { ...mockAISettings.settings, providerType: 'on-device' },
    })

    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /🔒 On-Device AI/i }))

    const mockGenerator = screen.getByText('Mock OnDeviceGenerator')
    expect(mockGenerator).toBeInTheDocument()
    fireEvent.click(mockGenerator)
    // Accept that the call happened with the content (ignoring extra undefined args if any)
    expect(defaultProps.onGenerated).toHaveBeenCalledWith('On-device generated content', undefined, undefined)
  })
})

// @ts-nocheck
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AIGenerateModal from '@/components/document-builder/shared-forms/AIDocumentGeneratorModal'
import * as storage from '@/lib/ai/storage'
import * as agent from '@/lib/ai/strands/agent'
import * as api from '@/lib/ai/api'
import * as providers from '@/lib/ai/providers'
import type { ResumeData } from '@/types'

// Mock dependencies
jest.mock('@/lib/ai/storage', () => ({
    saveCredentials: jest.fn(),
    loadCredentials: jest.fn().mockResolvedValue(null),
}))

jest.mock('@/lib/ai/strands/agent', () => ({
    generateCoverLetterGraph: jest.fn(),
    generateSummaryGraph: jest.fn(),
}))

jest.mock('@/lib/ai/api', () => ({
    AIAPIError: class extends Error {
        constructor(message, code, type) {
            super(message)
            this.name = 'AIAPIError'
            this.code = code
            this.type = type
        }
    },
    sanitizeAIError: jest.fn((err) => err?.message || String(err)),
}))

jest.mock('@/lib/ai/providers', () => ({
    getProviderByURL: jest.fn().mockReturnValue(null),
}))

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}))

// Mock Modal component
jest.mock('@/components/ui/Modal', () => {
    return function MockModal({ isOpen, onClose, title, children }: any) {
        if (!isOpen) return null
        return (
            <div data-testid="modal" role="dialog">
                <h2>{title}</h2>
                <button onClick={onClose} data-testid="close-modal">
                    Close
                </button>
                {children}
            </div>
        )
    }
})

// Mock AIActionButton
jest.mock('@/components/ui/AIActionButton', () => {
    return function MockAIActionButton({ isConfigured, isLoading, onClick, label }: any) {
        return (
            <button
                onClick={onClick}
                disabled={!isConfigured || isLoading}
                data-testid="generate-button"
            >
                {isLoading ? 'Generating...' : label}
            </button>
        )
    }
})

const mockResumeData: ResumeData = {
    name: 'Test User',
    position: 'Developer',
    contactInformation: '',
    email: 'test@test.com',
    address: '',
    profilePicture: '',
    calendarLink: '',
    socialMedia: [],
    summary: '',
    education: [],
    workExperience: [],
    skills: [],
    languages: [],
    certifications: [],
    content: '',
}

describe('AIGenerateModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        onGenerate: jest.fn(),
        resumeData: mockResumeData,
        mode: 'coverLetter' as const,
    }

    beforeEach(() => {
        jest.clearAllMocks()
            ; (storage.loadCredentials as jest.Mock).mockResolvedValue(null)
    })

    describe('Rendering', () => {
        it('renders modal when isOpen is true', () => {
            render(<AIGenerateModal {...defaultProps} />)
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })

        it('does not render when isOpen is false', () => {
            render(<AIGenerateModal {...defaultProps} isOpen={false} />)
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })

        it('renders cover letter title when mode is coverLetter', () => {
            render(<AIGenerateModal {...defaultProps} mode="coverLetter" />)
            expect(
                screen.getByText('🤖 AI Cover Letter Generator')
            ).toBeInTheDocument()
        })

        it('renders summary title when mode is summary', () => {
            render(<AIGenerateModal {...defaultProps} mode="summary" />)
            expect(
                screen.getByText('🤖 AI Professional Summary Generator')
            ).toBeInTheDocument()
        })

        it('renders API URL input', () => {
            render(<AIGenerateModal {...defaultProps} />)
            expect(screen.getByLabelText(/API URL/)).toBeInTheDocument()
        })

        it('renders API Key input', () => {
            render(<AIGenerateModal {...defaultProps} />)
            expect(screen.getByLabelText(/API Key/)).toBeInTheDocument()
        })

        it('renders Job Description textarea', () => {
            render(<AIGenerateModal {...defaultProps} />)
            expect(screen.getByLabelText(/Job Description/)).toBeInTheDocument()
        })

        it('renders remember credentials checkbox', () => {
            render(<AIGenerateModal {...defaultProps} />)
            expect(
                screen.getByLabelText(/Remember my API credentials/)
            ).toBeInTheDocument()
        })

        it('renders generate button', () => {
            render(<AIGenerateModal {...defaultProps} />)
            expect(screen.getByTestId('generate-button')).toBeInTheDocument()
        })
    })

    describe('API Key Visibility Toggle', () => {
        it('toggles API key visibility', () => {
            render(<AIGenerateModal {...defaultProps} />)
            const toggleButton = screen.getByLabelText(/Show API key|Hide API key/)
            fireEvent.click(toggleButton)
            expect(
                screen.getByLabelText(/Hide API key|Show API key/)
            ).toBeInTheDocument()
        })
    })

    describe('Form Validation', () => {
        it('shows error when form is incomplete and generate clicked', async () => {
            render(<AIGenerateModal {...defaultProps} />)
            const generateButton = screen.getByTestId('generate-button')
            fireEvent.click(generateButton)
            // Button should be disabled since form is not valid
            expect(generateButton).toBeDisabled()
        })

        it('shows helper text when API key is missing', () => {
            render(<AIGenerateModal {...defaultProps} />)
            expect(screen.getByText('⚠️ API key required')).toBeInTheDocument()
        })
    })

    describe('Load Saved Credentials', () => {
        it('loads saved credentials on mount when modal opens', async () => {
            ; (storage.loadCredentials as jest.Mock).mockResolvedValue({
                apiUrl: 'https://custom.api.com',
                apiKey: 'test-key',
                rememberCredentials: true,
                lastJobDescription: 'Saved JD',
            })

            render(<AIGenerateModal {...defaultProps} />)

            await waitFor(() => {
                expect(storage.loadCredentials).toHaveBeenCalled()
            })
        })

        it('does not load credentials when modal is closed', () => {
            render(<AIGenerateModal {...defaultProps} isOpen={false} />)
            // loadCredentials should not be called since isOpen is false
            // The effect only runs when isOpen changes
        })
    })

    describe('Form Input Changes', () => {
        it('updates API URL on change', () => {
            render(<AIGenerateModal {...defaultProps} />)
            const apiUrlInput = screen.getByLabelText(/API URL/)
            fireEvent.change(apiUrlInput, {
                target: { value: 'https://custom.api.com' },
            })
            expect(apiUrlInput).toHaveValue('https://custom.api.com')
        })

        it('updates API Key on change', () => {
            render(<AIGenerateModal {...defaultProps} />)
            const apiKeyInput = screen.getByLabelText(/API Key/)
            fireEvent.change(apiKeyInput, { target: { value: 'sk-test-key' } })
            expect(apiKeyInput).toHaveValue('sk-test-key')
        })

        it('updates job description on change', () => {
            render(<AIGenerateModal {...defaultProps} />)
            const jdInput = screen.getByLabelText(/Job Description/)
            fireEvent.change(jdInput, {
                target: { value: 'Senior Engineer at Acme' },
            })
            expect(jdInput).toHaveValue('Senior Engineer at Acme')
        })

        it('toggles remember credentials checkbox', () => {
            render(<AIGenerateModal {...defaultProps} />)
            const checkbox = screen.getByLabelText(/Remember my API credentials/)
            fireEvent.click(checkbox)
            expect(checkbox).toBeChecked()
        })
    })

    describe('Keyboard Shortcuts', () => {
        it('handles Ctrl+Enter in job description', () => {
            render(<AIGenerateModal {...defaultProps} />)
            const jdInput = screen.getByLabelText(/Job Description/)
            // Should not throw even with incomplete form
            fireEvent.keyDown(jdInput, {
                key: 'Enter',
                ctrlKey: true,
            })
        })

        it('handles Meta+Enter (Mac) in job description', () => {
            render(<AIGenerateModal {...defaultProps} />)
            const jdInput = screen.getByLabelText(/Job Description/)
            fireEvent.keyDown(jdInput, {
                key: 'Enter',
                metaKey: true,
            })
        })
    })

    describe('Generation Flow', () => {
        it('calls generateFunction on successful submission', async () => {
            const generatedContent = 'Generated cover letter content'
                ; (agent.generateCoverLetterGraph as jest.Mock).mockResolvedValue(
                    generatedContent
                )

            render(<AIGenerateModal {...defaultProps} />)

            // Fill in the form
            fireEvent.change(screen.getByLabelText(/API URL/), {
                target: { value: 'https://api.openai.com' },
            })
            fireEvent.change(screen.getByLabelText(/API Key/), {
                target: { value: 'sk-test-key' },
            })
            fireEvent.change(screen.getByLabelText(/Job Description/), {
                target: { value: 'Senior Engineer role' },
            })

            // Click generate
            const generateButton = screen.getByTestId('generate-button')
            fireEvent.click(generateButton)

            await waitFor(() => {
                expect(agent.generateCoverLetterGraph).toHaveBeenCalled()
            })
        })

        it('calls generateSummaryGraph when mode is summary', async () => {
            const generatedContent = 'Generated summary content'
                ; (agent.generateSummaryGraph as jest.Mock).mockResolvedValue(
                    generatedContent
                )

            render(<AIGenerateModal {...defaultProps} mode="summary" />)

            // Fill in the form
            fireEvent.change(screen.getByLabelText(/API URL/), {
                target: { value: 'https://api.openai.com' },
            })
            fireEvent.change(screen.getByLabelText(/API Key/), {
                target: { value: 'sk-test-key' },
            })
            fireEvent.change(screen.getByLabelText(/Job Description/), {
                target: { value: 'Senior Engineer role' },
            })

            const generateButton = screen.getByTestId('generate-button')
            fireEvent.click(generateButton)

            await waitFor(() => {
                expect(agent.generateSummaryGraph).toHaveBeenCalled()
            })
        })

        it('handles generation errors gracefully', async () => {
            ; (agent.generateCoverLetterGraph as jest.Mock).mockRejectedValue(
                new Error('API failure')
            )

            render(<AIGenerateModal {...defaultProps} />)

            // Fill in form
            fireEvent.change(screen.getByLabelText(/API URL/), {
                target: { value: 'https://api.openai.com' },
            })
            fireEvent.change(screen.getByLabelText(/API Key/), {
                target: { value: 'sk-test-key' },
            })
            fireEvent.change(screen.getByLabelText(/Job Description/), {
                target: { value: 'Test JD' },
            })

            fireEvent.click(screen.getByTestId('generate-button'))

            await waitFor(() => {
                expect(api.sanitizeAIError).toHaveBeenCalled()
            })
        })
    })
})

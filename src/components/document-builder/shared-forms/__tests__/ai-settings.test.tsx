import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AISettings from '@/components/document-builder/shared-forms/ai-settings'
import { useAISettings } from '@/lib/contexts/ai-settings-context'
import { fetchAvailableModels } from '@/lib/ai/models'

// Mock useAISettings
jest.mock('@/lib/contexts/ai-settings-context', () => ({
  useAISettings: jest.fn(),
}))

// Mock fetchAvailableModels
jest.mock('@/lib/ai/models', () => ({
  fetchAvailableModels: jest.fn(),
}))

describe('AISettings Component', () => {
  const mockUpdateSettings = jest.fn()
  const defaultSettings = {
    apiUrl: 'https://api.openai.com',
    apiKey: 'test-key',
    model: 'gpt-4o-mini',
    providerType: 'openai',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAISettings as jest.Mock).mockReturnValue({
      settings: defaultSettings,
      updateSettings: mockUpdateSettings,
      isConfigured: true,
      connectionStatus: 'valid',
    })
    ;(fetchAvailableModels as jest.Mock).mockResolvedValue(['gpt-4', 'gpt-3.5-turbo'])
  })

  it('renders with initial settings', async () => {
    render(<AISettings />)
    expect(screen.getByDisplayValue('https://api.openai.com')).toBeInTheDocument()
  })

  it('handles provider selection change', async () => {
    render(<AISettings />)
    const providerSelect = screen.getByLabelText(/AI Provider/i)

    await act(async () => {
      fireEvent.change(providerSelect, { target: { value: 'Groq' } })
    })

    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        apiUrl: 'https://api.groq.com/openai/v1',
      })
    )
  })

  it('shows on-device information when selected', async () => {
    ;(useAISettings as jest.Mock).mockReturnValue({
      settings: { ...defaultSettings, providerType: 'on-device' },
      updateSettings: mockUpdateSettings,
      isConfigured: true,
      connectionStatus: 'valid',
    })

    render(<AISettings />)
    const providerSelect = screen.getByLabelText(/AI Provider/i)

    await act(async () => {
      fireEvent.change(providerSelect, { target: { value: 'On-Device (Gemma 3)' } })
    })

    expect(screen.getByText(/🔒 Private AI/i)).toBeInTheDocument()
  })
})

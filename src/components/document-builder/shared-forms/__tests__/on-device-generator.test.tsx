import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { OnDeviceGenerator } from '@/components/document-builder/shared-forms/on-device-generator'
import { useOnDeviceLlm } from '@/lib/ai/on-device/use-on-device-llm'

jest.mock('@/lib/ai/on-device/use-on-device-llm', () => ({
  useOnDeviceLlm: jest.fn(),
  ON_DEVICE_MODEL_URL: 'http://test-model.task',
}))

const mockFetch = jest.fn()
global.fetch = mockFetch
global.URL.createObjectURL = jest.fn(() => 'blob:url')
global.URL.revokeObjectURL = jest.fn()

describe('OnDeviceGenerator', () => {
  const defaultProps = {
    prompt: 'test',
    onComplete: jest.fn(),
    onDismiss: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      headers: { get: () => '100' },
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
    })
  })

  it('shows connecting state', async () => {
    mockFetch.mockReturnValue(new Promise(() => {}))
    await act(async () => {
      render(<OnDeviceGenerator {...defaultProps} />)
    })
    expect(screen.getByText(/Connecting…/i)).toBeInTheDocument()
  })

  it('handles initialization and usage', async () => {
    ;(useOnDeviceLlm as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      output: 'Draft',
      isLoading: false,
      progress: 100,
      error: null,
      isReady: true,
    })

    await act(async () => {
      render(<OnDeviceGenerator {...defaultProps} />)
    })

    await waitFor(() => {
      const useBtn = screen.getByText(/Use This Draft/i)
      fireEvent.click(useBtn)
      expect(defaultProps.onComplete).toHaveBeenCalledWith('Draft')
    })
  })
})

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

const mockCacheMatch = jest.fn()
const mockCachePut = jest.fn()
const mockCachesOpen = jest.fn()
Object.defineProperty(global, 'caches', {
  value: {
    open: mockCachesOpen,
  },
})

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
    mockCachesOpen.mockResolvedValue({
      match: mockCacheMatch,
      put: mockCachePut,
    })
    mockCacheMatch.mockResolvedValue(null) // Not in cache by default
    mockCachePut.mockResolvedValue(true)
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

  it('loads model from cache if present', async () => {
    // MediaPipe initialization takes over once blob is provided
    ;(useOnDeviceLlm as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      output: '',
      isLoading: false,
      progress: 0,
      error: null,
      isReady: false,
    })

    mockCacheMatch.mockResolvedValue({
      headers: { get: () => '581959680' },
      blob: () => Promise.resolve(new Blob(['model'])),
    })

    await act(async () => {
      render(<OnDeviceGenerator {...defaultProps} />)
    })

    // Network should not be called
    expect(mockFetch).not.toHaveBeenCalled()
    expect(screen.getByText(/Initializing model…/i)).toBeInTheDocument()
  })

  it('handles cache open error gracefully and falls back to network', async () => {
    mockCachesOpen.mockRejectedValue(new Error('Cache not available'))

    await act(async () => {
      render(<OnDeviceGenerator {...defaultProps} />)
    })

    // Should fall back to making network fetch
    expect(mockFetch).toHaveBeenCalled()
  })

  it('handles cache save error gracefully', async () => {
    mockCachePut.mockRejectedValue(new Error('Quota exceeded'))

    // Simulate blob url being returned
    ;(useOnDeviceLlm as jest.Mock).mockReturnValue({
      generate: jest.fn(),
      output: '',
      isLoading: false,
      progress: 0,
      error: null,
      isReady: false,
    })

    await act(async () => {
      render(<OnDeviceGenerator {...defaultProps} />)
    })

    // Even if caching fails, the generation UI should eventually show up
    // Initializing state happens right after download is done
    await waitFor(() => {
      expect(screen.getByText(/Initializing model…/i)).toBeInTheDocument()
    })
  })

  it('shows error if network download fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await act(async () => {
      render(<OnDeviceGenerator {...defaultProps} />)
    })

    expect(screen.getByText(/Download failed/i)).toBeInTheDocument()
  })
})

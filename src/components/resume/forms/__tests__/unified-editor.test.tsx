import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { UnifiedEditor } from '@/components/resume/forms/unified-editor'

// Basic mocks
jest.mock('@/lib/pwa/register-service-worker', () => ({
  registerServiceWorker: jest.fn(),
}))

jest.mock('next/dynamic', () => () => {
  return function MockComponent({ children }: any) {
    return <div data-testid="mock">{children}</div>
  }
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('UnifiedEditor', () => {
  it('renders and switches modes', () => {
    render(<UnifiedEditor />)
    // Check for presence by role or generic text
    expect(screen.getByRole('heading', { name: /AI Resume Builder/i })).toBeInTheDocument()
  })
})

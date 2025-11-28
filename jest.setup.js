import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'
import React from 'react'

expect.extend(toHaveNoViolations)

// Mock onborda library (ESM module that Jest can't transform)
jest.mock('onborda', () => ({
  OnbordaProvider: ({ children }) =>
    React.createElement('div', { 'data-testid': 'onborda-provider' }, children),
  Onborda: ({ children, showOnborda }) =>
    React.createElement(
      'div',
      { 'data-testid': 'onborda', 'data-show': showOnborda },
      children
    ),
  useOnborda: () => ({
    startOnborda: jest.fn(),
    closeOnborda: jest.fn(),
    isOnbordaVisible: false,
    currentStep: 0,
    currentTour: null,
    setCurrentStep: jest.fn(),
  }),
}))

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock DragAndDrop wrapper components for testing
jest.mock('@/components/ui/DragAndDrop', () => ({
  DnDContext: ({ children, onDragEnd }) => (
    <div data-ondragend={onDragEnd}>{children}</div>
  ),
  DnDDroppable: ({ children }) =>
    children({
      draggableProps: {},
      dragHandleProps: {},
      innerRef: jest.fn(),
      droppableProps: {},
      placeholder: null,
    }),
  DnDDraggable: ({ children }) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
      },
      { isDragging: false }
    ),
  DraggableCard: ({ children }) => <div>{children}</div>,
}))

// Suppress React act() warnings and intentional test console.errors
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    const message = args[0]?.toString() || ''
    // Suppress React act() warnings (expected in async tests)
    if (message.includes('not wrapped in act')) return
    // Suppress intentional auth error test
    if (message.includes('Authentication error:')) return
    // Suppress framer-motion prop warnings in tests
    if (message.includes('whileHover')) return
    if (message.includes('whileTap')) return
    if (message.includes('whileInView')) return
    if (message.includes('animate')) return
    if (message.includes('initial')) return
    if (message.includes('variants')) return
    if (message.includes('transition')) return
    if (message.includes('viewport')) return
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

afterAll(() => {
  console.error = originalError
})

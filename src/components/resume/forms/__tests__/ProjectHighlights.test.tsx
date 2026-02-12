// @ts-nocheck
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProjectHighlights from '../ProjectHighlights'
import { useProjectHighlightsForm } from '@/hooks/useProjectHighlightsForm'

// Mock the hook
jest.mock('@/hooks/useProjectHighlightsForm')

const mockUseProjectHighlightsForm =
  useProjectHighlightsForm as jest.MockedFunction<
    typeof useProjectHighlightsForm
  >

describe('ProjectHighlights', () => {
  const mockAdd = jest.fn()
  const mockRemove = jest.fn()
  const mockHandleChange = jest.fn()

  const defaultHookReturn = {
    highlights: [
      'First project highlight',
      'Second project highlight',
      'Third project highlight',
    ],
    add: mockAdd,
    remove: mockRemove,
    handleChange: mockHandleChange,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseProjectHighlightsForm.mockReturnValue(defaultHookReturn)
  })

  describe('Rendering', () => {
    it('renders all achievements from the hook', () => {
      render(<ProjectHighlights projectIndex={0} />)

      expect(screen.getByText('First project highlight')).toBeInTheDocument()
      expect(screen.getByText('Second project highlight')).toBeInTheDocument()
      expect(screen.getByText('Third project highlight')).toBeInTheDocument()
    })

    it('renders numbered bullets for highlights', () => {
      render(<ProjectHighlights projectIndex={0} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('renders add input with placeholder', () => {
      render(<ProjectHighlights projectIndex={0} />)

      expect(
        screen.getByPlaceholderText(
          'Add highlight... (Press Enter to save)'
        )
      ).toBeInTheDocument()
    })

    it('renders with empty highlights list', () => {
      mockUseProjectHighlightsForm.mockReturnValue({
        ...defaultHookReturn,
        highlights: [],
      })

      render(<ProjectHighlights projectIndex={0} />)

      expect(
        screen.getByPlaceholderText(
          'Add highlight... (Press Enter to save)'
        )
      ).toBeInTheDocument()
      expect(screen.queryByText('1')).not.toBeInTheDocument()
    })
  })

  describe('Adding Highlights', () => {
    it('adds highlight when Enter is pressed with text', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const input = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      )
      fireEvent.change(input, { target: { value: 'New achievement' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockAdd).toHaveBeenCalledWith('New achievement')
    })

    it('clears input after adding highlight', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const input = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      ) as HTMLInputElement
      fireEvent.change(input, { target: { value: 'New achievement' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(input.value).toBe('')
    })

    it('does not add highlight when Enter is pressed with empty text', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const input = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      )
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockAdd).not.toHaveBeenCalled()
    })

    it('does not add highlight when Enter is pressed with only whitespace', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const input = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      )
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockAdd).not.toHaveBeenCalled()
    })

    it('does not trigger on other key presses', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const input = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      )
      fireEvent.change(input, { target: { value: 'New achievement' } })
      fireEvent.keyDown(input, { key: 'a' })

      expect(mockAdd).not.toHaveBeenCalled()
    })
  })

  describe('Editing Highlights', () => {
    it('enters edit mode when clicking on highlight text', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      expect(
        screen.getByDisplayValue('First project highlight')
      ).toBeInTheDocument()
    })

    it('saves edited highlight when Enter is pressed', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: 'Updated achievement' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockHandleChange).toHaveBeenCalledWith(0, 'Updated achievement')
    })

    it('exits edit mode after saving', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: 'Updated achievement' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(
        screen.queryByDisplayValue('Updated achievement')
      ).not.toBeInTheDocument()
    })

    it('cancels edit when Escape is pressed', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: 'Changed text' } })
      fireEvent.keyDown(input, { key: 'Escape' })

      expect(mockHandleChange).not.toHaveBeenCalled()
      expect(screen.queryByDisplayValue('Changed text')).not.toBeInTheDocument()
    })

    it('does not save empty text when Enter is pressed', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockHandleChange).not.toHaveBeenCalled()
    })

    it('does not save whitespace-only text when Enter is pressed', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockHandleChange).not.toHaveBeenCalled()
    })

    it('can edit multiple highlights independently', () => {
      render(<ProjectHighlights projectIndex={0} />)

      // Edit first highlight
      fireEvent.click(screen.getByText('First project highlight'))
      let input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: 'Updated first' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockHandleChange).toHaveBeenCalledWith(0, 'Updated first')

      // Edit second highlight
      fireEvent.click(screen.getByText('Second project highlight'))
      input = screen.getByDisplayValue('Second project highlight')
      fireEvent.change(input, { target: { value: 'Updated second' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockHandleChange).toHaveBeenCalledWith(1, 'Updated second')
    })
  })

  describe('Edit Blur Behavior', () => {
    it('saves changes on blur if text was modified', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: 'Modified text' } })
      fireEvent.blur(input)

      expect(mockHandleChange).toHaveBeenCalledWith(0, 'Modified text')
    })

    it('does not save on blur if text was not modified', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.blur(input)

      expect(mockHandleChange).not.toHaveBeenCalled()
    })

    it('does not save on blur if text is empty', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.blur(input)

      expect(mockHandleChange).not.toHaveBeenCalled()
    })

    it('does not save on blur if text is only whitespace', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.blur(input)

      expect(mockHandleChange).not.toHaveBeenCalled()
    })

    it('exits edit mode after blur', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const input = screen.getByDisplayValue('First project highlight')
      fireEvent.change(input, { target: { value: 'Modified text' } })
      fireEvent.blur(input)

      expect(
        screen.queryByDisplayValue('Modified text')
      ).not.toBeInTheDocument()
    })
  })

  describe('Removing Highlights', () => {
    it('removes highlight when remove button is clicked', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const removeButtons = screen.getAllByTitle('Remove highlight')
      fireEvent.click(removeButtons[0])

      expect(mockRemove).toHaveBeenCalledWith(0)
    })

    it('can remove any highlight by index', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const removeButtons = screen.getAllByTitle('Remove highlight')
      fireEvent.click(removeButtons[1])

      expect(mockRemove).toHaveBeenCalledWith(1)
    })

    it('renders remove button for each highlight', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const removeButtons = screen.getAllByTitle('Remove highlight')
      expect(removeButtons).toHaveLength(3)
    })
  })

  describe('Variant Styling', () => {
    it('applies teal variant styles by default', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const input = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      )
      expect(input).toHaveClass('border-teal-400/30')
      expect(input).toHaveClass('focus:border-teal-400')
    })

    it('applies pink variant styles when specified', () => {
      render(<ProjectHighlights projectIndex={0} variant="pink" />)

      const input = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      )
      expect(input).toHaveClass('border-pink-400/30')
      expect(input).toHaveClass('focus:border-pink-400')
    })

    it('applies variant styles to highlight containers', () => {
      render(<ProjectHighlights projectIndex={0} variant="teal" />)

      const highlight = screen.getByText('First project highlight')
      const container = highlight.closest('.group')
      expect(container).toHaveClass('border-teal-400/30')
    })

    it('applies pink variant to highlight containers', () => {
      render(<ProjectHighlights projectIndex={0} variant="pink" />)

      const highlight = screen.getByText('First project highlight')
      const container = highlight.closest('.group')
      expect(container).toHaveClass('border-pink-400/30')
    })

    it('applies variant styles to edit input', () => {
      render(<ProjectHighlights projectIndex={0} variant="pink" />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const editInput = screen.getByDisplayValue('First project highlight')
      expect(editInput).toHaveClass('border-pink-400/30')
      expect(editInput).toHaveClass('focus:border-pink-400')
    })
  })

  describe('Hook Integration', () => {
    it('calls hook with correct project index', () => {
      render(<ProjectHighlights projectIndex={5} />)

      expect(mockUseProjectHighlightsForm).toHaveBeenCalledWith(5)
    })

    it('uses highlights from hook', () => {
      mockUseProjectHighlightsForm.mockReturnValue({
        ...defaultHookReturn,
        highlights: ['Custom project highlight'],
      })

      render(<ProjectHighlights projectIndex={0} />)

      expect(screen.getByText('Custom project highlight')).toBeInTheDocument()
    })
  })

  describe('Auto-focus Behavior', () => {
    it('auto-focuses edit input when entering edit mode', async () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      fireEvent.click(highlight)

      const editInput = screen.getByDisplayValue('First project highlight')
      await waitFor(() => {
        expect(editInput).toHaveFocus()
      })
    })
  })

  describe('Accessibility', () => {
    it('has accessible title for highlight text', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const highlight = screen.getByText('First project highlight')
      expect(highlight).toHaveAttribute('title', 'Click to edit')
    })

    it('has accessible title for remove buttons', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const removeButtons = screen.getAllByTitle('Remove highlight')
      expect(removeButtons).toHaveLength(3)
      removeButtons.forEach((button) => {
        expect(button).toHaveAttribute('title', 'Remove highlight')
      })
    })

    it('uses proper input types', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const addInput = screen.getByPlaceholderText(
        'Add highlight... (Press Enter to save)'
      )
      expect(addInput).toHaveAttribute('type', 'text')
    })

    it('uses proper button types for remove buttons', () => {
      render(<ProjectHighlights projectIndex={0} />)

      const removeButtons = screen.getAllByTitle('Remove highlight')
      removeButtons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })
  })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FormInput } from '@/components/ui/FormInput'

describe('FormInput', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders input with label', () => {
    render(
      <FormInput
        label="Test Label"
        value=""
        onChange={mockOnChange}
        name="test"
      />
    )

    expect(screen.getByPlaceholderText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    render(
      <FormInput
        label="Test Label"
        value=""
        onChange={mockOnChange}
        name="test"
      />
    )

    const input = screen.getByPlaceholderText('Test Label')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it('renders password input with show/hide toggle', () => {
    render(
      <FormInput
        label="Password"
        value=""
        onChange={mockOnChange}
        name="password"
        type="password"
      />
    )

    // Check password input is rendered
    const input = screen.getByPlaceholderText('Password') as HTMLInputElement
    expect(input).toHaveAttribute('type', 'password')

    // Check toggle button is present
    const toggleButton = screen.getByLabelText('Show password')
    expect(toggleButton).toBeInTheDocument()
  })

  it('toggles password visibility when toggle button is clicked', () => {
    render(
      <FormInput
        label="Password"
        value="secret123"
        onChange={mockOnChange}
        name="password"
        type="password"
      />
    )

    const input = screen.getByPlaceholderText('Password') as HTMLInputElement
    const toggleButton = screen.getByLabelText('Show password')

    // Initially password type
    expect(input).toHaveAttribute('type', 'password')

    // Click to show password
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument()

    // Click again to hide password
    fireEvent.click(screen.getByLabelText('Hide password'))
    expect(input).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Show password')).toBeInTheDocument()
  })

  it('applies maxLength attribute when provided', () => {
    render(
      <FormInput
        label="Test Label"
        value=""
        onChange={mockOnChange}
        name="test"
        maxLength={50}
      />
    )

    const input = screen.getByPlaceholderText('Test Label')
    expect(input).toHaveAttribute('maxLength', '50')
  })

  it('shows character counter when showCounter is true', () => {
    render(
      <FormInput
        label="Test Label"
        value="hello"
        onChange={mockOnChange}
        name="test"
        maxLength={50}
        showCounter={true}
      />
    )

    expect(screen.getByText('5/50')).toBeInTheDocument()
  })

  it('uses placeholder when provided', () => {
    render(
      <FormInput
        label="Test Label"
        value=""
        onChange={mockOnChange}
        name="test"
        placeholder="Custom placeholder"
      />
    )

    const input = screen.getByPlaceholderText('Custom placeholder')
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder')
  })

  it('supports different input types', () => {
    const { rerender } = render(
      <FormInput
        label="Email"
        value=""
        onChange={mockOnChange}
        name="email"
        type="email"
      />
    )

    let input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')

    rerender(
      <FormInput
        label="URL"
        value=""
        onChange={mockOnChange}
        name="url"
        type="url"
      />
    )

    input = screen.getByPlaceholderText('URL')
    expect(input).toHaveAttribute('type', 'url')
  })
})

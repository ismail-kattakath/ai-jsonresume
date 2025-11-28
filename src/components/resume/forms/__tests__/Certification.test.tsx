import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Certification from '@/components/resume/forms/Certification'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import {
  renderWithContext,
  createMockResumeData,
} from '@/lib/__tests__/test-utils'

describe('Certification Component', () => {
  describe('Rendering', () => {
    it('should render all certifications as tags', () => {
      const mockData = createMockResumeData({
        certifications: [
          'AWS Solutions Architect',
          'Google Cloud Professional',
        ],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument()
      expect(screen.getByText('Google Cloud Professional')).toBeInTheDocument()
    })

    it('should render remove button for each certification', () => {
      const mockData = createMockResumeData({
        certifications: [
          'AWS Solutions Architect',
          'Google Cloud Professional',
        ],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      const removeButtons = screen.getAllByTitle('Remove')
      expect(removeButtons).toHaveLength(2)
    })

    it('should render add input field', () => {
      renderWithContext(<Certification />)
      expect(
        screen.getByPlaceholderText('Add certification...')
      ).toBeInTheDocument()
    })
  })

  describe('Add Functionality', () => {
    it('should add new certification when pressing Enter', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS Solutions Architect'],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const input = screen.getByPlaceholderText('Add certification...')
      fireEvent.change(input, { target: { value: 'Azure Administrator' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        certifications: ['AWS Solutions Architect', 'Azure Administrator'],
      })
    })

    it('should add new certification on blur', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS Solutions Architect'],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const input = screen.getByPlaceholderText('Add certification...')
      fireEvent.change(input, { target: { value: 'CompTIA Security+' } })
      fireEvent.blur(input)

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        certifications: ['AWS Solutions Architect', 'CompTIA Security+'],
      })
    })

    it('should not add empty certification', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS Solutions Architect'],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const input = screen.getByPlaceholderText('Add certification...')
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockSetResumeData).not.toHaveBeenCalled()
    })

    it('should clear input after adding', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS Solutions Architect'],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const input = screen.getByPlaceholderText('Add certification...')
      fireEvent.change(input, { target: { value: 'Azure' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(input).toHaveValue('')
    })
  })

  describe('Delete Functionality', () => {
    it('should delete certification when remove button is clicked', () => {
      const mockData = createMockResumeData({
        certifications: [
          'AWS Solutions Architect',
          'Google Cloud Professional',
          'Azure Administrator',
        ],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const removeButtons = screen.getAllByTitle('Remove')
      fireEvent.click(removeButtons[1]) // Delete Google Cloud Professional

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        certifications: ['AWS Solutions Architect', 'Azure Administrator'],
      })
    })

    it('should delete first certification correctly', () => {
      const mockData = createMockResumeData({
        certifications: [
          'AWS Solutions Architect',
          'Google Cloud Professional',
        ],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const removeButtons = screen.getAllByTitle('Remove')
      fireEvent.click(removeButtons[0])

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        certifications: ['Google Cloud Professional'],
      })
    })

    it('should delete last certification correctly', () => {
      const mockData = createMockResumeData({
        certifications: [
          'AWS Solutions Architect',
          'Google Cloud Professional',
        ],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const removeButtons = screen.getAllByTitle('Remove')
      fireEvent.click(removeButtons[1])

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        certifications: ['AWS Solutions Architect'],
      })
    })
  })

  describe('Layout and Styling', () => {
    it('should display certifications as inline tags', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS Solutions Architect'],
      })
      const { container } = renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      const tag = container.querySelector('.rounded-full')
      expect(tag).toBeInTheDocument()
    })

    it('should have purple focus color on input', () => {
      const mockData = createMockResumeData({ certifications: [] })
      const { container } = renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      const input = container.querySelector('.focus\\:border-purple-400')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should render correctly with empty certifications array', () => {
      const mockData = createMockResumeData({ certifications: [] })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      expect(
        screen.getByPlaceholderText('Add certification...')
      ).toBeInTheDocument()
      expect(screen.queryByTitle('Remove')).not.toBeInTheDocument()
    })

    it('should handle special characters in certification input', () => {
      const mockData = createMockResumeData({
        certifications: ['Cisco CCNA® Routing & Switching'],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      expect(
        screen.getByText('Cisco CCNA® Routing & Switching')
      ).toBeInTheDocument()
    })

    it('should trim whitespace when adding', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS'],
      })
      const mockSetResumeData = jest.fn()

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <Certification />
        </ResumeContext.Provider>
      )

      const input = screen.getByPlaceholderText('Add certification...')
      fireEvent.change(input, { target: { value: '  Azure  ' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        certifications: ['AWS', 'Azure'],
      })
    })

    it('should handle long certification names', () => {
      const longName =
        'Microsoft Certified: Azure Solutions Architect Expert with Advanced Cloud Infrastructure Management Specialization'
      const mockData = createMockResumeData({
        certifications: [longName],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      expect(screen.getByText(longName)).toBeInTheDocument()
    })

    it('should handle multiple certifications with same value', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS', 'AWS', 'AWS'],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      const awsTags = screen.getAllByText('AWS')
      expect(awsTags).toHaveLength(3)
    })

    it('should handle certification names with numbers', () => {
      const mockData = createMockResumeData({
        certifications: ['ISO/IEC 27001:2013 Lead Auditor'],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      expect(
        screen.getByText('ISO/IEC 27001:2013 Lead Auditor')
      ).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have title attribute on remove buttons', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS'],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      const removeButton = screen.getByTitle('Remove')
      expect(removeButton).toHaveAttribute('title', 'Remove')
    })

    it('should use text input type', () => {
      const mockData = createMockResumeData({ certifications: [] })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      const input = screen.getByPlaceholderText('Add certification...')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should have button type=button for remove buttons', () => {
      const mockData = createMockResumeData({
        certifications: ['AWS'],
      })
      renderWithContext(<Certification />, {
        contextValue: { resumeData: mockData },
      })

      const removeButton = screen.getByTitle('Remove')
      expect(removeButton).toHaveAttribute('type', 'button')
    })
  })
})

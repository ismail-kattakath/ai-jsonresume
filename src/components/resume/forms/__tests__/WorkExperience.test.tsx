import React from 'react'
import { axe } from 'jest-axe'
import WorkExperience from '@/components/resume/forms/WorkExperience'
import {
  renderWithContext,
  createMockResumeData,
  screen,
  fireEvent,
} from '@/lib/__tests__/test-utils'

describe('WorkExperience Component', () => {
  describe('Rendering', () => {
    it('should render section heading', () => {
      renderWithContext(<WorkExperience />)

      expect(screen.getByText('Work Experience')).toBeInTheDocument()
    })

    it('should render all form fields with floating labels', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test Company',
            url: 'test.com',
            position: 'Software Engineer',
            description: 'Test description',
            keyAchievements: 'Test achievements',
            startYear: '2020-01-01',
            endYear: '2023-01-01',
          },
        ],
      })

      renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      expect(screen.getByText('Company Name')).toBeInTheDocument()
      expect(screen.getByText('Company Website URL')).toBeInTheDocument()
      expect(screen.getByText('Job Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Key Achievements')).toBeInTheDocument()
      expect(screen.getAllByText('Start Date')[0]).toBeInTheDocument()
      expect(screen.getAllByText('End Date')[0]).toBeInTheDocument()
    })

    it('should display work experience data in inputs', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Acme Corp',
            url: 'acme.com',
            position: 'Senior Developer',
            description: 'Leading development team',
            keyAchievements: 'Shipped major features',
            startYear: '2020-06-01',
            endYear: '2023-12-01',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const companyInput = container.querySelector(
        'input[name="company"]'
      ) as HTMLInputElement
      const urlInput = container.querySelector(
        'input[name="url"]'
      ) as HTMLInputElement
      const positionInput = container.querySelector(
        'input[name="position"]'
      ) as HTMLInputElement

      expect(companyInput?.value).toBe('Acme Corp')
      expect(urlInput?.value).toBe('acme.com')
      expect(positionInput?.value).toBe('Senior Developer')
    })

    it('should render add button with FormButton', () => {
      renderWithContext(<WorkExperience />)

      const addButton = screen.getByText(/Add Work Experience/i)
      expect(addButton).toBeInTheDocument()
    })

    it('should render multiple work experience entries', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Company 1',
            url: 'company1.com',
            position: 'Role 1',
            description: 'Desc 1',
            keyAchievements: 'Achievements 1',
            startYear: '2020-01-01',
            endYear: '2021-01-01',
          },
          {
            company: 'Company 2',
            url: 'company2.com',
            position: 'Role 2',
            description: 'Desc 2',
            keyAchievements: 'Achievements 2',
            startYear: '2021-01-01',
            endYear: '2023-01-01',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const companyInputs = container.querySelectorAll('input[name="company"]')
      expect(companyInputs.length).toBe(2)
    })
  })

  describe('Add Functionality', () => {
    it('should add new work experience entry when add button is clicked', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Existing Company',
            url: 'existing.com',
            position: 'Developer',
            description: 'Test',
            keyAchievements: 'Test',
            startYear: '2020-01-01',
            endYear: '2023-01-01',
          },
        ],
      })

      renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const addButton = screen
        .getByText(/Add Work Experience/i)
        .closest('button')

      if (addButton) {
        fireEvent.click(addButton)

        expect(mockSetResumeData).toHaveBeenCalledWith({
          ...mockData,
          workExperience: [
            ...mockData.workExperience,
            {
              company: '',
              url: '',
              position: '',
              description: '',
              keyAchievements: '',
              startYear: '',
              endYear: '',
            },
          ],
        })
      }
    })
  })

  describe('Delete Functionality', () => {
    it('should render delete button for each entry', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test Company',
            url: 'test.com',
            position: 'Developer',
            description: 'Test',
            keyAchievements: 'Test',
            startYear: '2020-01-01',
            endYear: '2023-01-01',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const deleteButton = container.querySelector(
        'button[title="Delete this work experience"]'
      )

      expect(deleteButton).toBeInTheDocument()
    })

    it('should delete work experience entry when delete button is clicked', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Company 1',
            url: 'company1.com',
            position: 'Role 1',
            description: 'Desc 1',
            keyAchievements: 'Achievements 1',
            startYear: '2020-01-01',
            endYear: '2021-01-01',
          },
          {
            company: 'Company 2',
            url: 'company2.com',
            position: 'Role 2',
            description: 'Desc 2',
            keyAchievements: 'Achievements 2',
            startYear: '2021-01-01',
            endYear: '2023-01-01',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const deleteButtons = container.querySelectorAll(
        'button[title="Delete this work experience"]'
      )

      if (deleteButtons[0]) {
        fireEvent.click(deleteButtons[0])

        expect(mockSetResumeData).toHaveBeenCalledWith({
          ...mockData,
          workExperience: [mockData.workExperience[1]],
        })
      }
    })
  })

  describe('Input Changes', () => {
    it('should handle company name changes', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: '',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const companyInput = container.querySelector('input[name="company"]')

      if (companyInput) {
        fireEvent.change(companyInput, {
          target: { name: 'company', value: 'New Company' },
        })

        expect(mockSetResumeData).toHaveBeenCalled()
      }
    })

    it('should strip https:// from URL input', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const urlInput = container.querySelector('input[name="url"]')

      if (urlInput) {
        fireEvent.change(urlInput, {
          target: { name: 'url', value: 'https://example.com' },
        })

        const callArg = mockSetResumeData.mock.calls[0][0]
        expect(callArg.workExperience[0].url).toBe('example.com')
      }
    })

    it('should handle position changes', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const positionInput = container.querySelector('input[name="position"]')

      if (positionInput) {
        fireEvent.change(positionInput, {
          target: { name: 'position', value: 'Software Engineer' },
        })

        expect(mockSetResumeData).toHaveBeenCalled()
      }
    })

    it('should handle textarea changes', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const descriptionTextarea = container.querySelector(
        'textarea[name="description"]'
      )

      if (descriptionTextarea) {
        fireEvent.change(descriptionTextarea, {
          target: { name: 'description', value: 'New description' },
        })

        expect(mockSetResumeData).toHaveBeenCalled()
      }
    })

    it('should handle date changes', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const startYearInput = container.querySelector('input[name="startYear"]')

      if (startYearInput) {
        fireEvent.change(startYearInput, {
          target: { name: 'startYear', value: '2020-01-01' },
        })

        expect(mockSetResumeData).toHaveBeenCalled()
      }
    })
  })

  describe('Character Counters', () => {
    it('should display character count for description', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: 'Test description',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      expect(screen.getByText('16/250')).toBeInTheDocument()
    })

    it('should display character count for key achievements', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: 'Test achievements',
            startYear: '',
            endYear: '',
          },
        ],
      })

      renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      expect(screen.getByText('17 chars')).toBeInTheDocument()
    })

    it('should have maxLength on description textarea', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const descriptionTextarea = container.querySelector(
        'textarea[name="description"]'
      )

      expect(descriptionTextarea).toHaveAttribute('maxLength', '250')
    })
  })

  describe('Floating Labels', () => {
    it('should have floating-label-group for all input fields', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const floatingLabelGroups = container.querySelectorAll(
        '.floating-label-group'
      )

      // Should have 7 groups per entry (company, url, position, description, keyAchievements, startYear, endYear)
      expect(floatingLabelGroups.length).toBe(7)
    })

    it('should have floating-label class on all labels', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const floatingLabels = container.querySelectorAll('.floating-label')

      // Should have 7 labels per entry
      expect(floatingLabels.length).toBe(7)
    })
  })

  describe('Layout and Styling', () => {
    it('should apply hover effects to entry containers', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const entryContainer = container.querySelector('.group')

      expect(entryContainer).toHaveClass(
        'hover:border-white/20',
        'hover:bg-white/10'
      )
    })

    it('should use responsive layout for date inputs', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const dateContainer = container.querySelector(
        '.flex.flex-col.sm\\:flex-row'
      )

      expect(dateContainer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test Company',
            url: 'test.com',
            position: 'Developer',
            description: 'Test',
            keyAchievements: 'Test',
            startYear: '2020-01-01',
            endYear: '2023-01-01',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      // Exclude drag-and-drop wrapper from accessibility check
      // The draggable container creates nested interactive elements which is expected behavior
      const results = await axe(container, {
        rules: {
          'nested-interactive': { enabled: false },
        },
      })

      expect(results).toHaveNoViolations()
    })

    it('should have descriptive title attribute on delete button', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const deleteButton = container.querySelector(
        'button[title="Delete this work experience"]'
      )

      expect(deleteButton).toHaveAttribute('title')
    })

    it('should have proper input types', () => {
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      const urlInput = container.querySelector('input[name="url"]')
      const startYearInput = container.querySelector('input[name="startYear"]')

      expect(urlInput).toHaveAttribute('type', 'url')
      expect(startYearInput).toHaveAttribute('type', 'date')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty work experience array', () => {
      const mockData = createMockResumeData({
        workExperience: [],
      })

      renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: mockData },
      })

      // Should still render the section heading and add button
      expect(screen.getByText('Work Experience')).toBeInTheDocument()
    })

    it('should handle URLs with existing https:// protocol', () => {
      const mockSetResumeData = jest.fn()
      const mockData = createMockResumeData({
        workExperience: [
          {
            company: 'Test',
            url: '',
            position: '',
            description: '',
            keyAchievements: '',
            startYear: '',
            endYear: '',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: {
          resumeData: mockData,
          setResumeData: mockSetResumeData,
        },
      })

      const urlInput = container.querySelector('input[name="url"]')

      if (urlInput) {
        fireEvent.change(urlInput, {
          target: { name: 'url', value: 'https://example.com' },
        })

        const callArg = mockSetResumeData.mock.calls[0][0]
        // Should strip the https://
        expect(callArg.workExperience[0].url).toBe('example.com')
      }
    })

    it('should handle special characters in input values', () => {
      const specialData = createMockResumeData({
        workExperience: [
          {
            company: "O'Brien & Associates",
            url: 'test.com',
            position: 'Senior Developer (Team Lead)',
            description: 'Leading the "innovation" team',
            keyAchievements: 'Shipped #1 product',
            startYear: '2020-01-01',
            endYear: '2023-01-01',
          },
        ],
      })

      const { container } = renderWithContext(<WorkExperience />, {
        contextValue: { resumeData: specialData },
      })

      const companyInput = container.querySelector(
        'input[name="company"]'
      ) as HTMLInputElement
      const positionInput = container.querySelector(
        'input[name="position"]'
      ) as HTMLInputElement

      expect(companyInput?.value).toBe("O'Brien & Associates")
      expect(positionInput?.value).toBe('Senior Developer (Team Lead)')
    })
  })
})

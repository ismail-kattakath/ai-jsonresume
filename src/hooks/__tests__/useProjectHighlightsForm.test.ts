// @ts-nocheck
import { renderHook, act } from '@testing-library/react'
import { useProjectHighlightsForm } from '../useProjectHighlightsForm'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import type { ResumeData } from '@/types'
import React from 'react'

const mockResumeData: ResumeData = {
  name: 'Test User',
  position: 'Developer',
  email: 'test@example.com',
  summary: 'Test summary',
  location: { city: 'Test City', countryCode: 'US' },
  profiles: [],
  workExperience: [],
  education: [],
  skills: [],
  projects: [
    {
      name: 'Test Project',
      description: 'A test project',
      startYear: '2020-01-01',
      endYear: '',
      url: 'https://example.com',
      highlights: [
        'Achievement 1',
        'Achievement 2',
        'Achievement 3',
      ],
      technologies: [],
    },
    {
      name: 'Another Project',
      description: 'Previous project',
      startYear: '2018-01-01',
      endYear: '2019-12-31',
      url: '',
      highlights: ['Previous achievement'],
      technologies: [],
    },
  ],
  languages: [],
  certifications: [],
}

describe('useProjectHighlightsForm', () => {
  let mockSetResumeData: jest.Mock

  const createWrapper = (resumeData: ResumeData) => {
    mockSetResumeData = jest.fn()

    return ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        ResumeContext.Provider,
        {
          value: {
            resumeData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          },
        },
        children
      )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initialization', () => {
    it('returns highlights for the specified project index', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      expect(result.current.highlights).toEqual([
        'Achievement 1',
        'Achievement 2',
        'Achievement 3',
      ])
    })

    it('returns highlights for different project indices', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(1), {
        wrapper: createWrapper(mockResumeData),
      })

      expect(result.current.highlights).toEqual([
        'Previous achievement',
      ])
    })

    it('throws error if project index does not exist', () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useProjectHighlightsForm(999), {
          wrapper: createWrapper(mockResumeData),
        })
      }).toThrow('Project at index 999 not found')

      consoleSpy.mockRestore()
    })
  })

  describe('handleChange', () => {
    it('updates highlight text at specified index', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.handleChange(1, 'Updated Achievement 2')
      })

      expect(mockSetResumeData).toHaveBeenCalledTimes(1)
      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights[1]).toBe(
        'Updated Achievement 2'
      )
    })

    it('preserves other highlights when updating one', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.handleChange(0, 'New text')
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toHaveLength(3)
      expect(newData.projects[0].highlights[1]).toBe('Achievement 2')
      expect(newData.projects[0].highlights[2]).toBe('Achievement 3')
    })

    it('does not modify other projects', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.handleChange(0, 'Changed')
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[1].highlights).toEqual([
        'Previous achievement',
      ])
    })
  })

  describe('add', () => {
    it('adds new highlight with provided text', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.add('New Achievement')
      })

      expect(mockSetResumeData).toHaveBeenCalledTimes(1)
      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toHaveLength(4)
      expect(newData.projects[0].highlights[3]).toEqual('New Achievement')
    })

    it('trims whitespace from added highlight text', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.add('  Spaced Text  ')
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights[3]).toBe('Spaced Text')
    })

    it('does not add highlight if text is empty', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.add('')
      })

      expect(mockSetResumeData).not.toHaveBeenCalled()
    })

    it('does not add highlight if text is only whitespace', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.add('   ')
      })

      expect(mockSetResumeData).not.toHaveBeenCalled()
    })

    it('preserves existing highlights when adding new one', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.add('Fourth Achievement')
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights[0]).toBe('Achievement 1')
      expect(newData.projects[0].highlights[1]).toBe('Achievement 2')
      expect(newData.projects[0].highlights[2]).toBe('Achievement 3')
    })
  })

  describe('remove', () => {
    it('removes highlight at specified index', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.remove(1)
      })

      expect(mockSetResumeData).toHaveBeenCalledTimes(1)
      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toHaveLength(2)
      expect(newData.projects[0].highlights).toEqual([
        'Achievement 1',
        'Achievement 3',
      ])
    })

    it('removes first highlight', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.remove(0)
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toEqual([
        'Achievement 2',
        'Achievement 3',
      ])
    })

    it('removes last highlight', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.remove(2)
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toEqual([
        'Achievement 1',
        'Achievement 2',
      ])
    })

    it('does not modify other projects', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.remove(0)
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[1].highlights).toEqual([
        'Previous achievement',
      ])
    })
  })

  describe('reorder', () => {
    it('reorders highlights from start to end', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.reorder(0, 2)
      })

      expect(mockSetResumeData).toHaveBeenCalledTimes(1)
      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toEqual([
        'Achievement 2',
        'Achievement 3',
        'Achievement 1',
      ])
    })

    it('reorders highlights from end to start', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.reorder(2, 0)
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toEqual([
        'Achievement 3',
        'Achievement 1',
        'Achievement 2',
      ])
    })

    it('reorders highlights by one position', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.reorder(1, 2)
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toEqual([
        'Achievement 1',
        'Achievement 3',
        'Achievement 2',
      ])
    })

    it('does not modify other projects', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.reorder(0, 1)
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[1].highlights).toEqual([
        'Previous achievement',
      ])
    })

    it('handles reordering to the same position', () => {
      const { result } = renderHook(() => useProjectHighlightsForm(0), {
        wrapper: createWrapper(mockResumeData),
      })

      act(() => {
        result.current.reorder(1, 1)
      })

      const updateFn = mockSetResumeData.mock.calls[0][0]
      const newData = updateFn(mockResumeData)

      expect(newData.projects[0].highlights).toEqual([
        'Achievement 1',
        'Achievement 2',
        'Achievement 3',
      ])
    })
  })
})

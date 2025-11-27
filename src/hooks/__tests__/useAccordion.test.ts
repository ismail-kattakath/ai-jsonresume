import { renderHook, act } from '@testing-library/react'
import { useAccordion } from '../useAccordion'

describe('useAccordion', () => {
  describe('Initialization', () => {
    it('initializes with no expanded items', () => {
      const { result } = renderHook(() => useAccordion())

      expect(result.current.expandedIndex).toBeNull()
    })

    it('accepts initial length parameter', () => {
      const { result } = renderHook(() => useAccordion(5))

      expect(result.current.expandedIndex).toBeNull()
    })
  })

  describe('toggleExpanded', () => {
    it('expands an item when it is collapsed', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })

      expect(result.current.expandedIndex).toBe(0)
    })

    it('collapses an item when it is already expanded', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })

      expect(result.current.expandedIndex).toBe(0)

      act(() => {
        result.current.toggleExpanded(0)
      })

      expect(result.current.expandedIndex).toBeNull()
    })

    it('collapses previously expanded item when expanding a different item', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })

      expect(result.current.expandedIndex).toBe(0)

      act(() => {
        result.current.toggleExpanded(1)
      })

      expect(result.current.expandedIndex).toBe(1)
    })

    it('handles multiple toggle operations', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })
      expect(result.current.expandedIndex).toBe(0)

      act(() => {
        result.current.toggleExpanded(1)
      })
      expect(result.current.expandedIndex).toBe(1)

      act(() => {
        result.current.toggleExpanded(1)
      })
      expect(result.current.expandedIndex).toBeNull()
    })
  })

  describe('isExpanded', () => {
    it('returns true for expanded item', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(2)
      })

      expect(result.current.isExpanded(2)).toBe(true)
    })

    it('returns false for collapsed items', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })

      expect(result.current.isExpanded(1)).toBe(false)
      expect(result.current.isExpanded(2)).toBe(false)
    })

    it('returns false when no items are expanded', () => {
      const { result } = renderHook(() => useAccordion())

      expect(result.current.isExpanded(0)).toBe(false)
      expect(result.current.isExpanded(1)).toBe(false)
    })

    it('updates when expanded index changes', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })
      expect(result.current.isExpanded(0)).toBe(true)

      act(() => {
        result.current.toggleExpanded(1)
      })
      expect(result.current.isExpanded(0)).toBe(false)
      expect(result.current.isExpanded(1)).toBe(true)
    })
  })

  describe('expandNew', () => {
    it('expands a newly added item', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.expandNew(3)
      })

      expect(result.current.expandedIndex).toBe(3)
    })

    it('collapses previously expanded item when expanding new item', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })
      expect(result.current.expandedIndex).toBe(0)

      act(() => {
        result.current.expandNew(5)
      })
      expect(result.current.expandedIndex).toBe(5)
    })
  })

  describe('updateAfterReorder', () => {
    it('keeps expanded index when no item is expanded', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.updateAfterReorder(0, 2)
      })

      expect(result.current.expandedIndex).toBeNull()
    })

    it('updates expanded index when dragging the expanded item down', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })
      expect(result.current.expandedIndex).toBe(0)

      act(() => {
        result.current.updateAfterReorder(0, 2)
      })

      expect(result.current.expandedIndex).toBe(2)
    })

    it('updates expanded index when dragging the expanded item up', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(3)
      })
      expect(result.current.expandedIndex).toBe(3)

      act(() => {
        result.current.updateAfterReorder(3, 1)
      })

      expect(result.current.expandedIndex).toBe(1)
    })

    it('adjusts expanded index when dragging down past it', () => {
      const { result } = renderHook(() => useAccordion())

      // Expand item at index 2
      act(() => {
        result.current.toggleExpanded(2)
      })
      expect(result.current.expandedIndex).toBe(2)

      // Drag item from 0 to 3 (past the expanded item at 2)
      act(() => {
        result.current.updateAfterReorder(0, 3)
      })

      // Item at index 2 should shift down to index 1
      expect(result.current.expandedIndex).toBe(1)
    })

    it('adjusts expanded index when dragging up past it', () => {
      const { result } = renderHook(() => useAccordion())

      // Expand item at index 1
      act(() => {
        result.current.toggleExpanded(1)
      })
      expect(result.current.expandedIndex).toBe(1)

      // Drag item from 3 to 0 (past the expanded item at 1)
      act(() => {
        result.current.updateAfterReorder(3, 0)
      })

      // Item at index 1 should shift up to index 2
      expect(result.current.expandedIndex).toBe(2)
    })

    it('does not adjust expanded index when dragging below it', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(0)
      })
      expect(result.current.expandedIndex).toBe(0)

      // Drag item from 2 to 3 (both below expanded item at 0)
      act(() => {
        result.current.updateAfterReorder(2, 3)
      })

      expect(result.current.expandedIndex).toBe(0)
    })

    it('does not adjust expanded index when dragging above it', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(3)
      })
      expect(result.current.expandedIndex).toBe(3)

      // Drag item from 1 to 0 (both above expanded item at 3)
      act(() => {
        result.current.updateAfterReorder(1, 0)
      })

      expect(result.current.expandedIndex).toBe(3)
    })

    it('handles reordering at boundaries when dragging down', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(1)
      })

      // Drag from exactly the expanded position down
      act(() => {
        result.current.updateAfterReorder(1, 2)
      })

      expect(result.current.expandedIndex).toBe(2)
    })

    it('handles reordering at boundaries when dragging up', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(2)
      })

      // Drag from exactly the expanded position up
      act(() => {
        result.current.updateAfterReorder(2, 1)
      })

      expect(result.current.expandedIndex).toBe(1)
    })

    it('handles edge case when source equals destination', () => {
      const { result } = renderHook(() => useAccordion())

      act(() => {
        result.current.toggleExpanded(1)
      })

      act(() => {
        result.current.updateAfterReorder(2, 2)
      })

      // Should remain unchanged
      expect(result.current.expandedIndex).toBe(1)
    })
  })

  describe('Integration', () => {
    it('maintains correct state through multiple operations', () => {
      const { result } = renderHook(() => useAccordion())

      // Expand item 0
      act(() => {
        result.current.toggleExpanded(0)
      })
      expect(result.current.expandedIndex).toBe(0)
      expect(result.current.isExpanded(0)).toBe(true)

      // Reorder it down
      act(() => {
        result.current.updateAfterReorder(0, 2)
      })
      expect(result.current.expandedIndex).toBe(2)
      expect(result.current.isExpanded(2)).toBe(true)
      expect(result.current.isExpanded(0)).toBe(false)

      // Toggle it closed
      act(() => {
        result.current.toggleExpanded(2)
      })
      expect(result.current.expandedIndex).toBeNull()
      expect(result.current.isExpanded(2)).toBe(false)

      // Expand a new item
      act(() => {
        result.current.expandNew(5)
      })
      expect(result.current.expandedIndex).toBe(5)
      expect(result.current.isExpanded(5)).toBe(true)
    })
  })
})

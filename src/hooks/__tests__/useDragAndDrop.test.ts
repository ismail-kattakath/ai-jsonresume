import { renderHook, act } from '@testing-library/react'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import type { DropResult } from '@hello-pangea/dnd'

describe('useDragAndDrop', () => {
  it('should call onReorder with reordered items when drag ends', () => {
    const items = ['item1', 'item2', 'item3']
    const onReorder = jest.fn()

    const { result } = renderHook(() => useDragAndDrop(items, onReorder))

    const dropResult: DropResult = {
      draggableId: 'item-0',
      type: 'DEFAULT',
      source: { index: 0, droppableId: 'droppable' },
      destination: { index: 2, droppableId: 'droppable' },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null,
    }

    act(() => {
      result.current.onDragEnd(dropResult)
    })

    expect(onReorder).toHaveBeenCalledWith(['item2', 'item3', 'item1'])
  })

  it('should not call onReorder when dropped outside the list', () => {
    const items = ['item1', 'item2', 'item3']
    const onReorder = jest.fn()

    const { result } = renderHook(() => useDragAndDrop(items, onReorder))

    const dropResult: DropResult = {
      draggableId: 'item-0',
      type: 'DEFAULT',
      source: { index: 0, droppableId: 'droppable' },
      destination: null,
      reason: 'CANCEL',
      mode: 'FLUID',
      combine: null,
    }

    act(() => {
      result.current.onDragEnd(dropResult)
    })

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('should not call onReorder when dropped in the same position', () => {
    const items = ['item1', 'item2', 'item3']
    const onReorder = jest.fn()

    const { result } = renderHook(() => useDragAndDrop(items, onReorder))

    const dropResult: DropResult = {
      draggableId: 'item-0',
      type: 'DEFAULT',
      source: { index: 0, droppableId: 'droppable' },
      destination: { index: 0, droppableId: 'droppable' },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null,
    }

    act(() => {
      result.current.onDragEnd(dropResult)
    })

    expect(onReorder).not.toHaveBeenCalled()
  })

  it('should handle moving item forward in the list', () => {
    const items = ['A', 'B', 'C', 'D']
    const onReorder = jest.fn()

    const { result } = renderHook(() => useDragAndDrop(items, onReorder))

    const dropResult: DropResult = {
      draggableId: 'item-1',
      type: 'DEFAULT',
      source: { index: 1, droppableId: 'droppable' },
      destination: { index: 3, droppableId: 'droppable' },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null,
    }

    act(() => {
      result.current.onDragEnd(dropResult)
    })

    expect(onReorder).toHaveBeenCalledWith(['A', 'C', 'D', 'B'])
  })

  it('should handle moving item backward in the list', () => {
    const items = ['A', 'B', 'C', 'D']
    const onReorder = jest.fn()

    const { result } = renderHook(() => useDragAndDrop(items, onReorder))

    const dropResult: DropResult = {
      draggableId: 'item-3',
      type: 'DEFAULT',
      source: { index: 3, droppableId: 'droppable' },
      destination: { index: 1, droppableId: 'droppable' },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null,
    }

    act(() => {
      result.current.onDragEnd(dropResult)
    })

    expect(onReorder).toHaveBeenCalledWith(['A', 'D', 'B', 'C'])
  })

  it('should work with objects', () => {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' },
    ]
    const onReorder = jest.fn()

    const { result } = renderHook(() => useDragAndDrop(items, onReorder))

    const dropResult: DropResult = {
      draggableId: 'item-0',
      type: 'DEFAULT',
      source: { index: 0, droppableId: 'droppable' },
      destination: { index: 2, droppableId: 'droppable' },
      reason: 'DROP',
      mode: 'FLUID',
      combine: null,
    }

    act(() => {
      result.current.onDragEnd(dropResult)
    })

    expect(onReorder).toHaveBeenCalledWith([
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' },
      { id: 1, name: 'John' },
    ])
  })
})

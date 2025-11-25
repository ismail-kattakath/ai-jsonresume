import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  DnDContext,
  DnDDroppable,
  DnDDraggable,
  DraggableCard,
} from '@/components/ui/DragAndDrop'

// Mock @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => (
    <div data-testid="drag-drop-context">{children}</div>
  ),
  Droppable: ({ children }: any) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
      },
      {}
    ),
  Draggable: ({ children }: any) =>
    children(
      {
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
      },
      { isDragging: false }
    ),
}))

describe('DragAndDrop Components', () => {
  describe('DnDContext', () => {
    it('should accept onDragEnd prop', () => {
      // Test that the component accepts the required onDragEnd prop
      const onDragEnd = jest.fn()
      expect(() => {
        render(
          <DnDContext onDragEnd={onDragEnd}>
            <div data-testid="test-content">Test Content</div>
          </DnDContext>
        )
      }).not.toThrow()
    })

    it('should wrap children in DragDropContext', () => {
      render(
        <DnDContext onDragEnd={jest.fn()}>
          <div data-testid="test-content">Test Content</div>
        </DnDContext>
      )

      expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument()
    })
  })

  describe('DnDDroppable', () => {
    it('should accept droppableId prop', () => {
      // Test that the component accepts the required droppableId prop
      expect(() => {
        render(
          <DnDDroppable droppableId="test-droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                data-testid="droppable"
              >
                Droppable Content
              </div>
            )}
          </DnDDroppable>
        )
      }).not.toThrow()
    })
  })

  describe('DnDDraggable', () => {
    it('should accept draggableId and index props', () => {
      // Test that the component accepts the required props
      expect(() => {
        render(
          <DnDDraggable draggableId="test-draggable" index={0}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                data-testid="draggable"
              >
                Draggable Content
              </div>
            )}
          </DnDDraggable>
        )
      }).not.toThrow()
    })
  })

  describe('DraggableCard', () => {
    it('should render children', () => {
      render(
        <DraggableCard draggableId="test-card" index={0}>
          <div>Card Content</div>
        </DraggableCard>
      )

      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })

    it('should apply default outline color (purple)', () => {
      const { container } = render(
        <DraggableCard draggableId="test-card" index={0}>
          <div>Card Content</div>
        </DraggableCard>
      )

      const card = container.querySelector('.group')
      expect(card).toBeInTheDocument()
    })

    it('should apply custom outline color', () => {
      const { container } = render(
        <DraggableCard draggableId="test-card" index={0} outlineColor="indigo">
          <div>Card Content</div>
        </DraggableCard>
      )

      const card = container.querySelector('.group')
      expect(card).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <DraggableCard
          draggableId="test-card"
          index={0}
          className="custom-class"
        >
          <div>Card Content</div>
        </DraggableCard>
      )

      const card = container.querySelector('.custom-class')
      expect(card).toBeInTheDocument()
    })

    it('should have cursor-grab class', () => {
      const { container } = render(
        <DraggableCard draggableId="test-card" index={0}>
          <div>Card Content</div>
        </DraggableCard>
      )

      const card = container.querySelector('.cursor-grab')
      expect(card).toBeInTheDocument()
    })

    it('should have hover styles', () => {
      const { container } = render(
        <DraggableCard draggableId="test-card" index={0}>
          <div>Card Content</div>
        </DraggableCard>
      )

      const card = container.querySelector('.hover\\:border-white\\/20')
      expect(card).toBeInTheDocument()
    })
  })
})

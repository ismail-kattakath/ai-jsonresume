import { render, screen, fireEvent } from '@testing-library/react'
import KeyAchievements from '../KeyAchievements'
import { ResumeContext } from '@/lib/contexts/DocumentContext'

// Mock Hooks
jest.mock('@/lib/contexts/AISettingsContext', () => ({
    useAISettings: () => ({ settings: { jobDescription: '' }, isConfigured: true })
}))

jest.mock('@/hooks/useKeyAchievementsForm', () => ({
    useKeyAchievementsForm: () => ({
        achievements: [{ text: 'Achievement 1' }],
        add: jest.fn(),
        remove: jest.fn(),
        handleChange: jest.fn(),
        reorder: jest.fn(),
        setAchievements: jest.fn()
    })
}))

// Mock drag and drop
jest.mock('@/components/ui/DragAndDrop', () => ({
    DnDContext: ({ children }: any) => <div>{children}</div>,
    DnDDroppable: ({ children }: any) => children({ droppableProps: {}, innerRef: jest.fn(), placeholder: null }),
    DnDDraggable: ({ children }: any) => children({ dragHandleProps: {}, draggableProps: {}, innerRef: jest.fn() }, { isDragging: false })
}))

const mockResumeData = {
    workExperience: [
        { organization: 'Org 1', position: 'Role 1', keyAchievements: [] }
    ]
} as any

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <ResumeContext.Provider value={{ resumeData: mockResumeData, setResumeData: jest.fn() } as any}>
            {children}
        </ResumeContext.Provider>
    )
}

describe('KeyAchievements', () => {
    it('renders correctly', () => {
        render(<Wrapper><KeyAchievements workExperienceIndex={0} /></Wrapper>)
        expect(screen.getByText('Achievement 1')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Add key achievement/i)).toBeInTheDocument()
    })

    it('handles input change', () => {
        render(<Wrapper><KeyAchievements workExperienceIndex={0} /></Wrapper>)
        const input = screen.getByPlaceholderText(/Add key achievement/i)
        fireEvent.change(input, { target: { value: 'New Achievement' } })
        expect(input).toHaveValue('New Achievement')
    })
})

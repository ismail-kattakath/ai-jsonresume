import { render, screen, fireEvent } from '@testing-library/react'
import { SkillsSection } from '../SkillsSection'
import { ResumeContext } from '@/lib/contexts/DocumentContext'

// Mock Hooks
jest.mock('@/lib/contexts/AISettingsContext', () => ({
    useAISettings: () => ({ settings: {}, updateSettings: jest.fn(), isConfigured: true })
}))
jest.mock('@/hooks/useSkillGroupsManagement', () => ({
    useSkillGroupsManagement: () => ({ addGroup: jest.fn(), removeGroup: jest.fn(), renameGroup: jest.fn(), reorderGroups: jest.fn() })
}))
jest.mock('@/hooks/useAccordion', () => ({
    useAccordion: () => ({ isExpanded: () => true, toggleExpanded: jest.fn(), expandNew: jest.fn(), updateAfterReorder: jest.fn() })
}))

// Mock drag and drop since it's hard to test directly
jest.mock('@/components/ui/DragAndDrop', () => ({
    DnDContext: ({ children }: any) => <div>{children}</div>,
    DnDDroppable: ({ children }: any) => children({ droppableProps: {}, innerRef: jest.fn(), placeholder: null }),
    DnDDraggable: ({ children }: any) => children({ dragHandleProps: {}, draggableProps: {}, innerRef: jest.fn() }, { isDragging: false })
}))

jest.mock('../Skill', () => ({
    __esModule: true,
    default: ({ title }: any) => <div>Mocked Skill: {title}</div>
}))

const mockResumeData = { skills: [{ title: 'Languages', skills: [] }] } as any

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <ResumeContext.Provider value={{ resumeData: mockResumeData, setResumeData: jest.fn() } as any}>
            {children}
        </ResumeContext.Provider>
    )
}

describe('SkillsSection', () => {
    it('renders correctly', () => {
        render(<Wrapper><SkillsSection /></Wrapper>)
        expect(screen.getByText('Add Skill Group')).toBeInTheDocument()
    })

    it('toggles Add Skill Group input', () => {
        render(<Wrapper><SkillsSection /></Wrapper>)

        const addButton = screen.getByText('Add Skill Group')
        fireEvent.click(addButton)

        expect(screen.getByPlaceholderText('e.g., Frontend, Backend, DevOps...')).toBeInTheDocument()
    })
})

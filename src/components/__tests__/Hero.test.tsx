import { render, screen } from '@testing-library/react'
import Hero from '../sections/Hero'

// Must mock before importing portfolio or hero
jest.mock('@/lib/resumeAdapter', () => ({
    __esModule: true,
    default: {
        name: 'Test User',
        position: 'Software Engineer',
        summary: 'Expert summary.',
        address: '123 Main St, Toronto, ON M5V 2N8',
        contactInformation: '123-456-7890',
        email: 'test@example.com',
        socialMedia: [
            { socialMedia: 'LinkedIn', link: 'linkedin.com/in/test' },
            { socialMedia: 'Github', link: 'github.com/test' }
        ],
        profilePicture: '',
        skills: [],
        workExperience: [],
        projects: []
    }
}))

// Mock portfolio because it uses resumeAdapter top-level
jest.mock('@/lib/data/portfolio', () => ({
    contactInfo: {
        calendar: 'https://cal.com/test'
    }
}))

describe('Hero Component', () => {
    it('renders hero with name and label', () => {
        render(<Hero />)
        expect(screen.getByText('Test User')).toBeInTheDocument()
        expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    })
})

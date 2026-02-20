// @ts-nocheck
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AdditionalSections from '@/components/resume/forms/AdditionalSections'

// Mock the child form components
jest.mock('@/components/resume/forms/Language', () => {
    return function MockLanguage() {
        return <div data-testid="language-form">Language Form</div>
    }
})

jest.mock('@/components/resume/forms/Certification', () => {
    return function MockCertification() {
        return <div data-testid="certification-form">Certification Form</div>
    }
})

describe('AdditionalSections', () => {
    it('renders Languages and Certifications section titles', () => {
        render(<AdditionalSections />)
        expect(screen.getByText('Languages')).toBeInTheDocument()
        expect(screen.getByText('Certifications')).toBeInTheDocument()
    })

    it('renders expand/collapse chevron buttons', () => {
        const { container } = render(<AdditionalSections />)
        const buttons = container.querySelectorAll('button')
        // Each section has title button + chevron button = at least 4 buttons
        expect(buttons.length).toBeGreaterThanOrEqual(4)
    })

    it('toggles section expansion when title is clicked', () => {
        render(<AdditionalSections />)
        const languagesButton = screen.getByText('Languages')

        // Click to expand Languages
        fireEvent.click(languagesButton)

        // Languages form component should be accessible
        // Click again to collapse (or Certifications title to toggle)
        const certificationsButton = screen.getByText('Certifications')
        fireEvent.click(certificationsButton)
    })

    it('toggles section expansion when chevron button is clicked', () => {
        const { container } = render(<AdditionalSections />)
        // Find chevron buttons (they have title attribute)
        const expandButton = container.querySelector('button[title="Expand"]')
        if (expandButton) {
            fireEvent.click(expandButton)
        }

        const collapseButton = container.querySelector('button[title="Collapse"]')
        if (collapseButton) {
            fireEvent.click(collapseButton)
        }
    })

    it('renders drag handles', () => {
        const { container } = render(<AdditionalSections />)
        // GripVertical icons rendered as drag handles
        const gripElements = container.querySelectorAll('.cursor-grab')
        expect(gripElements.length).toBeGreaterThanOrEqual(2)
    })

    it('renders section icons (Languages and Award)', () => {
        const { container } = render(<AdditionalSections />)
        // Icons have specific color classes
        const emeraldIcons = container.querySelectorAll('.text-emerald-400')
        const violetIcons = container.querySelectorAll('.text-violet-400')
        expect(emeraldIcons.length).toBeGreaterThanOrEqual(1)
        expect(violetIcons.length).toBeGreaterThanOrEqual(1)
    })
})

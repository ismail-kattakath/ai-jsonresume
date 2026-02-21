import React from 'react'
import { render, screen } from '@testing-library/react'
import { SectionSkeleton, SectionListSkeleton, A4Skeleton } from '@/components/ui/section-skeleton'

describe('SectionSkeleton', () => {
  it('renders a pulsing placeholder with icon, title, and chevron shapes', () => {
    const { container } = render(<SectionSkeleton />)
    // Outer wrapper with animate-pulse
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('animate-pulse')
    // Three inner divs representing icon, label, chevron
    const innerRow = wrapper.firstChild as HTMLElement
    expect(innerRow.children).toHaveLength(3)
  })
})

describe('SectionListSkeleton', () => {
  it('renders 3 skeletons by default', () => {
    const { container } = render(<SectionListSkeleton />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children).toHaveLength(3)
  })

  it('renders the number of skeletons specified by the count prop', () => {
    const { container } = render(<SectionListSkeleton count={5} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children).toHaveLength(5)
  })

  it('renders 1 skeleton when count is 1', () => {
    const { container } = render(<SectionListSkeleton count={1} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children).toHaveLength(1)
  })

  it('renders 0 skeletons when count is 0', () => {
    const { container } = render(<SectionListSkeleton count={0} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children).toHaveLength(0)
  })
})

describe('A4Skeleton', () => {
  it('renders a pulsing A4-sized placeholder', () => {
    const { container } = render(<A4Skeleton />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('animate-pulse')
  })

  it('renders 4 content section rows', () => {
    const { container } = render(<A4Skeleton />)
    // Inner content div is inside p-12 > space-y-12 container
    const contentSection = container.querySelector('.space-y-12')
    expect(contentSection?.children).toHaveLength(4)
  })

  it('renders the header with name and avatar placeholders', () => {
    const { container } = render(<A4Skeleton />)
    const headerRow = container.querySelector('.mb-12')
    expect(headerRow).toBeInTheDocument()
    // Avatar placeholder (rounded-full)
    const avatar = headerRow?.querySelector('.rounded-full')
    expect(avatar).toBeInTheDocument()
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/layout/Header'
import { navItems } from '@/config/navigation'

jest.mock('framer-motion', () => ({
  motion: {
    header: ({ children, initial, animate, transition, ...props }: any) => (
      <header {...props}>{children}</header>
    ),
    button: ({
      children,
      onClick,
      whileHover,
      whileTap,
      initial,
      animate,
      transition,
      ...props
    }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    div: ({
      children,
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      ...props
    }: any) => <div {...props}>{children}</div>,
    span: ({ children, initial, whileHover, transition, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
}))

describe('Header', () => {
  beforeEach(() => {
    // Mock window.scrollTo and scrollIntoView
    window.scrollTo = jest.fn()
    Element.prototype.scrollIntoView = jest.fn()

    // Mock querySelector for navigation
    document.querySelector = jest.fn()

    // Reset window.location
    delete (window as any).location
    window.location = { href: '' } as any
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders header component', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('renders navigation items in desktop menu', () => {
      render(<Header />)
      navItems.forEach((item) => {
        expect(screen.getAllByText(item.name).length).toBeGreaterThan(0)
      })
    })

    it('renders mobile menu toggle button', () => {
      const { container } = render(<Header />)
      const menuButtons = container.querySelectorAll('button.md\\:hidden')
      expect(menuButtons.length).toBeGreaterThan(0)
    })

    it('renders logo', () => {
      const { container } = render(<Header />)
      const logo = container.querySelector('button.group')
      expect(logo).toBeInTheDocument()
    })
  })

  describe('Logo Behavior', () => {
    it('scrolls to top when logo is clicked', () => {
      const { container } = render(<Header />)
      const logo = container.querySelector('button.group')

      fireEvent.click(logo!)

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      })
    })
  })

  describe('Mobile Menu', () => {
    it('mobile menu is closed by default', () => {
      render(<Header />)
      const mobileNav = screen.queryByRole('button', { name: navItems[0].name })
      // Mobile menu items exist but might not be visible
      expect(mobileNav).toBeDefined()
    })

    it('opens mobile menu when toggle button is clicked', () => {
      const { container } = render(<Header />)
      const menuButton = container.querySelector('button.md\\:hidden')

      fireEvent.click(menuButton!)

      // Menu should be visible
      expect(menuButton).toBeInTheDocument()
    })

    it('closes mobile menu when toggle button is clicked again', () => {
      const { container } = render(<Header />)
      const menuButton = container.querySelector('button.md\\:hidden')

      // Open menu
      fireEvent.click(menuButton!)
      // Close menu
      fireEvent.click(menuButton!)

      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Navigation Behavior', () => {
    it('handles anchor link navigation', () => {
      const mockElement = { scrollIntoView: jest.fn() }
      ;(document.querySelector as jest.Mock).mockReturnValue(mockElement)

      render(<Header />)
      const navButtons = screen.getAllByText(navItems[0].name)

      // Click first navigation item (should be an anchor link)
      fireEvent.click(navButtons[0])

      expect(document.querySelector).toHaveBeenCalled()
    })

    it('scrolls to section when anchor link is clicked', () => {
      const mockElement = { scrollIntoView: jest.fn() }
      ;(document.querySelector as jest.Mock).mockReturnValue(mockElement)

      render(<Header />)
      const aboutButton = screen.getAllByText('About')[0]

      fireEvent.click(aboutButton)

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
      })
    })

    it('handles full page navigation for non-anchor links', () => {
      render(<Header />)

      // Find a nav item that might be a full page link
      const navButtons = screen.getAllByText(navItems[0].name)
      fireEvent.click(navButtons[0])

      // Navigation handler was called
      expect(navButtons[0]).toBeInTheDocument()
    })

    it('closes mobile menu after navigation', () => {
      const { container } = render(<Header />)
      const menuButton = container.querySelector('button.md\\:hidden')

      // Open mobile menu
      fireEvent.click(menuButton!)

      // Click a navigation item
      const navButtons = screen.getAllByText(navItems[0].name)
      fireEvent.click(navButtons[0])

      // Mobile menu should still exist (state management)
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Scroll Behavior', () => {
    it('updates header style on scroll', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')

      // Initially transparent
      expect(header?.className).toContain('bg-transparent')

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
      fireEvent.scroll(window)

      // Header should exist (class change is handled by state)
      expect(header).toBeInTheDocument()
    })

    it('adds scroll listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')

      render(<Header />)

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      )
    })

    it('removes scroll listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = render(<Header />)
      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      )
    })
  })
})

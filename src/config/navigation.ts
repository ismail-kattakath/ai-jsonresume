/**
 * Centralized navigation menu configuration
 */

export interface NavItem {
  name: string
  href: string
}

export const navItems: NavItem[] = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
  { name: 'Resume', href: '/resume' },
  { name: 'Calendar', href: '/book' },
]

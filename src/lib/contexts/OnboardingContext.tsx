/**
 * Onboarding Context
 * Manages the state of the onboarding tour
 */

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { ONBOARDING_STORAGE_KEY, ONBOARDING_VERSION } from '@/config/onboarding'

interface OnboardingContextType {
  hasSeenTour: boolean
  showTour: () => void
  completeTour: () => void
  resetTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
)

interface OnboardingProviderProps {
  children: ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [hasSeenTour, setHasSeenTour] = useState(true) // Default to true to avoid flash

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY)

      if (!stored) {
        // First-time user - show tour
        setHasSeenTour(false)
        return
      }

      const data = JSON.parse(stored)

      // Check if version matches - if not, show tour again
      if (data.version !== ONBOARDING_VERSION) {
        setHasSeenTour(false)
        return
      }

      // User has seen this version of the tour
      setHasSeenTour(true)
    } catch (error) {
      console.error('Error loading onboarding state:', error)
      // On error, assume user hasn't seen tour
      setHasSeenTour(false)
    }
  }, [])

  const showTour = () => {
    setHasSeenTour(false)
  }

  const completeTour = () => {
    setHasSeenTour(true)

    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          version: ONBOARDING_VERSION,
          completedAt: new Date().toISOString(),
        })
      )
    } catch (error) {
      console.error('Error saving onboarding state:', error)
    }
  }

  const resetTour = () => {
    setHasSeenTour(false)

    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    } catch (error) {
      console.error('Error resetting onboarding state:', error)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{ hasSeenTour, showTour, completeTour, resetTour }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)

  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }

  return context
}

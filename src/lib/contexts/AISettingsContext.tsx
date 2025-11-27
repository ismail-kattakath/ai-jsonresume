'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loadCredentials, saveCredentials } from '@/lib/ai/openai-client'

const DEFAULT_API_URL = 'http://localhost:1234'
const DEFAULT_API_KEY = 'DUMMYTOKEN'
const DEFAULT_MODEL = 'gpt-4o-mini'
const DEFAULT_JOB_DESCRIPTION = `At Supademo, we're reimagining how people experience products. Our AI-powered platform makes it effortless to create conversion-focused interactive demos at scale, with the platform already trusted by 100,000 professionals at top companies for sales, onboarding, and marketing. Since our 2023 launch, we've become G2's #5 fastest-growing software product (2025), hit profitability with 7-figure ARR, and we're just getting started.

What you'll own

Lead frontend experiences in React/Next.js, shipping polished UI that converts
Drive features end‑to‑end: scope → design → build → launch → iterate
Make pragmatic tradeoffs under ambiguity; bias to action and outcomes
Partner with customers to validate problems, gather feedback, and close loops
Shape product decisions directly with the CTO and cross‑functional leads

What makes this role special

High‑ownership builds from scratch, shipped to thousands, fast feedback cycles
Design‑first culture where details, performance, and UX quality matter
Autonomy to choose the right solution: prototype quickly, harden thoughtfully

What you bring

5+ years full‑stack with strong frontend chops in React/Next.js/TypeScript
Fluency across Node.js/APIs/microservices; comfortable working full-stack when needed
Excellent product instincts and judgment on scope, sequencing, and tradeoffs
Customer‑obsessed: can interface with customers, debug, and translate feedback into roadmap
Clear communication; thrives in ambiguity; EST collaboration hours

Nice to have

Built high‑volume, greenfield UX from zero‑to‑one
Experience in interactive, media‑rich, or editor‑style products

Perks

Remote (US/Canada), competitive salary + equity + benefits based on location
Real ownership across roadmap, architecture, and velocity

Ready to build killer products, ship end‑to‑end, and shape a category? Apply now.

Job Type: Full-time
Pay: $135,000.00-$200,000.00 per year

Benefits:
Dental care
Flexible schedule
Paid time off
Vision care

Work Location: Remote`

export interface AISettings {
  apiUrl: string
  apiKey: string
  model: string
  jobDescription: string
  rememberCredentials: boolean
}

export interface AISettingsContextType {
  settings: AISettings
  updateSettings: (updates: Partial<AISettings>) => void
  isConfigured: boolean
}

const defaultSettings: AISettings = {
  apiUrl: DEFAULT_API_URL,
  apiKey: DEFAULT_API_KEY,
  model: DEFAULT_MODEL,
  jobDescription: DEFAULT_JOB_DESCRIPTION,
  rememberCredentials: true,
}

export const AISettingsContext = createContext<AISettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  isConfigured: false,
})

export function AISettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load saved credentials on mount
  useEffect(() => {
    const saved = loadCredentials()
    if (saved) {
      setSettings((prev) => ({
        ...prev,
        apiUrl: saved.apiUrl || DEFAULT_API_URL,
        apiKey: saved.apiKey || DEFAULT_API_KEY,
        rememberCredentials: true,
        jobDescription: saved.lastJobDescription || DEFAULT_JOB_DESCRIPTION,
      }))
    }
    setIsInitialized(true)
  }, [])

  // Save credentials when they change
  useEffect(() => {
    if (!isInitialized) return

    saveCredentials({
      apiUrl: settings.apiUrl,
      apiKey: settings.apiKey,
      rememberCredentials: settings.rememberCredentials,
      lastJobDescription: settings.jobDescription,
    })
  }, [settings, isInitialized])

  const updateSettings = (updates: Partial<AISettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  const isConfigured =
    settings.apiUrl.trim() !== '' &&
    settings.apiKey.trim() !== '' &&
    settings.jobDescription.trim() !== ''

  return (
    <AISettingsContext.Provider value={{ settings, updateSettings, isConfigured }}>
      {children}
    </AISettingsContext.Provider>
  )
}

export function useAISettings() {
  const context = useContext(AISettingsContext)
  if (!context) {
    throw new Error('useAISettings must be used within an AISettingsProvider')
  }
  return context
}

/**
 * Onboarding Tour Component
 * Displays interactive tour for first-time users
 */

'use client'

import { Onborda, OnbordaProvider } from 'onborda'
import { useOnboarding } from '@/lib/contexts/OnboardingContext'
import { onboardingSteps } from '@/config/onboarding'

export function OnboardingTour() {
  const { hasSeenTour, completeTour } = useOnboarding()

  // Don't render if user has seen the tour
  if (hasSeenTour) return null

  return (
    <OnbordaProvider>
      <Onborda
        steps={onboardingSteps}
        showOnborda={!hasSeenTour}
        onFinish={completeTour}
        shadowRgb="0,0,0"
        shadowOpacity="0.8"
        cardTransition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        cardComponent={(props) => (
          <div className="relative max-w-md rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 shadow-2xl">
            {/* Icon */}
            {props.step.icon && (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-2xl">
                {props.step.icon}
              </div>
            )}

            {/* Title */}
            <h3 className="mb-2 text-xl font-bold text-white">
              {props.step.title}
            </h3>

            {/* Content */}
            <p className="mb-6 text-sm leading-relaxed text-white/80">
              {props.step.content}
            </p>

            {/* Progress indicator */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{
                    width: `${((props.currentStep + 1) / props.totalSteps) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-white/60">
                {props.currentStep + 1} / {props.totalSteps}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
              {/* Skip button - only on first step */}
              {props.currentStep === 0 && (
                <button
                  onClick={props.onClose}
                  className="rounded-lg px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Skip Tour
                </button>
              )}

              {/* Back button - show after first step */}
              {props.currentStep > 0 && (
                <button
                  onClick={props.previousStep}
                  className="rounded-lg px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Back
                </button>
              )}

              <div className="flex-1" />

              {/* Next/Finish button */}
              {props.currentStep < props.totalSteps - 1 ? (
                <button
                  onClick={props.nextStep}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={props.onClose}
                  className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-2 text-sm font-medium text-white transition-all hover:from-green-600 hover:to-emerald-600 hover:shadow-lg"
                >
                  Get Started 🚀
                </button>
              )}
            </div>
          </div>
        )}
      />
    </OnbordaProvider>
  )
}

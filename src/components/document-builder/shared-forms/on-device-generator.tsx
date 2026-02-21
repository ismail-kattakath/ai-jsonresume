'use client'

import React, { useEffect, useRef } from 'react'
import { Loader2, Square, RefreshCw, Check } from 'lucide-react'
import { useOnDeviceLlm } from '@/lib/ai/on-device/use-on-device-llm'

interface OnDeviceGeneratorProps {
  /** The fully-assembled prompt to send to the model */
  prompt: string
  /** Called when generation is complete with the final text */
  onComplete: (text: string) => void
  /** Called to dismiss this component */
  onDismiss: () => void
}

/**
 * Self-contained component that runs on-device Gemma3 inference.
 *
 * Isolating `useLlm` in its own component is required because React hooks
 * cannot be called conditionally. This component only mounts when the user
 * explicitly clicks "Generate with On-Device AI".
 *
 * Features:
 * - Shows model download progress (0–100%)
 * - Streams tokens in real-time with a blinking cursor
 * - Provides Use This Draft / Regenerate / Discard actions
 */
export function OnDeviceGenerator({ prompt, onComplete, onDismiss }: OnDeviceGeneratorProps) {
  const { generate, output, isLoading, progress, error, isReady } = useOnDeviceLlm()

  // Track whether we've already triggered generation for this prompt
  const hasGeneratedRef = useRef(false)

  // Auto-start generation once the model is ready
  useEffect(() => {
    if (isReady && !hasGeneratedRef.current && !output) {
      hasGeneratedRef.current = true
      generate(prompt)
    }
  }, [isReady, generate, prompt, output])

  const handleRegenerate = () => {
    hasGeneratedRef.current = true
    generate(prompt)
  }

  const handleUse = () => {
    const clean = output
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/~~(.+?)~~/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .trim()
    onComplete(clean)
  }

  // --- Render: Model Loading Phase ---
  if (progress < 100) {
    const stage = progress >= 95 ? 'Initializing model…' : `Downloading model… ${Math.round(progress)}%`

    return (
      <div className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>On-Device AI</span>
        </div>
        <p className="text-xs text-white/50">{stage}</p>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-white/30">
          {progress === 0
            ? '~555MB first-time download · cached locally after that'
            : 'This only happens once. Model is cached for future use.'}
        </p>
        <button onClick={onDismiss} className="text-xs text-white/30 underline transition-colors hover:text-white/60">
          Cancel
        </button>
      </div>
    )
  }

  // --- Render: Error State ---
  if (error) {
    return (
      <div className="space-y-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-red-400">On-Device AI Error</p>
        <p className="text-xs text-white/50">{error}</p>
        <button onClick={onDismiss} className="text-xs text-white/30 underline transition-colors hover:text-white/60">
          Dismiss
        </button>
      </div>
    )
  }

  // --- Render: Generating / Output ---
  const isDone = !isLoading && output.length > 0

  return (
    <div className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>On-Device AI is writing…</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Draft ready · generated on-device</span>
            </>
          )}
        </div>
        <span className="text-xs text-white/30">🔒 Private</span>
      </div>

      {/* Streaming output */}
      <div className="max-h-64 overflow-y-auto rounded bg-black/30 p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-white/80">
        {output || ' '}
        {isLoading && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-emerald-400 align-middle" />}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {isDone && (
          <button
            onClick={handleUse}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            <Check className="h-3 w-3" />
            Use This Draft
          </button>
        )}
        {isDone && (
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/5"
          >
            <RefreshCw className="h-3 w-3" />
            Regenerate
          </button>
        )}
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white/30 transition-colors hover:text-white/60"
        >
          {isLoading ? <Square className="h-3 w-3" /> : null}
          {isLoading ? 'Stop' : 'Discard'}
        </button>
      </div>
    </div>
  )
}

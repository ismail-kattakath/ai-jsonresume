'use client'

import { useLlm } from '@ismail-kattakath/mediapipe-react/genai'

/**
 * Gemma 3 1B IT (int4 quantized) model hosted on HuggingFace CDN.
 * ~555MB, downloaded once and cached by the browser (IndexedDB via MediaPipe).
 */
export const ON_DEVICE_MODEL_URL =
  'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int4.task'

export interface OnDeviceLlmState {
  /** Start generating. Note: generate() from the underlying useLlm hook returns void (not a Promise). */
  generate: (prompt: string) => void
  /** Streaming output — new tokens are appended in real time */
  output: string
  /** True while the model is actively generating tokens */
  isLoading: boolean
  /** Model download / init progress (0–100). 100 means model is ready */
  progress: number
  /** Error message if model load or inference failed */
  error: string | null
  /** True once model is downloaded and initialized (progress === 100 and not loading) */
  isReady: boolean
}

/**
 * Hook that wraps the MediaPipe `useLlm` hook to run Gemma3-1B-IT fully in-browser.
 *
 * The model is downloaded once and cached in the browser (IndexedDB).
 * Subsequent calls load from cache (~2–3 seconds instead of full download).
 *
 * Must be used inside a `<MediaPipeProvider>` tree.
 */
export function useOnDeviceLlm(): OnDeviceLlmState {
  const { generate, output, isLoading, progress, error } = useLlm({
    modelPath: ON_DEVICE_MODEL_URL,
  })

  const isReady = progress === 100 && !isLoading

  return {
    generate,
    output,
    isLoading,
    progress,
    error,
    isReady,
  }
}

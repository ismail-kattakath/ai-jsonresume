'use client'

import React, { useState, useContext } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import AISortButton from '@/components/ui/AISortButton'
import { toast } from 'sonner'
import { useAISettings } from '@/lib/contexts/AISettingsContext'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import {
  generateJobTitleWithProvider,
  OpenAIAPIError,
  GeminiAPIError,
} from '@/lib/ai/document-generator'
import { analytics } from '@/lib/analytics'

interface AIInputWithButtonProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onGenerated?: (content: string) => void
  placeholder: string
  name: string
  className?: string
  label?: string
}

const AIInputWithButton: React.FC<AIInputWithButtonProps> = ({
  value,
  onChange,
  onGenerated,
  placeholder,
  name,
  className = '',
  label = 'Job Title',
}) => {
  const { settings, isConfigured } = useAISettings()
  const { resumeData } = useContext(ResumeContext)
  const [isGenerating, setIsGenerating] = useState(false)

  // Helper to update input value
  const updateValue = (newValue: string) => {
    if (onGenerated) {
      onGenerated(newValue)
    } else {
      const syntheticEvent = {
        target: { value: newValue, name },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
  }

  /* istanbul ignore next */
  const handleGenerate = async () => {
    if (!isConfigured) {
      toast.error('AI not configured', {
        description:
          'Please fill in the API settings and job description in the Generative AI Settings section above.',
      })
      return
    }

    setIsGenerating(true)
    let streamedContent = ''
    const startTime = Date.now()

    // Track generation start
    analytics.aiGenerationStart(settings.providerType, settings.model)

    try {
      const content = await generateJobTitleWithProvider(
        resumeData,
        settings.jobDescription,
        settings.apiUrl,
        settings.apiKey,
        settings.model,
        settings.providerType,
        (chunk) => {
          if (chunk.content) {
            streamedContent += chunk.content
            updateValue(streamedContent)
          }
        }
      )

      // Final update with complete content
      updateValue(content)

      // Track generation success
      const responseTimeMs = Date.now() - startTime
      analytics.aiGenerationSuccess(
        settings.providerType,
        settings.model,
        responseTimeMs
      )

      toast.success('Job title generated successfully!', {
        description: 'The AI has crafted your tailored job title.',
      })
    } catch (err) {
      /* istanbul ignore next */
      console.error('Job title generation error:', err)

      /* istanbul ignore next */
      let errorMessage = 'Failed to generate job title'
      let errorType = 'unknown'

      /* istanbul ignore next */
      if (err instanceof OpenAIAPIError || err instanceof GeminiAPIError) {
        errorMessage = err.message
        errorType = err.constructor.name
      } else if (err instanceof Error) {
        errorMessage = err.message
        errorType = err.name
      }

      /* istanbul ignore next */
      // Track generation error
      analytics.aiGenerationError(settings.providerType, errorType)

      /* istanbul ignore next */
      toast.error('Generation failed', {
        description: errorMessage,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className={`floating-label-group ${className}`}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 pr-10 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
          value={value}
          onChange={onChange}
          disabled={isGenerating}
        />
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <AISortButton
            isConfigured={isConfigured}
            isLoading={isGenerating}
            onClick={handleGenerate}
            label="Generate by JD"
            showLabel={false}
            size="sm"
          />
        </div>
      </div>
      <label className="floating-label">{label}</label>
    </div>
  )
}

export default AIInputWithButton

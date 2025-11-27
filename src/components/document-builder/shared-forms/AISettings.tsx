'use client'

import React from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useAISettings } from '@/lib/contexts/AISettingsContext'
import { FormInput } from '@/components/ui/FormInput'
import { FormTextarea } from '@/components/ui/FormTextarea'

const AISettings: React.FC = () => {
  const { settings, updateSettings, isConfigured } = useAISettings()

  return (
    <div className="flex flex-col gap-4">
      {/* Status indicator */}
      <div
        className={`flex items-center gap-2 rounded-lg border p-3 ${
          isConfigured
            ? 'border-green-500/20 bg-green-500/10'
            : 'border-amber-500/20 bg-amber-500/10'
        }`}
      >
        {isConfigured ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-300">
              Ready to generate AI content
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-300">
              Configure settings below to enable AI generation
            </span>
          </>
        )}
      </div>

      {/* API URL and Key - Same line */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          label="API URL"
          name="apiUrl"
          value={settings.apiUrl}
          onChange={(e) => updateSettings({ apiUrl: e.target.value })}
          placeholder="https://api.openai.com"
          variant="blue"
        />
        <FormInput
          label="API Key"
          name="apiKey"
          type="password"
          value={settings.apiKey}
          onChange={(e) => updateSettings({ apiKey: e.target.value })}
          placeholder="sk-proj-..."
          variant="blue"
        />
      </div>

      {/* Job Description */}
      <FormTextarea
        label="Job Description"
        name="jobDescription"
        value={settings.jobDescription}
        onChange={(e) => updateSettings({ jobDescription: e.target.value })}
        placeholder="Paste the job description here to tailor your resume and cover letter..."
        variant="blue"
        minHeight="160px"
      />
    </div>
  )
}

export default AISettings

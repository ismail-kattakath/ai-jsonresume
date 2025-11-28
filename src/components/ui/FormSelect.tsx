import React, { ChangeEvent } from 'react'
import { FormVariant, variantClasses } from '@/lib/utils/formVariants'

export type { FormVariant }

interface FormSelectOption {
  value: string
  label: string
  description?: string
}

interface FormSelectProps {
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: FormSelectOption[]
  name: string
  variant?: FormVariant
  className?: string
  helpText?: string
}

/**
 * Reusable form select component with floating label pattern
 * Matches FormInput styling for consistency
 */
export function FormSelect({
  label,
  value,
  onChange,
  options,
  name,
  variant = 'teal',
  className = '',
  helpText,
}: FormSelectProps) {
  return (
    <div className="space-y-1">
      <div className={`floating-label-group ${className}`}>
        <select
          name={name}
          className={`w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:ring-2 ${variantClasses[variant]} cursor-pointer appearance-none`}
          value={value}
          onChange={onChange}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' fill-opacity='0.6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '40px',
          }}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-gray-900 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <label className="floating-label">{label}</label>
      </div>
      {helpText && <p className="text-xs text-white/50">{helpText}</p>}
    </div>
  )
}

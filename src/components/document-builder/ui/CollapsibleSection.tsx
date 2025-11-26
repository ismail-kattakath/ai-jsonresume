'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}

const CollapsibleSection = ({
  title,
  icon,
  children,
  defaultExpanded = false,
}: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20">
      {/* Header - Clickable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              {icon}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500"></div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 transition-transform" />
          ) : (
            <ChevronDown className="h-5 w-5 transition-transform" />
          )}
        </div>
      </button>

      {/* Content - Collapsible */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'max-h-[10000px] opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className="border-t border-white/10 p-6 pt-4">{children}</div>
      </div>
    </div>
  )
}

export default CollapsibleSection

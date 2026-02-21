'use client'

import React from 'react'

/**
 * A pulse skeleton to reserve space for form sections during load.
 * Matches the approximate height and shape of a CollapsibleSection header.
 */
export function SectionSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-white/10" />
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="ml-auto h-5 w-5 rounded bg-white/10" />
      </div>
    </div>
  )
}

export function SectionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SectionSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * A skeleton that mimics the A4 resume preview page.
 */
export function A4Skeleton() {
  return (
    <div className="mx-auto h-[1169px] w-[816px] animate-pulse bg-white/5 shadow-2xl">
      <div className="p-12">
        {/* Header skeleton */}
        <div className="mb-12 flex justify-between">
          <div className="space-y-4">
            <div className="h-10 w-64 rounded bg-white/10" />
            <div className="h-4 w-48 rounded bg-white/10" />
          </div>
          <div className="h-32 w-32 rounded-full bg-white/10" />
        </div>

        {/* Content body skeleton */}
        <div className="space-y-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-32 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-[90%] rounded bg-white/10" />
                <div className="h-4 w-[95%] rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

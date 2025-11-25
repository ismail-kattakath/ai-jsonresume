'use client'

import { useEffect } from 'react'
import resumeData from '@/lib/resumeAdapter'

export default function BookPage() {
  const calendarLink = resumeData.calendarLink

  useEffect(() => {
    if (calendarLink) {
      // Redirect to Google Calendar booking page
      window.location.replace(calendarLink)
    }
  }, [calendarLink])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="text-gray-600">Redirecting to booking page...</p>
        {calendarLink && (
          <p className="mt-2 text-sm text-gray-400">
            If you&apos;re not redirected,{' '}
            <a href={calendarLink} className="text-blue-600 underline">
              click here
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

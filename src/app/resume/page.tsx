'use client'

import { useEffect, useState } from 'react'
import Preview from '@/components/resume/preview/Preview'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import defaultResumeData from '@/lib/resumeAdapter'
import PrintButton from '@/components/document-builder/ui/PrintButton'
import '@/styles/document-builder.css'
import '@/styles/resume-preview.css'

export default function ResumeDownloadPage() {
  const [resumeData, setResumeData] = useState(defaultResumeData)

  useEffect(() => {
    // Load resume data from localStorage if available
    const storedData = localStorage.getItem('resumeData')
    let loadedData = defaultResumeData
    if (storedData) {
      loadedData = JSON.parse(storedData)
      setResumeData(loadedData)
    }

    // Set document title for PDF filename
    const formatName = (name: string) => {
      return name
        .split(/[\s_-]+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('')
    }

    if (loadedData.name) {
      document.title = `${formatName(loadedData.name)}-Resume`
    }

    // Auto-trigger print dialog only if URL param is present
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('autoprint') === 'true') {
      const timer = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        handleProfilePicture: () => {},
        handleChange: () => {},
        editable: false,
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 print:bg-white">
        {/* Floating Print Button - Hidden on print */}
        <div className="exclude-print safe-area-inset fixed right-4 bottom-16 z-50 md:right-8 md:bottom-8">
          <PrintButton name={resumeData.name} documentType="Resume" />
        </div>

        {/* Resume Content */}
        <div className="flex min-h-screen items-start justify-center px-4 py-8 print:px-0 print:py-0">
          <div className="w-full max-w-4xl">
            <Preview />
          </div>
        </div>
      </div>
    </ResumeContext.Provider>
  )
}

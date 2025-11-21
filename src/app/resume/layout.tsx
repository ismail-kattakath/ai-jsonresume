import type { Metadata } from 'next'
import DefaultResumeData from '@/components/resume-builder/utility/DefaultResumeData'

export const metadata: Metadata = {
  title: 'Download Resume',
  description: 'Print my latest resume in PDF',
  openGraph: {
    title: `Download Resume - ${DefaultResumeData.name}`,
    description: 'Print my latest resume in PDF',
    url: 'https://ismail.kattakath.com/resume',
    siteName: DefaultResumeData.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Download Resume - ${DefaultResumeData.name}`,
    description: 'Print my latest resume in PDF',
  },
}

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ATS Resume Builder | Ismail Kattakath',
  description: 'Create ATS-optimized resumes with our professional resume builder',
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

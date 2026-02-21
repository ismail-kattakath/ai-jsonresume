import React, { useContext } from 'react'
import { ResumeContext } from '@/lib/contexts/document-context'
import AIInputWithButton from './ai-input-with-button'

const PersonalInformation = ({}) => {
  const { resumeData, handleProfilePicture, handleChange, setResumeData } = useContext(ResumeContext)

  const handleJobTitleGenerate = (generatedTitle: string) => {
    setResumeData({ ...resumeData, position: generatedTitle })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="floating-label-group">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            value={resumeData.name}
            onChange={handleChange}
          />
          <label className="floating-label">Full Name</label>
        </div>
        <AIInputWithButton
          value={resumeData.position}
          onChange={handleChange}
          onGenerated={handleJobTitleGenerate}
          placeholder="Job Title"
          name="position"
          label="Job Title"
        />
        <div className="floating-label-group">
          <input
            type="text"
            placeholder="Phone (e.g., +1 (647) 225-2878)"
            name="contactInformation"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            value={resumeData.contactInformation}
            onChange={handleChange}
          />
          <label className="floating-label">Phone</label>
        </div>
        <div className="floating-label-group">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            value={resumeData.email}
            onChange={handleChange}
          />
          <label className="floating-label">Email</label>
        </div>
        <div className="floating-label-group md:col-span-2">
          <input
            type="text"
            placeholder="Address"
            name="address"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            value={resumeData.address}
            onChange={handleChange}
          />
          <label className="floating-label">Address</label>
        </div>
        <div className="floating-label-group">
          <input
            type="text"
            placeholder="Nationality"
            name="nationality"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            value={resumeData.nationality || ''}
            onChange={handleChange}
          />
          <label className="floating-label">Nationality</label>
        </div>
        <div className="floating-label-group">
          <input
            type="text"
            placeholder="Visa Status"
            name="visaStatus"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            value={resumeData.visaStatus || ''}
            onChange={handleChange}
          />
          <label className="floating-label">Visa Status</label>
        </div>
        <div className="floating-label-group md:col-span-2">
          <div className="relative flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20">
            <div className="relative overflow-hidden">
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                onChange={handleProfilePicture}
              />
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Choose File
              </button>
            </div>
            <span className="flex-1 truncate text-sm text-white/70">
              {resumeData.profilePicture ? 'Picture loaded' : 'No file chosen'}
            </span>
            {resumeData.profilePicture && (
              <button
                type="button"
                onClick={() => setResumeData({ ...resumeData, profilePicture: '' })}
                className="rounded-full bg-red-500/20 p-1.5 text-red-400 transition-colors hover:bg-red-500/30"
                title="Clear photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <label className="floating-label">Photo</label>
        </div>
      </div>
    </div>
  )
}

export default PersonalInformation

import React, { useContext, useState } from 'react'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import AIGenerateModal from '@/components/cover-letter/forms/AIGenerateModal'
import AITextAreaWithButton from '@/components/document-builder/shared-forms/AITextAreaWithButton'

const CoverLetterContent = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, content: e.target.value })
  }

  const handleGenerate = (generatedContent: string) => {
    setResumeData({ ...resumeData, content: generatedContent })
  }

  return (
    <div className="flex flex-col gap-4">
      <AITextAreaWithButton
        value={resumeData.content || ''}
        onChange={handleContentChange}
        onGenerateClick={() => setIsModalOpen(true)}
        placeholder="Write your compelling cover letter here...

Tip: Highlight your relevant experience, explain why you're excited about this opportunity, and show how your skills align with the role."
        name="content"
        rows={18}
        minHeight="300px"
        showCharacterCount={true}
      />

      {/* AI Generation Modal */}
      <AIGenerateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
        resumeData={resumeData}
      />
    </div>
  )
}

export default CoverLetterContent

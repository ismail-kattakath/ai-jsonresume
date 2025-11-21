import React, { useContext } from "react";
import { ResumeContext } from "@/lib/contexts/DocumentContext";
import ProfileHeader from "@/components/document-builder/shared-preview/ProfileHeader";

const CoverLetterPreview = () => {
  const { resumeData } = useContext(ResumeContext);

  // Capitalize name for signature (First Letter Of Each Word)
  const capitalizedName = resumeData.name
    ? resumeData.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : '';

  return (
    <div className="w-full md:w-[8.5in] md:sticky md:top-0 preview rm-padding-print p-6 md:overflow-y-scroll md:h-screen bg-white text-black font-[sans-serif]">
      <ProfileHeader />

      {/* Cover Letter Content */}
      <div className="mt-4 max-w-2xl mx-auto">
        <p className="content mb-2">Dear Hiring Manager,</p>
        <p className="content whitespace-pre-wrap editable" contentEditable suppressContentEditableWarning>
          {resumeData.content}
        </p>
        <div className="content mt-4">
          <p>Thanks and regards,</p>
          <p>{capitalizedName}</p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;

"use client";

import React, { useState, useEffect } from "react";
import "@/styles/document-builder.css";
import "@/styles/resume-preview.css";

// Import components
import Language from "@/components/resume/forms/Language";
import LoadUnload from "@/components/document-builder/shared-forms/LoadUnload";
import Preview from "@/components/resume/preview/Preview";
import defaultResumeData from "@/lib/resumeAdapter";
import SocialMedia from "@/components/document-builder/shared-forms/SocialMedia";
import WorkExperience from "@/components/resume/forms/WorkExperience";
import Skill from "@/components/resume/forms/Skill";
import PersonalInformation from "@/components/document-builder/shared-forms/PersonalInformation";
import Summary from "@/components/resume/forms/Summary";
import Education from "@/components/resume/forms/Education";
import Certification from "@/components/resume/forms/certification";
import PrintButton from "@/components/document-builder/ui/PrintButton";
import { ResumeContext } from "@/lib/contexts/DocumentContext";
import { Toaster } from "sonner";
import { useDocumentHandlers } from "@/lib/hooks/useDocumentHandlers";
import PasswordProtection from '@/components/auth/PasswordProtection';

function ResumeEditor() {
  // Resume data
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const { handleProfilePicture, handleChange } = useDocumentHandlers(resumeData, setResumeData);

  // Migrate skills data on mount if needed
  useEffect(() => {
    if (resumeData.skills && resumeData.skills.length > 0) {
      const needsMigration = resumeData.skills.some((skillCategory: any) =>
        skillCategory.skills.some(
          (skill: any) =>
            typeof skill === "string" ||
            ((skill as any).underline !== undefined &&
              skill.highlight === undefined)
        )
      );

      if (needsMigration) {
        const migratedData = {
          ...resumeData,
          skills: resumeData.skills.map((skillCategory: any) => ({
            ...skillCategory,
            skills: skillCategory.skills.map((skill: any) => {
              if (typeof skill === "string") {
                return { text: skill, highlight: false };
              }
              // Handle old 'underline' property
              if (
                (skill as any).underline !== undefined &&
                skill.highlight === undefined
              ) {
                return {
                  text: skill.text,
                  highlight: (skill as any).underline,
                };
              }
              return skill;
            }),
          })),
        };
        setResumeData(migratedData);
      }
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <ResumeContext.Provider
        value={{
          resumeData,
          setResumeData,
          handleProfilePicture,
          handleChange,
        }}
      >
        <div className="flex flex-col md:flex-row md:h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden relative">
          {/* Floating Print Button - Hidden on print */}
          <div className="exclude-print fixed bottom-8 right-8 z-50">
            <PrintButton name={resumeData.name} documentType="Resume" />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex-1 p-4 md:p-6 lg:p-8 exclude-print md:h-screen md:overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30 space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-white/10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Resume Editor</h1>
                <p className="text-sm text-white/60">Build your professional resume</p>
              </div>
            </div>

            <LoadUnload hidePrintButton />
            <PersonalInformation />
            <SocialMedia />
            <Summary />
            <Education />
            <WorkExperience />
            {resumeData.skills.map((skill, index) => (
              <Skill title={skill.title} key={index} />
            ))}
            <Language />
            <Certification />
          </form>
          <Preview />
        </div>
      </ResumeContext.Provider>
    </>
  );
}

export default function ResumeEditPage() {
  return (
    <PasswordProtection>
      <ResumeEditor />
    </PasswordProtection>
  );
}

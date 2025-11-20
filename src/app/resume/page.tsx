"use client";

import React, { useState, useEffect } from "react";
import Preview from "@/components/resume-builder/preview/Preview";
import DefaultResumeData from "@/components/resume-builder/utility/DefaultResumeData";
import { ResumeContext } from "@/app/resume/edit/ResumeContext";
import "../resume/edit/resume-builder.css";

export default function ResumePrintPage() {
  const [resumeData, setResumeData] = useState(DefaultResumeData);

  // Auto-trigger print dialog on mount
  useEffect(() => {
    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleProfilePicture = () => {};
  const handleChange = () => {};

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        handleProfilePicture,
        handleChange,
      }}
    >
      <div className="min-h-screen bg-white">
        <Preview />
      </div>
    </ResumeContext.Provider>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Preview from "@/components/resume-builder/preview/Preview";
import { ResumeContext } from "@/app/resume/edit/ResumeContext";
import defaultResumeData from "@/lib/resumeAdapter";
import { MdPictureAsPdf, MdEdit } from "react-icons/md";
import "@/app/resume/edit/resume-builder.css";

export default function ResumeDownloadPage() {
  const [resumeData, setResumeData] = useState(defaultResumeData);

  useEffect(() => {
    // Load resume data from localStorage if available
    const storedData = localStorage.getItem("resumeData");
    if (storedData) {
      setResumeData(JSON.parse(storedData));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        handleProfilePicture: () => {},
        handleChange: () => {},
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 print:bg-white">
        {/* Action Bar - Hidden on print */}
        <div className="exclude-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900">Resume Preview</h1>
                  <p className="text-xs text-gray-500">Ready to download or edit</p>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/resume/edit"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <MdEdit className="text-lg" />
                  <span className="hidden sm:inline">Edit Resume</span>
                  <span className="sm:hidden">Edit</span>
                </Link>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <MdPictureAsPdf className="text-lg" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                  <span className="sm:hidden">Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="py-8 px-4 flex items-start justify-center min-h-[calc(100vh-4rem)] print:py-0 print:px-0">
          <div className="w-full max-w-4xl">
            <Preview />
          </div>
        </div>
      </div>
    </ResumeContext.Provider>
  );
}

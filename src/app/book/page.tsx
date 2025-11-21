"use client";

import { useEffect } from "react";
import DefaultResumeData from "@/components/resume-builder/utility/DefaultResumeData";

export default function BookPage() {
  const calendarLink = DefaultResumeData.calendarLink;

  useEffect(() => {
    if (calendarLink) {
      // Redirect to Google Calendar booking page
      window.location.replace(calendarLink);
    }
  }, [calendarLink]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to booking page...</p>
        {calendarLink && (
          <p className="text-sm text-gray-400 mt-2">
            If you're not redirected, <a href={calendarLink} className="text-blue-600 underline">click here</a>
          </p>
        )}
      </div>
    </div>
  );
}

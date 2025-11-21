'use client';

import { createContext } from "react";
import resumeData from "@/lib/resumeAdapter";

type ResumeContextType = {
  resumeData: typeof resumeData;
  setResumeData: (data: typeof resumeData) => void;
  handleProfilePicture: (e: any) => void;
  handleChange: (e: any) => void;
};

export const ResumeContext = createContext<ResumeContextType>({
  resumeData: resumeData,
  setResumeData: () => {},
  handleProfilePicture: () => {},
  handleChange: () => {},
});

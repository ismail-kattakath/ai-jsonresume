import React, { useContext } from "react";
import { ResumeContext } from "@/app/resume/edit/ResumeContext";
const Summary = () => {
  const { resumeData, setResumeData, handleChange } = useContext(ResumeContext);

  const handleToggleSummary = (e) => {
    setResumeData({ ...resumeData, showSummary: e.target.checked });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h2 className="text-base text-white font-semibold mb-0">Summary</h2>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showSummary"
            checked={resumeData.showSummary}
            onChange={handleToggleSummary}
            className="w-4 h-4 text-red-800 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-fuchsia-500"
          />
          <label
            htmlFor="showSummary"
            className="text-sm text-white cursor-pointer"
          >
            Display Summary Section
          </label>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <textarea
          placeholder="Summary"
          name="summary"
          className="w-full px-2 py-1 bg-white text-gray-950 rounded h-40"
          value={resumeData.summary}
          onChange={handleChange}
          maxLength="500"
        />
      </div>
    </div>
  );
};

export default Summary;

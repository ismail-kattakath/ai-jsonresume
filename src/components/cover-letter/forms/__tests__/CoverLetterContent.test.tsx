import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CoverLetterContent from "../CoverLetterContent";
import { ResumeContext } from "@/lib/contexts/DocumentContext";
import { renderWithContext, createMockResumeData } from "@/lib/__tests__/test-utils";

describe("CoverLetterContent Component", () => {
  describe("Rendering", () => {
    it("should render section heading", () => {
      renderWithContext(<CoverLetterContent />);
      const heading = screen.getByRole("heading", { name: "Cover Letter Content" });
      expect(heading).toBeInTheDocument();
    });

    it("should render textarea with placeholder", () => {
      renderWithContext(<CoverLetterContent />);
      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("should render floating label", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const label = container.querySelector(".floating-label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("Cover Letter Content");
    });

    it("should render character counter", () => {
      renderWithContext(<CoverLetterContent />);
      expect(screen.getByText("0 characters")).toBeInTheDocument();
    });

    it("should display existing content in textarea", () => {
      const mockData = createMockResumeData({
        content: "This is my cover letter content",
      });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toHaveValue("This is my cover letter content");
    });

    it("should show correct character count for existing content", () => {
      const mockData = createMockResumeData({
        content: "Hello World",
      });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      expect(screen.getByText("11 characters")).toBeInTheDocument();
    });
  });

  describe("Input Changes", () => {
    it("should update content when user types", () => {
      const mockData = createMockResumeData({ content: "" });
      const mockSetResumeData = jest.fn();

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <CoverLetterContent />
        </ResumeContext.Provider>
      );

      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      fireEvent.change(textarea, { target: { value: "New cover letter content" } });

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        content: "New cover letter content",
      });
    });

    it("should handle empty string input", () => {
      const mockData = createMockResumeData({ content: "Existing content" });
      const mockSetResumeData = jest.fn();

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <CoverLetterContent />
        </ResumeContext.Provider>
      );

      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      fireEvent.change(textarea, { target: { value: "" } });

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        content: "",
      });
    });

    it("should handle multiline input", () => {
      const mockData = createMockResumeData({ content: "" });
      const mockSetResumeData = jest.fn();

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <CoverLetterContent />
        </ResumeContext.Provider>
      );

      const multilineContent = "First paragraph\n\nSecond paragraph\n\nThird paragraph";
      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      fireEvent.change(textarea, { target: { value: multilineContent } });

      expect(mockSetResumeData).toHaveBeenCalledWith({
        ...mockData,
        content: multilineContent,
      });
    });
  });

  describe("Character Counter", () => {
    it("should update character count when content changes", () => {
      const mockData = createMockResumeData({ content: "Test" });
      const { rerender } = render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: jest.fn(),
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <CoverLetterContent />
        </ResumeContext.Provider>
      );

      expect(screen.getByText("4 characters")).toBeInTheDocument();

      // Update content
      const updatedData = { ...mockData, content: "Updated content" };
      rerender(
        <ResumeContext.Provider
          value={{
            resumeData: updatedData,
            setResumeData: jest.fn(),
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <CoverLetterContent />
        </ResumeContext.Provider>
      );

      expect(screen.getByText("15 characters")).toBeInTheDocument();
    });

    it("should count spaces and special characters", () => {
      const mockData = createMockResumeData({
        content: "Hello, World! 123",
      });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      expect(screen.getByText("17 characters")).toBeInTheDocument();
    });

    it("should count newlines in character count", () => {
      const mockData = createMockResumeData({
        content: "Line 1\nLine 2",
      });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      expect(screen.getByText("13 characters")).toBeInTheDocument();
    });

    it("should show 0 characters for undefined content", () => {
      const mockData = createMockResumeData({ content: undefined });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      expect(screen.getByText("0 characters")).toBeInTheDocument();
    });
  });

  describe("Floating Label", () => {
    it("should have floating-label-group wrapper", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const floatingGroup = container.querySelector(".floating-label-group");
      expect(floatingGroup).toBeInTheDocument();
    });

    it("should have floating-label class on label", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const label = container.querySelector(".floating-label");
      expect(label).toBeInTheDocument();
      expect(label?.tagName.toLowerCase()).toBe("label");
    });
  });

  describe("Layout and Styling", () => {
    it("should have green gradient accent on section heading", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const gradient = container.querySelector(".bg-gradient-to-b.from-green-500.to-emerald-500");
      expect(gradient).toBeInTheDocument();
    });

    it("should have focus styles with green color", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const textarea = container.querySelector(".focus\\:border-green-400");
      expect(textarea).toBeInTheDocument();
    });

    it("should have character counter positioned absolutely", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const counter = container.querySelector(".absolute.bottom-3.right-3");
      expect(counter).toBeInTheDocument();
    });

    it("should have character counter as non-interactive", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const counter = container.querySelector(".pointer-events-none");
      expect(counter).toBeInTheDocument();
      expect(counter).toHaveTextContent("0 characters");
    });

    it("should have resizable textarea", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const textarea = container.querySelector(".resize-y");
      expect(textarea).toBeInTheDocument();
    });

    it("should have minimum height set", () => {
      const { container } = renderWithContext(<CoverLetterContent />);
      const textarea = container.querySelector(".min-h-\\[300px\\]");
      expect(textarea).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should use semantic heading structure", () => {
      renderWithContext(<CoverLetterContent />);
      const heading = screen.getByRole("heading", { name: "Cover Letter Content" });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });

    it("should have name attribute on textarea", () => {
      renderWithContext(<CoverLetterContent />);
      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toHaveAttribute("name", "content");
    });

    it("should have rows attribute for better accessibility", () => {
      renderWithContext(<CoverLetterContent />);
      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toHaveAttribute("rows", "18");
    });

    it("should have descriptive placeholder with tips", () => {
      renderWithContext(<CoverLetterContent />);
      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i) as HTMLTextAreaElement;
      expect(textarea.placeholder).toContain("Tip:");
      expect(textarea.placeholder).toContain("Highlight your relevant experience");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long content", () => {
      const longContent = "A".repeat(5000);
      const mockData = createMockResumeData({ content: longContent });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      expect(screen.getByText("5000 characters")).toBeInTheDocument();
      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toHaveValue(longContent);
    });

    it("should handle special characters and emojis", () => {
      const specialContent = "Hello 🎉 Special chars: @#$%^&*()";
      const mockData = createMockResumeData({ content: specialContent });
      const mockSetResumeData = jest.fn();

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <CoverLetterContent />
        </ResumeContext.Provider>
      );

      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toHaveValue(specialContent);
      expect(screen.getByText(`${specialContent.length} characters`)).toBeInTheDocument();
    });

    it("should handle null content gracefully", () => {
      const mockData = createMockResumeData({ content: undefined });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toHaveValue("");
      expect(screen.getByText("0 characters")).toBeInTheDocument();
    });

    it("should handle content with only whitespace", () => {
      const whitespaceContent = "   \n\n   ";
      const mockData = createMockResumeData({ content: whitespaceContent });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      expect(screen.getByText(`${whitespaceContent.length} characters`)).toBeInTheDocument();
    });

    it("should handle Unicode characters correctly", () => {
      const unicodeContent = "Hello 你好 مرحبا";
      const mockData = createMockResumeData({ content: unicodeContent });
      renderWithContext(<CoverLetterContent />, {
        contextValue: { resumeData: mockData },
      });

      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);
      expect(textarea).toHaveValue(unicodeContent);
      expect(screen.getByText(`${unicodeContent.length} characters`)).toBeInTheDocument();
    });

    it("should handle rapid content updates", () => {
      const mockData = createMockResumeData({ content: "" });
      const mockSetResumeData = jest.fn();

      render(
        <ResumeContext.Provider
          value={{
            resumeData: mockData,
            setResumeData: mockSetResumeData,
            handleProfilePicture: jest.fn(),
            handleChange: jest.fn(),
          }}
        >
          <CoverLetterContent />
        </ResumeContext.Provider>
      );

      const textarea = screen.getByPlaceholderText(/Write your compelling cover letter here/i);

      // Simulate rapid typing
      fireEvent.change(textarea, { target: { value: "H" } });
      fireEvent.change(textarea, { target: { value: "He" } });
      fireEvent.change(textarea, { target: { value: "Hel" } });
      fireEvent.change(textarea, { target: { value: "Hell" } });
      fireEvent.change(textarea, { target: { value: "Hello" } });

      expect(mockSetResumeData).toHaveBeenCalledTimes(5);
      expect(mockSetResumeData).toHaveBeenLastCalledWith({
        ...mockData,
        content: "Hello",
      });
    });
  });
});

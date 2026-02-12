import { useContext } from 'react'
import { ResumeContext } from '@/lib/contexts/DocumentContext'

/**
 * Specialized hook for managing highlights in projects
 * Handles individual highlight items within a project entry
 */
export function useProjectHighlightsForm(projectIndex: number) {
  const { resumeData, setResumeData } = useContext(ResumeContext)

  const project = resumeData.projects?.[projectIndex]

  if (!project) {
    throw new Error(`Project at index ${projectIndex} not found`)
  }

  // Ensure highlights is initialized
  const highlights = project.highlights || []

  /**
   * Handle text change for a specific highlight
   */
  const handleChange = (highlightIndex: number, value: string) => {
    if (!project) return

    const newHighlights = [...highlights]
    newHighlights[highlightIndex] = value

    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects?.map((proj, i) =>
        i === projectIndex
          ? { ...proj, highlights: newHighlights }
          : proj
      ),
    }))
  }

  /**
   * Add new highlight
   */
  const add = (text: string) => {
    if (!text.trim() || !project) return
    const newHighlights = [...highlights, text.trim()]

    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects?.map((proj, i) =>
        i === projectIndex
          ? { ...proj, highlights: newHighlights }
          : proj
      ),
    }))
  }

  /**
   * Remove highlight by index
   */
  const remove = (highlightIndex: number) => {
    if (!project) return
    const newHighlights = highlights.filter(
      (_, i) => i !== highlightIndex
    )

    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects?.map((proj, i) =>
        i === projectIndex
          ? { ...proj, highlights: newHighlights }
          : proj
      ),
    }))
  }

  /**
   * Reorder highlights via drag and drop
   */
  const reorder = (startIndex: number, endIndex: number) => {
    if (!project) return
    const newHighlights = [...highlights]
    const [removed] = newHighlights.splice(startIndex, 1)
    if (removed) {
      newHighlights.splice(endIndex, 0, removed)
    }

    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects?.map((proj, i) =>
        i === projectIndex
          ? { ...proj, highlights: newHighlights }
          : proj
      ),
    }))
  }

  return {
    highlights,
    handleChange,
    add,
    remove,
    reorder,
  }
}

import React, { useContext } from 'react'
import FormButton from '@/components/ui/FormButton'
import { FormInput } from '@/components/ui/FormInput'
import { FormTextarea } from '@/components/ui/FormTextarea'
import { AccordionCard, AccordionHeader } from '@/components/ui/AccordionCard'
import { useArrayForm } from '@/hooks/useArrayForm'
import { useAccordion } from '@/hooks/useAccordion'
import { ResumeContext } from '@/lib/contexts/DocumentContext'
import {
  DnDContext,
  DnDDroppable,
  DnDDraggable,
} from '@/components/ui/DragAndDrop'
import KeyAchievements from '@/components/resume/forms/KeyAchievements'
import TagInput from '@/components/ui/TagInput'
import type { DropResult } from '@hello-pangea/dnd'

/**
 * Work Experience form component
 * Card-based layout with collapsible entries
 */
const WorkExperience = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext)
  const { data, handleChange, add, remove } = useArrayForm(
    'workExperience',
    {
      company: '',
      url: '',
      position: '',
      description: '',
      keyAchievements: [],
      startYear: '',
      endYear: '',
      technologies: [],
    },
    { urlFields: ['url'] }
  )

  const { isExpanded, toggleExpanded, expandNew, updateAfterReorder } =
    useAccordion()

  const handleAdd = () => {
    add()
    expandNew(data.length)
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination) return
    if (destination.index === source.index) return

    const newWorkExperience = [...resumeData.workExperience]
    const [removed] = newWorkExperience.splice(source.index, 1)
    newWorkExperience.splice(destination.index, 0, removed)
    setResumeData({ ...resumeData, workExperience: newWorkExperience })

    updateAfterReorder(source.index, destination.index)
  }

  const handleAddTechnology = (index: number, technology: string) => {
    const newWorkExperience = [...resumeData.workExperience]
    const technologies = newWorkExperience[index].technologies || []
    newWorkExperience[index] = {
      ...newWorkExperience[index],
      technologies: [...technologies, technology],
    }
    setResumeData({ ...resumeData, workExperience: newWorkExperience })
  }

  const handleRemoveTechnology = (index: number, techIndex: number) => {
    const newWorkExperience = [...resumeData.workExperience]
    const technologies = [...(newWorkExperience[index].technologies || [])]
    technologies.splice(techIndex, 1)
    newWorkExperience[index] = {
      ...newWorkExperience[index],
      technologies,
    }
    setResumeData({ ...resumeData, workExperience: newWorkExperience })
  }

  return (
    <div className="flex flex-col gap-4">
      <DnDContext onDragEnd={onDragEnd}>
        <DnDDroppable droppableId="work-experience">
          {(provided) => (
            <div
              className="space-y-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.map((workExperience, index) => (
                <DnDDraggable
                  key={`WORK-${index}`}
                  draggableId={`WORK-${index}`}
                  index={index}
                >
                  {(dragProvided, snapshot) => (
                    <AccordionCard
                      isDragging={snapshot.isDragging}
                      isExpanded={isExpanded(index)}
                      theme="teal"
                      innerRef={dragProvided.innerRef}
                      draggableProps={dragProvided.draggableProps}
                      header={
                        <AccordionHeader
                          title={workExperience.company}
                          subtitle={workExperience.position}
                          placeholder="New Experience"
                          isExpanded={isExpanded(index)}
                          onToggle={() => toggleExpanded(index)}
                          onDelete={() => remove(index)}
                          deleteTitle="Delete experience"
                          dragHandleProps={dragProvided.dragHandleProps}
                        />
                      }
                    >
                      <FormInput
                        label="Company Name"
                        name="company"
                        value={workExperience.company}
                        onChange={(e) => handleChange(e, index)}
                        variant="teal"
                      />

                      <FormInput
                        label="Company Website URL"
                        name="url"
                        type="url"
                        value={workExperience.url}
                        onChange={(e) => handleChange(e, index)}
                        variant="teal"
                      />

                      <FormInput
                        label="Job Title"
                        name="position"
                        value={workExperience.position}
                        onChange={(e) => handleChange(e, index)}
                        variant="teal"
                      />

                      <FormTextarea
                        label="Description"
                        name="description"
                        placeholder="Brief company/role description..."
                        value={workExperience.description}
                        onChange={(e) => handleChange(e, index)}
                        variant="teal"
                        maxLength={250}
                        showCounter
                        minHeight="100px"
                      />

                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                          Key Achievements
                        </label>
                        <KeyAchievements
                          workExperienceIndex={index}
                          variant="teal"
                        />
                      </div>

                      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <FormInput
                          label="Start Date"
                          name="startYear"
                          type="date"
                          value={workExperience.startYear}
                          onChange={(e) => handleChange(e, index)}
                          variant="teal"
                          className="flex-1"
                        />

                        <FormInput
                          label="End Date"
                          name="endYear"
                          type="date"
                          value={workExperience.endYear}
                          onChange={(e) => handleChange(e, index)}
                          variant="teal"
                          className="flex-1"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                          Technologies
                        </label>
                        <TagInput
                          tags={workExperience.technologies || []}
                          onAdd={(tech) => handleAddTechnology(index, tech)}
                          onRemove={(techIndex) =>
                            handleRemoveTechnology(index, techIndex)
                          }
                          placeholder="Add technology..."
                          variant="teal"
                        />
                      </div>
                    </AccordionCard>
                  )}
                </DnDDraggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </DnDDroppable>
      </DnDContext>

      <FormButton size={data.length} add={handleAdd} label="Experience" />
    </div>
  )
}

export default WorkExperience

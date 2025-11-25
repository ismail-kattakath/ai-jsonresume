import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import FormButton from '@/components/ui/FormButton'
import { FormInput } from '@/components/ui/FormInput'
import { FormTextarea } from '@/components/ui/FormTextarea'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { useArrayForm } from '@/hooks/useArrayForm'
import { ResumeContext } from '@/lib/contexts/DocumentContext'

const DragDropContext = dynamic(
  () =>
    import('@hello-pangea/dnd').then((mod) => {
      return mod.DragDropContext
    }),
  { ssr: false }
)
const Droppable = dynamic(
  () =>
    import('@hello-pangea/dnd').then((mod) => {
      return mod.Droppable
    }),
  { ssr: false }
)
const Draggable = dynamic(
  () =>
    import('@hello-pangea/dnd').then((mod) => {
      return mod.Draggable
    }),
  { ssr: false }
)

/**
 * Work Experience form component - REFACTORED
 * Reduced from 169 lines to ~80 lines using reusable components
 * All CRUD logic delegated to useArrayForm hook
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
      keyAchievements: '',
      startYear: '',
      endYear: '',
    },
    { urlFields: ['url'] }
  )

  const onDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const newWorkExperience = [...resumeData.workExperience]
    const [removed] = newWorkExperience.splice(source.index, 1)
    newWorkExperience.splice(destination.index, 0, removed)
    setResumeData({ ...resumeData, workExperience: newWorkExperience })
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Work Experience" variant="teal" />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="work-experience">
          {(provided) => (
            <div
              className="flex flex-col gap-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.map((workExperience, index) => (
                <Draggable
                  key={`WORK-${index}`}
                  draggableId={`WORK-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group flex cursor-grab flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 hover:border-white/20 hover:bg-white/10 active:cursor-grabbing ${
                        snapshot.isDragging
                          ? 'bg-white/20 outline-2 outline-teal-400 outline-dashed'
                          : ''
                      }`}
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

                      <FormTextarea
                        label="Key Achievements"
                        name="keyAchievements"
                        placeholder="Key achievements and responsibilities..."
                        value={workExperience.keyAchievements}
                        onChange={(e) => handleChange(e, index)}
                        variant="teal"
                        showCounter
                        minHeight="120px"
                      />

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

                        <DeleteButton
                          onClick={() => remove(index)}
                          label="Delete this work experience"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <FormButton size={data.length} add={add} label="Work Experience" />
    </div>
  )
}

export default WorkExperience

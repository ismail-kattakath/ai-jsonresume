import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import FormButton from '@/components/ui/FormButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { useSimpleArrayForm } from '@/hooks/useSimpleArrayForm'
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
 * Certification form component - REFACTORED
 * Reduced from 73 lines to ~50 lines
 */
const Certification = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext)
  const { data, handleChange, add, remove } =
    useSimpleArrayForm('certifications')

  const onDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const newCertifications = [...resumeData.certifications]
    const [removed] = newCertifications.splice(source.index, 1)
    newCertifications.splice(destination.index, 0, removed)
    setResumeData({ ...resumeData, certifications: newCertifications })
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Certifications" variant="violet" />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="certifications">
          {(provided) => (
            <div
              className="flex flex-col gap-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.map((certification, index) => (
                <Draggable
                  key={`CERT-${index}`}
                  draggableId={`CERT-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group flex cursor-grab flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-3 hover:border-white/20 hover:bg-white/10 active:cursor-grabbing ${
                        snapshot.isDragging
                          ? 'bg-white/20 outline-2 outline-violet-400 outline-dashed'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="floating-label-group flex-1">
                          <input
                            type="text"
                            placeholder="Enter certification name"
                            name="certification"
                            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                            value={certification}
                            onChange={(e) =>
                              handleChange(index, e.target.value)
                            }
                          />
                          <label className="floating-label">
                            Certification Name
                          </label>
                        </div>

                        <DeleteButton
                          onClick={() => remove(index)}
                          label="Delete this certification"
                          className="p-2"
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

      <FormButton size={data.length} add={add} label="Certification" />
    </div>
  )
}

export default Certification

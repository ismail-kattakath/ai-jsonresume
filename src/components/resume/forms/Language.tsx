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
 * Language form component - REFACTORED
 * Reduced from 90 lines to ~60 lines
 */
const Language = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext)
  const { data, handleChange, add, remove } = useSimpleArrayForm('languages')

  const onDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const newLanguages = [...resumeData.languages]
    const [removed] = newLanguages.splice(source.index, 1)
    newLanguages.splice(destination.index, 0, removed)
    setResumeData({ ...resumeData, languages: newLanguages })
  }

  const handleToggleLanguages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeData({ ...resumeData, showLanguages: e.target.checked })
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Languages"
        variant="emerald"
        action={
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10">
            <input
              type="checkbox"
              id="showLanguages"
              checked={resumeData.showLanguages}
              onChange={handleToggleLanguages}
              className="h-4 w-4 cursor-pointer rounded accent-emerald-500"
            />
            <span className="text-sm text-white/90">Display Section</span>
          </label>
        }
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="languages">
          {(provided) => (
            <div
              className="flex flex-col gap-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data.map((language, index) => (
                <Draggable
                  key={`LANGUAGE-${index}`}
                  draggableId={`LANGUAGE-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group flex cursor-grab flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-3 hover:border-white/20 hover:bg-white/10 active:cursor-grabbing ${
                        snapshot.isDragging
                          ? 'bg-white/20 outline-2 outline-emerald-400 outline-dashed'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="floating-label-group flex-1">
                          <input
                            type="text"
                            placeholder="Language"
                            name="language"
                            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                            value={language}
                            onChange={(e) =>
                              handleChange(index, e.target.value)
                            }
                          />
                          <label className="floating-label">Language</label>
                        </div>

                        <DeleteButton
                          onClick={() => remove(index)}
                          label="Delete this language"
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

      <FormButton size={data.length} add={add} label="Language" />
    </div>
  )
}

export default Language

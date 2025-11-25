import React from 'react'
import FormButton from '@/components/ui/FormButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DeleteButton } from '@/components/ui/DeleteButton'
import {
  DnDContext,
  DnDDroppable,
  DraggableCard,
} from '@/components/ui/DragAndDrop'
import { useSkillsForm } from '@/hooks/useSkillsForm'
import type { DropResult } from '@hello-pangea/dnd'

interface SkillProps {
  title: string
}

/**
 * Skill form component - REFACTORED with DRY principles
 * Uses reusable drag-and-drop components
 */
const Skill = ({ title }: SkillProps) => {
  const { skills, handleChange, toggleHighlight, add, remove, reorder } =
    useSkillsForm(title)

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return
    reorder(source.index, destination.index)
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title={title} variant="pink" />

      <DnDContext onDragEnd={onDragEnd}>
        <DnDDroppable droppableId={`skills-${title}`}>
          {(provided) => (
            <div
              className="flex flex-col gap-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {skills.map((skill, index) => (
                <DraggableCard
                  key={`SKILL-${title}-${index}`}
                  draggableId={`SKILL-${title}-${index}`}
                  index={index}
                  outlineColor="pink"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={skill.highlight}
                      onChange={() => toggleHighlight(index)}
                      className="h-4 w-4 flex-shrink-0 cursor-pointer rounded accent-pink-500"
                      title="Highlight this skill"
                    />

                    <div className="floating-label-group flex-1">
                      <input
                        type="text"
                        placeholder={`Enter ${title.toLowerCase()}`}
                        name={title}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white transition-all outline-none placeholder:text-white/40 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                        value={skill.text}
                        onChange={(e) => handleChange(index, e.target.value)}
                      />
                      <label className="floating-label">{title}</label>
                    </div>

                    <DeleteButton
                      onClick={() => remove(index)}
                      label="Delete this skill"
                      className="p-2"
                    />
                  </div>
                </DraggableCard>
              ))}
              {provided.placeholder}
            </div>
          )}
        </DnDDroppable>
      </DnDContext>

      <FormButton size={skills.length} add={add} label={title} />
    </div>
  )
}

export default Skill

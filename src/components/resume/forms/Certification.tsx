import React from 'react'
import TagInput from '@/components/ui/TagInput'
import { useSimpleArrayForm } from '@/hooks/useSimpleArrayForm'

/**
 * Certification form component
 * Displays certifications as inline tags with inline add input
 */
const Certification = () => {
  const { data, add, remove } = useSimpleArrayForm('certifications')

  return (
    <TagInput
      tags={data}
      onAdd={add}
      onRemove={remove}
      placeholder="Add certification..."
      variant="purple"
    />
  )
}

export default Certification

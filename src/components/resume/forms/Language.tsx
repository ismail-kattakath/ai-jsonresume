import React from 'react'
import TagInput from '@/components/ui/TagInput'
import { useSimpleArrayForm } from '@/hooks/useSimpleArrayForm'

/**
 * Language form component
 * Displays languages as inline tags with inline add input
 */
const Language = () => {
  const { data, add, remove } = useSimpleArrayForm('languages')

  return (
    <TagInput
      items={data}
      onAdd={add}
      onRemove={remove}
      placeholder="Add language..."
      theme="emerald"
    />
  )
}

export default Language

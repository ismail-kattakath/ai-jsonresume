import React, { useState } from 'react'

type ColorTheme = 'pink' | 'emerald' | 'violet' | 'teal' | 'blue'

const themeClasses: Record<ColorTheme, string> = {
  pink: 'focus:border-pink-400',
  emerald: 'focus:border-emerald-400',
  violet: 'focus:border-violet-400',
  teal: 'focus:border-teal-400',
  blue: 'focus:border-blue-400',
}

interface TagInputProps {
  /** Array of string items to display as tags */
  items: string[]
  /** Called when a new item is added */
  onAdd: (value: string) => void
  /** Called when an item is removed */
  onRemove: (index: number) => void
  /** Placeholder text for the input */
  placeholder?: string
  /** Color theme for focus states */
  theme?: ColorTheme
}

/**
 * Reusable tag input component
 * Displays items as inline tags with an inline input for adding new items
 */
const TagInput = ({
  items,
  onAdd,
  onRemove,
  placeholder = 'Add item...',
  theme = 'pink',
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        onAdd(inputValue.trim())
        setInputValue('')
      }
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`TAG-${index}-${item}`}
          className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white"
        >
          {item}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="ml-1 cursor-pointer text-white/60 transition-all hover:text-red-400"
            title="Remove"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`rounded-full border border-dashed border-white/30 bg-transparent px-3 py-1 text-sm text-white outline-none placeholder:text-white/40 ${themeClasses[theme]}`}
      />
    </div>
  )
}

export default TagInput

import React from 'react'

interface HighlightProps {
  text: string
  keywords: string
  className?: string
}

/**
 * A component that highlights specific keywords within a text string.
 * It splits the text by keywords and wraps matches in a <mark> tag.
 */
export const Highlight: React.FC<HighlightProps> = ({
  text,
  keywords,
  className = '',
}) => {
  if (!text) return null
  if (!keywords || !keywords.trim())
    return <span className={className}>{text}</span>

  // Split keywords by comma and clean up
  const keywordArray = keywords
    .split(',')
    .map((k) => k.trim())
    .filter((k) => k.length > 0)

  if (keywordArray.length === 0)
    return <span className={className}>{text}</span>

  // Escape special characters and create a regex with lookarounds for whole word matching
  const escapedKeywords = keywordArray
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  const regex = new RegExp(`(?<!\\w)(${escapedKeywords})(?!\\w)`, 'gi')

  // Split text by the regex matches
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isMatch = keywordArray.some(
          (k) => k.toLowerCase() === part.toLowerCase()
        )

        return isMatch ? (
          <mark key={i} className="rounded bg-yellow-200/50 px-0.5 text-black">
            {part}
          </mark>
        ) : (
          part
        )
      })}
    </span>
  )
}

export default Highlight

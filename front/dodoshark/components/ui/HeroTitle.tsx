import React from 'react'
import { renderText } from '@/app/lib/sanity-utils'

interface HeroTitleProps {
  title?: string
  fallback?: React.ReactNode
}

/**
 * HeroTitle Component
 * Logic:
 * 1. If title contains a newline (\n), split it. First line is normal (white/inherit), 
 *    second line is highlighted with 'accent-gradient-text'.
 * 2. If title is single line, split by space. The second half of words (rounded down) 
 *    is highlighted with 'accent-gradient-text'.
 */
const HeroTitle: React.FC<HeroTitleProps> = ({ title, fallback }) => {
  const cleanTitle = renderText(title)

  if (!cleanTitle) {
    return <>{fallback}</>
  }

  // Check for explicit newline
  if (cleanTitle.includes('\n')) {
    const lines = cleanTitle.split('\n').map((line) => renderText(line)).filter(Boolean)
    if (lines.length >= 2) {
      return (
        <>
          {lines[0]}
          <br />
          <span className="accent-gradient-text">{lines.slice(1).join(' ')}</span>
        </>
      )
    }
  }

  // Single line logic: split half words
  const words = cleanTitle.split(/\s+/)
  if (words.length <= 1) {
    return <>{cleanTitle}</>
  }

  const highlightCount = Math.floor(words.length / 2)
  const normalCount = words.length - highlightCount

  const normalPart = words.slice(0, normalCount).join(' ')
  const highlightPart = words.slice(normalCount).join(' ')

  return (
    <>
      {normalPart}{' '}
      <span className="accent-gradient-text">{highlightPart}</span>
    </>
  )
}

export default HeroTitle

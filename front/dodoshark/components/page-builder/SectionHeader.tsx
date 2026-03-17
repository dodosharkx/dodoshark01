import type { ReactNode } from 'react'

import {
  eyebrowClass,
  getSectionToneClasses,
  sectionSubtitleClass,
  sectionTitleClass,
  type SectionSpacing,
  type SectionTone,
} from './sectionStyles'

type SectionHeaderProps = {
  eyebrow?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  isDark?: boolean
  tone?: SectionTone
  align?: 'left' | 'center'
  spacing?: SectionSpacing
  showDivider?: boolean
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  isDark = false,
  tone,
  align = 'center',
  spacing = 'default',
  showDivider = true,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}: SectionHeaderProps) {
  if (!eyebrow && !title && !subtitle) return null

  const resolvedTone = tone ?? (isDark ? 'dark' : 'light')
  const toneClasses = getSectionToneClasses(resolvedTone)
  const alignClass = align === 'left' ? 'text-left' : 'text-center'
  const lineAlignClass = align === 'left' ? 'mx-0' : 'mx-auto'
  const stackClass = spacing === 'compact' ? 'space-y-3' : 'space-y-4'
  const dividerSpacingClass = spacing === 'compact' ? 'mt-4' : 'mt-5'
  const resolvedSubtitleClass =
    subtitleClassName || `${sectionSubtitleClass} max-w-3xl ${toneClasses.subtitle}`

  return (
    <header className={`${alignClass} ${className}`.trim()}>
      <div className={stackClass}>
        {eyebrow && (
          <p className={`${eyebrowClass} ${toneClasses.eyebrow}`}>
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className={`${sectionTitleClass} ${toneClasses.title} ${titleClassName}`.trim()}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className={`${resolvedSubtitleClass}`.trim()}>
            {subtitle}
          </p>
        )}
      </div>
      {showDivider && (title || subtitle) && (
        <div
          className={`${dividerSpacingClass} h-1.5 w-20 rounded-full ${toneClasses.divider} ${lineAlignClass}`}
        />
      )}
    </header>
  )
}

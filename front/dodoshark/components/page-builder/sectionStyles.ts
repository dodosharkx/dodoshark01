export type SectionTone = 'light' | 'dark'
export type SectionSpacing = 'default' | 'compact'

export const defaultSectionContainerClass = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
export const proseSectionContainerClass = 'mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'

export const sectionSpacingClassMap: Record<SectionSpacing, string> = {
  default: 'py-16 md:py-20',
  compact: 'py-14 md:py-16',
}

export const sectionTitleClass =
  'text-3xl font-display font-extrabold leading-[1.05] tracking-[-0.02em] md:text-4xl lg:text-[2.75rem]'
export const sectionSubtitleClass = 'text-sm leading-7 md:text-base'
export const bodyTextClass = 'text-sm leading-7 md:text-base'
export const cardTitleClass =
  'text-xl font-display font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[1.375rem]'
export const eyebrowClass = 'text-[11px] font-semibold uppercase tracking-[0.2em]'
export const heroTitleClass =
  'text-3xl font-display font-black leading-[1.04] tracking-[-0.03em] md:text-4xl lg:text-5xl'
export const heroSubtitleClass = 'text-[11px] font-semibold uppercase tracking-[0.2em]'
export const heroDescriptionClass = 'text-sm leading-7 md:text-base lg:text-lg'

export function getSectionToneClasses(tone: SectionTone) {
  if (tone === 'dark') {
    return {
      title: 'text-white',
      subtitle: 'text-slate-300',
      body: 'text-slate-300',
      muted: 'text-slate-400',
      eyebrow: 'text-slate-300',
      divider: 'bg-orange-500',
    }
  }

  return {
    title: 'text-slate-900',
    subtitle: 'text-slate-600',
    body: 'text-slate-600',
    muted: 'text-slate-500',
    eyebrow: 'text-slate-500',
    divider: 'bg-orange-500',
  }
}

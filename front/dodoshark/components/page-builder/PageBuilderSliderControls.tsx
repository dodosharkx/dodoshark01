import type {Swiper as SwiperInstance} from 'swiper'

export type SliderControls = {
  hasOverflow: boolean
  canPrev: boolean
  canNext: boolean
  currentPage: number
  totalPages: number
}

export const defaultSliderControls: SliderControls = {
  hasOverflow: false,
  canPrev: false,
  canNext: false,
  currentPage: 0,
  totalPages: 1,
}

export function getSliderControls(instance: SwiperInstance): SliderControls {
  const hasOverflow = !instance.isLocked && instance.slides.length > 1
  const totalPages = Math.max(instance.snapGrid.length, 1)

  return {
    hasOverflow,
    canPrev: hasOverflow && !instance.isBeginning,
    canNext: hasOverflow && !instance.isEnd,
    currentPage: Math.min(instance.snapIndex, totalPages - 1),
    totalPages,
  }
}

export function getSlidesPerGroup(instance: SwiperInstance) {
  const {slidesPerGroup} = instance.params
  return typeof slidesPerGroup === 'number' && slidesPerGroup > 0 ? slidesPerGroup : 1
}

function ArrowLeftIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      />
    </svg>
  )
}

function ArrowRightIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  )
}

export function SliderNavButton({
  direction,
  disabled,
  isDark,
  label,
  onClick,
  className = '',
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  isDark: boolean
  label: string
  onClick: () => void
  className?: string
}) {
  const buttonClass = isDark
    ? 'border-slate-600 bg-slate-900 text-slate-100 shadow-xl shadow-slate-950/30 hover:border-orange-300 hover:bg-slate-800 hover:text-orange-300'
    : 'border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/15 hover:border-orange-400 hover:bg-orange-500 hover:text-white'

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 ${buttonClass} ${className}`}
    >
      {direction === 'prev' ? (
        <ArrowLeftIcon className="h-5 w-5" />
      ) : (
        <ArrowRightIcon className="h-5 w-5" />
      )}
    </button>
  )
}

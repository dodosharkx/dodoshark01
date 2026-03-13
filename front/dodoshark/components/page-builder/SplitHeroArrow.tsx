'use client'

type SplitHeroArrowProps = {
  direction: 'previous' | 'next'
  onClick: () => void
  ariaLabel: string
  disabled?: boolean
  className?: string
}

export default function SplitHeroArrow({
  direction,
  onClick,
  ariaLabel,
  disabled = false,
  className = '',
}: SplitHeroArrowProps) {
  const isPrevious = direction === 'previous'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={[
        'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full',
        'border border-slate-300/80 bg-white/85 text-slate-700 shadow-md backdrop-blur-sm transition-colors',
        'hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'sm:h-11 sm:w-11',
        isPrevious ? 'left-0 sm:left-1' : 'right-0 sm:right-1',
        className,
      ].join(' ')}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 sm:h-5 sm:w-5 ${isPrevious ? '' : 'rotate-180'}`}
        aria-hidden="true"
      >
        <path
          d="M15 5 8 12l7 7"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
      </svg>
    </button>
  )
}

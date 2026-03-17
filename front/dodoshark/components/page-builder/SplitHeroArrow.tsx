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
        'absolute top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border',
        'border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/15 transition',
        'hover:border-orange-400 hover:bg-orange-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
        'disabled:cursor-not-allowed disabled:opacity-40',
        isPrevious ? 'left-2' : 'right-2',
        className,
      ].join(' ')}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${isPrevious ? '' : 'rotate-180'}`}
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

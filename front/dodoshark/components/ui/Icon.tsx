type SiteIconName =
  | 'arrow-right'
  | 'calendar'
  | 'chart-line'
  | 'clock'
  | 'cubes'
  | 'facebook'
  | 'film'
  | 'gear'
  | 'globe'
  | 'image'
  | 'industry'
  | 'lightbulb'
  | 'location'
  | 'microchip'
  | 'play'
  | 'search'
  | 'seedling'

type IconProps = {
  icon: SiteIconName | string
  className?: string
  title?: string
}

const fontAwesomeAliases: Record<string, SiteIconName> = {
  'fa-arrow-right': 'arrow-right',
  'fa-calendar-alt': 'calendar',
  'fa-chart-line': 'chart-line',
  'fa-clock': 'clock',
  'fa-cubes': 'cubes',
  'fa-facebook-f': 'facebook',
  'fa-film': 'film',
  'fa-gear': 'gear',
  'fa-globe-americas': 'globe',
  'fa-image': 'image',
  'fa-industry': 'industry',
  'fa-lightbulb': 'lightbulb',
  'fa-location-dot': 'location',
  'fa-microchip': 'microchip',
  'fa-play': 'play',
  'fa-search': 'search',
  'fa-seedling': 'seedling',
}

const siteIconNames = new Set<SiteIconName>([
  'arrow-right',
  'calendar',
  'chart-line',
  'clock',
  'cubes',
  'facebook',
  'film',
  'gear',
  'globe',
  'image',
  'industry',
  'lightbulb',
  'location',
  'microchip',
  'play',
  'search',
  'seedling',
])

function resolveIconName(icon: SiteIconName | string): SiteIconName {
  if (siteIconNames.has(icon as SiteIconName)) {
    return icon as SiteIconName
  }

  if (icon in fontAwesomeAliases) {
    return fontAwesomeAliases[icon]
  }

  const token = icon
    .split(/\s+/)
    .map((item) => item.trim())
    .find((item) => item.startsWith('fa-'))

  if (token && token in fontAwesomeAliases) {
    return fontAwesomeAliases[token]
  }

  if (icon in fontAwesomeAliases) {
    return fontAwesomeAliases[icon]
  }

  return 'image'
}

function getIconSvg(name: SiteIconName) {
  switch (name) {
    case 'arrow-right':
      return (
        <path
          d="M5 12h14m-5-5 5 5-5 5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      )
    case 'calendar':
      return (
        <>
          <rect
            x="4"
            y="5"
            width="16"
            height="15"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 3v4m8-4v4M4 10h16"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'chart-line':
      return (
        <>
          <path
            d="M4 19h16"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <path
            d="m6 15 4-4 3 2 5-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'clock':
      return (
        <>
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 8v4l3 2"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'cubes':
      return (
        <>
          <path
            d="m12 3 6 3.5v7L12 17l-6-3.5v-7L12 3Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M12 10 6 6.5M12 10l6-3.5M12 10v7"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'facebook':
      return (
        <path
          d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.5-.1-1.3-.1-2.1-.1-2.1 0-3.5 1.2-3.5 3.7V11H8v3h2.4v7h3.1Z"
          fill="currentColor"
        />
      )
    case 'film':
      return (
        <>
          <rect
            x="4"
            y="5"
            width="16"
            height="14"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 5v14M16 5v14M4 9h4m8 0h4M4 15h4m8 0h4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </>
      )
    case 'gear':
      return (
        <>
          <path
            d="m12 3 1.2 2.2 2.5.4.5 2.5 2.1 1.2-1.1 2.3 1.1 2.3-2.1 1.2-.5 2.5-2.5.4L12 21l-1.2-2.2-2.5-.4-.5-2.5-2.1-1.2 1.1-2.3-1.1-2.3 2.1-1.2.5-2.5 2.5-.4L12 3Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </>
      )
    case 'globe':
      return (
        <>
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </>
      )
    case 'image':
      return (
        <>
          <rect
            x="4"
            y="5"
            width="16"
            height="14"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" />
          <path
            d="m6 17 4.5-4.5 2.8 2.8 1.7-1.7L18 17"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'industry':
      return (
        <>
          <path
            d="M4 19V9l5 3V9l5 3V5l6 4v10H4Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M8 19v-3m4 3v-3m4 3v-3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'lightbulb':
      return (
        <>
          <path
            d="M9 18h6m-5 3h4m-5.5-6a6 6 0 1 1 7 0c-.8.7-1.2 1.4-1.3 2H9.8c-.1-.6-.5-1.3-1.3-2Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'location':
      return (
        <>
          <path
            d="M12 20s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="10" r="2.2" fill="currentColor" />
        </>
      )
    case 'microchip':
      return (
        <>
          <rect
            x="7"
            y="7"
            width="10"
            height="10"
            rx="1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m14 0h3M2 15h3m14 0h3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
        </>
      )
    case 'play':
      return <path d="M8 6v12l10-6-10-6Z" fill="currentColor" />
    case 'search':
      return (
        <>
          <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="m16 16 4 4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      )
    case 'seedling':
      return (
        <>
          <path
            d="M12 21v-8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <path
            d="M12 13c0-4 2.8-6.3 7-6-1 3.8-3.3 6-7 6Zm0 0c0-3.2-2.3-5-6-5 .4 3.4 2.2 5.2 6 5Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      )
  }
}

export type { SiteIconName }

export default function Icon({ icon, className, title }: IconProps) {
  const resolved = resolveIconName(icon)
  const label = title || resolved.replace(/-/g, ' ')

  if (title) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        role="img"
        focusable="false"
      >
        <title>{label}</title>
        {getIconSvg(resolved)}
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {getIconSvg(resolved)}
    </svg>
  )
}

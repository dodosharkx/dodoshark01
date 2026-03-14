import type {CSSProperties} from 'react'

export type SharedBackgroundVariant =
  | 'white'
  | 'lightGray'
  | 'blueGradientSoft'
  | 'blueGradientAir'

export type SharedBackgroundTheme = {
  section: string
  sectionBorder: string
  heading: string
  subtitle: string
  body: string
  tone: 'light' | 'dark'
  surface: string
  surfaceMuted: string
  surfaceElevated: string
  line: string
  dotIdle: string
  dotActive: string
  control: string
  controlHover: string
  overlay: string
  accentDark: string
  accentDarkSoft: string
  showcaseVars: CSSProperties
}

const sharedBackgroundThemes: Record<SharedBackgroundVariant, SharedBackgroundTheme> = {
  white: {
    section: 'bg-white',
    sectionBorder: 'border-y border-slate-100',
    heading: 'text-slate-900',
    subtitle: 'text-slate-500',
    body: 'text-slate-600',
    tone: 'light',
    surface: 'border border-slate-200 bg-white',
    surfaceMuted: 'border border-slate-200/80 bg-slate-50/85',
    surfaceElevated:
      'border border-slate-200 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]',
    line: 'bg-slate-300',
    dotIdle: 'bg-slate-300',
    dotActive: 'bg-orange-500',
    control: 'border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/15',
    controlHover: 'hover:border-orange-400 hover:bg-orange-500 hover:text-white',
    overlay: 'rgba(15,23,42,0.38)',
    accentDark: 'bg-slate-900 text-slate-50',
    accentDarkSoft: 'border-slate-200/40 bg-slate-900/78 text-slate-50',
    showcaseVars: {
      '--showcase-card-bg': '#f8fafc',
      '--showcase-card-border': 'rgb(148 163 184 / 0.2)',
      '--showcase-card-shadow': '0 24px 56px -32px rgb(15 23 42 / 0.38)',
      '--showcase-media-bg': 'rgb(226 232 240)',
      '--showcase-title': '#0f172a',
      '--showcase-description': '#475569',
      '--showcase-nav-bg': 'rgb(255 255 255 / 0.92)',
      '--showcase-nav-border': 'rgb(203 213 225 / 0.92)',
      '--showcase-nav-text': '#0f172a',
      '--showcase-counter': 'rgba(15,23,42,0.92)',
    } as CSSProperties,
  },
  lightGray: {
    section: 'bg-slate-50',
    sectionBorder: 'border-y border-slate-100',
    heading: 'text-slate-900',
    subtitle: 'text-slate-500',
    body: 'text-slate-600',
    tone: 'light',
    surface: 'border border-slate-200 bg-white',
    surfaceMuted: 'border border-slate-200/80 bg-slate-50/95',
    surfaceElevated:
      'border border-slate-200 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]',
    line: 'bg-slate-300',
    dotIdle: 'bg-slate-300',
    dotActive: 'bg-orange-500',
    control: 'border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/15',
    controlHover: 'hover:border-orange-400 hover:bg-orange-500 hover:text-white',
    overlay: 'rgba(15,23,42,0.38)',
    accentDark: 'bg-slate-900 text-slate-50',
    accentDarkSoft: 'border-slate-200/40 bg-slate-900/78 text-slate-50',
    showcaseVars: {
      '--showcase-card-bg': '#f8fafc',
      '--showcase-card-border': 'rgb(148 163 184 / 0.18)',
      '--showcase-card-shadow': '0 24px 56px -32px rgb(15 23 42 / 0.36)',
      '--showcase-media-bg': 'rgb(226 232 240)',
      '--showcase-title': '#0f172a',
      '--showcase-description': '#475569',
      '--showcase-nav-bg': 'rgb(255 255 255 / 0.92)',
      '--showcase-nav-border': 'rgb(203 213 225 / 0.92)',
      '--showcase-nav-text': '#0f172a',
      '--showcase-counter': 'rgba(15,23,42,0.92)',
    } as CSSProperties,
  },
  blueGradientSoft: {
    section:
      'bg-[radial-gradient(120%_58%_at_50%_0%,rgba(191,219,254,0.34)_0%,rgba(191,219,254,0.16)_42%,rgba(255,255,255,0)_78%),linear-gradient(180deg,#edf5ff_0%,#f5faff_34%,#ffffff_74%,#ffffff_100%)]',
    sectionBorder: 'border-y border-sky-100/80',
    heading: 'text-slate-900',
    subtitle: 'text-slate-600',
    body: 'text-slate-700',
    tone: 'light',
    surface: 'border border-sky-100/80 bg-white/90',
    surfaceMuted: 'border border-sky-100/80 bg-sky-50/55',
    surfaceElevated:
      'border border-sky-100/80 bg-white/94 shadow-[0_22px_48px_-30px_rgba(59,130,246,0.18)]',
    line: 'bg-sky-200/90',
    dotIdle: 'bg-sky-200',
    dotActive: 'bg-orange-500',
    control:
      'border-sky-100 bg-white/92 text-slate-900 shadow-xl shadow-sky-200/40 backdrop-blur-sm',
    controlHover: 'hover:border-sky-200 hover:bg-white hover:text-orange-600',
    overlay: 'rgba(15,23,42,0.30)',
    accentDark: 'bg-slate-900 text-slate-50',
    accentDarkSoft: 'border-sky-100/70 bg-slate-900/76 text-slate-50',
    showcaseVars: {
      '--showcase-card-bg': 'rgba(255,255,255,0.88)',
      '--showcase-card-border': 'rgb(186 230 253 / 0.95)',
      '--showcase-card-shadow': '0 24px 56px -32px rgb(59 130 246 / 0.18)',
      '--showcase-media-bg': 'rgb(219 234 254 / 0.9)',
      '--showcase-title': '#0f172a',
      '--showcase-description': '#475569',
      '--showcase-nav-bg': 'rgb(255 255 255 / 0.9)',
      '--showcase-nav-border': 'rgb(186 230 253 / 0.95)',
      '--showcase-nav-text': '#0f172a',
      '--showcase-counter': 'rgba(15,23,42,0.88)',
    } as CSSProperties,
  },
  blueGradientAir: {
    section:
      'bg-[radial-gradient(125%_60%_at_50%_0%,rgba(147,197,253,0.42)_0%,rgba(191,219,254,0.22)_40%,rgba(255,255,255,0)_78%),linear-gradient(180deg,#e3f1ff_0%,#eef7ff_36%,#ffffff_76%,#ffffff_100%)]',
    sectionBorder: 'border-y border-sky-100/90',
    heading: 'text-slate-900',
    subtitle: 'text-slate-600',
    body: 'text-slate-700',
    tone: 'light',
    surface: 'border border-sky-100/90 bg-white/90',
    surfaceMuted: 'border border-sky-100/90 bg-sky-50/70',
    surfaceElevated:
      'border border-sky-100/90 bg-white/95 shadow-[0_24px_54px_-32px_rgba(59,130,246,0.22)]',
    line: 'bg-sky-200',
    dotIdle: 'bg-sky-200',
    dotActive: 'bg-orange-500',
    control:
      'border-sky-100 bg-white/94 text-slate-900 shadow-xl shadow-sky-200/45 backdrop-blur-sm',
    controlHover: 'hover:border-sky-200 hover:bg-white hover:text-orange-600',
    overlay: 'rgba(15,23,42,0.28)',
    accentDark: 'bg-slate-900 text-slate-50',
    accentDarkSoft: 'border-sky-100/70 bg-slate-900/76 text-slate-50',
    showcaseVars: {
      '--showcase-card-bg': 'rgba(255,255,255,0.9)',
      '--showcase-card-border': 'rgb(186 230 253 / 0.98)',
      '--showcase-card-shadow': '0 24px 56px -32px rgb(59 130 246 / 0.2)',
      '--showcase-media-bg': 'rgb(191 219 254 / 0.72)',
      '--showcase-title': '#0f172a',
      '--showcase-description': '#475569',
      '--showcase-nav-bg': 'rgb(255 255 255 / 0.92)',
      '--showcase-nav-border': 'rgb(186 230 253 / 0.98)',
      '--showcase-nav-text': '#0f172a',
      '--showcase-counter': 'rgba(15,23,42,0.88)',
    } as CSSProperties,
  },
}

export function getSharedBackgroundTheme(variant: SharedBackgroundVariant = 'white') {
  return sharedBackgroundThemes[variant] ?? sharedBackgroundThemes.white
}

export type FeatureListBackgroundStyle = SharedBackgroundVariant

export function mapFeatureBackgroundStyleToVariant(
  style: FeatureListBackgroundStyle = 'white',
): SharedBackgroundVariant {
  return style
}

export function getSharedSurfaceClasses(
  theme: SharedBackgroundTheme,
  level: 'default' | 'muted' | 'elevated' = 'default',
) {
  if (level === 'muted') return theme.surfaceMuted
  if (level === 'elevated') return theme.surfaceElevated
  return theme.surface
}

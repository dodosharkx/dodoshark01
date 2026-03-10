import Image from 'next/image'
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'

import { urlFor } from '@/app/lib/sanity'
import { getSharedBackgroundTheme } from './backgroundTheme'
import SectionHeader from './SectionHeader'

type RichSectionMedia = {
  alt?: string
  asset?: {
    _id?: string
    url?: string
    metadata?: {
      lqip?: string
      dimensions?: {
        width?: number
        height?: number
      }
    }
  }
}

function hasImageIdentity(media?: RichSectionMedia) {
  const ref = media?.asset && '_ref' in media.asset ? (media.asset as { _ref?: string })._ref?.trim() : ''
  const id = media?.asset?._id?.trim()
  const url = media?.asset?.url?.trim()
  return Boolean(ref || id || url)
}

function resolveMediaSrc(media?: RichSectionMedia) {
  if (!media) return undefined

  const directUrl = media?.asset?.url?.trim()
  if (directUrl) return directUrl

  if (!hasImageIdentity(media)) return undefined

  try {
    return urlFor(media).width(1400).fit('max').url()
  } catch {
    return undefined
  }
}

export type RichSectionBlockData = {
  _type: 'richSectionBlock'
  _key?: string
  heading?: string
  subtitle?: string
  body?: PortableTextBlock[]
  media?: RichSectionMedia
  layout?: 'textLeftMediaRight' | 'mediaLeftTextRight'
  disableMediaFrameEffect?: boolean
  backgroundVariant?: 'default' | 'muted' | 'dark'
  anchorId?: string
}

function getPortableTextComponents(isDark: boolean): PortableTextComponents {
  const textColor = isDark ? 'text-slate-300' : 'text-slate-600'
  const headingColor = isDark ? 'text-white' : 'text-slate-900'
  const quoteBorder = isDark ? 'border-slate-600' : 'border-slate-300'
  const listMarker = isDark ? 'marker:text-orange-300' : 'marker:text-orange-500'
  const linkColor = isDark ? 'text-orange-300' : 'text-orange-600'

  return {
    block: {
      normal: ({ children }) => (
        <p className={`mb-5 text-[1.02rem] font-normal leading-[1.85] md:text-[1.06rem] ${textColor}`}>
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2 className={`mb-5 text-2xl font-display font-extrabold leading-[1.08] tracking-[-0.02em] md:text-3xl ${headingColor}`}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className={`mb-4 text-xl font-display font-bold leading-[1.12] tracking-[-0.02em] md:text-2xl ${headingColor}`}>
          {children}
        </h3>
      ),
      blockquote: ({ children }) => (
        <blockquote
          className={`my-8 border-l-4 pl-5 italic ${quoteBorder} ${textColor}`}
        >
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`mb-5 ml-6 list-disc space-y-2 leading-[1.8] ${listMarker} ${textColor}`}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={`mb-5 ml-6 list-decimal space-y-2 leading-[1.8] ${listMarker} ${textColor}`}>
          {children}
        </ol>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        const href = value?.href as string | undefined
        if (!href) return <>{children}</>

        const isExternal = /^https?:\/\//i.test(href)
        return (
          <a
            href={href}
            className={`${linkColor} underline underline-offset-4`}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer' : undefined}
          >
            {children}
          </a>
        )
      },
    },
  }
}

function MediaFigure({
  media,
  title,
  disableMediaFrameEffect = false,
}: {
  media?: RichSectionMedia
  title?: string
  disableMediaFrameEffect?: boolean
}) {
  const src = resolveMediaSrc(media)
  if (!src || !media?.asset) {
    const fallbackClass = disableMediaFrameEffect
      ? 'w-full aspect-[4/3] bg-slate-100'
      : 'w-full aspect-[4/3] rounded-lg bg-slate-100 border border-slate-200'
    return (
      <div className={fallbackClass} />
    )
  }

  const width = media.asset.metadata?.dimensions?.width ?? 1200
  const height = media.asset.metadata?.dimensions?.height ?? 900
  const hasLqip = Boolean(media.asset.metadata?.lqip)

  const frameClass = disableMediaFrameEffect
    ? 'relative overflow-hidden'
    : 'relative overflow-hidden rounded-lg shadow-xl bg-white'

  return (
    <div className={frameClass}>
      <Image
        src={src}
        alt={media.alt || title || 'Section media'}
        width={width}
        height={height}
        className="w-full h-auto object-cover"
        placeholder={hasLqip ? 'blur' : 'empty'}
        blurDataURL={media.asset.metadata?.lqip}
      />
    </div>
  )
}

type RichSectionBlockProps = {
  block: RichSectionBlockData
  seamlessToNext?: boolean
}

export default function RichSectionBlock({
  block,
  seamlessToNext = false,
}: RichSectionBlockProps) {
  const layout = block.layout === 'mediaLeftTextRight' ? 'mediaLeftTextRight' : 'textLeftMediaRight'
  const variant = block.backgroundVariant ?? 'default'
  const theme = getSharedBackgroundTheme(variant)
  const isDark = variant === 'dark'
  const hasMedia = Boolean(block.media?.asset)
  const hasBody = Boolean(block.body?.length)
  const hasSubtitle = Boolean(block.subtitle?.trim())
  const anchorId = block.anchorId?.trim() || undefined

  if (!block.heading && !hasSubtitle && !hasBody && !hasMedia) return null

  const headingClass = theme.heading
  const subtitleClass = theme.subtitle
  const layoutClass = 'grid items-start gap-14 lg:grid-cols-2 lg:gap-16'

  const textOrderClass =
    layout === 'mediaLeftTextRight' ? 'lg:order-2' : 'lg:order-1'
  const mediaOrderClass =
    layout === 'mediaLeftTextRight' ? 'lg:order-1' : 'lg:order-2'
  const bodyClass = seamlessToNext
    ? 'max-w-[36rem] [&_blockquote:last-child]:mb-0 [&_ol:last-child]:mb-0 [&_p:last-child]:mb-0 [&_ul:last-child]:mb-0'
    : 'max-w-[36rem]'

  const sectionSpacingClass = seamlessToNext ? 'pt-24 pb-2 md:pb-4' : 'py-24'

  return (
    <section id={anchorId} className={`${sectionSpacingClass} ${theme.section}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={layoutClass}>
          <div className={`${textOrderClass} max-w-[36rem]`}>
            {(block.heading || hasSubtitle) && (
              <SectionHeader
                title={block.heading}
                subtitle={hasSubtitle ? block.subtitle : undefined}
                isDark={isDark}
                align="left"
                className="mb-8 max-w-[36rem]"
                titleClassName={`text-3xl font-display font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[2.5rem] ${headingClass}`}
                subtitleClassName={`max-w-[34rem] text-[0.98rem] font-normal leading-7 md:text-base ${subtitleClass}`}
              />
            )}

            {hasBody && (
              <div className={bodyClass}>
                <PortableText
                  value={block.body as PortableTextBlock[]}
                  components={getPortableTextComponents(isDark)}
                />
              </div>
            )}
          </div>

          {hasMedia && (
            <div className={mediaOrderClass}>
              <MediaFigure
                media={block.media}
                title={block.heading}
                disableMediaFrameEffect={block.disableMediaFrameEffect}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

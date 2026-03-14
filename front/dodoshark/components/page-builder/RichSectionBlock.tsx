import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'

import {
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import RichSectionMediaCarousel from './RichSectionMediaCarousel'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import { bodyTextClass, cardTitleClass, sectionSubtitleClass } from './sectionStyles'

type RichSectionImage = {
  alt?: string
  asset?: {
    _ref?: string
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

export type RichSectionMediaItem = {
  _key?: string
  image?: RichSectionImage
  alt?: string
  caption?: string
}

function hasImageIdentity(image?: RichSectionImage) {
  const ref = image?.asset?._ref?.trim()
  const id = image?.asset?._id?.trim()
  const url = image?.asset?.url?.trim()
  return Boolean(ref || id || url)
}

function getValidMediaItems(items?: RichSectionMediaItem[]) {
  return (items ?? []).filter((item) => hasImageIdentity(item.image))
}

export type RichSectionBlockData = {
  _type: 'richSectionBlock'
  _key?: string
  heading?: string
  subtitle?: string
  body?: PortableTextBlock[]
  mediaItems?: RichSectionMediaItem[]
  layout?: 'textLeftMediaRight' | 'mediaLeftTextRight'
  disableMediaFrameEffect?: boolean
  backgroundVariant?: SharedBackgroundVariant
  anchorId?: string
}

export function hasRichSectionContent(block: RichSectionBlockData) {
  const hasMedia = getValidMediaItems(block.mediaItems).length > 0
  const hasBody = Boolean(block.body?.length)
  const hasSubtitle = Boolean(block.subtitle?.trim())

  return Boolean(block.heading || hasSubtitle || hasBody || hasMedia)
}

function getPortableTextComponents(theme: SharedBackgroundTheme): PortableTextComponents {
  const textColor = theme.body
  const headingColor = theme.heading
  const quoteBorder = 'border-slate-300'
  const listMarker = 'marker:text-orange-500'
  const linkColor = 'text-orange-600'

  return {
    block: {
      normal: ({ children }) => (
        <p className={`mb-5 font-normal ${bodyTextClass} ${textColor}`}>
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2 className={`mb-5 ${cardTitleClass} ${headingColor}`}>
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

type RichSectionBlockProps = {
  block: RichSectionBlockData
}

type RichSectionBlockContentProps = {
  block: RichSectionBlockData
  trimTrailingContentSpacing?: boolean
}

export function RichSectionBlockContent({
  block,
  trimTrailingContentSpacing = false,
}: RichSectionBlockContentProps) {
  const layout = block.layout === 'mediaLeftTextRight' ? 'mediaLeftTextRight' : 'textLeftMediaRight'
  const variant = block.backgroundVariant ?? 'white'
  const theme = getSharedBackgroundTheme(variant)
  const mediaItems = getValidMediaItems(block.mediaItems)
  const hasMedia = mediaItems.length > 0
  const hasBody = Boolean(block.body?.length)
  const hasSubtitle = Boolean(block.subtitle?.trim())

  if (!hasRichSectionContent(block)) return null

  const layoutClass = 'grid items-start gap-14 lg:grid-cols-2 lg:gap-16'

  const textOrderClass =
    layout === 'mediaLeftTextRight' ? 'lg:order-2' : 'lg:order-1'
  const mediaOrderClass =
    layout === 'mediaLeftTextRight' ? 'lg:order-1' : 'lg:order-2'
  const bodyClass = trimTrailingContentSpacing
    ? 'max-w-[36rem] [&_blockquote:last-child]:mb-0 [&_h2:last-child]:mb-0 [&_h3:last-child]:mb-0 [&_ol:last-child]:mb-0 [&_p:last-child]:mb-0 [&_ul:last-child]:mb-0'
    : 'max-w-[36rem]'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={layoutClass}>
        <div className={`${textOrderClass} min-w-0 max-w-[36rem]`}>
          {(block.heading || hasSubtitle) && (
            <SectionHeader
              title={block.heading}
              subtitle={hasSubtitle ? block.subtitle : undefined}
              tone="light"
              align="left"
              className="mb-10 max-w-[36rem] md:mb-12"
              titleClassName={theme.heading}
              subtitleClassName={`max-w-[34rem] font-normal ${sectionSubtitleClass} ${theme.subtitle}`}
            />
          )}

          {hasBody && (
            <div className={bodyClass}>
              <PortableText
                value={block.body as PortableTextBlock[]}
                components={getPortableTextComponents(theme)}
              />
            </div>
          )}
        </div>

        {hasMedia && (
          <div className={`${mediaOrderClass} min-w-0`}>
            <RichSectionMediaCarousel
              items={mediaItems}
              title={block.heading}
              theme={theme}
              disableMediaFrameEffect={block.disableMediaFrameEffect}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function RichSectionBlock({ block }: RichSectionBlockProps) {
  if (!hasRichSectionContent(block)) return null

  const variant = block.backgroundVariant ?? 'white'
  const theme = getSharedBackgroundTheme(variant)
  const anchorId = block.anchorId?.trim() || undefined

  return (
    <SectionShell id={anchorId} sectionClassName={theme.section}>
      <RichSectionBlockContent block={block} />
    </SectionShell>
  )
}

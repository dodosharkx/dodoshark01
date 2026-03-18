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
import AccentTitle from './AccentTitle'
import RichSectionMediaCarousel from './RichSectionMediaCarousel'
import {
  getValidRichSectionMediaItems,
  RichSectionMediaGrid,
  type RichSectionMediaItem,
} from './RichSectionMedia'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import {bodyTextClass, cardTitleClass, sectionSubtitleClass} from './sectionStyles'

export type RichSectionLayout =
  | 'textLeftMediaRight'
  | 'mediaLeftTextRight'
  | 'centeredMediaGridBodyBelow'

export type RichSectionColumnItem = {
  _key?: string
  title?: string
  description?: string
}

export type RichSectionBlockData = {
  _type: 'richSectionBlock'
  _key?: string
  heading?: string
  subtitle?: string
  body?: PortableTextBlock[]
  mediaItems?: RichSectionMediaItem[]
  mediaTopAccentTitle?: string
  layout?: RichSectionLayout
  centerHeaderInSplitLayout?: boolean
  enableTwoColumnContent?: boolean
  leftColumnHeading?: string
  leftColumnItems?: RichSectionColumnItem[]
  rightColumnHeading?: string
  rightColumnItems?: RichSectionColumnItem[]
  disableMediaFrameEffect?: boolean
  backgroundVariant?: SharedBackgroundVariant
  anchorId?: string
}

function normalizeRichSectionLayout(layout?: RichSectionLayout): RichSectionLayout {
  if (layout === 'mediaLeftTextRight' || layout === 'centeredMediaGridBodyBelow') {
    return layout
  }

  return 'textLeftMediaRight'
}

function getValidRichSectionColumnItems(items?: RichSectionColumnItem[]) {
  return (items ?? []).filter(
    (item) => Boolean(item?.title?.trim()) || Boolean(item?.description?.trim()),
  )
}

function hasTwoColumnPanelContent(heading?: string, items?: RichSectionColumnItem[]) {
  return Boolean(heading?.trim()) || getValidRichSectionColumnItems(items).length > 0
}

function useTwoColumnContent(block: RichSectionBlockData) {
  return (
    normalizeRichSectionLayout(block.layout) === 'centeredMediaGridBodyBelow' &&
    block.enableTwoColumnContent === true
  )
}

function centerHeaderInSplitLayout(block: RichSectionBlockData) {
  const layout = normalizeRichSectionLayout(block.layout)

  return (
    block.centerHeaderInSplitLayout === true &&
    (layout === 'textLeftMediaRight' || layout === 'mediaLeftTextRight')
  )
}

export function hasRichSectionContent(block: RichSectionBlockData) {
  const layout = normalizeRichSectionLayout(block.layout)
  const hasMedia = getValidRichSectionMediaItems(block.mediaItems).length > 0
  const hasSubtitle = Boolean(block.subtitle?.trim())
  const hasTwoColumnMode =
    layout === 'centeredMediaGridBodyBelow' && block.enableTwoColumnContent === true
  const hasTwoColumnPanels =
    hasTwoColumnPanelContent(block.leftColumnHeading, block.leftColumnItems) ||
    hasTwoColumnPanelContent(block.rightColumnHeading, block.rightColumnItems)
  const hasTwoColumnContent = hasTwoColumnMode && hasTwoColumnPanels
  const hasBody = hasTwoColumnMode ? false : Boolean(block.body?.length)

  return Boolean(block.heading || hasSubtitle || hasBody || hasMedia || hasTwoColumnContent)
}

function getPortableTextComponents(theme: SharedBackgroundTheme): PortableTextComponents {
  const textColor = theme.body
  const headingColor = theme.heading
  const quoteBorder = 'border-slate-300'
  const listMarker = 'marker:text-orange-500'
  const linkColor = 'text-orange-600'

  return {
    block: {
      normal: ({children}) => (
        <p className={`mb-5 font-normal ${bodyTextClass} ${textColor}`}>
          {children}
        </p>
      ),
      h2: ({children}) => (
        <h2 className={`mb-5 ${cardTitleClass} ${headingColor}`}>
          {children}
        </h2>
      ),
      h3: ({children}) => (
        <h3
          className={`mb-4 text-xl font-display font-bold leading-[1.12] tracking-[-0.02em] md:text-2xl ${headingColor}`}
        >
          {children}
        </h3>
      ),
      blockquote: ({children}) => (
        <blockquote className={`my-8 border-l-4 pl-5 italic ${quoteBorder} ${textColor}`}>
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({children}) => (
        <ul className={`mb-5 ml-6 list-disc space-y-2 leading-[1.8] ${listMarker} ${textColor}`}>
          {children}
        </ul>
      ),
      number: ({children}) => (
        <ol className={`mb-5 ml-6 list-decimal space-y-2 leading-[1.8] ${listMarker} ${textColor}`}>
          {children}
        </ol>
      ),
    },
    marks: {
      link: ({children, value}) => {
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

const twoColumnPanelBaseHeadingClass =
  'text-center whitespace-pre-line font-display font-extrabold leading-[1.08] tracking-[-0.03em]'
const twoColumnPillBaseClass =
  'inline-flex min-h-9 max-w-full items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold leading-tight md:min-h-10 md:px-5 md:text-base'
const twoColumnDescriptionBaseClass =
  'mx-auto max-w-[20ch] whitespace-pre-line text-base font-normal leading-7 md:text-[1.125rem] md:leading-8'

function RichSectionTwoColumnPanel({
  heading,
  items,
  variant,
  theme,
}: {
  heading?: string
  items: RichSectionColumnItem[]
  variant: 'left' | 'right'
  theme: SharedBackgroundTheme
}) {
  if (!heading?.trim() && items.length === 0) return null

  const isRight = variant === 'right'
  const panelClass = isRight
    ? 'border border-sky-200/70 bg-[linear-gradient(180deg,rgba(224,242,254,0.82)_0%,rgba(219,234,254,0.78)_100%)] shadow-[0_28px_60px_-40px_rgba(14,165,233,0.28)]'
    : 'border border-slate-200/80 bg-white/82 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.16)]'
  const headingClass = isRight
    ? `text-2xl md:text-[2rem] ${theme.heading}`
    : `text-2xl md:text-[1.875rem] ${theme.heading}`
  const pillClass = isRight
    ? 'bg-slate-900 text-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.8)]'
    : 'bg-[linear-gradient(90deg,#7dd3fc_0%,#38bdf8_100%)] text-slate-900 shadow-[0_10px_24px_-18px_rgba(14,165,233,0.7)]'
  const descriptionClass = isRight ? 'text-slate-700' : theme.body

  return (
    <div
      className={`mx-auto h-full w-full max-w-[30rem] rounded-[2rem] px-5 py-6 backdrop-blur-sm md:px-7 md:py-8 ${panelClass}`}
    >
      {heading?.trim() && (
        <h3
          className={`mb-8 ${twoColumnPanelBaseHeadingClass} md:mb-9 ${headingClass}`}
        >
          {heading.trim()}
        </h3>
      )}

      {items.length > 0 && (
        <div className="space-y-6 md:space-y-7">
          {items.map((item, index) => (
            <div
              key={item._key ?? `${variant}-${item.title ?? 'item'}-${index}`}
              className="text-center"
            >
              {item.title?.trim() && (
                <div className="mb-3.5 flex justify-center md:mb-4">
                  <span
                    className={`${twoColumnPillBaseClass} ${pillClass}`}
                  >
                    <span className="whitespace-pre-line">{item.title.trim()}</span>
                  </span>
                </div>
              )}
              {item.description?.trim() && (
                <p
                  className={`${twoColumnDescriptionBaseClass} ${descriptionClass}`}
                >
                  {item.description.trim()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RichSectionTwoColumnContent({
  block,
  theme,
}: {
  block: RichSectionBlockData
  theme: SharedBackgroundTheme
}) {
  const leftColumnHeading = block.leftColumnHeading?.trim()
  const rightColumnHeading = block.rightColumnHeading?.trim()
  const leftItems = getValidRichSectionColumnItems(block.leftColumnItems)
  const rightItems = getValidRichSectionColumnItems(block.rightColumnItems)
  const columns = [
    {
      key: 'left' as const,
      heading: leftColumnHeading,
      items: leftItems,
      variant: 'left' as const,
    },
    {
      key: 'right' as const,
      heading: rightColumnHeading,
      items: rightItems,
      variant: 'right' as const,
    },
  ].filter((column) => column.heading || column.items.length > 0)

  if (columns.length === 0) return null

  const gridClass =
    columns.length > 1
      ? 'grid gap-5 md:grid-cols-2 md:gap-6 lg:gap-8'
      : 'mx-auto max-w-3xl'

  return (
    <div className="mx-auto max-w-5xl">
      <div className={gridClass}>
        {columns.map((column) => (
          <RichSectionTwoColumnPanel
            key={column.key}
            heading={column.heading}
            items={column.items}
            variant={column.variant}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )
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
  const layout = normalizeRichSectionLayout(block.layout)
  const variant = block.backgroundVariant ?? 'white'
  const theme = getSharedBackgroundTheme(variant)
  const mediaItems = getValidRichSectionMediaItems(block.mediaItems)
  const mediaTopAccentTitle = block.mediaTopAccentTitle?.trim()
  const hasMedia = mediaItems.length > 0
  const hasTwoColumnMode = useTwoColumnContent(block)
  const hasCenteredSplitHeader = centerHeaderInSplitLayout(block)
  const hasBody = hasTwoColumnMode ? false : Boolean(block.body?.length)
  const hasSubtitle = Boolean(block.subtitle?.trim())
  const centeredCaptionClassName = `mt-1.5 text-center text-[1.08rem] font-medium leading-6 md:mt-2 md:text-[1.16rem] md:leading-7 ${theme.body}`
  const centeredDescriptionClassName = `text-center text-sm leading-6 md:text-[0.95rem] md:leading-7 ${theme.subtitle}`
  const centeredDescriptionSpacingClassName = '-mt-0.5 md:-mt-1'

  if (!hasRichSectionContent(block)) return null

  const layoutClass = 'grid items-start gap-14 lg:grid-cols-2 lg:gap-16'

  const textOrderClass =
    layout === 'mediaLeftTextRight' ? 'lg:order-2' : 'lg:order-1'
  const mediaOrderClass =
    layout === 'mediaLeftTextRight' ? 'lg:order-1' : 'lg:order-2'
  const bodyClass = trimTrailingContentSpacing
    ? 'max-w-[36rem] [&_blockquote:last-child]:mb-0 [&_h2:last-child]:mb-0 [&_h3:last-child]:mb-0 [&_ol:last-child]:mb-0 [&_p:last-child]:mb-0 [&_ul:last-child]:mb-0'
    : 'max-w-[36rem]'

  if (layout === 'centeredMediaGridBodyBelow') {
    const centeredBodyClass = trimTrailingContentSpacing
      ? 'mx-auto max-w-5xl [&_blockquote:last-child]:mb-0 [&_h2:last-child]:mb-0 [&_h3:last-child]:mb-0 [&_ol:last-child]:mb-0 [&_p:last-child]:mb-0 [&_ul:last-child]:mb-0'
      : 'mx-auto max-w-5xl'

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(block.heading || hasSubtitle) && (
          <SectionHeader
            title={block.heading}
            subtitle={hasSubtitle ? block.subtitle : undefined}
            tone="light"
            align="center"
            className="mx-auto mb-10 max-w-4xl md:mb-12"
            titleClassName={theme.heading}
            subtitleClassName={`mx-auto max-w-3xl font-normal ${sectionSubtitleClass} ${theme.subtitle}`}
          />
        )}

        <div className="space-y-10 md:space-y-12">
          {hasMedia && (
            <div className="mx-auto max-w-5xl">
              <AccentTitle title={mediaTopAccentTitle} className="mb-6 max-w-[20rem] md:mb-7" />
              <RichSectionMediaGrid
                items={mediaItems}
                title={block.heading}
                theme={theme}
                showDescription
                captionClassName={centeredCaptionClassName}
                descriptionClassName={centeredDescriptionClassName}
                descriptionSpacingClassName={centeredDescriptionSpacingClassName}
                disableMediaFrameEffect={block.disableMediaFrameEffect}
              />
            </div>
          )}

          {hasTwoColumnMode ? (
            <RichSectionTwoColumnContent block={block} theme={theme} />
          ) : hasBody ? (
            <div className={centeredBodyClass}>
              <PortableText
                value={block.body as PortableTextBlock[]}
                components={getPortableTextComponents(theme)}
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {hasCenteredSplitHeader && (block.heading || hasSubtitle) && (
        <SectionHeader
          title={block.heading}
          subtitle={hasSubtitle ? block.subtitle : undefined}
          tone="light"
          align="center"
          className="mx-auto mb-10 max-w-4xl md:mb-12"
          titleClassName={theme.heading}
          subtitleClassName={`mx-auto max-w-3xl font-normal ${sectionSubtitleClass} ${theme.subtitle}`}
        />
      )}

      <div className={layoutClass}>
        <div className={`${textOrderClass} min-w-0 max-w-[36rem]`}>
          {!hasCenteredSplitHeader && (block.heading || hasSubtitle) && (
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
            <AccentTitle title={mediaTopAccentTitle} className="mb-6 max-w-[20rem] md:mb-7" />
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

export default function RichSectionBlock({block}: RichSectionBlockProps) {
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

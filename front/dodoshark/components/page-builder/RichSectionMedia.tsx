import Image from 'next/image'

import { urlFor } from '@/app/lib/sanity'

import {
  getSharedSurfaceClasses,
  type SharedBackgroundTheme,
} from './backgroundTheme'

export type RichSectionImage = {
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
  description?: string
}

export function hasRichSectionImageIdentity(image?: RichSectionImage) {
  const ref = image?.asset?._ref?.trim()
  const id = image?.asset?._id?.trim()
  const url = image?.asset?.url?.trim()

  return Boolean(ref || id || url)
}

export function getValidRichSectionMediaItems(items?: RichSectionMediaItem[]) {
  return (items ?? []).filter((item) => hasRichSectionImageIdentity(item.image))
}

function resolveRichSectionMediaSrc(item?: RichSectionMediaItem) {
  if (!item?.image) return undefined

  const directUrl = item.image.asset?.url?.trim()
  if (directUrl) return directUrl

  if (!hasRichSectionImageIdentity(item.image)) return undefined

  try {
    return urlFor(item.image).width(1400).fit('max').url()
  } catch {
    return undefined
  }
}

export function RichSectionMediaFigure({
  item,
  title,
  theme,
  disableMediaFrameEffect = false,
}: {
  item: RichSectionMediaItem
  title?: string
  theme: SharedBackgroundTheme
  disableMediaFrameEffect?: boolean
}) {
  const src = resolveRichSectionMediaSrc(item)
  if (!src || !item.image?.asset) {
    const fallbackClass = disableMediaFrameEffect
      ? `w-full aspect-[4/3] ${getSharedSurfaceClasses(theme, 'muted')}`
      : `w-full aspect-[4/3] rounded-lg ${getSharedSurfaceClasses(theme, 'muted')}`
    return <div className={fallbackClass} />
  }

  const width = item.image.asset.metadata?.dimensions?.width ?? 1200
  const height = item.image.asset.metadata?.dimensions?.height ?? 900
  const hasLqip = Boolean(item.image.asset.metadata?.lqip)
  const alt = item.alt?.trim() || item.caption?.trim() || title || 'Section media'
  const frameClass = disableMediaFrameEffect
    ? 'relative overflow-hidden'
    : `relative overflow-hidden rounded-lg ${getSharedSurfaceClasses(theme, 'elevated')}`

  return (
    <div className={frameClass}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
        placeholder={hasLqip ? 'blur' : 'empty'}
        blurDataURL={item.image.asset.metadata?.lqip}
      />
    </div>
  )
}

export function RichSectionMediaCard({
  item,
  title,
  theme,
  showDescription = false,
  captionClassName,
  descriptionClassName,
  descriptionSpacingClassName,
  disableMediaFrameEffect = false,
}: {
  item: RichSectionMediaItem
  title?: string
  theme: SharedBackgroundTheme
  showDescription?: boolean
  captionClassName?: string
  descriptionClassName?: string
  descriptionSpacingClassName?: string
  disableMediaFrameEffect?: boolean
}) {
  const caption = item.caption?.trim()
  const description = showDescription ? item.description?.trim() : undefined

  return (
    <article className="min-w-0">
      <RichSectionMediaFigure
        item={item}
        title={title}
        theme={theme}
        disableMediaFrameEffect={disableMediaFrameEffect}
      />
      {caption ? (
        <p
          className={
            captionClassName ??
            `mt-3 text-center text-sm leading-6 md:text-[0.95rem] ${theme.subtitle}`
          }
        >
          {caption}
        </p>
      ) : null}
      {description ? (
        <p
          className={`whitespace-pre-line ${
            descriptionSpacingClassName ?? (caption ? 'mt-1.5 md:mt-2' : 'mt-3 md:mt-4')
          } ${descriptionClassName ?? `text-center text-sm leading-6 md:text-[0.95rem] ${theme.subtitle}`}`}
        >
          {description}
        </p>
      ) : null}
    </article>
  )
}

export function RichSectionMediaGrid({
  items,
  title,
  theme,
  showDescription = false,
  captionClassName,
  descriptionClassName,
  descriptionSpacingClassName,
  disableMediaFrameEffect = false,
}: {
  items: RichSectionMediaItem[]
  title?: string
  theme: SharedBackgroundTheme
  showDescription?: boolean
  captionClassName?: string
  descriptionClassName?: string
  descriptionSpacingClassName?: string
  disableMediaFrameEffect?: boolean
}) {
  if (items.length === 0) return null

  if (items.length === 1) {
    const item = items[0]

    return (
      <div className="mx-auto w-full max-w-full md:max-w-[32rem] lg:max-w-[34rem]">
        <RichSectionMediaCard
          item={item}
          title={title}
          theme={theme}
          showDescription={showDescription}
          captionClassName={captionClassName}
          descriptionClassName={descriptionClassName}
          descriptionSpacingClassName={descriptionSpacingClassName}
          disableMediaFrameEffect={disableMediaFrameEffect}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {items.map((item, index) => {
        return (
          <RichSectionMediaCard
            key={item._key ?? `rich-section-media-grid-${index}`}
            item={item}
            title={title}
            theme={theme}
            showDescription={showDescription}
            captionClassName={captionClassName}
            descriptionClassName={descriptionClassName}
            descriptionSpacingClassName={descriptionSpacingClassName}
            disableMediaFrameEffect={disableMediaFrameEffect}
          />
        )
      })}
    </div>
  )
}

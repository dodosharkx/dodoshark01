import Image from 'next/image'

import {urlFor} from '@/app/lib/sanity'

import AccentTitle from './AccentTitle'
import FeatureListBlockCarousel from './FeatureListBlockCarousel'
import {
  getSharedBackgroundTheme,
  mapFeatureBackgroundStyleToVariant,
  type FeatureListBackgroundStyle,
  type SharedBackgroundTheme,
} from './backgroundTheme'
import {type FeatureListImage, type FeatureListItem} from './FeatureListBlockCard'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import {bodyTextClass, cardTitleClass} from './sectionStyles'

export type FeatureListBlockData = {
  _type: 'featureListBlock'
  _key?: string
  title?: string
  topAccentTitle?: string
  mergeWithPreviousRichSection?: boolean
  backgroundStyle?: FeatureListBackgroundStyle
  items?: FeatureListItem[]
}

export function hasFeatureListContent(
  block: FeatureListBlockData,
  showHeader = true,
) {
  const hasHeader =
    showHeader &&
    block.mergeWithPreviousRichSection !== true &&
    Boolean(block.title?.trim())
  const items = (block.items ?? []).filter((item) => item?.title)

  return hasHeader || items.length > 0
}

function hasImageIdentity(image?: FeatureListImage) {
  const ref = image?.asset?._ref?.trim()
  const id = image?.asset?._id?.trim()
  const url = image?.asset?.url?.trim()

  return Boolean(ref || id || url)
}

function resolveFeatureMedia(item: FeatureListItem) {
  if (hasImageIdentity(item.image)) {
    return {image: item.image, isIconFallback: false}
  }

  if (hasImageIdentity(item.icon)) {
    return {image: item.icon, isIconFallback: true}
  }

  return {image: item.image ?? item.icon, isIconFallback: false}
}

function resolveImageSrc(
  image?: FeatureListImage,
  options: {width?: number; height?: number; fit?: 'crop' | 'max'} = {},
) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl
  if (!hasImageIdentity(image)) return undefined

  try {
    let builder = urlFor(image).width(options.width ?? 240)

    if (options.height) {
      builder = builder.height(options.height)
    }

    return builder.fit(options.fit ?? 'crop').url()
  } catch {
    return undefined
  }
}

function FeatureMedia({
  item,
  theme,
}: {
  item: FeatureListItem
  theme: SharedBackgroundTheme
}) {
  const {image: media, isIconFallback} = resolveFeatureMedia(item)
  if (!media) return null

  const mediaSrc = resolveImageSrc(
    media,
    isIconFallback
      ? {width: 160, height: 160, fit: 'max'}
      : {width: 240, height: 240, fit: 'crop'},
  )
  if (!mediaSrc) return null

  const containerClass = isIconFallback
    ? `relative mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl md:mb-5 md:h-20 md:w-20 ${theme.surfaceMuted}`
    : 'relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-xl bg-white md:mb-5 md:h-20 md:w-20'
  const imageClass = isIconFallback
    ? 'h-full w-full object-contain p-3 md:p-3.5'
    : 'h-full w-full object-cover'

  return (
    <div className={containerClass}>
      <Image
        src={mediaSrc}
        alt={media.alt || item.title || 'Feature media'}
        fill
        sizes="(min-width: 768px) 80px, 64px"
        className={imageClass}
      />
    </div>
  )
}

type FeatureListBlockProps = {
  block: FeatureListBlockData
}

type FeatureListBlockContentProps = {
  block: FeatureListBlockData
  showHeader?: boolean
  renderMode?: 'default' | 'mergedCards' | 'mergedCarousel'
}

export function FeatureListBlockContent({
  block,
  showHeader = true,
  renderMode = 'default',
}: FeatureListBlockContentProps) {
  const items = (block.items ?? []).filter((item) => item?.title)
  const topAccentTitle = block.topAccentTitle?.trim()
  const backgroundStyle = block.backgroundStyle ?? 'white'
  const backgroundVariant = mapFeatureBackgroundStyleToVariant(backgroundStyle)
  const theme = getSharedBackgroundTheme(backgroundVariant)
  const hasHeader =
    showHeader &&
    block.mergeWithPreviousRichSection !== true &&
    Boolean(block.title?.trim())
  const isMergedCards = renderMode === 'mergedCards'
  const useCarousel = renderMode === 'default' || renderMode === 'mergedCarousel'

  if (!hasFeatureListContent(block, showHeader)) return null

  const titleClass = theme.heading
  const itemTitleClass = 'text-gray-900'
  const itemDescriptionClass = theme.body
  const mergedCardClass = `h-full rounded-xl px-4 py-6 text-center sm:px-6 ${theme.surfaceElevated}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {hasHeader && (
        <SectionHeader
          title={block.title}
          tone="light"
          className="mx-auto mb-10 max-w-[36rem] md:mb-12"
          titleClassName={titleClass}
        />
      )}

      <AccentTitle title={topAccentTitle} className="mb-6 max-w-[20rem] md:mb-7" />

      {isMergedCards ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] sm:gap-6 lg:gap-7">
          {items.map((item, index) => {
            const isLastOddMobileItem =
              items.length % 2 === 1 && index === items.length - 1
            const wrapperClass = isLastOddMobileItem
              ? 'col-span-2 mx-auto w-full max-w-[15rem] sm:col-span-1 sm:max-w-none'
              : 'min-w-0'

            return (
              <div
                key={item._key ?? `${item.title}-${index}`}
                className={`${wrapperClass} flex h-full flex-col`}
              >
                <article className={`${mergedCardClass} flex min-h-0 flex-1 flex-col`}>
                  <FeatureMedia item={item} theme={theme} />
                  <h3
                    className={`mx-auto mb-3 max-w-[14ch] whitespace-pre-line ${cardTitleClass} ${itemTitleClass}`}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className={`mx-auto max-w-[24ch] whitespace-pre-line font-normal ${bodyTextClass} ${itemDescriptionClass}`}
                    >
                      {item.description}
                    </p>
                  )}
                </article>
              </div>
            )
          })}
        </div>
      ) : useCarousel ? (
        <FeatureListBlockCarousel
          items={items}
          theme={theme}
          showMobileArrows={renderMode === 'mergedCarousel'}
        />
      ) : null
      }
    </div>
  )
}

export default function FeatureListBlock({ block }: FeatureListBlockProps) {
  if (!hasFeatureListContent(block)) return null

  const backgroundStyle = block.backgroundStyle ?? 'white'
  const backgroundVariant = mapFeatureBackgroundStyleToVariant(backgroundStyle)
  const theme = getSharedBackgroundTheme(backgroundVariant)

  return (
    <SectionShell spacing="compact" sectionClassName={theme.section}>
      <FeatureListBlockContent block={block} />
    </SectionShell>
  )
}

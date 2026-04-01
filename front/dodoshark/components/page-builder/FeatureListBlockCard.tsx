import Image from 'next/image'

import {urlFor} from '@/lib/sanity'
import { sanitizeAltText } from '@/lib/sanity-utils'
import Icon from '@/components/ui/Icon'

import type {SharedBackgroundTheme} from './backgroundTheme'
import {bodyTextClass, cardTitleClass} from './sectionStyles'

export type FeatureListImage = {
  alt?: string
  asset?: {
    _id?: string
    _ref?: string
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

export type FeatureListItem = {
  _key?: string
  title?: string
  description?: string
  icon?: FeatureListImage
  image?: FeatureListImage
}

function hasImageIdentity(image?: FeatureListImage) {
  const ref = image?.asset?._ref?.trim()
  const id = image?.asset?._id?.trim()
  const url = image?.asset?.url?.trim()

  return Boolean(ref || id || url)
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
    let builder = urlFor(image).width(options.width ?? 1200)

    if (options.height) {
      builder = builder.height(options.height)
    }

    return builder.fit(options.fit ?? 'crop').url()
  } catch {
    return undefined
  }
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

export function FeatureListStandaloneCard({
  item,
  theme,
  sizes,
}: {
  item: FeatureListItem
  theme: SharedBackgroundTheme
  sizes: string
}) {
  const {image, isIconFallback} = resolveFeatureMedia(item)
  const imageSrc = resolveImageSrc(
    image,
    isIconFallback
      ? {width: 960, height: 720, fit: 'max'}
      : {width: 1200, height: 960, fit: 'crop'},
  )
  const blurDataURL = image?.asset?.metadata?.lqip
  const hasLqip = Boolean(blurDataURL)
  const hasFilledImage = Boolean(imageSrc && !isIconFallback)
  const mediaFrameClass = hasFilledImage ? 'bg-white' : theme.surfaceMuted
  const imageClass = isIconFallback
    ? 'h-full w-full object-contain p-7 md:p-8'
    : 'h-full w-full object-cover'
  const placeholderClass = theme.subtitle
  const frameClass = theme.surfaceElevated
  const contentClass = 'bg-white/95 text-slate-900'
  const descriptionClass = 'text-slate-700'

  return (
    <article className={`flex min-h-0 h-full flex-col overflow-hidden rounded-2xl ${frameClass}`}>
      <div className={`relative aspect-[5/4] overflow-hidden ${mediaFrameClass}`}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={sanitizeAltText(image?.alt, item.title) || 'Feature image'}
            fill
            sizes={sizes}
            className={imageClass}
            placeholder={hasLqip ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${placeholderClass}`}>
            <Icon icon="image" className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col justify-start px-6 py-6 md:px-7 md:py-7 ${contentClass}`}>
        {item.title && (
          <h3 className={`mb-3 whitespace-pre-line ${cardTitleClass}`}>
            {item.title}
          </h3>
        )}
        {item.description && (
          <p className={`whitespace-pre-line ${bodyTextClass} ${descriptionClass}`}>
            {item.description}
          </p>
        )}
      </div>
    </article>
  )
}

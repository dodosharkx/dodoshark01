import Image from 'next/image'

import {urlFor} from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'

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
  isDarkSection = false,
  sizes,
}: {
  item: FeatureListItem
  isDarkSection?: boolean
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
  const mediaBackgroundClass = isDarkSection ? 'bg-slate-200/95' : 'bg-slate-100'
  const placeholderClass = isDarkSection ? 'text-slate-500' : 'text-slate-300'
  const frameClass = isDarkSection
    ? 'border border-white/10 bg-white/95 shadow-[0_24px_60px_-34px_rgba(2,8,23,0.85)]'
    : 'border border-slate-200/80 bg-white shadow-[0_24px_60px_-34px_rgba(15,23,42,0.3)]'

  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-[1.125rem] ${frameClass}`}>
      <div className={`relative aspect-[5/4] overflow-hidden ${mediaBackgroundClass}`}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={image?.alt || item.title || 'Feature image'}
            fill
            sizes={sizes}
            className={isIconFallback ? 'object-contain p-10' : 'object-cover'}
            placeholder={hasLqip ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${placeholderClass}`}>
            <Icon icon="image" className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-start bg-[#273577] px-6 py-6 text-white md:px-7 md:py-7">
        {item.title && (
          <h3 className={`mb-3 whitespace-pre-line ${cardTitleClass} text-white`}>
            {item.title}
          </h3>
        )}
        {item.description && (
          <p className={`whitespace-pre-line ${bodyTextClass} text-white/82`}>
            {item.description}
          </p>
        )}
      </div>
    </article>
  )
}

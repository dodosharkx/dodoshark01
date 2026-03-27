import type { SanityImage } from '@/app/lib/types/sanity'

import { urlFor } from '@/app/lib/sanity'

export type QueryParamValue = string | string[] | undefined

type ToImageSrcOptions = {
  height?: number
  fit?: 'crop' | 'max'
}

export function firstParam(value: QueryParamValue) {
  if (Array.isArray(value)) return value[0]
  return value
}

export function toImageSrc(image?: SanityImage, width = 1200, options?: ToImageSrcOptions) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl

  const hasIdentity = Boolean(image.asset?._id || image.asset?._ref)
  if (!hasIdentity) return undefined

  try {
    let imageBuilder = urlFor(image).width(width)
    if (options?.height) {
      imageBuilder = imageBuilder.height(options.height)
    }
    return imageBuilder.fit(options?.fit ?? 'max').url()
  } catch {
    return undefined
  }
}

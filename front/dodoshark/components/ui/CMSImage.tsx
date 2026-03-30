import Image from 'next/image'
import type { ComponentProps } from 'react'

import { renderText, toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityImage } from '@/app/lib/types/sanity'

type CMSImageProps = Omit<ComponentProps<typeof Image>, 'src' | 'alt'> & {
  image?: SanityImage
  alt?: string
  fallbackAlt?: string
  width?: number
  height?: number
  fill?: boolean
}

/**
 * A dedicated component for rendering Sanity images with automatic alt text resolution.
 * Per user request, it does not support hardcoded fallback src/alt attributes.
 */
export default function CMSImage({
  image,
  fallbackAlt = 'DoDoShark Image',
  width,
  height,
  fill,
  className,
  alt: altOverride,
  ...props
}: CMSImageProps) {
  const src = toImageSrc(image, width || 1200)
  const alt = altOverride || renderText(image?.alt) || fallbackAlt

  if (!src) return null

  return (
    <Image
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      className={className}
      {...props}
    />
  )
}

import Image from 'next/image'
import type { ComponentProps } from 'react'

import { sanitizeAltText, toImageSrc } from '@/lib/sanity-utils'
import type { SanityImage } from '@/lib/types/sanity'

type CMSImageProps = Omit<ComponentProps<typeof Image>, 'src' | 'alt'> & {
  image?: SanityImage
  alt?: string
  fallbackSrc?: string
  fallbackAlt?: string
  width?: number
  height?: number
  fill?: boolean
}

/**
 * A dedicated component for rendering Sanity images with automatic alt text resolution.
 * Supports hardcoded fallback src/alt attributes when Sanity image resolution fails.
 */
export default function CMSImage({
  image,
  fallbackSrc,
  fallbackAlt = 'DoDoShark Image',
  width,
  height,
  fill,
  className,
  alt: altOverride,
  ...props
}: CMSImageProps) {
  const src = toImageSrc(image, width || 1200)
  const alt = sanitizeAltText(altOverride, image?.alt, fallbackAlt) || 'DoDoShark Image'

  // If Sanity resolution fails but we have a fallback source, use it
  if (!src && fallbackSrc) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        className={className}
        {...props}
      />
    )
  }

  // If no source at all, return null
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

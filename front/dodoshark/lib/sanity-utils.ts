import {stegaClean} from 'next-sanity'

import type { SanityImage } from '@/lib/types/sanity'

import { urlFor } from '@/lib/sanity'

export type QueryParamValue = string | string[] | undefined

type ToImageSrcOptions = {
  height?: number
  fit?: 'crop' | 'max'
}

const ZERO_WIDTH_TEXT_PATTERN = /[\u200B\u200C\u200D\uFEFF]/g
let hasWarnedAboutZeroWidthAltText = false

export function firstParam(value: QueryParamValue) {
  if (Array.isArray(value)) return value[0]
  return value
}

export function cleanText(value?: string | null) {
  if (typeof value !== 'string') return undefined
  if (value.trim() === '') return undefined

  try {
    const cleaned = stegaClean(value)?.replace(ZERO_WIDTH_TEXT_PATTERN, '').trim()
    return cleaned || undefined
  } catch {
    const trimmed = value.replace(ZERO_WIDTH_TEXT_PATTERN, '').trim()
    return trimmed || undefined
  }
}

function describeZeroWidthCodePoints(value: string) {
  const codePoints = new Set(
    Array.from(value.matchAll(ZERO_WIDTH_TEXT_PATTERN), ([char]) => `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`),
  )

  return Array.from(codePoints)
}

function cleanAltCandidate(value: string) {
  try {
    return stegaClean(value)
  } catch {
    return value
  }
}

export function sanitizeAltText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value !== 'string') continue

    const cleanedValue = cleanAltCandidate(value)
    const zeroWidthMatches = describeZeroWidthCodePoints(cleanedValue)
    const sanitized = cleanedValue.replace(ZERO_WIDTH_TEXT_PATTERN, '').trim()

    if (!hasWarnedAboutZeroWidthAltText && zeroWidthMatches.length > 0 && process.env.NODE_ENV !== 'production') {
      hasWarnedAboutZeroWidthAltText = true
      console.warn(`[sanity-utils] Removed zero-width characters from image alt text: ${zeroWidthMatches.join(', ')}`)
    }

    if (sanitized) return sanitized
  }

  return undefined
}

export function hasStegaMetadata(value?: string | null) {
  if (typeof value !== 'string' || value === '') return false

  try {
    return stegaClean(value) !== value
  } catch {
    return true
  }
}

export function renderText(value?: string | null) {
  if (typeof value !== 'string') return undefined
  if (value.trim() === '') return undefined
  return value
}

export function renderSentenceCase(value?: string | null) {
  const rendered = renderText(value)
  if (!rendered) return ''
  if (hasStegaMetadata(rendered)) return rendered

  const normalized = rendered.trim().replace(/\s+/g, ' ').toLowerCase()
  if (!normalized) return ''

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export function cleanSlug(value?: string | { current?: string } | null) {
  if (typeof value === 'string') return cleanText(value)
  return cleanText(value?.current)
}

export function hasText(value?: string | null) {
  return Boolean(cleanText(value))
}

export function hasRenderableText(value?: string | null) {
  return Boolean(renderText(value))
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

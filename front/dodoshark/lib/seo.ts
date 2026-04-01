import type { Metadata } from 'next'

import { cleanText, sanitizeAltText, toImageSrc } from '@/lib/sanity-utils'
import type { SeoMeta } from '@/lib/types/sanity'

type BuildPageMetadataOptions = {
  seo?: SeoMeta | null
  fallbackTitle: string
  fallbackDescription: string
}

function normalizeText(value?: string | null) {
  return cleanText(value)
}

function normalizeKeywords(keywords?: string[] | null) {
  const items = keywords
    ?.map((item) => cleanText(item))
    .filter((item): item is string => Boolean(item))
  return items?.length ? items : undefined
}

function toAbsoluteUrl(value?: string) {
  if (!value) return undefined
  return /^https?:\/\//i.test(value) ? value : undefined
}

export function buildPageMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
}: BuildPageMetadataOptions): Metadata {
  const title = normalizeText(seo?.title) || fallbackTitle
  const description = normalizeText(seo?.description) || fallbackDescription
  const canonical = toAbsoluteUrl(normalizeText(seo?.canonicalUrl))
  const ogImageUrl = toAbsoluteUrl(
    toImageSrc(seo?.ogImage, 1200, {
      height: 630,
      fit: 'crop',
    }),
  )
  const ogImages = ogImageUrl
    ? [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: sanitizeAltText(seo?.ogImage?.alt, title) || title,
        },
      ]
    : undefined

  return {
    title,
    description,
    keywords: normalizeKeywords(seo?.keywords),
    alternates: canonical ? { canonical } : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: ogImages,
    },
    twitter: {
      card: ogImages ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  }
}

export type SanityDimensions = {
  width?: number
  height?: number
}

export type SanityAssetMetadata = {
  lqip?: string
  dimensions?: SanityDimensions
}

export type SanityAsset = {
  _id?: string
  _ref?: string
  url?: string
  metadata?: SanityAssetMetadata
}

export type SanityImage = {
  _type?: string
  alt?: string
  asset?: SanityAsset
}

export type SeoMeta = {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
  ogImage?: SanityImage
}

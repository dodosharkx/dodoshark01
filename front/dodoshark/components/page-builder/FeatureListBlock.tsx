import Image from 'next/image'

import { urlFor } from '@/app/lib/sanity'
import {
  getSharedBackgroundTheme,
  mapFeatureBackgroundStyleToVariant,
} from './backgroundTheme'
import SectionHeader from './SectionHeader'

type FeatureIconImage = {
  alt?: string
  asset?: {
    _id?: string
    url?: string
  }
}

type FeatureListItem = {
  _key?: string
  title?: string
  description?: string
  icon?: FeatureIconImage
}

export type FeatureListBlockData = {
  _type: 'featureListBlock'
  _key?: string
  title?: string
  mergeWithPreviousRichSection?: boolean
  backgroundStyle?: 'white' | 'lightGray' | 'darkGray'
  items?: FeatureListItem[]
}

export function hasFeatureListContent(
  block: FeatureListBlockData,
  showHeader = true,
) {
  const hasHeader = showHeader && Boolean(block.title?.trim())
  const items = (block.items ?? []).filter((item) => item?.title)

  return hasHeader || items.length > 0
}

function FeatureMedia({ item }: { item: FeatureListItem }) {
  const media = item.icon
  if (!media?.asset) return null

  return (
    <div className="relative mx-auto mb-4 h-16 w-16 md:h-20 md:w-20">
      <Image
        src={urlFor(media).width(160).height(160).fit('max').url()}
        alt={media.alt || item.title || 'Feature media'}
        fill
        sizes="(min-width: 768px) 80px, 64px"
        className="object-contain"
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
}

export function FeatureListBlockContent({
  block,
  showHeader = true,
}: FeatureListBlockContentProps) {
  const items = (block.items ?? []).filter((item) => item?.title)
  const backgroundStyle = block.backgroundStyle ?? 'white'
  const backgroundVariant = mapFeatureBackgroundStyleToVariant(backgroundStyle)
  const theme = getSharedBackgroundTheme(backgroundVariant)
  const isDark = backgroundVariant === 'dark'
  const hasHeader = showHeader && Boolean(block.title?.trim())

  if (!hasFeatureListContent(block, showHeader)) return null

  const titleClass = theme.heading
  const itemTitleClass = isDark ? 'text-blue-300' : 'text-blue-600'
  const itemDescriptionClass = theme.body

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {hasHeader && (
        <SectionHeader
          title={block.title}
          isDark={isDark}
          className="mx-auto mb-10 max-w-[36rem]"
          titleClassName={`text-3xl font-display font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[2.5rem] ${titleClass}`}
        />
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] sm:gap-x-6 sm:gap-y-10">
        {items.map((item, index) => (
          <article
            key={item._key ?? `${item.title}-${index}`}
            className="mx-auto flex max-w-[10rem] flex-col items-center text-center sm:max-w-[13rem]"
          >
            <FeatureMedia item={item} />
            <h3
              className={`mb-3 max-w-[12ch] whitespace-pre-line text-lg font-display font-extrabold leading-[1.15] tracking-[-0.02em] md:text-xl ${itemTitleClass}`}
            >
              {item.title}
            </h3>
            {item.description && (
              <p
                className={`mx-auto max-w-[17ch] whitespace-pre-line text-sm font-normal leading-5 md:text-[0.95rem] md:leading-7 ${itemDescriptionClass}`}
              >
                {item.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export default function FeatureListBlock({ block }: FeatureListBlockProps) {
  if (!hasFeatureListContent(block)) return null

  const backgroundStyle = block.backgroundStyle ?? 'white'
  const backgroundVariant = mapFeatureBackgroundStyleToVariant(backgroundStyle)
  const theme = getSharedBackgroundTheme(backgroundVariant)

  return (
    <section className={`py-16 md:py-20 ${theme.section}`}>
      <FeatureListBlockContent block={block} />
    </section>
  )
}

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

function FeatureMedia({ item }: { item: FeatureListItem }) {
  const media = item.icon
  if (!media?.asset) return null

  return (
    <div className="relative mx-auto mb-5 h-24 w-24">
      <Image
        src={urlFor(media).width(160).height(160).fit('max').url()}
        alt={media.alt || item.title || 'Feature media'}
        fill
        sizes="96px"
        className="object-contain"
      />
    </div>
  )
}

type FeatureListBlockProps = {
  block: FeatureListBlockData
  seamlessFromPrev?: boolean
}

export default function FeatureListBlock({
  block,
  seamlessFromPrev = false,
}: FeatureListBlockProps) {
  const items = (block.items ?? []).filter((item) => item?.title)
  const backgroundStyle = block.backgroundStyle ?? 'white'
  const backgroundVariant = mapFeatureBackgroundStyleToVariant(backgroundStyle)
  const theme = getSharedBackgroundTheme(backgroundVariant)
  const isDark = backgroundVariant === 'dark'
  const hasHeader = Boolean(block.title?.trim())

  if (!hasHeader && items.length === 0) return null

  const titleClass = theme.heading
  const itemTitleClass = theme.heading
  const itemDescriptionClass = theme.body
  const sectionSpacingClass =
    seamlessFromPrev && !hasHeader ? '-mt-4 pt-0 pb-14 md:-mt-6 md:pb-16' : 'py-16 md:py-20'

  return (
    <section className={`${sectionSpacingClass} ${theme.section}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasHeader && (
          <SectionHeader
            title={block.title}
            isDark={isDark}
            className="mx-auto mb-10 max-w-[36rem]"
            titleClassName={`text-3xl font-display font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[2.5rem] ${titleClass}`}
          />
        )}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-8 gap-y-12">
          {items.map((item, index) => (
            <article
              key={item._key ?? `${item.title}-${index}`}
              className="mx-auto flex max-w-[16rem] flex-col items-center text-center"
            >
              <FeatureMedia item={item} />
              <h3
                className={`mb-4 max-w-[13ch] whitespace-pre-line text-[1.65rem] font-display font-extrabold leading-[1.08] tracking-[-0.02em] md:text-[1.75rem] ${itemTitleClass}`}
              >
                {item.title}
              </h3>
              {item.description && (
                <p
                  className={`mx-auto max-w-[19ch] whitespace-pre-line text-base font-normal leading-8 ${itemDescriptionClass}`}
                >
                  {item.description}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

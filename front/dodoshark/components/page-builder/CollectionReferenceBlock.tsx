import Image from 'next/image'
import Link from 'next/link'

import { urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'
import {
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import { cardTitleClass, sectionSubtitleClass } from './sectionStyles'

type SanityImage = {
  alt?: string
  asset?: {
    _id?: string
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

type ReferenceDoc = {
  _id?: string
  _type?: string
  title?: string
  name?: string
  modelName?: string
  slug?: { current?: string }
  shortDescription?: string
  description?: string
  excerpt?: string
  mainImage?: SanityImage
  image?: SanityImage
  coverImage?: SanityImage
  heroImage?: SanityImage
}

type ReferenceItem = {
  _key?: string
  labelOverride?: string
  isClickable?: boolean
  reference?: ReferenceDoc
}

export type CollectionReferenceBlockData = {
  _type: 'collectionReferenceBlock'
  _key?: string
  title?: string
  subtitle?: string
  backgroundVariant?: SharedBackgroundVariant
  layout?: 'grid' | 'list' | 'carousel'
  columns?: 2 | 3 | 4
  references?: ReferenceItem[]
}

function resolveTitle(item: ReferenceItem) {
  return (
    item.labelOverride ||
    item.reference?.title ||
    item.reference?.name ||
    item.reference?.modelName ||
    'Untitled Item'
  )
}

function resolveDescription(doc?: ReferenceDoc) {
  return doc?.shortDescription || doc?.description || doc?.excerpt || ''
}

function resolveImage(doc?: ReferenceDoc) {
  return doc?.mainImage || doc?.image || doc?.coverImage || doc?.heroImage
}

function resolveHref(doc?: ReferenceDoc) {
  const slug = doc?.slug?.current
  if (!slug) return undefined

  if (doc?._type === 'product') return `/products/${slug}`
  if (doc?._type === 'solution') return `/solutions/${slug}`
  if (doc?._type === 'post') return `/blog/${slug}`
  if (doc?._type === 'caseStudy') return `/cases/${slug}`
  return undefined
}

function ReferenceCard({
  item,
  theme,
}: {
  item: ReferenceItem
  theme: SharedBackgroundTheme
}) {
  const title = resolveTitle(item)
  const description = resolveDescription(item.reference)
  const image = resolveImage(item.reference)
  const href = item.isClickable === false ? undefined : resolveHref(item.reference)
  const content = (
    <article className={`h-full p-4 md:p-5 ${theme.surfaceElevated}`}>
      <div className="flex h-full flex-col items-center text-center">
        <div className="mb-4 aspect-square w-16 overflow-hidden rounded-lg sm:w-20 md:mb-5 md:w-full md:max-w-none md:aspect-[1/1]">
          {image?.asset ? (
            <Image
              src={urlFor(image).width(800).fit('max').url()}
              alt={image.alt || title}
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <h3 className={`mb-2 ${cardTitleClass} text-slate-900`}>{title}</h3>
        {description && (
          <p className="mb-4 max-w-[28ch] text-sm leading-7 text-slate-500 md:text-base">{description}</p>
        )}
        {href && (
          <span className="mt-auto inline-flex items-center justify-center text-sm font-bold text-orange-600">
            View Details <Icon icon="arrow-right" className="ms-1 inline h-4 w-4" />
          </span>
        )}
      </div>
    </article>
  )

  if (!href) return content

  return <Link href={href}>{content}</Link>
}

function columnsClass(columns?: number) {
  if (columns === 2) return 'grid-cols-2'
  if (columns === 4) return 'grid-cols-2 xl:grid-cols-4'
  return 'grid-cols-2 xl:grid-cols-3'
}

export default function CollectionReferenceBlock({
  block,
}: {
  block: CollectionReferenceBlockData
}) {
  const variant = block.backgroundVariant ?? 'lightGray'
  const theme = getSharedBackgroundTheme(variant)
  const layout = block.layout ?? 'grid'
  const refs = (block.references ?? []).filter((item) => item.reference)
  const sectionBorderClass = theme.sectionBorder
  const subtitleClass = theme.body

  if (!block.title && !block.subtitle && refs.length === 0) return null

  return (
    <SectionShell sectionClassName={`${theme.section} ${sectionBorderClass}`}>
      {(block.title || block.subtitle) && (
        <SectionHeader
          title={block.title}
          subtitle={block.subtitle}
          tone="light"
          className="mb-10 md:mb-12"
          titleClassName={theme.heading}
          subtitleClassName={`${subtitleClass} ${sectionSubtitleClass} mx-auto max-w-3xl`}
        />
      )}

      {layout === 'grid' && (
        <div className={`grid gap-4 md:gap-8 ${columnsClass(block.columns)}`}>
          {refs.map((item, idx) => (
            <ReferenceCard key={item._key ?? idx} item={item} theme={theme} />
          ))}
        </div>
      )}

      {layout === 'list' && (
        <div className="space-y-6">
          {refs.map((item, idx) => (
            <div key={item._key ?? idx} className="mx-auto max-w-5xl">
              <ReferenceCard item={item} theme={theme} />
            </div>
          ))}
        </div>
      )}

      {layout === 'carousel' && (
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
          {refs.map((item, idx) => (
            <div
              key={item._key ?? idx}
              className="max-w-[400px] min-w-[280px] snap-start md:min-w-[360px]"
            >
              <ReferenceCard item={item} theme={theme} />
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}

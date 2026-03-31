'use client'

import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {A11y, Keyboard} from 'swiper/modules'
import type {Swiper as SwiperInstance} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import type { SanityImage } from '@/app/lib/types/sanity'
import Icon from '@/components/ui/Icon'
import {
  defaultSliderControls,
  getEdgeAlignedNavButtonClass,
  getSliderControls,
  getSlidesPerGroup,
  SliderNavButton,
} from './PageBuilderSliderControls'
import {
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import { cardTitleClass, sectionSubtitleClass } from './sectionStyles'
import 'swiper/css'

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

type ReferenceCardVariant = 'default' | 'gridMobile'

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

const MAX_REFERENCE_ITEMS = 20

const carouselBreakpoints = {
  768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
  1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
  1280: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 24 },
} as const

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
  if (doc?._type === 'caseStudy') return `/cases/${slug}`
  return undefined
}

function ReferenceCard({
  item,
  theme,
  variant = 'default',
}: {
  item: ReferenceItem
  theme: SharedBackgroundTheme
  variant?: ReferenceCardVariant
}) {
  const title = resolveTitle(item)
  const description = resolveDescription(item.reference)
  const image = resolveImage(item.reference)
  const href = item.isClickable === false ? undefined : resolveHref(item.reference)
  const isGridMobile = variant === 'gridMobile'
  const articleClass = isGridMobile
    ? `h-full overflow-hidden rounded-2xl p-4 md:overflow-visible md:rounded-none md:p-5 ${theme.surfaceElevated}`
    : `h-full p-4 md:p-5 ${theme.surfaceElevated}`
  const mediaFrameClass = isGridMobile
    ? '-mx-4 -mt-4 mb-3 flex aspect-square w-[calc(100%+2rem)] items-center justify-center overflow-hidden border-b border-slate-100 bg-white/95 sm:mb-4 md:mx-0 md:mt-0 md:mb-5 md:w-full md:max-w-none md:aspect-[1/1] md:rounded-lg md:border-0 md:bg-transparent'
    : 'mb-4 aspect-square w-16 overflow-hidden rounded-lg sm:w-20 md:mb-5 md:w-full md:max-w-none md:aspect-[1/1]'
  const imageClass = isGridMobile
    ? 'h-full w-full object-contain p-1 sm:p-2 md:object-cover md:p-0'
    : 'h-full w-full object-cover'
  const titleClass = isGridMobile
    ? 'mb-1.5 line-clamp-3 text-base font-display font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900 sm:text-lg md:mb-2 md:line-clamp-none md:text-[1.375rem] md:leading-[1.15]'
    : `${cardTitleClass} mb-2 text-slate-900`
  const descriptionClass = isGridMobile
    ? 'hidden max-w-[28ch] text-sm leading-7 text-slate-500 md:mb-4 md:block md:text-base'
    : 'mb-4 max-w-[28ch] text-sm leading-7 text-slate-500 md:text-base'
  const ctaClass = isGridMobile
    ? 'mt-auto hidden items-center justify-center text-sm font-bold text-orange-600 md:inline-flex'
    : 'mt-auto inline-flex items-center justify-center text-sm font-bold text-orange-600'
  const imageSizes = isGridMobile
    ? '(max-width: 767px) calc((100vw - 2.75rem) / 2), (max-width: 1279px) calc((100vw - 5rem) / 2), (max-width: 1535px) calc((100vw - 6rem) / 3), 25vw'
    : '(max-width: 767px) 5rem, (max-width: 1279px) 50vw, 33vw'
  const content = (
    <article className={articleClass}>
      <div className="flex h-full flex-col items-center text-center">
        <div className={mediaFrameClass}>
          {image?.asset ? (
            <Image
              src={urlFor(image).width(800).fit('max').url()}
              alt={image.alt || title}
              width={800}
              height={800}
              sizes={imageSizes}
              className={imageClass}
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center ${theme.subtitle}`}>
              <Icon icon="image" className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          )}
        </div>

        <h3 className={titleClass}>{title}</h3>
        {description && (
          <p className={descriptionClass}>{description}</p>
        )}
        {href && (
          <span className={ctaClass}>
            View Details <Icon icon="arrow-right" className="ms-1 inline h-4 w-4" />
          </span>
        )}
      </div>
    </article>
  )

  if (!href) return content

  return <Link href={href} className="block h-full">{content}</Link>
}

function columnsClass(columns?: number) {
  if (columns === 2) return 'grid-cols-2'
  if (columns === 4) return 'grid-cols-2 xl:grid-cols-4'
  return 'grid-cols-2 xl:grid-cols-3'
}

function CollectionReferenceCarousel({
  items,
  theme,
}: {
  items: ReferenceItem[]
  theme: SharedBackgroundTheme
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [controls, setControls] = useState(defaultSliderControls)

  if (items.length === 0) return null

  return (
    <div className="group relative">
      <div className="relative overflow-x-hidden">
        {controls.hasOverflow && (
          <>
            <SliderNavButton
              direction="prev"
              disabled={!controls.canPrev}
              isDark={false}
              buttonClassName={`${theme.control} ${theme.controlHover}`}
              label="Previous collection references"
              onClick={() => swiper?.slidePrev()}
              className={getEdgeAlignedNavButtonClass('prev')}
            />

            <SliderNavButton
              direction="next"
              disabled={!controls.canNext}
              isDark={false}
              buttonClassName={`${theme.control} ${theme.controlHover}`}
              label="Next collection references"
              onClick={() => swiper?.slideNext()}
              className={getEdgeAlignedNavButtonClass('next')}
            />
          </>
        )}

        <Swiper
          modules={[A11y, Keyboard]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={16}
          speed={500}
          keyboard={{ enabled: true }}
          watchOverflow
          breakpoints={carouselBreakpoints}
          a11y={{
            slideLabelMessage: 'Collection reference {{index}}',
            prevSlideMessage: 'Previous collection references',
            nextSlideMessage: 'Next collection references',
          }}
          onSwiper={(instance) => {
            setSwiper(instance)
            setControls(getSliderControls(instance))
          }}
          onSlideChange={(instance) => setControls(getSliderControls(instance))}
          onResize={(instance) => setControls(getSliderControls(instance))}
          onBreakpoint={(instance) => setControls(getSliderControls(instance))}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={item._key ?? idx} className="!h-auto">
              <ReferenceCard item={item} theme={theme} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {controls.hasOverflow && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: controls.totalPages }, (_, index) => {
            const active = index === controls.currentPage

            return (
              <button
                key={`collection-reference-page-${index}`}
                type="button"
                aria-label={`Go to collection reference page ${index + 1}`}
                aria-pressed={active}
                onClick={() => {
                  if (!swiper || swiper.destroyed) return
                  swiper.slideTo(index * getSlidesPerGroup(swiper))
                }}
                className={`h-2.5 rounded-full transition-all ${
                  active ? `w-8 ${theme.dotActive}` : `w-2.5 ${theme.dotIdle}`
                }`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CollectionReferenceBlock({
  block,
}: {
  block: CollectionReferenceBlockData
}) {
  const variant = block.backgroundVariant ?? 'lightGray'
  const theme = getSharedBackgroundTheme(variant)
  const layout = block.layout ?? 'grid'
  const refs = (block.references ?? [])
    .filter((item) => item.reference)
    .slice(0, MAX_REFERENCE_ITEMS)
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
        <div className={`grid gap-3 sm:gap-4 md:gap-8 ${columnsClass(block.columns)}`}>
          {refs.map((item, idx) => (
            <ReferenceCard key={item._key ?? idx} item={item} theme={theme} variant="gridMobile" />
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
        <CollectionReferenceCarousel items={refs} theme={theme} />
      )}
    </SectionShell>
  )
}

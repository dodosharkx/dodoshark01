'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'
import { getSharedBackgroundTheme } from './backgroundTheme'
import SectionHeader from './SectionHeader'
import 'swiper/css'

type CardImage = {
  alt?: string
  asset?: {
    _id?: string
    url?: string
  }
}

type CardCta = {
  label?: string
  href?: string
}

type CardReference = {
  _type?: 'product' | 'solution' | 'caseStudy' | 'post' | string
  title?: string
  slug?: { current?: string }
  shortDescription?: string
  description?: string
  mainImage?: CardImage
  image?: CardImage
  cta?: CardCta
}

type CardItem = {
  _key?: string
  cardType?: 'reference' | 'inline'
  title?: string
  description?: string
  clickable?: boolean
  reference?: CardReference
  inlineCard?: {
    title?: string
    image?: CardImage
    description?: string
    cta?: CardCta
  }
}

type CardGroup = {
  _key?: string
  subtitle?: string
  cards?: CardItem[]
  groupTitle?: string
  groupSubtitle?: string
  topCards?: CardItem[]
  bottomCards?: CardItem[]
}

type SliderControls = {
  hasOverflow: boolean
  currentPage: number
  totalPages: number
}

const defaultSliderControls: SliderControls = {
  hasOverflow: false,
  currentPage: 0,
  totalPages: 1,
}

export type CardGridBlockData = {
  _type: 'cardGridBlock'
  _key?: string
  title?: string
  subtitle?: string
  backgroundVariant?: 'default' | 'muted' | 'dark'
  nestedCards?: CardItem[]
  nestedCardTitle?: string
  columns?: 2 | 3 | 4
  cards?: CardItem[]
  groups?: CardGroup[]
  disableCardFrameEffect?: boolean
}

const columnClassMap = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
} as const

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href)
}

function getSliderControls(instance: SwiperInstance): SliderControls {
  const hasOverflow = !instance.isLocked && instance.slides.length > 1
  const totalPages = Math.max(instance.snapGrid.length, 1)

  return {
    hasOverflow,
    currentPage: Math.min(instance.snapIndex, totalPages - 1),
    totalPages,
  }
}

function getReferenceHref(reference?: CardReference) {
  const slug = reference?.slug?.current?.trim()
  if (!slug) return ''

  if (reference?._type === 'product') return `/products/${slug}`
  if (reference?._type === 'solution') return `/solutions/${slug}`
  if (reference?._type === 'caseStudy') return `/cases/${slug}`
  if (reference?._type === 'post') return `/blog/${slug}`

  return `/${slug}`
}

function resolveCard(item: CardItem) {
  const title = item.title?.trim() || ''
  const description = item.description?.trim() || ''
  const clickable = item.clickable !== false

  if (item.cardType === 'inline') {
    const href = item.inlineCard?.cta?.href?.trim() || ''
    const legacyTitle = item.inlineCard?.title?.trim() || ''
    const legacyDescription = item.inlineCard?.description?.trim() || ''

    return {
      title: title || legacyTitle,
      description: description || legacyDescription,
      image: item.inlineCard?.image,
      ctaLabel: clickable ? item.inlineCard?.cta?.label?.trim() || '' : '',
      href: clickable ? href : '',
    }
  }

  const reference = item.reference
  const resolvedTitle = title || reference?.title?.trim() || ''
  const resolvedDescription =
    description ||
    reference?.shortDescription?.trim() ||
    reference?.description?.trim() ||
    ''
  const href = reference?.cta?.href?.trim() || getReferenceHref(reference)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    image: reference?.mainImage || reference?.image,
    ctaLabel: clickable ? reference?.cta?.label?.trim() || 'View Details' : '',
    href: clickable ? href : '',
  }
}

function CardLink({
  href,
  className,
  children,
}: {
  href: string
  className: string
  children: ReactNode
}) {
  if (!href) {
    return <span className={className}>{children}</span>
  }

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={className}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function GridCard({
  item,
  size,
  disableCardFrameEffect = false,
  isDarkBackground = false,
}: {
  item: CardItem
  size: 'large' | 'small'
  disableCardFrameEffect?: boolean
  isDarkBackground?: boolean
}) {
  const data = resolveCard(item)
  const hasContent = Boolean(data.title || data.description || data.image?.asset)
  if (!hasContent) return null

  const imageHeightClass = size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/3]'
  const titleClass = size === 'large' ? 'text-xl' : 'text-base'
  const textClass = size === 'large' ? 'text-sm' : 'text-xs'
  const ctaClass = size === 'large' ? 'text-sm' : 'text-xs'
  const titleTone = disableCardFrameEffect && isDarkBackground ? 'text-slate-100' : 'text-slate-900'
  const descriptionTone =
    disableCardFrameEffect && isDarkBackground ? 'text-slate-300' : 'text-slate-500'
  const ctaTone = disableCardFrameEffect && isDarkBackground ? 'text-orange-300' : 'text-orange-500'
  const articleClass = disableCardFrameEffect
    ? 'text-center'
    : 'overflow-hidden rounded-lg border border-slate-100 bg-white text-center transition-shadow hover:shadow-lg'
  const contentClass = size === 'large' ? 'p-6' : 'p-5'
  const imageBgClass = disableCardFrameEffect && isDarkBackground ? 'bg-slate-800' : 'bg-slate-100'
  const emptyImageClass = disableCardFrameEffect && isDarkBackground ? 'text-slate-500' : 'text-slate-300'

  return (
    <article className={articleClass}>
      <div className={`relative ${imageHeightClass} ${imageBgClass}`}>
        {data.image?.asset ? (
          <Image
            src={urlFor(data.image).width(900).height(700).fit('crop').url()}
            alt={data.image.alt || data.title || 'Card image'}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${emptyImageClass}`}>
            <Icon icon="image" className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className={contentClass}>
        {data.title && (
          <h3 className={`${titleClass} mb-2 font-display font-black ${titleTone}`}>
            {data.title}
          </h3>
        )}
        {data.description && (
          <p className={`${textClass} mb-4 leading-relaxed ${descriptionTone}`}>
            {data.description}
          </p>
        )}
        {data.ctaLabel && (
          <CardLink
            href={data.href}
            className={`${ctaClass} inline-flex items-center justify-center gap-2 font-bold ${ctaTone}`}
          >
            {data.ctaLabel}
            <Icon icon="arrow-right" className="h-4 w-4" />
          </CardLink>
        )}
      </div>
    </article>
  )
}

function MobileCarouselCard({
  item,
  isDarkBackground = false,
  disableCardFrameEffect = false,
  showControls = false,
  controls,
  onSelectPage,
}: {
  item: CardItem
  isDarkBackground?: boolean
  disableCardFrameEffect?: boolean
  showControls?: boolean
  controls: SliderControls
  onSelectPage: (index: number) => void
}) {
  const data = resolveCard(item)
  const hasContent = Boolean(data.title || data.description || data.image?.asset)
  if (!hasContent) return null

  const titleTone = disableCardFrameEffect && isDarkBackground ? 'text-slate-100' : 'text-slate-900'
  const descriptionTone =
    disableCardFrameEffect && isDarkBackground ? 'text-slate-300' : 'text-slate-500'
  const ctaTone = disableCardFrameEffect && isDarkBackground ? 'text-orange-300' : 'text-orange-500'
  const articleClass = disableCardFrameEffect
    ? 'text-center'
    : 'overflow-hidden rounded-lg border border-slate-100 bg-white text-center shadow-sm'
  const imageBgClass = disableCardFrameEffect && isDarkBackground ? 'bg-slate-800' : 'bg-slate-100'
  const emptyImageClass = disableCardFrameEffect && isDarkBackground ? 'text-slate-500' : 'text-slate-300'
  const dotsBaseClass = isDarkBackground ? 'bg-slate-500/50' : 'bg-slate-300'
  const dotsActiveClass = isDarkBackground ? 'bg-orange-300' : 'bg-orange-500'

  return (
    <article className={articleClass}>
      <div className={`relative aspect-[16/10] ${imageBgClass}`}>
        {data.image?.asset ? (
          <Image
            src={urlFor(data.image).width(900).height(700).fit('crop').url()}
            alt={data.image.alt || data.title || 'Card image'}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${emptyImageClass}`}>
            <Icon icon="image" className="h-8 w-8" />
          </div>
        )}

      </div>

      {showControls && (
        <div className="flex items-center justify-center px-5 py-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: controls.totalPages }, (_, index) => {
              const active = index === controls.currentPage

              return (
                <button
                  key={`card-page-${index}`}
                  type="button"
                  aria-label={`Go to card page ${index + 1}`}
                  aria-pressed={active}
                  onClick={() => onSelectPage(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    active ? `w-8 ${dotsActiveClass}` : `w-2.5 ${dotsBaseClass}`
                  }`}
                />
              )
            })}
          </div>
        </div>
      )}

      <div className="p-6">
        {data.title && (
          <h3 className={`mb-2 text-xl font-display font-black ${titleTone}`}>
            {data.title}
          </h3>
        )}
        {data.description && (
          <p className={`mb-4 text-sm leading-relaxed ${descriptionTone}`}>
            {data.description}
          </p>
        )}
        {data.ctaLabel && (
          <CardLink
            href={data.href}
            className={`inline-flex items-center justify-center gap-2 text-sm font-bold ${ctaTone}`}
          >
            {data.ctaLabel}
            <Icon icon="arrow-right" className="h-4 w-4" />
          </CardLink>
        )}
      </div>
    </article>
  )
}

function SectionTitle({
  title,
  isDarkBackground = false,
}: {
  title?: string
  isDarkBackground?: boolean
}) {
  if (!title) return null

  const separatorClass = isDarkBackground ? 'bg-slate-600' : 'bg-slate-400/70'
  const titleClass = isDarkBackground ? 'text-slate-100' : 'text-slate-800'

  return (
    <header className="mb-10 text-center">
      <div className="flex items-center gap-6">
        <span className={`h-px flex-1 ${separatorClass}`} />
        <h3 className={`text-3xl font-display font-black md:text-4xl ${titleClass}`}>
          {title}
        </h3>
        <span className={`h-px flex-1 ${separatorClass}`} />
      </div>
    </header>
  )
}

function GroupGrid({
  sectionTitle,
  cards,
  columns,
  disableCardFrameEffect,
  isDarkBackground,
}: {
  sectionTitle?: string
  cards: CardItem[]
  columns: 2 | 3 | 4
  disableCardFrameEffect?: boolean
  isDarkBackground?: boolean
}) {
  const [mobileSwiper, setMobileSwiper] = useState<SwiperInstance | null>(null)
  const [mobileControls, setMobileControls] = useState<SliderControls>(defaultSliderControls)

  const derivedColumns = cards.length <= 2 ? 2 : cards.length >= 4 ? 4 : 3
  const columnsToUse = derivedColumns || columns
  const desktopCardSize: 'large' | 'small' = columnsToUse <= 2 ? 'large' : 'small'

  if (cards.length === 0) return null

  return (
    <section className="py-8">
      <SectionTitle title={sectionTitle} isDarkBackground={isDarkBackground} />

      <div className="md:hidden">
        <Swiper
          key={`${sectionTitle ?? 'cards'}-${cards.length}`}
          modules={[Keyboard, A11y]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={16}
          speed={450}
          watchOverflow
          grabCursor
          keyboard={{ enabled: true }}
          a11y={{
            prevSlideMessage: 'Previous cards',
            nextSlideMessage: 'Next cards',
          }}
          onSwiper={(instance) => {
            setMobileSwiper(instance)
            setMobileControls(getSliderControls(instance))
          }}
          onSlideChange={(instance) => setMobileControls(getSliderControls(instance))}
          onResize={(instance) => setMobileControls(getSliderControls(instance))}
        >
          {cards.map((item, index) => (
            <SwiperSlide key={item._key ?? `group-card-mobile-${index}`} className="h-auto">
              <MobileCarouselCard
                item={item}
                disableCardFrameEffect={disableCardFrameEffect}
                isDarkBackground={isDarkBackground}
                showControls={mobileControls.hasOverflow}
                controls={mobileControls}
                onSelectPage={(pageIndex) => mobileSwiper?.slideTo(pageIndex)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={`hidden gap-6 md:grid ${columnClassMap[columnsToUse]}`}>
        {cards.map((item, index) => (
          <GridCard
            key={item._key ?? `group-card-${index}`}
            item={item}
            size={desktopCardSize}
            disableCardFrameEffect={disableCardFrameEffect}
            isDarkBackground={isDarkBackground}
          />
        ))}
      </div>
    </section>
  )
}

export default function CardGridBlock({ block }: { block: CardGridBlockData }) {
  const variant = block.backgroundVariant ?? 'muted'
  const theme = getSharedBackgroundTheme(variant)
  const isDarkBackground = variant === 'dark'
  const nestedCards = (block.nestedCards ?? []).filter(
    (item) => item?.cardType || item?.reference || item?.inlineCard,
  )
  const legacyGroupCards = (block.groups ?? []).flatMap((group) => {
    const groupCards = (group.cards ?? []).filter(
      (item) => item?.cardType || item?.reference || item?.inlineCard,
    )
    const fallbackTop = (group.topCards ?? []).filter(
      (item) => item?.cardType || item?.reference || item?.inlineCard,
    )
    const fallbackBottom = (group.bottomCards ?? []).filter(
      (item) => item?.cardType || item?.reference || item?.inlineCard,
    )
    return groupCards.length > 0 ? groupCards : [...fallbackTop, ...fallbackBottom]
  })
  const legacyCards = (block.cards ?? []).filter(
    (item) => item?.cardType || item?.reference || item?.inlineCard,
  )
  const mergedNestedCards = nestedCards.length > 0 ? nestedCards : legacyGroupCards
  const legacyColumns = block.columns ?? 3
  const disableCardFrameEffect = Boolean(block.disableCardFrameEffect)
  const cardsSectionTitle = block.subtitle?.trim() || undefined
  const nestedSectionTitle = block.nestedCardTitle?.trim() || undefined

  const hasNestedCards = mergedNestedCards.length > 0
  const hasLegacy = legacyCards.length > 0
  const headerSubtitle = hasLegacy ? undefined : block.subtitle
  const subtitleClass = isDarkBackground ? theme.subtitle : theme.body

  if (!block.title && !block.subtitle && !hasNestedCards && !hasLegacy) return null

  return (
    <section className={`py-24 ${theme.section}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(block.title || block.subtitle) && (
          <SectionHeader
            title={block.title}
            subtitle={headerSubtitle}
            isDark={isDarkBackground}
            className="mb-14"
            titleClassName={`text-3xl md:text-4xl font-display font-black tracking-tight ${theme.heading}`}
            subtitleClassName={`mx-auto mt-5 max-w-3xl text-base md:text-lg ${subtitleClass}`}
          />
        )}

        {hasLegacy && (
          <GroupGrid
            sectionTitle={cardsSectionTitle}
            cards={legacyCards}
            columns={legacyColumns}
            disableCardFrameEffect={disableCardFrameEffect}
            isDarkBackground={isDarkBackground}
          />
        )}

        {hasNestedCards && (
          <GroupGrid
            sectionTitle={nestedSectionTitle}
            cards={mergedNestedCards}
            columns={3}
            disableCardFrameEffect={disableCardFrameEffect}
            isDarkBackground={isDarkBackground}
          />
        )}
      </div>
    </section>
  )
}

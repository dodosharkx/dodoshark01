'use client'

import Image from 'next/image'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {useState} from 'react'
import {A11y, Keyboard} from 'swiper/modules'
import type {Swiper as SwiperInstance} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'

import {getSafeHref, isExternalHref} from '@/app/lib/safeHref'
import {urlFor} from '@/app/lib/sanity'
import {cleanSlug, cleanText, renderText} from '@/app/lib/sanity-utils'
import Icon from '@/components/ui/Icon'
import {
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import {
  defaultSliderControls,
  getEdgeAlignedNavButtonClass,
  getSliderControls,
  getSlidesPerGroup,
  SliderNavButton,
  type SliderControls,
} from './PageBuilderSliderControls'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import {bodyTextClass, cardTitleClass, sectionSubtitleClass} from './sectionStyles'
import 'swiper/css'

type CardImage = {
  alt?: string
  asset?: {
    _id?: string
    _ref?: string
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
  slug?: {current?: string}
  shortDescription?: string
  description?: string
  excerpt?: string
  mainImage?: CardImage
  image?: CardImage
  coverImage?: CardImage
  heroImage?: CardImage
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

type CardRow = {
  _key?: string
  title?: string
  cards?: CardItem[]
}

export type CardGridBlockData = {
  _type: 'cardGridBlock'
  _key?: string
  title?: string
  subtitle?: string
  backgroundVariant?: SharedBackgroundVariant
  enableBannerOverlap?: boolean
  bannerImage?: CardImage
  bannerOverlayColor?: string
  rows?: CardRow[]
  disableCardFrameEffect?: boolean
}

const staticColumnClassMap = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
} as const

const desktopCarouselBreakpoints = {
  768: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 24,
  },
  1024: {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 24,
  },
}

function resolveImageSrc(
  image?: CardImage,
  options: {width?: number; height?: number; fit?: 'crop' | 'max'} = {},
) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl

  const hasIdentity = Boolean(image.asset?._ref || image.asset?._id)
  if (!hasIdentity) return undefined

  try {
    let builder = urlFor(image).width(options.width ?? 900)

    if (options.height) {
      builder = builder.height(options.height)
    }

    return builder.fit(options.fit ?? 'crop').url()
  } catch {
    return undefined
  }
}

function getStaticDesktopColumns(count: number): 2 | 3 {
  return count <= 2 ? 2 : 3
}

function hasCardData(item?: CardItem) {
  return Boolean(item?.cardType || item?.reference || item?.inlineCard)
}

function getReferenceHref(reference?: CardReference) {
  const slug = cleanSlug(reference?.slug)
  if (!slug) return ''

  if (reference?._type === 'product') return `/products/${slug}`
  if (reference?._type === 'solution') return `/solutions/${slug}`
  if (reference?._type === 'caseStudy') return `/cases/${slug}`

  return ''
}

function resolveCard(item: CardItem) {
  const title = renderText(item.title) || ''
  const description = renderText(item.description) || ''
  const clickable = item.clickable !== false

  if (item.cardType === 'inline') {
    const href = clickable ? getSafeHref(item.inlineCard?.cta?.href) || '' : ''
    const legacyTitle = renderText(item.inlineCard?.title) || ''
    const legacyDescription = renderText(item.inlineCard?.description) || ''
    const isInteractive = Boolean(href)

    return {
      title: title || legacyTitle,
      description: description || legacyDescription,
      image: item.inlineCard?.image,
      ctaLabel: isInteractive ? cleanText(item.inlineCard?.cta?.label) || '' : '',
      href,
      isInteractive,
    }
  }

  const reference = item.reference
  const resolvedTitle = title || renderText(reference?.title) || ''
  const resolvedDescription =
    description ||
    renderText(reference?.shortDescription) ||
    renderText(reference?.description) ||
    renderText(reference?.excerpt) ||
    ''
  const href = clickable ? getSafeHref(reference?.cta?.href) || getReferenceHref(reference) : ''
  const isInteractive = Boolean(href)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    image:
      reference?.mainImage ||
      reference?.image ||
      reference?.coverImage ||
      reference?.heroImage,
    ctaLabel: isInteractive ? cleanText(reference?.cta?.label) || 'View Details' : '',
    href,
    isInteractive,
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
  theme,
  disableCardFrameEffect = false,
}: {
  item: CardItem
  size: 'large' | 'small'
  theme: SharedBackgroundTheme
  disableCardFrameEffect?: boolean
}) {
  const data = resolveCard(item)
  const hasContent = Boolean(data.title || data.description || data.image?.asset)
  if (!hasContent) return null

  const imageHeightClass = 'aspect-[4/3]'
  const titleClass =
    size === 'large'
      ? cardTitleClass
      : 'text-lg font-display font-bold leading-[1.2] tracking-[-0.02em]'
  const textClass = size === 'large' ? bodyTextClass : 'text-sm leading-6'
  const ctaClass = size === 'large' ? 'text-sm' : 'text-xs'
  const titleTone = theme.heading
  const descriptionTone = theme.subtitle
  const ctaTone = 'text-orange-600'
  const framedArticleBaseClass = `overflow-hidden rounded-lg text-center ${theme.surfaceElevated}`
  const articleClass = disableCardFrameEffect
    ? 'text-center'
    : data.isInteractive
      ? `${framedArticleBaseClass} transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-1`
      : framedArticleBaseClass
  const contentClass = size === 'large' ? 'p-6' : 'p-5'
  const imageBgClass = theme.surfaceMuted
  const emptyImageClass = theme.subtitle
  const imageSrc = resolveImageSrc(data.image, {width: 900, height: 675, fit: 'crop'})

  return (
    <article className={articleClass}>
      <div className={`relative ${imageHeightClass} ${imageBgClass}`}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={data.image?.alt || data.title || 'Card image'}
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
        {data.title && <h3 className={`${titleClass} mb-2 ${titleTone}`}>{data.title}</h3>}
        {data.description && <p className={`${textClass} mb-4 ${descriptionTone}`}>{data.description}</p>}
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
  theme,
  disableCardFrameEffect = false,
  showControls = false,
  controls,
  onSelectPage,
}: {
  item: CardItem
  theme: SharedBackgroundTheme
  disableCardFrameEffect?: boolean
  showControls?: boolean
  controls: SliderControls
  onSelectPage: (index: number) => void
}) {
  const data = resolveCard(item)
  const hasContent = Boolean(data.title || data.description || data.image?.asset)
  if (!hasContent) return null

  const titleTone = theme.heading
  const descriptionTone = theme.subtitle
  const ctaTone = 'text-orange-600'
  const framedArticleBaseClass = `relative rounded-lg text-center ${theme.surfaceElevated}`
  const articleClass = disableCardFrameEffect ? 'relative text-center' : framedArticleBaseClass
  const imageBgClass = theme.surfaceMuted
  const emptyImageClass = theme.subtitle
  const dotsBaseClass = theme.dotIdle
  const dotsActiveClass = theme.dotActive
  const imageSrc = resolveImageSrc(data.image, {width: 900, height: 675, fit: 'crop'})
  const imageFrameClass = disableCardFrameEffect
    ? `relative aspect-[4/3] ${imageBgClass}`
    : `relative aspect-[4/3] overflow-hidden rounded-t-lg ${imageBgClass}`

  return (
    <article className={articleClass}>
      <div className={imageFrameClass}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={data.image?.alt || data.title || 'Card image'}
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
          <div className="flex min-w-0 items-center justify-center gap-2">
            {Array.from({length: controls.totalPages}, (_, index) => {
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
        {data.title && <h3 className={`mb-2 ${cardTitleClass} ${titleTone}`}>{data.title}</h3>}
        {data.description && <p className={`mb-4 ${bodyTextClass} ${descriptionTone}`}>{data.description}</p>}
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
  theme,
}: {
  title?: string
  theme: SharedBackgroundTheme
}) {
  const resolvedTitle = renderText(title)

  if (!resolvedTitle) return null

  const titleClass = theme.heading

  return (
    <header className="mb-5 text-center md:mb-6">
      <div className="flex justify-center">
        <h3
          className={`inline-block whitespace-pre-line px-4 text-2xl font-display font-bold tracking-[-0.02em] md:text-[1.75rem] ${titleClass}`}
        >
          {resolvedTitle}
        </h3>
      </div>
      <div className="mt-1.5 flex justify-center md:mt-2">
        <div className="h-1 w-16 rounded-full bg-orange-500 md:w-20" />
      </div>
    </header>
  )
}

function DesktopCarousel({
  cards,
  theme,
  disableCardFrameEffect,
}: {
  cards: CardItem[]
  theme: SharedBackgroundTheme
  disableCardFrameEffect?: boolean
}) {
  const [desktopSwiper, setDesktopSwiper] = useState<SwiperInstance | null>(null)
  const [desktopControls, setDesktopControls] = useState<SliderControls>(defaultSliderControls)
  const desktopButtonClassName = `${theme.control} ${theme.controlHover}`

  return (
    <div className="group relative hidden md:block">
      <div className="relative overflow-x-hidden">
        {desktopControls.hasOverflow && (
          <>
            <SliderNavButton
              direction="prev"
              disabled={!desktopControls.canPrev}
              isDark={false}
              buttonClassName={desktopButtonClassName}
              label="Previous cards"
              onClick={() => desktopSwiper?.slidePrev()}
              className={getEdgeAlignedNavButtonClass('prev')}
            />

            <SliderNavButton
              direction="next"
              disabled={!desktopControls.canNext}
              isDark={false}
              buttonClassName={desktopButtonClassName}
              label="Next cards"
              onClick={() => desktopSwiper?.slideNext()}
              className={getEdgeAlignedNavButtonClass('next')}
            />
          </>
        )}

        <Swiper
          modules={[Keyboard, A11y]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={16}
          speed={500}
          keyboard={{enabled: true}}
          watchOverflow
          grabCursor
          breakpoints={desktopCarouselBreakpoints}
          a11y={{
            slideLabelMessage: 'Card {{index}}',
            prevSlideMessage: 'Previous cards',
            nextSlideMessage: 'Next cards',
          }}
          onSwiper={(instance) => {
            setDesktopSwiper(instance)
            setDesktopControls(getSliderControls(instance))
          }}
          onSlideChange={(instance) => setDesktopControls(getSliderControls(instance))}
          onResize={(instance) => setDesktopControls(getSliderControls(instance))}
          onBreakpoint={(instance) => setDesktopControls(getSliderControls(instance))}
        >
          {cards.map((item, index) => (
            <SwiperSlide key={item._key ?? `group-card-desktop-${index}`} className="!h-auto">
              <GridCard
                item={item}
                size="small"
                theme={theme}
                disableCardFrameEffect={disableCardFrameEffect}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {desktopControls.hasOverflow && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({length: desktopControls.totalPages}, (_, index) => {
            const active = index === desktopControls.currentPage

            return (
              <button
                key={`desktop-card-page-${index}`}
                type="button"
                aria-label={`Go to card page ${index + 1}`}
                aria-pressed={active}
                onClick={() => {
                  if (!desktopSwiper || desktopSwiper.destroyed) return
                  desktopSwiper.slideTo(index * getSlidesPerGroup(desktopSwiper))
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

function GroupGrid({
  sectionTitle,
  cards,
  theme,
  disableCardFrameEffect,
  sectionClassName,
}: {
  sectionTitle?: string
  cards: CardItem[]
  theme: SharedBackgroundTheme
  disableCardFrameEffect?: boolean
  sectionClassName?: string
}) {
  const [mobileSwiper, setMobileSwiper] = useState<SwiperInstance | null>(null)
  const [mobileControls, setMobileControls] = useState<SliderControls>(defaultSliderControls)
  const validCards = cards.filter(hasCardData)
  const desktopUsesCarousel = validCards.length > 3
  const desktopCardSize: 'large' | 'small' = validCards.length <= 2 ? 'large' : 'small'
  const desktopColumns = getStaticDesktopColumns(validCards.length)
  const mobileButtonClassName = `${theme.control} ${theme.controlHover}`

  if (validCards.length < 2) return null

  return (
    <section className={`pt-0 pb-8 ${sectionClassName ?? ''}`.trim()}>
      <SectionTitle title={sectionTitle} theme={theme} />

      <div className="md:hidden">
        <div className="relative overflow-x-hidden">
          {mobileControls.hasOverflow && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 aspect-[4/3]">
              <SliderNavButton
                direction="prev"
                disabled={!mobileControls.canPrev}
                isDark={false}
                buttonClassName={mobileButtonClassName}
                label="Previous card"
                onClick={() => mobileSwiper?.slidePrev()}
                className={`pointer-events-auto ${getEdgeAlignedNavButtonClass('prev')}`}
              />

              <SliderNavButton
                direction="next"
                disabled={!mobileControls.canNext}
                isDark={false}
                buttonClassName={mobileButtonClassName}
                label="Next card"
                onClick={() => mobileSwiper?.slideNext()}
                className={`pointer-events-auto ${getEdgeAlignedNavButtonClass('next')}`}
              />
            </div>
          )}

          <Swiper
            key={`${sectionTitle ?? 'cards'}-${validCards.length}-mobile`}
            modules={[Keyboard, A11y]}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={16}
            speed={450}
            watchOverflow
            grabCursor
            keyboard={{enabled: true}}
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
            {validCards.map((item, index) => (
              <SwiperSlide key={item._key ?? `group-card-mobile-${index}`} className="h-auto">
                <MobileCarouselCard
                  item={item}
                  theme={theme}
                  disableCardFrameEffect={disableCardFrameEffect}
                  showControls={mobileControls.hasOverflow}
                  controls={mobileControls}
                  onSelectPage={(pageIndex) => mobileSwiper?.slideTo(pageIndex)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {desktopUsesCarousel ? (
        <DesktopCarousel
          cards={validCards}
          theme={theme}
          disableCardFrameEffect={disableCardFrameEffect}
        />
      ) : (
        <div className={`hidden gap-6 md:grid ${staticColumnClassMap[desktopColumns]}`}>
          {validCards.map((item, index) => (
            <GridCard
              key={item._key ?? `group-card-${index}`}
              item={item}
              size={desktopCardSize}
              theme={theme}
              disableCardFrameEffect={disableCardFrameEffect}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default function CardGridBlock({block}: {block: CardGridBlockData}) {
  const variant = block.backgroundVariant ?? 'lightGray'
  const theme = getSharedBackgroundTheme(variant)
  const enableBannerOverlap = Boolean(block.enableBannerOverlap)
  const rows =
    (block.rows ?? [])
      .map((row) => ({
        ...row,
        cards: (row.cards ?? []).filter(hasCardData),
      }))
      .filter((row) => (row.cards?.length ?? 0) >= 2) ?? []
  const hasRows = rows.length > 0
  const disableCardFrameEffect = Boolean(block.disableCardFrameEffect)
  const bannerImageSrc = resolveImageSrc(block.bannerImage, {width: 2000, height: 900, fit: 'crop'})
  const bannerOverlayColor = cleanText(block.bannerOverlayColor) || theme.overlay
  const headerSubtitle = block.subtitle
  const subtitleClass = theme.body

  if (!block.title && !block.subtitle && !hasRows) return null

  const content = (
    <>
      {rows.map((row, index) => (
        <GroupGrid
          key={row._key ?? `row-${index}`}
          sectionTitle={row.title}
          cards={row.cards ?? []}
          theme={theme}
          disableCardFrameEffect={disableCardFrameEffect}
          sectionClassName={index < rows.length - 1 ? 'pb-12 md:pb-14' : undefined}
        />
      ))}
    </>
  )

  if (enableBannerOverlap) {
    return (
      <section className={`${theme.section} pb-20 md:pb-24`}>
        <div className="relative h-[300px] overflow-hidden sm:h-[360px] lg:h-[420px]">
          {bannerImageSrc ? (
            <Image
              src={bannerImageSrc}
              alt={block.bannerImage?.alt || block.title || 'Card grid banner'}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-800" />
          )}
          <div className="absolute inset-0" style={{backgroundColor: bannerOverlayColor}} />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 text-center sm:px-6 lg:px-8">
            <div className="w-full">
              <SectionHeader
                title={block.title}
                subtitle={headerSubtitle}
                tone="dark"
                className="mx-auto max-w-3xl"
                subtitleClassName="mx-auto max-w-3xl text-sm leading-7 text-slate-300 md:text-base"
              />
            </div>
          </div>
        </div>

        {hasRows && (
          <div className="relative z-10 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:-mt-24 lg:px-8">
            <div className={`rounded-[1.5rem] px-6 py-8 sm:px-8 md:py-10 lg:px-10 lg:py-12 ${theme.surfaceElevated}`}>
              {content}
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <SectionShell sectionClassName={theme.section}>
      {(block.title || block.subtitle) && (
        <SectionHeader
          title={block.title}
          subtitle={headerSubtitle}
          tone="light"
          className="mb-10 md:mb-12"
          titleClassName={theme.heading}
          subtitleClassName={`mx-auto max-w-3xl ${sectionSubtitleClass} ${subtitleClass}`}
        />
      )}

      {content}
    </SectionShell>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import {
  getSharedBackgroundTheme,
  type ShowcaseCssVars,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import SplitHeroArrow from './SplitHeroArrow'
import { bodyTextClass, cardTitleClass, sectionSubtitleClass } from './sectionStyles'
import styles from './ShowcaseBlock.module.css'
import 'swiper/css'

type ShowcaseImage = {
  alt?: string
  asset?: {
    _ref?: string
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

export type ShowcaseItem = {
  _key?: string
  title?: string
  description?: string
  image?: ShowcaseImage
  href?: string
}

export type ShowcaseBlockData = {
  _type: 'showcaseBlock'
  _key?: string
  title?: string
  subtitle?: string
  layout?: 'cardCarousel' | 'splitCarousel'
  backgroundVariant?: SharedBackgroundVariant
  items?: ShowcaseItem[]
  footerCta?: {
    label?: string
    href?: string
  }
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  )
}

function resolveImageSrc(
  image?: ShowcaseImage,
  options?: {
    width?: number
    height?: number
    fit?: 'crop' | 'max'
  },
) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl

  const hasIdentity = Boolean(image.asset?._ref || image.asset?._id)
  if (!hasIdentity) return undefined

  try {
    let builder = urlFor(image).width(options?.width ?? 1200)
    if (options?.height) {
      builder = builder.height(options.height)
    }
    builder = builder.fit(options?.fit ?? 'max')
    return builder.auto('format').quality(75).url()
  } catch {
    return undefined
  }
}

function isExternalUrl(href?: string) {
  return Boolean(href?.trim())
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const title = item.title?.trim() || 'Untitled Showcase'
  const description = item.description?.trim()
  const href = item.href?.trim() || ''
  const imageSrc = resolveImageSrc(item.image, { width: 1200, height: 800, fit: 'crop' })
  const className = `${styles.cardLink} ${href ? '' : styles.cardStatic}`.trim()

  const content = (
    <>
      <div className={styles.imageWrap}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={item.image?.alt || title}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
            className={styles.image}
          />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
    </>
  )

  if (!isExternalUrl(href)) {
    return <article className={className}>{content}</article>
  }

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {content}
    </a>
  )
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href)
}

function SplitCarousel({
  items,
  theme,
  footerCta,
}: {
  items: ShowcaseItem[]
  theme: SharedBackgroundTheme
  footerCta?: ShowcaseBlockData['footerCta']
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const dotsBaseClass = theme.dotIdle
  const dotsActiveClass = theme.dotActive
  const titleClass = theme.heading
  const bodyClass = theme.body
  const footerHref = footerCta?.href?.trim() || ''
  const footerLabel = footerCta?.label?.trim() || ''

  if (items.length === 0) return null

  return (
    <div className="mx-auto max-w-7xl">
      <Swiper
        modules={[Keyboard, A11y, Autoplay]}
        slidesPerView={1}
        loop={items.length > 1}
        spaceBetween={24}
        speed={650}
        grabCursor
        watchOverflow
        allowTouchMove={items.length > 1}
        keyboard={{ enabled: true }}
        autoplay={
          items.length > 1
            ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        a11y={{
          prevSlideMessage: 'Previous showcase',
          nextSlideMessage: 'Next showcase',
          slideLabelMessage: 'Showcase slide {{index}}',
        }}
        onSwiper={(instance) => {
          setSwiper(instance)
          setCurrentIndex(instance.realIndex)
        }}
        onSlideChange={(instance) => setCurrentIndex(instance.realIndex)}
      >
        {items.map((item, index) => {
          const title = item.title?.trim() || 'Untitled Showcase'
          const description = item.description?.trim()
          const imageSrc = resolveImageSrc(item.image, { width: 1600, height: 1100, fit: 'crop' })

          return (
            <SwiperSlide key={item._key ?? `${title}-${index}`} className="!h-auto">
              <article className={`relative grid h-full gap-8 md:items-start md:px-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:px-14 ${styles.splitSlide}`}>
                {items.length > 1 && (
                  <div className={styles.splitDesktopNav}>
                    <SplitHeroArrow
                      direction="previous"
                      ariaLabel="Previous showcase slide"
                      className={styles.splitDesktopNavButton}
                      onClick={() => {
                        if (!swiper || swiper.destroyed) return
                        swiper.slidePrev()
                      }}
                    />
                    <SplitHeroArrow
                      direction="next"
                      ariaLabel="Next showcase slide"
                      className={styles.splitDesktopNavButton}
                      onClick={() => {
                        if (!swiper || swiper.destroyed) return
                        swiper.slideNext()
                      }}
                    />
                  </div>
                )}

                <div className="order-2 flex md:pt-8 flex-col justify-center md:order-2 lg:order-1">
                  <h3 className={`${cardTitleClass} ${titleClass}`}>
                    {title}
                  </h3>
                  {description ? (
                    <p className={`mt-5 ${bodyTextClass} ${bodyClass}`}>
                      {description}
                    </p>
                  ) : null}
                </div>

                <div className="relative order-1 md:order-1 lg:order-2">
                  <div className={styles.splitMedia}>
                    {imageSrc ? (
                      <div className={styles.splitMediaFrame}>
                        <Image
                          src={imageSrc}
                          alt={item.image?.alt || title}
                          fill
                          sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) 100vw, 52vw"
                          className={styles.splitMediaImage}
                        />
                      </div>
                    ) : (
                      <div className={styles.splitMediaFallback}>
                        <ArrowRightIcon className="h-10 w-10 rotate-45" />
                      </div>
                    )}
                  </div>

                  {items.length > 1 && (
                    <div className={styles.splitMediaMobileNav}>
                      <SplitHeroArrow
                        direction="previous"
                        ariaLabel="Previous showcase slide"
                        className={styles.splitMediaMobileNavButton}
                        onClick={() => {
                          if (!swiper || swiper.destroyed) return
                          swiper.slidePrev()
                        }}
                      />
                      <SplitHeroArrow
                        direction="next"
                        ariaLabel="Next showcase slide"
                        className={styles.splitMediaMobileNavButton}
                        onClick={() => {
                          if (!swiper || swiper.destroyed) return
                          swiper.slideNext()
                        }}
                      />
                    </div>
                  )}
                </div>
              </article>
            </SwiperSlide>
          )
        })}
      </Swiper>

      {items.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((item, index) => {
            const active = index === currentIndex

            return (
              <button
                key={item._key ?? `split-showcase-dot-${index}`}
                type="button"
                aria-label={`Go to showcase slide ${index + 1}`}
                aria-pressed={active}
                onClick={() => {
                  if (!swiper || swiper.destroyed) return
                  if (items.length > 1) {
                    swiper.slideToLoop(index)
                    return
                  }
                  swiper.slideTo(index)
                }}
                className={`h-2.5 rounded-full transition-all ${
                  active ? `w-8 ${dotsActiveClass}` : `w-2.5 ${dotsBaseClass}`
                }`}
              />
            )
          })}
        </div>
      )}

      {footerLabel && footerHref && (
        <div className="mt-10 text-center">
          {isExternalHref(footerHref) ? (
            <a
              href={footerHref}
              target={footerHref.startsWith('http') ? '_blank' : undefined}
              rel={footerHref.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto"
            >
              {footerLabel}
              <ArrowRightIcon className={styles.footerCtaIcon} />
            </a>
          ) : (
            <Link
              href={footerHref}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto"
            >
              {footerLabel}
              <ArrowRightIcon className={styles.footerCtaIcon} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function ShowcaseBlock({ block }: { block: ShowcaseBlockData }) {
  const items = (block.items ?? []).filter((item) => item?.title?.trim() && item?.image?.asset)
  const layout = block.layout === 'splitCarousel' ? 'splitCarousel' : 'cardCarousel'
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(items.length > 1)
  const variant = block.backgroundVariant ?? 'lightGray'
  const theme = getSharedBackgroundTheme(variant)
  const cardCarouselVars: ShowcaseCssVars = {
    ...theme.showcaseVars,
    '--showcase-card-bg': '#ffffff',
    '--showcase-media-bg': '#ffffff',
    '--showcase-card-shadow': '0 10px 24px -18px rgb(15 23 42 / 0.12)',
  }

  if (!block.title && !block.subtitle && items.length === 0) return null

  function syncControls(instance: SwiperInstance) {
    setCurrentIndex(instance.realIndex)
    setCanPrev(!instance.isBeginning)
    setCanNext(!instance.isEnd)
  }

  return (
    <SectionShell sectionClassName={theme.section}>
      {(block.title || block.subtitle) && (
        <SectionHeader
          title={block.title}
          subtitle={block.subtitle}
          tone="light"
          className={layout === 'splitCarousel' ? 'mb-12 md:mb-14' : 'mb-10 md:mb-12'}
          titleClassName={theme.heading}
          subtitleClassName={`mx-auto max-w-3xl ${sectionSubtitleClass} ${theme.subtitle}`}
        />
      )}

      {items.length > 0 && (
        layout === 'splitCarousel' ? (
          <SplitCarousel items={items} theme={theme} footerCta={block.footerCta} />
        ) : (
          <div className={`${styles.shell} ${styles.cardCarouselShell}`} style={cardCarouselVars}>
            <div className={styles.carouselViewport}>
              <Swiper
                modules={[Keyboard, A11y]}
                className={styles.carousel}
                slidesPerView={1}
                spaceBetween={18}
                speed={550}
                grabCursor
                watchOverflow
                keyboard={{ enabled: true }}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  1200: {
                    slidesPerView: 3,
                    spaceBetween: 28,
                  },
                }}
                a11y={{
                  prevSlideMessage: 'Previous showcase',
                  nextSlideMessage: 'Next showcase',
                }}
                onSwiper={(instance) => {
                  setSwiper(instance)
                  syncControls(instance)
                }}
                onSlideChange={syncControls}
                onBreakpoint={syncControls}
                onResize={syncControls}
              >
                {items.map((item, index) => (
                  <SwiperSlide key={item._key ?? `${item.title}-${index}`} className={styles.slide}>
                    <ShowcaseCard item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className={styles.footerBar}>
              <div className={styles.footerLead}>
                {items.length > 1 && (
                  <div className={styles.controls}>
                    <button
                      type="button"
                      aria-label="Previous showcase"
                      className={styles.navButton}
                      disabled={!canPrev}
                      onClick={() => swiper?.slidePrev()}
                    >
                      <ArrowLeftIcon className={styles.navIcon} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next showcase"
                      className={styles.navButton}
                      disabled={!canNext}
                      onClick={() => swiper?.slideNext()}
                    >
                      <ArrowRightIcon className={styles.navIcon} />
                    </button>
                  </div>
                )}

                <p className={styles.mobileCounter} aria-live="polite">
                  {Math.min(currentIndex + 1, items.length)} of {items.length}
                </p>
              </div>

              {block.footerCta?.label?.trim() && block.footerCta?.href?.trim() ? (
                <a
                  href={block.footerCta.href.trim()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto"
                >
                  {block.footerCta.label.trim()}
                  <ArrowRightIcon className={styles.footerCtaIcon} />
                </a>
              ) : null}
            </div>
          </div>
        )
      )}
    </SectionShell>
  )
}

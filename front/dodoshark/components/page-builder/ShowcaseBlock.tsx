'use client'

import Image from 'next/image'
import { useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import { getSharedBackgroundTheme } from './backgroundTheme'
import SectionHeader from './SectionHeader'
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
  logo?: ShowcaseImage
  href?: string
  ctaLabel?: string
}

export type ShowcaseBlockData = {
  _type: 'showcaseBlock'
  _key?: string
  title?: string
  subtitle?: string
  backgroundVariant?: 'default' | 'muted' | 'dark'
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
  const ctaLabel = item.ctaLabel?.trim() || 'View Details'
  const imageSrc = resolveImageSrc(item.image, { width: 1200, height: 800, fit: 'crop' })
  const logoSrc = resolveImageSrc(item.logo, { width: 264, height: 80, fit: 'max' })
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
        {logoSrc ? (
          <div className={styles.logoBadge}>
            <Image
              src={logoSrc}
              alt={item.logo?.alt || `${title} logo`}
              width={132}
              height={40}
              className={styles.logoImage}
            />
          </div>
        ) : null}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
        <span className={styles.inlineCta}>
          {ctaLabel}
          <ArrowRightIcon className={styles.inlineArrow} />
        </span>
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

export default function ShowcaseBlock({ block }: { block: ShowcaseBlockData }) {
  const items = (block.items ?? []).filter((item) => item?.title?.trim() && item?.image?.asset)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(items.length > 1)
  const variant = block.backgroundVariant ?? 'muted'
  const theme = getSharedBackgroundTheme(variant)
  const isDark = variant === 'dark'

  if (!block.title && !block.subtitle && items.length === 0) return null

  function syncControls(instance: SwiperInstance) {
    setCurrentIndex(instance.realIndex)
    setCanPrev(!instance.isBeginning)
    setCanNext(!instance.isEnd)
  }

  return (
    <section className={`py-24 ${theme.section}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(block.title || block.subtitle) && (
          <SectionHeader
            title={block.title}
            subtitle={block.subtitle}
            isDark={isDark}
            className="mb-10"
            titleClassName={`text-3xl md:text-4xl font-display font-black tracking-tight ${theme.heading}`}
            subtitleClassName={`mx-auto max-w-3xl text-base md:text-lg ${theme.subtitle}`}
          />
        )}

        {items.length > 0 && (
          <div className={`${styles.shell} ${isDark ? styles.darkShell : ''}`.trim()}>
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
              onResize={syncControls}
            >
              {items.map((item, index) => (
                <SwiperSlide key={item._key ?? `${item.title}-${index}`} className={styles.slide}>
                  <ShowcaseCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.footerBar}>
              <div className={styles.footerLead}>
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
        )}
      </div>
    </section>
  )
}

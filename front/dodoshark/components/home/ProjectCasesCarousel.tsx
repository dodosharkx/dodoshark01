'use client'

import Image from 'next/image'

import Link from 'next/link'
import { useState } from 'react'
import CMSImage from '@/components/ui/CMSImage'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import styles from './ProjectCasesCarousel.module.css'
import 'swiper/css'

type ProjectCaseItem = {
  title: string
  description: string
  image: string
  sanityImage?: any
  logo?: string | null
  logoImage?: any
  href: string
}

type ProjectCasesCarouselProps = {
  items: ProjectCaseItem[]
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

export default function ProjectCasesCarousel({ items }: ProjectCasesCarouselProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(items.length > 1)

  if (items.length === 0) return null

  function syncControls(instance: SwiperInstance) {
    setCurrentIndex(instance.realIndex)
    setCanPrev(!instance.isBeginning)
    setCanNext(!instance.isEnd)
  }

  return (
    <div className={styles.shell}>
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
          prevSlideMessage: 'Previous case',
          nextSlideMessage: 'Next case',
        }}
        onSwiper={(instance) => {
          setSwiper(instance)
          syncControls(instance)
        }}
        onSlideChange={syncControls}
        onResize={syncControls}
      >
        {items.map((item) => (
          <SwiperSlide key={`${item.title}-${item.logo ?? 'no-logo'}`} className={styles.slide}>
            <Link href={item.href} className={styles.cardLink}>
              <div className={styles.imageWrap}>
                {item.sanityImage?.asset ? (
                  <CMSImage
                    image={item.sanityImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    className={styles.image}
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    className={styles.image}
                    priority={false}
                  />
                )}
                {item.logoImage?.asset ? (
                  <div className={styles.logoBadge}>
                    <CMSImage image={item.logoImage} width={132} height={40} className={styles.logoImage} />
                  </div>
                ) : item.logo ? (
                  <div className={styles.logoBadge}>
                    <Image src={item.logo} alt={`${item.title} logo`} width={132} height={40} className={styles.logoImage} />
                  </div>
                ) : null}
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
                <span className={styles.inlineCta}>
                  Read Case Study
                  <ArrowRightIcon className={styles.inlineArrow} />
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.footerBar}>
        <div className={styles.footerLead}>
          <div className={styles.controls}>
            <button
              type="button"
              aria-label="Previous case"
              className={styles.navButton}
              disabled={!canPrev}
              onClick={() => swiper?.slidePrev()}
            >
              <ArrowLeftIcon className={styles.navIcon} />
            </button>
            <button
              type="button"
              aria-label="Next case"
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

        <Link
          href="/cases"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto"
        >
          View All Cases
          <ArrowRightIcon className={styles.footerCtaIcon} />
        </Link>
      </div>
    </div>
  )
}

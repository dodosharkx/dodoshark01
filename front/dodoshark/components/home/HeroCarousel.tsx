'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import CMSImage from '@/components/ui/CMSImage'

export type HeroCarouselImage = {
  src: string
  alt: string
  sanityImage?: any
}

export type HeroCarouselProps = {
  images: HeroCarouselImage[]
  autoplayMs?: number
  pauseOnHover?: boolean
  showDots?: boolean
  showArrows?: boolean
}

export default function HeroCarousel({
  images,
  autoplayMs = 5500,
  pauseOnHover = true,
  showDots = true,
  showArrows = true,
}: HeroCarouselProps) {
  const slides = images.filter((item) => Boolean(item?.src))
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [failedMap, setFailedMap] = useState<Record<number, boolean>>({})
  const safeActiveIndex = slides.length > 0 ? activeIndex % slides.length : 0

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasHydrated(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (slides.length <= 1 || autoplayMs <= 0 || (pauseOnHover && isHovered)) return

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, autoplayMs)

    return () => window.clearInterval(timer)
  }, [autoplayMs, isHovered, pauseOnHover, slides.length])

  function jumpTo(index: number) {
    if (slides.length === 0) return
    const normalized = (index + slides.length) % slides.length
    setActiveIndex(normalized)
  }

  function shouldRenderSlide(index: number) {
    if (!hasHydrated) return index === safeActiveIndex
    if (slides.length <= 3) return true

    const prevIndex = (safeActiveIndex - 1 + slides.length) % slides.length
    const nextIndex = (safeActiveIndex + 1) % slides.length
    return index === safeActiveIndex || index === prevIndex || index === nextIndex
  }

  if (slides.length === 0) {
    return <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#64748b_0,#475569_45%,#334155_100%)]" />
  }

  if (slides.length === 1) {
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#64748b_0,#475569_45%,#334155_100%)]" />
        {!failedMap[0] && (
          slides[0].sanityImage?.asset ? (
            <CMSImage
              image={slides[0].sanityImage}
              alt={slides[0].alt}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              loading="eager"
              quality={74}
              className="object-cover"
              onError={() => setFailedMap((prev) => ({ ...prev, 0: true }))}
            />
          ) : (
            <Image
              src={slides[0].src}
              alt={slides[0].alt}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              loading="eager"
              quality={74}
              className="object-cover"
              onError={() => setFailedMap((prev) => ({ ...prev, 0: true }))}
            />
          )
        )}
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {slides.map((slide, index) => {
        if (!shouldRenderSlide(index)) return null

        const isActive = index === safeActiveIndex

        return (
          <div
            key={`${slide.src}-${index}`}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              isActive ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
            }`}
            aria-hidden={!isActive}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#64748b_0,#475569_45%,#334155_100%)]" />
            {!failedMap[index] && (
              slide.sanityImage?.asset ? (
                <CMSImage
                  image={slide.sanityImage}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  sizes="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  quality={isActive ? 74 : 68}
                  className="object-cover"
                  onError={() => setFailedMap((prev) => ({ ...prev, [index]: true }))}
                />
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  sizes="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  quality={isActive ? 74 : 68}
                  className="object-cover"
                  onError={() => setFailedMap((prev) => ({ ...prev, [index]: true }))}
                />
              )
            )}
          </div>
        )
      })}

      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Previous hero image"
            onClick={() => jumpTo(safeActiveIndex - 1)}
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-md border border-white/35 bg-slate-800/45 text-2xl text-white backdrop-blur transition hover:bg-slate-800/70 sm:grid"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <button
            type="button"
            aria-label="Next hero image"
            onClick={() => jumpTo(safeActiveIndex + 1)}
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-md border border-white/35 bg-slate-800/45 text-2xl text-white backdrop-blur transition hover:bg-slate-800/70 sm:grid"
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2">
          {slides.map((slide, index) => {
            const isActive = index === safeActiveIndex
            return (
              <button
                key={`${slide.alt}-${index}`}
                type="button"
                aria-label={`Go to hero image ${index + 1}`}
                onClick={() => jumpTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  isActive ? 'w-8 bg-orange-400' : 'w-2.5 bg-white/60 hover:bg-white'
                }`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

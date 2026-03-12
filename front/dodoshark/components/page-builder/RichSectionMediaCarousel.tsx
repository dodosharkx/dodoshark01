'use client'

import Image from 'next/image'
import { useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import type { RichSectionMediaItem } from './RichSectionBlock'
import 'swiper/css'

function hasImageIdentity(item?: RichSectionMediaItem) {
  const ref = item?.image?.asset?._ref?.trim()
  const id = item?.image?.asset?._id?.trim()
  const url = item?.image?.asset?.url?.trim()
  return Boolean(ref || id || url)
}

function resolveMediaSrc(item?: RichSectionMediaItem) {
  if (!item?.image) return undefined

  const directUrl = item.image.asset?.url?.trim()
  if (directUrl) return directUrl

  if (!hasImageIdentity(item)) return undefined

  try {
    return urlFor(item.image).width(1400).fit('max').url()
  } catch {
    return undefined
  }
}

function MediaFigure({
  item,
  title,
  disableMediaFrameEffect = false,
}: {
  item: RichSectionMediaItem
  title?: string
  disableMediaFrameEffect?: boolean
}) {
  const src = resolveMediaSrc(item)
  if (!src || !item.image?.asset) {
    const fallbackClass = disableMediaFrameEffect
      ? 'w-full aspect-[4/3] bg-slate-100'
      : 'w-full aspect-[4/3] rounded-lg border border-slate-200 bg-slate-100'
    return <div className={fallbackClass} />
  }

  const width = item.image.asset.metadata?.dimensions?.width ?? 1200
  const height = item.image.asset.metadata?.dimensions?.height ?? 900
  const hasLqip = Boolean(item.image.asset.metadata?.lqip)
  const alt = item.alt?.trim() || item.caption?.trim() || title || 'Section media'
  const frameClass = disableMediaFrameEffect
    ? 'relative overflow-hidden'
    : 'relative overflow-hidden rounded-lg bg-white shadow-xl'

  return (
    <div className={frameClass}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
        placeholder={hasLqip ? 'blur' : 'empty'}
        blurDataURL={item.image.asset.metadata?.lqip}
      />
    </div>
  )
}

export default function RichSectionMediaCarousel({
  items,
  title,
  isDark,
  disableMediaFrameEffect = false,
}: {
  items: RichSectionMediaItem[]
  title?: string
  isDark: boolean
  disableMediaFrameEffect?: boolean
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentItem = items[Math.min(currentIndex, items.length - 1)]
  const caption = currentItem?.caption?.trim()
  const captionClass = isDark ? 'text-slate-400' : 'text-slate-500'
  const dotsBaseClass = isDark ? 'bg-slate-500/50' : 'bg-slate-300'
  const dotsActiveClass = isDark ? 'bg-orange-300' : 'bg-orange-500'

  if (items.length === 0) return null

  if (items.length === 1) {
    return (
      <div className="w-full min-w-0">
        <MediaFigure
          item={items[0]}
          title={title}
          disableMediaFrameEffect={disableMediaFrameEffect}
        />
        {caption ? (
          <p className={`mx-auto mt-4 max-w-[42rem] text-center text-sm leading-6 md:text-[0.95rem] ${captionClass}`}>
            {caption}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">
      <Swiper
        className="w-full overflow-hidden"
        modules={[Keyboard, A11y]}
        slidesPerView={1}
        spaceBetween={16}
        speed={550}
        grabCursor
        watchOverflow
        allowTouchMove={items.length > 1}
        keyboard={{ enabled: true }}
        a11y={{
          prevSlideMessage: 'Previous media item',
          nextSlideMessage: 'Next media item',
          slideLabelMessage: 'Media item {{index}}',
        }}
        onSwiper={(instance) => {
          setSwiper(instance)
          setCurrentIndex(instance.realIndex)
        }}
        onSlideChange={(instance) => setCurrentIndex(instance.realIndex)}
      >
        {items.map((item, index) => (
          <SwiperSlide
            key={item._key ?? `rich-section-media-${index}`}
            className="!h-auto min-w-0"
          >
            <MediaFigure
              item={item}
              title={title}
              disableMediaFrameEffect={disableMediaFrameEffect}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {caption ? (
        <p className={`mx-auto mt-4 max-w-[42rem] text-center text-sm leading-6 md:text-[0.95rem] ${captionClass}`}>
          {caption}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) => {
          const active = index === currentIndex

          return (
            <button
              key={item._key ?? `rich-section-media-dot-${index}`}
              type="button"
              aria-label={`Go to media item ${index + 1}`}
              aria-pressed={active}
              onClick={() => swiper?.slideTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                active ? `w-8 ${dotsActiveClass}` : `w-2.5 ${dotsBaseClass}`
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}

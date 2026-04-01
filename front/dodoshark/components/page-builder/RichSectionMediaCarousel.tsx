'use client'

import { useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { type SharedBackgroundTheme } from './backgroundTheme'
import {
  RichSectionMediaCard,
  type RichSectionMediaItem,
} from './RichSectionMedia'
import SplitHeroArrow from './SplitHeroArrow'
import 'swiper/css'

export default function RichSectionMediaCarousel({
  items,
  title,
  theme,
  disableMediaFrameEffect = false,
}: {
  items: RichSectionMediaItem[]
  title?: string
  theme: SharedBackgroundTheme
  disableMediaFrameEffect?: boolean
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const captionClassName = `mx-auto mt-4 max-w-[42rem] text-center text-sm leading-6 md:text-[0.95rem] ${theme.subtitle}`
  const dotsBaseClass = theme.dotIdle
  const dotsActiveClass = theme.dotActive
  const canPrev = currentIndex > 0
  const canNext = currentIndex < items.length - 1

  if (items.length === 0) return null

  if (items.length === 1) {
    return (
      <div className="w-full min-w-0">
        <RichSectionMediaCard
          item={items[0]}
          title={title}
          theme={theme}
          captionClassName={captionClassName}
          disableMediaFrameEffect={disableMediaFrameEffect}
        />
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">
      <div className="overflow-x-hidden">
        <div className="relative">
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
                <RichSectionMediaCard
                  item={item}
                  title={title}
                  theme={theme}
                  captionClassName={captionClassName}
                  disableMediaFrameEffect={disableMediaFrameEffect}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <SplitHeroArrow
            direction="previous"
            ariaLabel="Previous media item"
            disabled={!canPrev}
            className={theme.accentDarkSoft}
            onClick={() => {
              if (!swiper || swiper.destroyed || !canPrev) return
              swiper.slidePrev()
            }}
          />
          <SplitHeroArrow
            direction="next"
            ariaLabel="Next media item"
            disabled={!canNext}
            className={theme.accentDarkSoft}
            onClick={() => {
              if (!swiper || swiper.destroyed || !canNext) return
              swiper.slideNext()
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {items.map((item, index) => {
          const active = index === currentIndex

          return (
            <button
              key={item._key ?? `rich-section-media-dot-${index}`}
              type="button"
              aria-label={`Go to media item ${index + 1}`}
              aria-pressed={active ? 'true' : 'false'}
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

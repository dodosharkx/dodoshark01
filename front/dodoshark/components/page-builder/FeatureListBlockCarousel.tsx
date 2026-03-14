'use client'

import {useState} from 'react'
import {A11y, Keyboard} from 'swiper/modules'
import type {Swiper as SwiperInstance} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'

import {
  defaultSliderControls,
  getSliderControls,
  getSlidesPerGroup,
  SliderNavButton,
} from './PageBuilderSliderControls'
import type {SharedBackgroundTheme} from './backgroundTheme'
import {FeatureListStandaloneCard, type FeatureListItem} from './FeatureListBlockCard'
import 'swiper/css'

type FeatureListBlockCarouselProps = {
  items: FeatureListItem[]
  theme: SharedBackgroundTheme
  showMobileArrows?: boolean
}

const carouselBreakpoints = {
  768: {slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20},
  1024: {slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24},
} as const

export default function FeatureListBlockCarousel({
  items,
  theme,
  showMobileArrows = false,
}: FeatureListBlockCarouselProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [controls, setControls] = useState(defaultSliderControls)
  const dotsBaseClass = theme.dotIdle
  const dotsActiveClass = theme.dotActive
  const cardSizes =
    '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 33vw'
  const arrowVisibilityClass = showMobileArrows ? 'inline-flex' : 'hidden md:inline-flex'

  if (items.length === 0) return null

  return (
    <div className="group relative">
      <div className="mx-auto max-w-7xl">
        {controls.hasOverflow && (
          <>
            <SliderNavButton
              direction="prev"
              disabled={!controls.canPrev}
              isDark={false}
              buttonClassName={`${theme.control} ${theme.controlHover}`}
              label="Previous feature cards"
              onClick={() => swiper?.slidePrev()}
              className={`absolute left-2 top-[35%] z-20 -translate-y-1/2 ${arrowVisibilityClass} md:left-0 md:-left-5 lg:-left-6`}
            />

            <SliderNavButton
              direction="next"
              disabled={!controls.canNext}
              isDark={false}
              buttonClassName={`${theme.control} ${theme.controlHover}`}
              label="Next feature cards"
              onClick={() => swiper?.slideNext()}
              className={`absolute right-2 top-[35%] z-20 -translate-y-1/2 ${arrowVisibilityClass} md:right-0 md:-right-5 lg:-right-6`}
            />
          </>
        )}

        <Swiper
          modules={[A11y, Keyboard]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={16}
          speed={500}
          keyboard={{enabled: true}}
          watchOverflow
          breakpoints={carouselBreakpoints}
          a11y={{
            slideLabelMessage: 'Feature card {{index}}',
            prevSlideMessage: 'Previous feature cards',
            nextSlideMessage: 'Next feature cards',
          }}
          onSwiper={(instance) => {
            setSwiper(instance)
            setControls(getSliderControls(instance))
          }}
          onSlideChange={(instance) => setControls(getSliderControls(instance))}
          onResize={(instance) => setControls(getSliderControls(instance))}
          onBreakpoint={(instance) => setControls(getSliderControls(instance))}
        >
          {items.map((item, index) => (
            <SwiperSlide
              key={item._key ?? `${item.title ?? 'feature-card'}-${index}`}
              className="!h-auto"
            >
              <FeatureListStandaloneCard
                item={item}
                theme={theme}
                sizes={cardSizes}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {controls.hasOverflow && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({length: controls.totalPages}, (_, index) => {
            const active = index === controls.currentPage

            return (
              <button
                key={`feature-list-page-${index}`}
                type="button"
                aria-label={`Go to feature card page ${index + 1}`}
                aria-pressed={active}
                onClick={() => {
                  if (!swiper || swiper.destroyed) return
                  swiper.slideTo(index * getSlidesPerGroup(swiper))
                }}
                className={`h-2.5 rounded-full transition-all ${
                  active ? `w-8 ${dotsActiveClass}` : `w-2.5 ${dotsBaseClass}`
                }`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

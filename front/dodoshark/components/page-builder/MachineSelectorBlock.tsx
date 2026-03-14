'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'
import {
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import { bodyTextClass, cardTitleClass, sectionSubtitleClass } from './sectionStyles'
import 'swiper/css'

type SelectorImage = {
  alt?: string
  asset?: {
    _ref?: string
    _id?: string
    url?: string
    metadata?: {
      dimensions?: {
        width?: number
        height?: number
      }
      lqip?: string
    }
  }
}

type ProductVariantItem = {
  _id?: string
  modelName?: string
  shortDescription?: string
  image?: SelectorImage
}

type MachineItem = {
  _key?: string
  modelLabel?: string
  isFeatured?: boolean
  productVariant?: ProductVariantItem
}

type MachineGroup = {
  _key?: string
  label?: string
  description?: string
  items?: MachineItem[]
}

type SliderControls = {
  hasOverflow: boolean
  canPrev: boolean
  canNext: boolean
  currentPage: number
  totalPages: number
}

const defaultSliderControls: SliderControls = {
  hasOverflow: false,
  canPrev: false,
  canNext: false,
  currentPage: 0,
  totalPages: 1,
}

export type MachineSelectorBlockData = {
  _type: 'machineSelectorBlock'
  _key?: string
  title?: string
  subtitle?: string
  backgroundVariant?: SharedBackgroundVariant
  groups?: MachineGroup[]
  defaultGroupIndex?: number
  maxItemsPerRow?: 1 | 2 | 3 | 4
  showModelDescription?: boolean
  footerText?: string
}

function hasImageIdentity(image?: SelectorImage) {
  const ref = image?.asset?._ref?.trim()
  const id = image?.asset?._id?.trim()
  const url = image?.asset?.url?.trim()
  return Boolean(ref || id || url)
}

function resolveImageSrc(image?: SelectorImage) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl
  if (!hasImageIdentity(image)) return undefined

  try {
    return urlFor(image).width(1200).fit('max').url()
  } catch {
    return undefined
  }
}

function getSliderControls(instance: SwiperInstance): SliderControls {
  const hasOverflow = !instance.isLocked && instance.slides.length > 1
  const totalPages = Math.max(instance.snapGrid.length, 1)
  return {
    hasOverflow,
    canPrev: hasOverflow && !instance.isBeginning,
    canNext: hasOverflow && !instance.isEnd,
    currentPage: Math.min(instance.snapIndex, totalPages - 1),
    totalPages,
  }
}

function getMachineSliderBreakpoints(columns: 1 | 2 | 3 | 4) {
  if (columns === 1) {
    return {
      768: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
      1024: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 24 },
      1280: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 28 },
    }
  }

  if (columns === 2) {
    return {
      768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
      1024: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 24 },
      1280: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 28 },
    }
  }

  if (columns === 3) {
    return {
      768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
      1280: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 28 },
    }
  }

  return {
    768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
    1280: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 28 },
  }
}

function getSlidesPerGroup(instance: SwiperInstance) {
  const { slidesPerGroup } = instance.params
  return typeof slidesPerGroup === 'number' && slidesPerGroup > 0 ? slidesPerGroup : 1
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function SliderNavButton({
  direction,
  disabled,
  theme,
  label,
  onClick,
  className = '',
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  theme: SharedBackgroundTheme
  label: string
  onClick: () => void
  className?: string
}) {
  const buttonClass = `${theme.control} ${theme.controlHover}`

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 ${buttonClass} ${className}`}
    >
      {direction === 'prev' ? (
        <ArrowLeftIcon className="h-5 w-5" />
      ) : (
        <ArrowRightIcon className="h-5 w-5" />
      )}
    </button>
  )
}

function MachineCard({
  item,
  theme,
  shouldShowModelDescription,
}: {
  item: MachineItem
  theme: SharedBackgroundTheme
  shouldShowModelDescription: boolean
}) {
  const variantItem = item.productVariant
  const title = item.modelLabel?.trim() || variantItem?.modelName?.trim() || 'Unnamed Model'
  const description = variantItem?.shortDescription?.trim()
  const image = variantItem?.image
  const src = resolveImageSrc(image)

  return (
    <article
      className={`h-full rounded-[0.75rem] p-5 ${
        item.isFeatured ? `ring-2 ring-orange-400 ${theme.surfaceElevated}` : theme.surface
      }`}
    >
      <div className="mb-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm">
        {src ? (
          <Image
            src={src}
            alt={image?.alt || title}
            width={image?.asset?.metadata?.dimensions?.width ?? 1000}
            height={image?.asset?.metadata?.dimensions?.height ?? 750}
            className="h-full w-full object-contain"
            placeholder={image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={image?.asset?.metadata?.lqip}
          />
        ) : (
          <Icon icon="image" className="h-8 w-8 text-slate-300" />
        )}
      </div>

      <h3 className={`mb-2 text-center ${cardTitleClass} text-slate-900`}>
        {title}
      </h3>

      {shouldShowModelDescription && description && (
        <p className={`text-center ${bodyTextClass} text-slate-600`}>
          {description}
        </p>
      )}
    </article>
  )
}

export default function MachineSelectorBlock({ block }: { block: MachineSelectorBlockData }) {
  const variant = block.backgroundVariant ?? 'lightGray'
  const theme = getSharedBackgroundTheme(variant)

  const groups = useMemo(
    () =>
      (block.groups ?? []).filter(
        (group) => (group.items ?? []).some((item) => item.productVariant) && group.label?.trim(),
      ),
    [block.groups],
  )

  const initialIndex = Number.isInteger(block.defaultGroupIndex)
    ? Math.max(0, Math.min(block.defaultGroupIndex as number, Math.max(groups.length - 1, 0)))
    : 0
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [tabsSwiper, setTabsSwiper] = useState<SwiperInstance | null>(null)
  const [machineSwiper, setMachineSwiper] = useState<SwiperInstance | null>(null)
  const [tabControls, setTabControls] = useState<SliderControls>(defaultSliderControls)
  const [machineControls, setMachineControls] = useState<SliderControls>(defaultSliderControls)

  const activeGroup = groups[activeIndex]
  const activeItems = useMemo(
    () => (activeGroup?.items ?? []).filter((item) => item.productVariant),
    [activeGroup],
  )

  const tabActiveClass = 'bg-orange-400 text-slate-900'
  const tabInactiveClass = `${theme.accentDark} hover:bg-slate-800`
  const footerClass = theme.body
  const groupDescriptionClass = theme.body
  const subtitleClass = theme.subtitle
  const shouldShowModelDescription = block.showModelDescription !== false
  const maxItemsPerRow = block.maxItemsPerRow ?? 4
  const dotsBaseClass = theme.dotIdle
  const dotsActiveClass = theme.dotActive

  useEffect(() => {
    setActiveIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (!groups.length) {
      setActiveIndex(0)
      return
    }

    setActiveIndex((current) => Math.max(0, Math.min(current, groups.length - 1)))
  }, [groups.length])

  useEffect(() => {
    if (!tabsSwiper || tabsSwiper.destroyed) return

    tabsSwiper.slideTo(activeIndex)
    setTabControls(getSliderControls(tabsSwiper))
  }, [activeIndex, tabsSwiper])

  useEffect(() => {
    setMachineControls(defaultSliderControls)
    if (!machineSwiper || machineSwiper.destroyed) return

    machineSwiper.slideTo(0, 0)
    setMachineControls(getSliderControls(machineSwiper))
  }, [activeIndex, machineSwiper])

  if (!block.title && !block.subtitle && groups.length === 0) return null

  return (
    <SectionShell sectionClassName={theme.section}>
      {(block.title || block.subtitle) && (
        <SectionHeader
          title={block.title}
          subtitle={block.subtitle}
          tone="light"
          className="mb-10 md:mb-12"
          titleClassName={theme.heading}
          subtitleClassName={`mx-auto max-w-3xl ${sectionSubtitleClass} ${subtitleClass}`}
        />
      )}

      {groups.length > 0 && (
        <div className="mb-8 -mx-4 px-4 md:mx-0 md:mb-10 md:px-0">
            <div className="flex items-center md:justify-center">
              <div className={`min-w-0 flex-1 ${tabControls.hasOverflow ? 'md:max-w-4xl' : 'md:max-w-fit'}`}>
                <Swiper
                  modules={[Keyboard, A11y]}
                  slidesPerView="auto"
                  centeredSlides
                  centeredSlidesBounds
                  centerInsufficientSlides
                  watchOverflow
                  grabCursor
                  keyboard={{ enabled: true }}
                  spaceBetween={12}
                  speed={450}
                  initialSlide={activeIndex}
                  a11y={{
                    prevSlideMessage: 'Previous filter',
                    nextSlideMessage: 'Next filter',
                  }}
                  onSwiper={(instance) => {
                    setTabsSwiper(instance)
                    setTabControls(getSliderControls(instance))
                  }}
                  onSlideChange={(instance) => setTabControls(getSliderControls(instance))}
                  onResize={(instance) => setTabControls(getSliderControls(instance))}
                  onBreakpoint={(instance) => setTabControls(getSliderControls(instance))}
                  className="!overflow-visible"
                >
                  {groups.map((group, idx) => {
                    const active = idx === activeIndex
                    return (
                      <SwiperSlide key={group._key ?? `${group.label}-${idx}`} className="!w-auto">
                        <button
                          type="button"
                          onClick={() => setActiveIndex(idx)}
                          aria-pressed={active}
                          className={`min-w-[132px] rounded-sm px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors md:min-w-[180px] md:px-6 md:py-3 md:text-base ${active ? tabActiveClass : tabInactiveClass}`}
                        >
                          {group.label}
                        </button>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            </div>
        </div>
      )}

        {activeGroup?.description && (
          <p className={`mb-8 text-center text-sm md:text-base ${groupDescriptionClass}`}>
            {activeGroup.description}
          </p>
        )}

        {activeItems.length > 0 && (
          <div>
            <div className="group relative overflow-visible">
              {machineControls.hasOverflow && (
                <>
                  <SliderNavButton
                    direction="prev"
                    disabled={!machineControls.canPrev}
                    theme={theme}
                    label="Previous machine"
                    onClick={() => machineSwiper?.slidePrev()}
                    className="absolute left-2 top-[35%] z-20 hidden -translate-y-1/2 xl:inline-flex"
                  />
                  <SliderNavButton
                    direction="next"
                    disabled={!machineControls.canNext}
                    theme={theme}
                    label="Next machine"
                    onClick={() => machineSwiper?.slideNext()}
                    className="absolute right-2 top-[35%] z-20 hidden -translate-y-1/2 xl:inline-flex"
                  />
                </>
              )}

              <Swiper
                key={activeGroup?._key ?? `group-${activeIndex}`}
                modules={[Keyboard, A11y]}
                slidesPerView={1}
                slidesPerGroup={1}
                breakpoints={getMachineSliderBreakpoints(maxItemsPerRow)}
                centerInsufficientSlides
                watchOverflow
                grabCursor
                keyboard={{ enabled: true }}
                spaceBetween={16}
                speed={500}
                a11y={{
                  prevSlideMessage: 'Previous machine',
                  nextSlideMessage: 'Next machine',
                }}
                onSwiper={(instance) => {
                  setMachineSwiper(instance)
                  setMachineControls(getSliderControls(instance))
                }}
                onSlideChange={(instance) => setMachineControls(getSliderControls(instance))}
                onResize={(instance) => setMachineControls(getSliderControls(instance))}
                onBreakpoint={(instance) => setMachineControls(getSliderControls(instance))}
              >
                {activeItems.map((item, idx) => {
                  const variantItem = item.productVariant
                  const title = item.modelLabel?.trim() || variantItem?.modelName?.trim() || 'Unnamed Model'

                  return (
                    <SwiperSlide key={item._key ?? `${title}-${idx}`} className="!h-auto">
                      <MachineCard
                        item={item}
                        theme={theme}
                        shouldShowModelDescription={shouldShowModelDescription}
                      />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>

            {machineControls.hasOverflow && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: machineControls.totalPages }, (_, idx) => {
                  const active = idx === machineControls.currentPage

                  return (
                    <button
                      key={`machine-page-${idx}`}
                      type="button"
                      aria-label={`Go to machine page ${idx + 1}`}
                      aria-pressed={active}
                      onClick={() => {
                        if (!machineSwiper || machineSwiper.destroyed) return
                        machineSwiper.slideTo(idx * getSlidesPerGroup(machineSwiper))
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
        )}

        {block.footerText && (
          <p className={`mt-8 text-center text-md font-semibold ${footerClass}`}>{block.footerText}</p>
        )}
    </SectionShell>
  )
}

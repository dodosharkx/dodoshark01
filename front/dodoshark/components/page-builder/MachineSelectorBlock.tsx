'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'
import { getSharedBackgroundTheme } from './backgroundTheme'
import SectionHeader from './SectionHeader'
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
  backgroundVariant?: 'default' | 'muted' | 'dark'
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
  isDark,
  label,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  isDark: boolean
  label: string
  onClick: () => void
}) {
  const buttonClass = isDark
    ? 'border-slate-600 bg-slate-800 text-slate-100 hover:border-orange-300 hover:text-orange-300'
    : 'border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:text-orange-500'

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 ${buttonClass}`}
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
  shouldShowModelDescription,
}: {
  item: MachineItem
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
        item.isFeatured ? 'ring-2 ring-orange-400 bg-white shadow-lg' : 'border border-slate-200 bg-white'
      }`}
    >
      <div className="mb-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm bg-slate-100">
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

      <h3 className="mb-2 text-center text-xl font-display font-black text-slate-900 md:text-2xl">
        {title}
      </h3>

      {shouldShowModelDescription && description && (
        <p className="text-center text-sm leading-relaxed text-slate-600 md:text-base">
          {description}
        </p>
      )}
    </article>
  )
}

export default function MachineSelectorBlock({ block }: { block: MachineSelectorBlockData }) {
  const variant = block.backgroundVariant ?? 'muted'
  const theme = getSharedBackgroundTheme(variant)
  const isDark = variant === 'dark'

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
  const tabInactiveClass = isDark
    ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
    : 'bg-slate-800 text-white hover:bg-slate-700'
  const footerClass = isDark ? 'text-slate-300' : 'text-slate-700'
  const groupDescriptionClass = isDark ? 'text-slate-300' : theme.body
  const subtitleClass = isDark ? theme.subtitle : theme.body
  const shouldShowModelDescription = block.showModelDescription !== false
  const desktopTabsNavClass = isDark ? 'bg-slate-900/80' : 'bg-slate-50/90'
  const maxItemsPerRow = block.maxItemsPerRow ?? 4
  const dotsBaseClass = isDark ? 'bg-slate-500/50' : 'bg-slate-300'
  const dotsActiveClass = isDark ? 'bg-orange-300' : 'bg-orange-500'

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
    <section className={`py-24 ${theme.section}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(block.title || block.subtitle) && (
          <SectionHeader
            title={block.title}
            subtitle={block.subtitle}
            isDark={isDark}
            className="mb-10"
            titleClassName={`text-3xl md:text-4xl font-display font-black tracking-tight ${theme.heading}`}
            subtitleClassName={`mx-auto max-w-3xl text-base md:text-lg ${subtitleClass}`}
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
            <div className="mb-4 hidden items-center justify-end md:flex">
              {machineControls.hasOverflow && (
                <div className={`inline-flex items-center gap-3 rounded-full px-2 py-2 ${desktopTabsNavClass}`}>
                  <SliderNavButton
                    direction="prev"
                    disabled={!machineControls.canPrev}
                    isDark={isDark}
                    label="Previous machine"
                    onClick={() => machineSwiper?.slidePrev()}
                  />
                  <SliderNavButton
                    direction="next"
                    disabled={!machineControls.canNext}
                    isDark={isDark}
                    label="Next machine"
                    onClick={() => machineSwiper?.slideNext()}
                  />
                </div>
              )}
            </div>

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
                      shouldShowModelDescription={shouldShowModelDescription}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>

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
      </div>
    </section>
  )
}

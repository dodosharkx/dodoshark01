'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { urlFor } from '@/app/lib/sanity'
import { cleanText, renderText } from '@/app/lib/sanity-utils'
import Icon from '@/components/ui/Icon'
import {
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import {
  SliderNavButton,
  getEdgeAlignedNavButtonClass,
} from './PageBuilderSliderControls'
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
  imageZoom?: number
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

function MachineCard({
  item,
  theme,
  shouldShowModelDescription,
  imageZoom = 115,
}: {
  item: MachineItem
  theme: SharedBackgroundTheme
  shouldShowModelDescription: boolean
  imageZoom?: number
}) {
  const variantItem = item.productVariant
  const title = renderText(item.modelLabel) || renderText(variantItem?.modelName) || 'Unnamed Model'
  const description = renderText(variantItem?.shortDescription)
  const image = variantItem?.image
  const src = resolveImageSrc(image)

  const zoomScale = imageZoom / 100

  return (
    <article
      className={`group/card h-full overflow-hidden rounded-[0.75rem] transition-all duration-300 ${
        item.isFeatured ? `ring-2 ring-orange-400 ${theme.surfaceElevated}` : `${theme.surface} hover:shadow-xl`
      }`}
    >
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-white/50 p-4">
        {src ? (
          <Image
            src={src}
            alt={image?.alt || title}
            width={image?.asset?.metadata?.dimensions?.width ?? 1000}
            height={image?.asset?.metadata?.dimensions?.height ?? 1000}
            style={{ transform: `scale(${zoomScale})` }}
            className="h-full w-full object-contain transition-transform duration-500"
            placeholder={image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={image?.asset?.metadata?.lqip}
          />
        ) : (
          <Icon icon="image" className="h-8 w-8 text-slate-300" />
        )}
      </div>

      <div className="p-6 text-center">
        <h3 className={`mb-2 ${cardTitleClass} text-slate-900`}>
          {title}
        </h3>

        {shouldShowModelDescription && description && (
          <p className={`${bodyTextClass} text-slate-600`}>
            {description}
          </p>
        )}
      </div>
    </article>
  )
}

export default function MachineSelectorBlock({ block }: { block: MachineSelectorBlockData }) {
  const variant = block.backgroundVariant ?? 'lightGray'
  const theme = getSharedBackgroundTheme(variant)

  const groups = useMemo(
    () =>
      (block.groups ?? []).filter(
        (group) => (group.items ?? []).some((item) => item.productVariant) && renderText(group.label),
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
        <div className="mb-8 overflow-x-hidden md:mb-10">
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
                className="w-full"
              >
                {groups.map((group, idx) => {
                  const active = idx === activeIndex
                  return (
                    <SwiperSlide key={group._key ?? `${group.label}-${idx}`} className="!w-auto">
                      <button
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={active ? `Currently viewing ${group.label}` : `Show ${group.label}`}
                        {...(active ? { 'aria-current': 'true' } : {})}
                        className={`min-w-[132px] rounded-sm px-4 py-2 text-xs font-black tracking-wider transition-colors md:min-w-[180px] md:px-6 md:py-3 md:text-base ${active ? tabActiveClass : tabInactiveClass}`}
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

        {renderText(activeGroup?.description) && (
          <p className={`mb-8 text-center text-sm md:text-base ${groupDescriptionClass}`}>
            {renderText(activeGroup.description)}
          </p>
        )}

        {activeItems.length > 0 && (
          <div>
            <div className="group relative overflow-x-hidden">
              {machineControls.hasOverflow && (
                <>
                  <SliderNavButton
                    direction="prev"
                    disabled={!machineControls.canPrev}
                    isDark={false}
                    buttonClassName={`${theme.control} ${theme.controlHover}`}
                    label="Previous machine"
                    onClick={() => machineSwiper?.slidePrev()}
                    className={getEdgeAlignedNavButtonClass('prev', 'hidden xl:inline-flex')}
                  />
                  <SliderNavButton
                    direction="next"
                    disabled={!machineControls.canNext}
                    isDark={false}
                    buttonClassName={`${theme.control} ${theme.controlHover}`}
                    label="Next machine"
                    onClick={() => machineSwiper?.slideNext()}
                    className={getEdgeAlignedNavButtonClass('next', 'hidden xl:inline-flex')}
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
                  const title =
                    renderText(item.modelLabel) ||
                    renderText(variantItem?.modelName) ||
                    'Unnamed Model'

                  return (
                    <SwiperSlide key={item._key ?? `${title}-${idx}`} className="!h-auto">
                      <MachineCard
                        item={item}
                        theme={theme}
                        shouldShowModelDescription={shouldShowModelDescription}
                        imageZoom={block.imageZoom}
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
                      aria-label={active ? `Currently at slide ${idx + 1}` : `Go to slide ${idx + 1}`}
                      {...(active ? { 'aria-current': 'step' } : {})}
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

        {renderText(block.footerText) && (
          <p className={`mt-8 text-center text-md font-semibold ${footerClass}`}>
            {renderText(block.footerText)}
          </p>
        )}
    </SectionShell>
  )
}

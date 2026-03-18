'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { getSafeHref, isExternalHref } from '@/app/lib/safeHref'
import { urlFor } from '@/app/lib/sanity'
import {
  getSectionToneClasses,
  heroDescriptionClass,
  heroSubtitleClass,
  heroTitleClass,
} from './sectionStyles'
import SplitHeroArrow from './SplitHeroArrow'

type HeroImage = {
  _key?: string
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

type HeroCtaButton = {
  _key?: string
  label?: string
  href?: string
  primary?: boolean
}

export type HeroBlockData = {
  _type: 'heroBlock'
  _key?: string
  title?: string
  subtitle?: string
  description?: string
  variant?: 'legacyBackgroundSlider' | 'splitProductShowcase'
  images?: HeroImage[]
  backgroundImage?: HeroImage
  ctaButtons?: HeroCtaButton[]
  alignment?: 'left' | 'right'
  mediaLayout?: 'textLeftImageRight' | 'imageLeftTextRight'
}

function hasImageIdentity(image?: HeroImage) {
  const ref = image?.asset?._ref?.trim()
  const id = image?.asset?._id?.trim()
  const url = image?.asset?.url?.trim()
  return Boolean(ref || id || url)
}

function resolveHeroImageSrc(image?: HeroImage, width = 1920, quality = 75) {
  if (!image) return undefined

  if (!hasImageIdentity(image)) return undefined

  try {
    return urlFor(image).width(width).fit('max').auto('format').quality(quality).url()
  } catch {
    return image?.asset?.url?.trim()
  }
}

function resolveHeroImageDimensions(
  image?: HeroImage,
  fallbackWidth = 1600,
  fallbackHeight = 1200
) {
  return {
    width: image?.asset?.metadata?.dimensions?.width ?? fallbackWidth,
    height: image?.asset?.metadata?.dimensions?.height ?? fallbackHeight,
  }
}

function resolveAlignment(value?: string): 'left' | 'right' {
  return value === 'right' ? 'right' : 'left'
}

function resolveVariant(value?: string): 'legacyBackgroundSlider' | 'splitProductShowcase' {
  return value === 'splitProductShowcase' ? 'splitProductShowcase' : 'legacyBackgroundSlider'
}

function resolveMediaLayout(value?: string): 'textLeftImageRight' | 'imageLeftTextRight' {
  return value === 'imageLeftTextRight' ? 'imageLeftTextRight' : 'textLeftImageRight'
}

function CtaButton({ button }: { button: HeroCtaButton }) {
  const label = button.label?.trim()
  const href = getSafeHref(button.href)

  if (!label || !href) return null

  const className = [
    'inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-colors',
    button.primary
      ? 'bg-orange-500 text-black hover:bg-orange-600'
      : 'border border-black/50 text-black hover:bg-black/10',
  ].join(' ')

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={className}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

function HeroAccent({
  className = '',
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'dark'
}) {
  const toneClasses = getSectionToneClasses(tone)

  return (
    <div className={`mb-7 flex ${className}`}>
      <span className={`h-1.5 w-20 rounded-full ${toneClasses.divider}`} />
    </div>
  )
}

function HeroTextContent({
  block,
  titleClassName,
  subtitleClassName,
  descriptionClassName,
  accentAlignClass,
  actionsClassName,
}: {
  block: HeroBlockData
  titleClassName: string
  subtitleClassName: string
  descriptionClassName: string
  accentAlignClass?: string
  actionsClassName?: string
}) {
  const title = block.title?.trim()
  const subtitle = block.subtitle?.trim()
  const description = block.description?.trim()

  return (
    <>
      {title && <h1 className={`whitespace-pre-line ${titleClassName}`}>{title}</h1>}

      {subtitle && <p className={`whitespace-pre-line ${subtitleClassName}`}>{subtitle}</p>}

      <HeroAccent
        className={accentAlignClass}
        tone={titleClassName.includes('text-white') ? 'dark' : 'light'}
      />

      {description && (
        <p className={`whitespace-pre-line ${descriptionClassName}`}>{description}</p>
      )}

      {!!block.ctaButtons?.length && (
        <div className={actionsClassName}>
          {block.ctaButtons.map((button) => (
            <CtaButton key={button._key ?? `${button.label}-${button.href}`} button={button} />
          ))}
        </div>
      )}
    </>
  )
}

function HeroIndicators({
  images,
  activeIndex,
  onSelect,
  layout = 'absolute',
}: {
  images: HeroImage[]
  activeIndex: number
  onSelect: (index: number) => void
  layout?: 'absolute' | 'mediaBelow'
}) {
  if (images.length <= 1) return null

  const containerClass =
    layout === 'mediaBelow'
      ? 'mt-5 flex items-center justify-center gap-2'
      : 'absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2'

  return (
    <div className={containerClass}>
      {images.map((item, index) => (
        <button
          key={item._key ?? index}
          type="button"
          onClick={() => onSelect(index)}
          className={`h-2.5 rounded-full transition-all ${
            index === activeIndex ? 'w-7 bg-orange-400' : 'w-2.5 bg-black/35 hover:bg-black/60'
          }`}
          aria-label={`Switch hero image ${index + 1}`}
        />
      ))}
    </div>
  )
}

function SplitHeroMedia({
  image,
  title,
  index,
  showControls,
  onPrevious,
  onNext,
  frameClassName = '',
}: {
  image?: HeroImage
  title?: string
  index: number
  showControls: boolean
  onPrevious: () => void
  onNext: () => void
  frameClassName?: string
}) {
  const src = resolveHeroImageSrc(image, 1800, 78)
  const resolvedFrameClassName = frameClassName || 'w-full'

  if (!src) {
    return (
      <div className="overflow-x-hidden px-5 sm:px-6">
        <div className={`mx-auto ${resolvedFrameClassName}`}>
          <div className="relative">
            {showControls && (
              <>
                <SplitHeroArrow
                  direction="previous"
                  onClick={onPrevious}
                  ariaLabel="Previous hero image"
                />
                <SplitHeroArrow
                  direction="next"
                  onClick={onNext}
                  ariaLabel="Next hero image"
                />
              </>
            )}

            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[1.5rem] border border-slate-300/60 bg-white/35">
              <span className="text-sm font-medium text-slate-500">Product image</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const dimensions = resolveHeroImageDimensions(image, 1800, 1350)
  const hasLqip = Boolean(image?.asset?.metadata?.lqip)

  return (
    <div className="overflow-x-hidden px-5 sm:px-6">
      <div className={`mx-auto ${resolvedFrameClassName}`}>
        <div className="relative">
          {showControls && (
            <>
              <SplitHeroArrow
                direction="previous"
                onClick={onPrevious}
                ariaLabel="Previous hero image"
              />
              <SplitHeroArrow
                direction="next"
                onClick={onNext}
                ariaLabel="Next hero image"
              />
            </>
          )}

          <Image
            key={image?._key ?? src}
            src={src}
            alt={image?.alt || title || `Hero product image ${index + 1}`}
            width={dimensions.width}
            height={dimensions.height}
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="h-auto w-full object-contain"
            placeholder={hasLqip ? 'blur' : 'empty'}
            blurDataURL={image?.asset?.metadata?.lqip}
            priority={index === 0}
          />
        </div>
      </div>
    </div>
  )
}

function LegacyHero({
  block,
  images,
  activeImageIndex,
  setActiveImageIndex,
}: {
  block: HeroBlockData
  images: HeroImage[]
  activeImageIndex: number
  setActiveImageIndex: (value: number) => void
}) {
  const safeActiveImageIndex = images.length > 0 ? activeImageIndex % images.length : 0
  const image = images[safeActiveImageIndex]
  const imageSrc = resolveHeroImageSrc(image)
  const align = resolveAlignment(block.alignment)
  const contentPositionClass = align === 'right' ? 'justify-end' : 'justify-start'
  const panelAlignClass = align === 'right' ? 'items-end text-right' : 'items-start text-left'
  const indicatorAlignClass = align === 'right' ? 'justify-end' : 'justify-start'

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
      <div className="relative min-h-[520px] sm:min-h-[620px] lg:min-h-[700px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={image?.alt || block.title || 'Hero image'}
            fill
            sizes="100vw"
            preload={safeActiveImageIndex === 0}
            fetchPriority={safeActiveImageIndex === 0 ? 'high' : 'auto'}
            loading={safeActiveImageIndex === 0 ? 'eager' : 'lazy'}
            quality={safeActiveImageIndex === 0 ? 74 : 68}
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-white" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/60 via-slate-800/35 to-slate-800/10" />

        <div
          className={`relative z-10 mx-auto flex min-h-[520px] max-w-7xl px-4 py-16 sm:min-h-[620px] sm:px-6 lg:min-h-[700px] lg:px-8 ${contentPositionClass}`}
        >
          <div className={`flex max-w-xl flex-col ${panelAlignClass}`}>
            <HeroTextContent
              block={block}
              titleClassName={`mb-3 ${heroTitleClass} text-white`}
              subtitleClassName={`mb-3 ${heroSubtitleClass} text-slate-200`}
              descriptionClassName={`whitespace-pre-line ${heroDescriptionClass} text-slate-100`}
              accentAlignClass={indicatorAlignClass}
              actionsClassName={`mt-8 flex flex-wrap gap-3 ${indicatorAlignClass}`}
            />
          </div>
        </div>

        <HeroIndicators
          images={images}
          activeIndex={safeActiveImageIndex}
          onSelect={setActiveImageIndex}
        />
      </div>
    </section>
  )
}

function SplitHero({
  block,
  images,
  activeImageIndex,
  setActiveImageIndex,
}: {
  block: HeroBlockData
  images: HeroImage[]
  activeImageIndex: number
  setActiveImageIndex: (value: number) => void
}) {
  const layout = resolveMediaLayout(block.mediaLayout)
  const safeActiveImageIndex = images.length > 0 ? activeImageIndex % images.length : 0
  const activeImage = images[safeActiveImageIndex]
  const backgroundImage = block.backgroundImage
  const backgroundSrc = resolveHeroImageSrc(backgroundImage, 2200, 72)
  const hasBackgroundLqip = Boolean(backgroundImage?.asset?.metadata?.lqip)

  const desktopGridClass =
    layout === 'imageLeftTextRight'
      ? 'lg:grid-cols-[45vw_minmax(0,1fr)]'
      : 'lg:grid-cols-[minmax(0,1fr)_45vw]'
  const textDesktopOrderClass = layout === 'imageLeftTextRight' ? 'lg:order-2' : 'lg:order-1'
  const mediaDesktopOrderClass = layout === 'imageLeftTextRight' ? 'lg:order-1' : 'lg:order-2'
  const textSpacingClass = layout === 'imageLeftTextRight' ? 'lg:pl-10 xl:pl-14' : 'lg:pr-10 xl:pr-14'
  const mediaAlignClass = layout === 'imageLeftTextRight' ? 'lg:justify-start' : 'lg:justify-end'
  const canPaginate = images.length > 1

  function showPreviousImage() {
    if (!canPaginate) return
    setActiveImageIndex((safeActiveImageIndex - 1 + images.length) % images.length)
  }

  function showNextImage() {
    if (!canPaginate) return
    setActiveImageIndex((safeActiveImageIndex + 1) % images.length)
  }

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden">
      <div className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[720px]">
        {backgroundSrc ? (
          <Image
            src={backgroundSrc}
            alt={backgroundImage?.alt || block.title || 'Hero background image'}
            fill
            sizes="100vw"
            preload
            fetchPriority="high"
            loading="eager"
            quality={72}
            className="object-cover object-center"
            placeholder={hasBackgroundLqip ? 'blur' : 'empty'}
            blurDataURL={backgroundImage?.asset?.metadata?.lqip}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(241,245,249,0.96)_36%,_rgba(226,232,240,0.98)_100%)]" />
        )}

        <div className="absolute inset-0 bg-white/38" />

        <div className="relative z-10 lg:hidden">
          <div className="flex min-h-[620px] flex-col gap-8 px-4 py-10 sm:min-h-[680px] sm:px-6 sm:py-14">
            <div className="flex flex-col items-center">
              <SplitHeroMedia
                image={activeImage}
                title={block.title}
                index={safeActiveImageIndex}
                showControls={canPaginate}
                onPrevious={showPreviousImage}
                onNext={showNextImage}
                frameClassName="w-[90vw] max-w-none"
              />
              <HeroIndicators
                images={images}
                activeIndex={safeActiveImageIndex}
                onSelect={setActiveImageIndex}
                layout="mediaBelow"
              />
            </div>

            <div className="mx-auto w-full max-w-7xl">
              <HeroTextContent
                block={block}
                titleClassName={`mb-3 text-slate-900 ${heroTitleClass}`}
                subtitleClassName={`mb-3 ${heroSubtitleClass} text-slate-500`}
                descriptionClassName={`whitespace-pre-line ${heroDescriptionClass} text-slate-700`}
                accentAlignClass="justify-start"
                actionsClassName="mt-8 flex flex-wrap gap-3 justify-start"
              />
            </div>
          </div>
        </div>

        <div className={`relative z-10 hidden min-h-[720px] items-center gap-8 px-[5vw] py-16 lg:grid ${desktopGridClass}`}>
          <div className={`flex ${mediaAlignClass} ${mediaDesktopOrderClass}`}>
            <div className="flex flex-col items-center">
              <SplitHeroMedia
                image={activeImage}
                title={block.title}
                index={safeActiveImageIndex}
                showControls={canPaginate}
                onPrevious={showPreviousImage}
                onNext={showNextImage}
                frameClassName="w-[45vw] max-w-none"
              />
              <HeroIndicators
                images={images}
                activeIndex={safeActiveImageIndex}
                onSelect={setActiveImageIndex}
                layout="mediaBelow"
              />
            </div>
          </div>

          <div className={`flex ${textDesktopOrderClass}`}>
            <div className={`max-w-xl text-left ${textSpacingClass}`}>
              <HeroTextContent
                block={block}
                titleClassName={`mb-3 text-slate-900 ${heroTitleClass}`}
                subtitleClassName={`mb-3 ${heroSubtitleClass} text-slate-500`}
                descriptionClassName={`whitespace-pre-line ${heroDescriptionClass} text-slate-700`}
                accentAlignClass="justify-start"
                actionsClassName="mt-8 flex flex-wrap gap-3 justify-start"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default function HeroBlock({ block }: { block: HeroBlockData }) {
  const images = useMemo(
    () => (block.images ?? []).filter((image) => hasImageIdentity(image)),
    [block.images]
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length])

  const variant = resolveVariant(block.variant)

  if (variant === 'splitProductShowcase') {
    return (
      <SplitHero
        block={block}
        images={images}
        activeImageIndex={activeImageIndex}
        setActiveImageIndex={setActiveImageIndex}
      />
    )
  }

  return (
    <LegacyHero
      block={block}
      images={images}
      activeImageIndex={activeImageIndex}
      setActiveImageIndex={setActiveImageIndex}
    />
  )
}

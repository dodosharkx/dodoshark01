'use client'

import Image from 'next/image'
import Link from 'next/link'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { A11y, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import { getSafeHref, isExternalHref } from '@/app/lib/safeHref'
import { urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'
import {
  getSharedSurfaceClasses,
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import {
  getEdgeAlignedNavButtonClass,
  SliderNavButton,
} from './PageBuilderSliderControls'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import { sectionSubtitleClass } from './sectionStyles'
import 'swiper/css'

type GalleryImage = {
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

type GalleryItem = {
  _key?: string
  type?: 'image' | 'videoUrl'
  image?: GalleryImage
  videoUrl?: string
  videoThumbnail?: GalleryImage
  caption?: string
  metaText?: string
}

type MediaGalleryCta = {
  label?: string
  href?: string
}

type ActiveVideo = {
  src: string
  title: string
}

export type MediaGalleryBlockData = {
  _type: 'mediaGalleryBlock'
  _key?: string
  title?: string
  backgroundVariant?: SharedBackgroundVariant
  layout?: 'carousel' | 'thumbnailGallery' | 'videoCardCarousel'
  cta?: MediaGalleryCta
  items?: GalleryItem[]
}

function hasImageIdentity(image?: GalleryImage) {
  const ref = image?.asset?._ref?.trim()
  const id = image?.asset?._id?.trim()
  return Boolean(ref || id)
}

function resolveImageSrc({
  image,
  width,
}: {
  image?: GalleryImage
  width: number
}) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl

  if (!hasImageIdentity(image)) return undefined

  try {
    return urlFor(image).width(width).fit('max').url()
  } catch {
    return undefined
  }
}

function resolveGalleryItemPreviewImage(item?: GalleryItem) {
  if (!item) return undefined
  return item.type === 'videoUrl' ? item.videoThumbnail : item.image
}

function resolveGalleryItemPreviewSrc(item: GalleryItem, width: number) {
  return resolveImageSrc({
    image: resolveGalleryItemPreviewImage(item),
    width,
  })
}

function resolveGalleryItemAlt(item: GalleryItem) {
  const image = resolveGalleryItemPreviewImage(item)
  return image?.alt || item.caption || (item.type === 'videoUrl' ? 'Video thumbnail' : 'Gallery image')
}

function getGalleryItemDimensions(item: GalleryItem, fallbackWidth: number, fallbackHeight: number) {
  const image = resolveGalleryItemPreviewImage(item)
  return {
    width: image?.asset?.metadata?.dimensions?.width ?? fallbackWidth,
    height: image?.asset?.metadata?.dimensions?.height ?? fallbackHeight,
  }
}

function getGalleryItemBlurDataUrl(item: GalleryItem) {
  return resolveGalleryItemPreviewImage(item)?.asset?.metadata?.lqip
}

function getGalleryItemLabel(item: GalleryItem, index: number) {
  const baseLabel = item.caption?.trim() || (item.type === 'videoUrl' ? 'Video item' : 'Image item')
  return `${baseLabel} ${index + 1}`
}

function extractYouTubeVideoId(url?: string) {
  const raw = url?.trim()
  if (!raw) return undefined

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return undefined
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) return undefined

  const host = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname
  if (host === 'youtu.be') {
    const id = pathname.split('/').filter(Boolean)[0]
    return id || undefined
  }

  if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
    if (pathname === '/watch') return parsed.searchParams.get('v') || undefined

    const segments = pathname.split('/').filter(Boolean)
    if (!segments.length) return undefined

    if (segments[0] === 'embed' && segments[1]) return segments[1]
    if ((segments[0] === 'shorts' || segments[0] === 'live') && segments[1]) return segments[1]
  }

  return undefined
}

function resolveYouTubePreviewThumbnail(url?: string, quality: 'default' | 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault') {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return undefined

  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
}

function isYouTubePreviewThumbnail(src?: string) {
  if (!src) return false

  try {
    const parsed = new URL(src)
    return parsed.hostname === 'i.ytimg.com' || parsed.hostname === 'img.youtube.com'
  } catch {
    return false
  }
}

function resolveVideoEmbedSrc(url?: string) {
  const raw = url?.trim()
  if (!raw) return undefined

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return undefined
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) return undefined

  const host = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname

  const withParam = (key: string, value: string) => {
    parsed.searchParams.set(key, value)
    return parsed.toString()
  }

  const youtubeId = extractYouTubeVideoId(url)
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
  }

  if (host.includes('vimeo.com')) {
    const segments = pathname.split('/').filter(Boolean)
    const videoId = segments.reverse().find((segment) => /^\d+$/.test(segment))
    if (videoId) return `https://player.vimeo.com/video/${videoId}?autoplay=1`
  }

  if (host.includes('bilibili.com')) {
    if (host.includes('player.bilibili.com')) return withParam('autoplay', '1')
    const match = pathname.match(/\/video\/([a-zA-Z0-9]+)/)
    if (match?.[1]) {
      return `https://player.bilibili.com/player.html?bvid=${match[1]}&autoplay=1`
    }
  }

  if (pathname.includes('/embed/')) return withParam('autoplay', '1')

  return withParam('autoplay', '1')
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" />
    </svg>
  )
}

function MediaGalleryCtaLink({
  cta,
  className = '',
}: {
  cta?: MediaGalleryCta
  className?: string
}) {
  const label = cta?.label?.trim()
  const href = getSafeHref(cta?.href)

  if (!label || !href) return null

  const buttonClassName = `inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto ${className}`.trim()

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={buttonClassName}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
      >
        {label}
        <ArrowRightIcon className="h-4 w-4" />
      </a>
    )
  }

  return (
    <Link href={href} className={buttonClassName}>
      {label}
      <ArrowRightIcon className="h-4 w-4" />
    </Link>
  )
}

function ImageTile({
  image,
  caption,
  theme,
}: {
  image?: GalleryImage
  caption?: string
  theme: SharedBackgroundTheme
}) {
  const src = resolveImageSrc({ image, width: 1200 })

  if (!src || !image) {
    return (
      <div
        className={`p-10 text-center text-sm ${theme.subtitle} ${getSharedSurfaceClasses(theme, 'muted')}`}
      >
        Image unavailable
      </div>
    )
  }

  const width = image.asset?.metadata?.dimensions?.width ?? 1200
  const height = image.asset?.metadata?.dimensions?.height ?? 900
  const hasLqip = Boolean(image.asset?.metadata?.lqip)

  return (
    <figure className="group">
      <div className="relative aspect-video overflow-hidden bg-slate-800 shadow-xl">
        <Image
          src={src}
          alt={image.alt || caption || 'Gallery image'}
          width={width}
          height={height}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          placeholder={hasLqip ? 'blur' : 'empty'}
          blurDataURL={image.asset?.metadata?.lqip}
        />
      </div>
      {caption && (
        <figcaption
          className={`mt-4 text-center text-sm font-bold uppercase tracking-wide ${theme.body}`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function VideoTile({
  url,
  thumbnail,
  caption,
  theme,
  onOpenVideo,
}: {
  url?: string
  thumbnail?: GalleryImage
  caption?: string
  theme: SharedBackgroundTheme
  onOpenVideo: (url?: string, caption?: string) => void
}) {
  if (!url) return null

  const width = thumbnail?.asset?.metadata?.dimensions?.width ?? 1280
  const height = thumbnail?.asset?.metadata?.dimensions?.height ?? 720
  const thumbnailSrc = resolveImageSrc({ image: thumbnail, width: 1200 })

  return (
    <button type="button" onClick={() => onOpenVideo(url, caption)} className="group block w-full text-left">
      <div className="relative aspect-video overflow-hidden bg-slate-800 shadow-xl">
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={thumbnail?.alt || caption || 'Video thumbnail'}
            width={width}
            height={height}
            className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-800 text-slate-200">
            <Icon icon="film" className="h-10 w-10" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-orange-500">
            <Icon icon="play" className="ml-1 h-6 w-6" />
          </div>
        </div>
      </div>
      {caption && (
        <h5
          className={`mt-4 text-center text-sm font-bold font-display uppercase tracking-widest ${theme.heading}`}
        >
          {caption}
        </h5>
      )}
    </button>
  )
}

function GalleryTile({
  item,
  theme,
  onOpenVideo,
}: {
  item: GalleryItem
  theme: SharedBackgroundTheme
  onOpenVideo: (url?: string, caption?: string) => void
}) {
  if (item.type === 'videoUrl') {
    return (
      <VideoTile
        url={item.videoUrl}
        thumbnail={item.videoThumbnail}
        caption={item.caption}
        theme={theme}
        onOpenVideo={onOpenVideo}
      />
    )
  }

  return <ImageTile image={item.image} caption={item.caption} theme={theme} />
}

function ThumbnailGalleryStage({
  item,
  onOpenVideo,
}: {
  item: GalleryItem
  onOpenVideo: (url?: string, caption?: string) => void
}) {
  const previewSrc = resolveGalleryItemPreviewSrc(item, 1800)
  const { width, height } = getGalleryItemDimensions(item, 1800, 1200)
  const blurDataURL = getGalleryItemBlurDataUrl(item)
  const hasLqip = Boolean(blurDataURL)
  const isVideo = item.type === 'videoUrl'

  if (!previewSrc) {
    if (isVideo) {
      return (
        <button
          type="button"
          onClick={() => onOpenVideo(item.videoUrl, item.caption)}
          className="group relative block aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-left shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)] sm:aspect-[16/10]"
        >
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <Icon icon="film" className="h-14 w-14 sm:h-16 sm:w-16" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-orange-500 sm:h-20 sm:w-20">
              <Icon icon="play" className="ml-1 h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </div>
        </button>
      )
    }

    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-sm text-slate-400 sm:aspect-[16/10]">
        Media unavailable
      </div>
    )
  }

  const media = (
    <>
      <Image
        src={previewSrc}
        alt={resolveGalleryItemAlt(item)}
        width={width}
        height={height}
        className={`h-full w-full object-cover transition-transform duration-700 ${isVideo ? 'opacity-75 group-hover:scale-[1.03]' : 'group-hover:scale-[1.02]'}`}
        placeholder={hasLqip ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1120px"
      />
      {isVideo && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-orange-500 sm:h-20 sm:w-20">
              <Icon icon="play" className="ml-1 h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </div>
        </>
      )}
    </>
  )

  if (isVideo) {
    return (
      <button
        type="button"
        onClick={() => onOpenVideo(item.videoUrl, item.caption)}
        className="group relative block aspect-[4/3] w-full overflow-hidden bg-slate-900 text-left shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)] sm:aspect-[16/10]"
      >
        {media}
      </button>
    )
  }

  return (
    <div className="group relative aspect-[4/3] w-full overflow-hidden bg-slate-900 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)] sm:aspect-[16/10]">
      {media}
    </div>
  )
}

const ThumbnailGalleryThumb = forwardRef<HTMLButtonElement, {
  item: GalleryItem
  index: number
  isActive: boolean
  onSelect: () => void
  theme: SharedBackgroundTheme
}>(
  function ThumbnailGalleryThumb(
    {
      item,
      index,
      isActive,
      onSelect,
      theme,
    },
    ref
  ) {
    const previewSrc = resolveGalleryItemPreviewSrc(item, 320)
    const { width, height } = getGalleryItemDimensions(item, 320, 240)
    const isVideo = item.type === 'videoUrl'
    const idleBorder = getSharedSurfaceClasses(theme)
    const activeBorder = `${getSharedSurfaceClasses(theme, 'elevated')} border-orange-500 ring-2 ring-orange-500/25`

    return (
      <button
        ref={ref}
        type="button"
        onClick={onSelect}
        className={`group relative block w-full overflow-hidden border transition-all duration-300 ${isActive ? activeBorder : idleBorder}`}
        aria-label={getGalleryItemLabel(item, index)}
        aria-pressed={isActive}
      >
        <div className="relative aspect-[5/4] bg-slate-900">
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt={resolveGalleryItemAlt(item)}
              width={width}
              height={height}
              className={`h-full w-full object-cover transition duration-300 ${isActive ? 'scale-[1.02]' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`}
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 120px, 144px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
              <Icon icon={isVideo ? 'film' : 'image'} className="h-6 w-6" />
            </div>
          )}

          <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-black/10' : 'bg-black/25 group-hover:bg-black/15'}`} />

          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                <Icon icon="play" className="ml-0.5 h-3.5 w-3.5" />
              </div>
            </div>
          )}
        </div>
      </button>
    )
  }
)

ThumbnailGalleryThumb.displayName = 'ThumbnailGalleryThumb'

function ThumbnailGallery({
  items,
  theme,
  captionClassName,
  onOpenVideo,
}: {
  items: GalleryItem[]
  theme: SharedBackgroundTheme
  captionClassName: string
  onOpenVideo: (url?: string, caption?: string) => void
}) {
  const [mainSwiper, setMainSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const clampedActiveIndex = Math.min(activeIndex, Math.max(items.length - 1, 0))

  useEffect(() => {
    const activeThumbnail = thumbnailRefs.current[clampedActiveIndex]
    if (!activeThumbnail) return

    activeThumbnail.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [clampedActiveIndex])

  if (items.length === 0) return null

  const activeItem = items[clampedActiveIndex]
  const desktopTrackClassName =
    items.length < 5 ? 'lg:justify-center' : 'lg:justify-start'

  return (
    <div>
      <Swiper
        modules={[A11y, Keyboard]}
        onSwiper={setMainSwiper}
        slidesPerView={1}
        speed={500}
        keyboard={{ enabled: true }}
        allowTouchMove={items.length > 1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        a11y={{
          slideLabelMessage: 'Gallery item {{index}}',
          prevSlideMessage: 'Previous media item',
          nextSlideMessage: 'Next media item',
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={item._key ?? `${item.caption}-${index}`}>
            <ThumbnailGalleryStage item={item} onOpenVideo={onOpenVideo} />
          </SwiperSlide>
        ))}
      </Swiper>

      {activeItem?.caption && (
        <p className={`mt-5 text-center text-sm font-bold uppercase tracking-[0.24em] sm:text-base ${captionClassName}`}>
          {activeItem.caption}
        </p>
      )}

      {items.length > 1 && (
        <div className="mt-6 overflow-x-auto pb-2">
          <div className={`flex min-w-full gap-3 ${desktopTrackClassName}`}>
            {items.map((item, index) => (
              <div
                key={`${item._key ?? item.caption ?? 'thumb'}-${index}`}
                className="w-[96px] shrink-0 sm:w-[112px] md:w-[136px] lg:w-[calc((100%-48px)/5)]"
              >
                <ThumbnailGalleryThumb
                  ref={(node) => {
                    thumbnailRefs.current[index] = node
                  }}
                  item={item}
                  index={index}
                  isActive={index === clampedActiveIndex}
                  onSelect={() => mainSwiper?.slideTo(index)}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function HomeStyleVideoCard({
  item,
  theme,
  onOpenVideo,
}: {
  item: GalleryItem
  theme: SharedBackgroundTheme
  onOpenVideo: (url?: string, caption?: string) => void
}) {
  const previewSrc = resolveGalleryItemPreviewSrc(item, 960)
  const youtubeFallbackSrc = item.type === 'videoUrl' ? resolveYouTubePreviewThumbnail(item.videoUrl) : undefined
  const resolvedPreviewSrc = previewSrc || youtubeFallbackSrc
  const shouldUseNativeImage = !previewSrc && isYouTubePreviewThumbnail(youtubeFallbackSrc)
  const { width, height } = getGalleryItemDimensions(item, 960, 720)
  const blurDataURL = getGalleryItemBlurDataUrl(item)
  const hasLqip = Boolean(blurDataURL)
  const isVideo = item.type === 'videoUrl'
  const title = item.caption?.trim() || (isVideo ? 'Video item' : 'Gallery image')
  const metaText = item.metaText?.trim()

  const cardBody = (
    <>
      <div className="relative h-56 overflow-hidden md:h-48">
        {resolvedPreviewSrc ? (
          shouldUseNativeImage ? (
            <img
              src={resolvedPreviewSrc}
              alt={resolveGalleryItemAlt(item)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <Image
              src={resolvedPreviewSrc}
              alt={resolveGalleryItemAlt(item)}
              width={width}
              height={height}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              placeholder={hasLqip ? 'blur' : 'empty'}
              blurDataURL={blurDataURL}
              sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-500">
            <Icon icon={isVideo ? 'film' : 'image'} className="h-10 w-10" />
          </div>
        )}

        {isVideo && <div className="absolute inset-0 bg-black/10" />}

        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-orange-500/95 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Icon icon="play" className="ml-1 h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{title}</h3>
        {metaText && <p className="mt-2 text-xs text-slate-400">{metaText}</p>}
      </div>
    </>
  )

  if (isVideo) {
    return (
      <button
        type="button"
        onClick={() => onOpenVideo(item.videoUrl, item.caption)}
        className={`group flex h-full w-full flex-col overflow-hidden rounded-[1rem] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.surfaceElevated}`}
      >
        {cardBody}
      </button>
    )
  }

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-[1rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.surfaceElevated}`}>
      {cardBody}
    </article>
  )
}

function VideoCardCarousel({
  title,
  cta,
  items,
  theme,
  onOpenVideo,
}: {
  title?: string
  cta?: MediaGalleryCta
  items: GalleryItem[]
  theme: SharedBackgroundTheme
  onOpenVideo: (url?: string, caption?: string) => void
}) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(items.length <= 1)

  function syncSwiperState(instance: SwiperInstance) {
    setIsBeginning(instance.isBeginning || instance.isLocked)
    setIsEnd(instance.isEnd || instance.isLocked)
  }

  return (
    <>
      {title && (
        <SectionHeader
          title={title}
          tone="light"
          align="center"
          className="mb-10 md:mb-12"
          titleClassName={theme.heading}
        />
      )}

      {items.length > 0 && (
        <div className="group relative mx-auto max-w-7xl">
          <div className="relative overflow-x-hidden">
            <SliderNavButton
              direction="prev"
              disabled={isBeginning}
              isDark={false}
              buttonClassName={`${theme.control} ${theme.controlHover}`}
              label="Previous videos"
              onClick={() => swiper?.slidePrev()}
              className={getEdgeAlignedNavButtonClass('prev', 'xl:opacity-0 xl:group-hover:opacity-100')}
            />

            <SliderNavButton
              direction="next"
              disabled={isEnd}
              isDark={false}
              buttonClassName={`${theme.control} ${theme.controlHover}`}
              label="Next videos"
              onClick={() => swiper?.slideNext()}
              className={getEdgeAlignedNavButtonClass('next', 'xl:opacity-0 xl:group-hover:opacity-100')}
            />

            <Swiper
              key={items.length}
              modules={[A11y, Keyboard]}
              slidesPerView={1}
              spaceBetween={24}
              speed={500}
              keyboard={{ enabled: true }}
              watchOverflow
              breakpoints={{
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 4 },
              }}
              onSwiper={(instance) => {
                setSwiper(instance)
                syncSwiperState(instance)
              }}
              onSlideChange={syncSwiperState}
              onBreakpoint={syncSwiperState}
              onResize={syncSwiperState}
              a11y={{
                slideLabelMessage: 'Video card {{index}}',
                prevSlideMessage: 'Previous videos',
                nextSlideMessage: 'Next videos',
              }}
            >
              {items.map((item, index) => (
                <SwiperSlide key={item._key ?? `${item.caption ?? 'media-card'}-${index}`} className="h-auto">
                  <HomeStyleVideoCard item={item} theme={theme} onOpenVideo={onOpenVideo} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {getSafeHref(cta?.href) && (
        <div className="mt-10 text-center">
          <MediaGalleryCtaLink cta={cta} />
        </div>
      )}
	    </>
	  )
	}

export default function MediaGalleryBlock({ block }: { block: MediaGalleryBlockData }) {
  const variant = block.backgroundVariant ?? 'white'
  const theme = getSharedBackgroundTheme(variant)
  const layout =
    block.layout === 'carousel' || block.layout === 'videoCardCarousel'
      ? block.layout
      : 'thumbnailGallery'
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null)
  const hasCta = Boolean(block.cta?.label?.trim() && getSafeHref(block.cta?.href))
  const showInlineSectionCta = hasCta && layout !== 'videoCardCarousel'
  const items = (block.items ?? []).filter(
    (item) =>
      (item.type === 'videoUrl' && item.videoUrl) ||
      (item.type !== 'videoUrl' && Boolean(resolveImageSrc({ image: item.image, width: 1200 })))
  )

  function openVideo(url?: string, caption?: string) {
    const src = resolveVideoEmbedSrc(url)
    if (!src) return
    setActiveVideo({
      src,
      title: caption?.trim() || 'Video',
    })
  }

  function closeVideo() {
    setActiveVideo(null)
  }

  useEffect(() => {
    if (!activeVideo) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveVideo(null)
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [activeVideo])

  if (!block.title && items.length === 0 && !hasCta) return null

  return (
    <>
      <SectionShell
        spacing={layout === 'videoCardCarousel' ? 'compact' : 'default'}
        sectionClassName={theme.section}
      >
        {block.title && layout !== 'videoCardCarousel' && (
          <SectionHeader
            title={block.title}
            tone="light"
            className="mb-10 md:mb-12"
            titleClassName={theme.heading}
            subtitleClassName={`mx-auto max-w-3xl ${sectionSubtitleClass} ${theme.subtitle}`}
          />
        )}

        {showInlineSectionCta && (
          <div
            className={
              block.title
                ? '-mt-4 mb-10 text-center md:-mt-6 md:mb-12'
                : 'mb-10 text-center md:mb-12'
            }
          >
            <MediaGalleryCtaLink cta={block.cta} />
          </div>
        )}

        {layout === 'carousel' && (
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
            {items.map((item, index) => (
              <div
                key={item._key ?? `${item.caption}-${index}`}
                className="max-w-[500px] min-w-[280px] snap-start md:min-w-[420px]"
              >
                <GalleryTile item={item} theme={theme} onOpenVideo={openVideo} />
              </div>
            ))}
          </div>
        )}

        {layout === 'thumbnailGallery' && (
          <ThumbnailGallery
            items={items}
            theme={theme}
            captionClassName={theme.body}
            onOpenVideo={openVideo}
          />
        )}

        {layout === 'videoCardCarousel' && (
          <VideoCardCarousel
            title={block.title}
            cta={block.cta}
            items={items}
            theme={theme}
            onOpenVideo={openVideo}
          />
        )}
      </SectionShell>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={closeVideo}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
            <div className="w-full" onClick={(event) => event.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between text-white">
                <h3 className="text-sm font-semibold tracking-wide md:text-base">{activeVideo.title}</h3>
                <button
                  type="button"
                  onClick={closeVideo}
                  className="rounded-md border border-white/30 px-4 py-1.5 text-xs transition-colors hover:bg-white/15 md:text-sm"
                >
                  Close
                </button>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
                <iframe
                  src={activeVideo.src}
                  title={activeVideo.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

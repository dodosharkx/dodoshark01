'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import { urlFor } from '@/app/lib/sanity'
import { normalizeYouTubeEmbedUrl } from '@/app/lib/video'
import Icon from '@/components/ui/Icon'
import { getSharedBackgroundTheme } from './backgroundTheme'
import SectionHeader from './SectionHeader'

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

type MachineGroupCta = {
  enabled?: boolean
  label?: string
  targetType?: 'link' | 'youtube'
  href?: string
  youtubeUrl?: string
}

type MachineGroup = {
  _key?: string
  label?: string
  description?: string
  cta?: MachineGroupCta
  items?: MachineItem[]
}

type ActiveGroupCta = {
  label: string
  href?: string
  embedUrl?: string
}

type ActiveVideo = {
  title: string
  src: string
}

export type MachineSelectorBlockData = {
  _type: 'machineSelectorBlock'
  _key?: string
  title?: string
  subtitle?: string
  backgroundVariant?: 'default' | 'muted' | 'dark'
  groups?: MachineGroup[]
  defaultGroupIndex?: number
  maxItemsPerRow?: 1 | 2 | 3 | 4 | 5
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

function resolveColumnsClass(columns?: number) {
  if (columns === 1) return ''
  if (columns === 2) return 'md:grid-cols-2'
  if (columns === 3) return 'md:grid-cols-2 lg:grid-cols-3'
  if (columns === 5) return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  return 'md:grid-cols-2 lg:grid-cols-4'
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href)
}

function resolveActiveGroupCta(group?: MachineGroup): ActiveGroupCta | undefined {
  const cta = group?.cta
  if (!cta?.enabled) return undefined

  const label = cta.label?.trim()
  if (!label) return undefined

  if (cta.targetType === 'youtube') {
    const embedUrl = normalizeYouTubeEmbedUrl(cta.youtubeUrl?.trim() || '')
    return embedUrl ? { label, embedUrl } : undefined
  }

  const href = cta.href?.trim()
  return href ? { label, href } : undefined
}

export default function MachineSelectorBlock({ block }: { block: MachineSelectorBlockData }) {
  const variant = block.backgroundVariant ?? 'muted'
  const theme = getSharedBackgroundTheme(variant)
  const isDark = variant === 'dark'

  const groups = useMemo(
    () => (block.groups ?? []).filter((group) => (group.items ?? []).length > 0 && group.label?.trim()),
    [block.groups],
  )

  const initialIndex = Number.isInteger(block.defaultGroupIndex)
    ? Math.max(0, Math.min(block.defaultGroupIndex as number, Math.max(groups.length - 1, 0)))
    : 0
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null)
  const mobileGroupRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeGroup = groups[activeIndex]
  const activeItems = (activeGroup?.items ?? []).filter((item) => item.productVariant)
  const activeCta = useMemo(() => resolveActiveGroupCta(activeGroup), [activeGroup])

  const tabActiveClass = isDark
    ? 'bg-orange-400 text-slate-900'
    : 'bg-orange-400 text-slate-900'
  const tabInactiveClass = isDark
    ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
    : 'bg-slate-800 text-white hover:bg-slate-700'
  const footerClass = isDark ? 'text-slate-300' : 'text-slate-700'
  const groupDescriptionClass = isDark ? 'text-slate-300' : theme.body
  const subtitleClass = isDark ? theme.subtitle : theme.body
  const shouldShowModelDescription = block.showModelDescription !== false
  const stickyTabsClass = isDark
    ? 'bg-slate-800/95 border-slate-700'
    : 'bg-white/95 border-slate-200'
  const ctaButtonClass = isDark
    ? 'border-orange-300 bg-orange-400 text-slate-950 hover:border-orange-200 hover:bg-orange-300'
    : 'border-[#d9b24d] bg-[#e3ba48] text-[#19335d] hover:border-[#c9a03b] hover:bg-[#d7ae3d]'
  const ctaButtonBaseClass = `inline-flex min-h-14 items-center justify-center rounded-md border px-8 py-4 text-center text-lg font-black tracking-[0.03em] transition-colors ${ctaButtonClass}`

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return
    mobileGroupRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeIndex])

  useEffect(() => {
    setActiveVideo(null)
  }, [activeIndex])

  useEffect(() => {
    if (!activeVideo) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideo(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeVideo])

  if (!block.title && !block.subtitle && groups.length === 0) return null

  return (
    <>
      <section className={`py-24 ${theme.section}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(block.title || block.subtitle) && (
            <SectionHeader
              title={block.title}
              subtitle={block.subtitle}
              isDark={isDark}
              className="mb-10"
              titleClassName={`text-3xl md:text-4xl font-display font-black tracking-tight ${theme.heading}`}
              subtitleClassName={`max-w-3xl mx-auto text-base md:text-lg ${subtitleClass}`}
            />
          )}

          {groups.length > 0 && (
            <>
              <div className={`md:hidden sticky top-20 z-40 -mx-4 mb-8 border-y px-4 py-3 backdrop-blur-md ${stickyTabsClass}`}>
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
                  {groups.map((group, idx) => {
                    const active = idx === activeIndex
                    return (
                      <button
                        key={`mobile-${group._key ?? `${group.label}-${idx}`}`}
                        ref={(node) => {
                          mobileGroupRefs.current[idx] = node
                        }}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-pressed={active}
                        className={`shrink-0 rounded-sm px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${active ? tabActiveClass : tabInactiveClass}`}
                      >
                        {group.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="hidden md:flex mb-10 flex-wrap justify-center gap-4">
                {groups.map((group, idx) => {
                  const active = idx === activeIndex
                  return (
                    <button
                      key={`desktop-${group._key ?? `${group.label}-${idx}`}`}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-pressed={active}
                      className={`min-w-[180px] rounded-sm px-6 py-3 text-base font-black transition-colors ${active ? tabActiveClass : tabInactiveClass}`}
                    >
                      {group.label}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {activeGroup?.description && (
            <p className={`mb-8 text-center text-sm md:text-base ${groupDescriptionClass}`}>
              {activeGroup.description}
            </p>
          )}

          <div className={`grid grid-cols-1 gap-6 ${resolveColumnsClass(block.maxItemsPerRow ?? 4)}`}>
            {activeItems.map((item, idx) => {
              const variantItem = item.productVariant
              const title = item.modelLabel?.trim() || variantItem?.modelName?.trim() || 'Unnamed Model'
              const description = variantItem?.shortDescription?.trim()
              const image = variantItem?.image
              const src = resolveImageSrc(image)

              return (
                <article
                  key={item._key ?? `${title}-${idx}`}
                  className={`rounded-[0.75rem] p-5 ${
                    item.isFeatured ? 'ring-2 ring-orange-400 bg-white shadow-lg' : 'bg-white border border-slate-200'
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
            })}
          </div>

          {activeCta && (
            <div className="mt-10 flex justify-center">
              {activeCta.href ? (
                isExternalHref(activeCta.href) ? (
                  <a
                    href={activeCta.href}
                    target={activeCta.href.startsWith('http') ? '_blank' : undefined}
                    rel={activeCta.href.startsWith('http') ? 'noreferrer' : undefined}
                    className={ctaButtonBaseClass}
                  >
                    {activeCta.label}
                  </a>
                ) : (
                  <Link href={activeCta.href} className={ctaButtonBaseClass}>
                    {activeCta.label}
                  </Link>
                )
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    activeCta.embedUrl &&
                    setActiveVideo({
                      title: activeGroup?.label?.trim() || activeCta.label,
                      src: activeCta.embedUrl,
                    })
                  }
                  className={ctaButtonBaseClass}
                >
                  {activeCta.label}
                </button>
              )}
            </div>
          )}

          {block.footerText && (
            <p className={`mt-12 text-center text-xl font-semibold ${footerClass}`}>{block.footerText}</p>
          )}
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          onClick={() => setActiveVideo(null)}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
            <div className="w-full" onClick={(event) => event.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between text-white">
                <h3 className="text-sm font-semibold tracking-wide md:text-base">{activeVideo.title}</h3>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
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

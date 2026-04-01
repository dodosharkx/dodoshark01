'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useEffectEvent, useState } from 'react'

import { renderSentenceCase } from '@/app/lib/sanity-utils'
import Icon from '@/components/ui/Icon'

export type LandingCardItem = {
  id: string
  href: string
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  imageAspectRatio?: number
  logoSrc?: string
  logoAlt?: string
  tag: string
  metaText?: string
}

type LandingCardPagerProps = {
  items: LandingCardItem[]
  initialPage: number
  pathname: string
  filterParamName?: 'category' | 'industry' | 'tag'
  filterParamValue?: string
  emptyMessage: string
  imageAspectClassName?: string
  tagClassName?: string
  tagLabelClassName?: string
}

type ViewportMode = 'mobile' | 'tablet' | 'desktop'

function resolveViewportMode(width: number): ViewportMode {
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function getPaginationSettings(mode: ViewportMode) {
  if (mode === 'mobile') {
    return {
      columnsClassName: 'grid-cols-1',
      itemsPerPage: 6,
    }
  }

  if (mode === 'tablet') {
    return {
      columnsClassName: 'grid-cols-2',
      itemsPerPage: 12,
    }
  }

  return {
    columnsClassName: 'grid-cols-3',
    itemsPerPage: 12,
  }
}

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages)
}

function buildHref({
  pathname,
  filterParamName,
  filterParamValue,
  page,
}: {
  pathname: string
  filterParamName?: 'category' | 'industry' | 'tag'
  filterParamValue?: string
  page?: number
}) {
  const params = new URLSearchParams()

  if (filterParamName && filterParamValue) {
    params.set(filterParamName, filterParamValue)
  }

  if (page && page > 1) {
    params.set('page', String(page))
  }

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

function CardCta() {
  return (
    <span className="inline-flex items-center gap-1 text-center text-sm font-semibold text-[#14b8a6] underline decoration-current underline-offset-4 transition-colors duration-200 group-hover:text-[#f59e0b] group-focus-within:text-[#f59e0b]">
      View Details
      <Icon
        icon="arrow-right"
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5"
      />
    </span>
  )
}

export default function LandingCardPager({
  items,
  initialPage,
  pathname,
  filterParamName,
  filterParamValue,
  emptyMessage,
  imageAspectClassName = 'aspect-[4/3]',
  tagClassName,
  tagLabelClassName,
}: LandingCardPagerProps) {
  const router = useRouter()
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop')
  const [currentPage, setCurrentPage] = useState(initialPage)

  const syncViewportMode = useEffectEvent(() => {
    const nextMode = resolveViewportMode(window.innerWidth)
    setViewportMode((prevMode) => (prevMode === nextMode ? prevMode : nextMode))
  })

  useEffect(() => {
    syncViewportMode()
    window.addEventListener('resize', syncViewportMode)
    return () => window.removeEventListener('resize', syncViewportMode)
  }, [syncViewportMode])

  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const { columnsClassName, itemsPerPage } = getPaginationSettings(viewportMode)
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))
  const safeCurrentPage = clampPage(currentPage, totalPages)
  const pageStart = (safeCurrentPage - 1) * itemsPerPage
  const visibleItems = items.slice(pageStart, pageStart + itemsPerPage)

  useEffect(() => {
    if (!items.length || currentPage === safeCurrentPage) return

    setCurrentPage(safeCurrentPage)
    router.replace(
      buildHref({
        pathname,
        filterParamName,
        filterParamValue,
        page: safeCurrentPage,
      }),
      { scroll: false },
    )
  }, [currentPage, filterParamName, filterParamValue, items.length, pathname, router, safeCurrentPage])

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      <div className={`mb-16 grid gap-8 ${columnsClassName}`}>
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className="premium-card group relative flex flex-col overflow-hidden focus-within:-translate-y-[6px] focus-within:border-orange-500/40 focus-within:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)]"
          >
            <Link
              href={item.href}
              className="absolute inset-0 z-10 rounded-[inherit] focus-visible:outline-none"
              aria-label={`View Details - ${item.title}`}
            >
              <span className="sr-only">View Details - {item.title}</span>
            </Link>
            <div
              className={`relative overflow-hidden bg-slate-100 ${imageAspectClassName} card-image-container`}
              id={`card-image-${item.id}`}
            >
              {item.imageAspectRatio && (
                <style>
                  {`#card-image-${item.id} { aspect-ratio: ${item.imageAspectRatio}; }`}
                </style>
              )}
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt || item.title || 'Card image'}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300">
                  <Icon icon="image" className="h-10 w-10" />
                </div>
              )}

              {item.logoSrc ? (
                <div className="absolute bottom-4 left-4 z-[1] inline-flex max-w-[min(10rem,calc(100%-2rem))] items-center justify-center rounded-2xl border border-white/30 bg-white/92 px-3 py-2 shadow-[0_18px_38px_-22px_rgba(15,23,42,0.95)] backdrop-blur-sm">
                  <Image
                    src={item.logoSrc}
                    alt={item.logoAlt || `${item.title} logo`}
                    width={132}
                    height={40}
                    sizes="132px"
                    className="h-6 w-auto object-contain"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col p-7">
              <div className="mb-4 flex justify-center">
                <div
                  className={`inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[13px] font-semibold leading-none text-orange-600 shadow-[0_8px_24px_rgba(249,115,22,0.08)] ${
                    tagClassName ?? ''
                  }`}
                  title={renderSentenceCase(item.tag)}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                  <span className={`block truncate ${tagLabelClassName ?? 'max-w-[180px]'}`}>
                    {renderSentenceCase(item.tag)}
                  </span>
                </div>
              </div>

              {item.metaText ? (
                <div className="mb-4 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  <Icon icon="location" className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.metaText}</span>
                </div>
              ) : null}

              <h3 className="mb-3 text-xl font-display font-black leading-tight text-slate-900 transition-colors group-hover:text-orange-600 group-focus-within:text-orange-600">
                {item.title}
              </h3>

              <p className="line-clamp-3 text-sm font-light leading-relaxed text-slate-500">{item.description}</p>

              <div className="mt-auto flex items-center justify-center pt-5">
                <CardCta />
              </div>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1
            const active = pageNumber === safeCurrentPage

            return (
              <Link
                key={pageNumber}
                href={buildHref({
                  pathname,
                  filterParamName,
                  filterParamValue,
                  page: pageNumber,
                })}
                className="group flex h-12 w-12 items-center justify-center -mx-3 -my-3"
                aria-label={`Go to page ${pageNumber}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setCurrentPage(pageNumber)}
              >
                <div className={`h-3 rounded-full transition-all ${
                  active ? 'w-8 bg-orange-500' : 'w-3 bg-slate-200 group-hover:bg-slate-300'
                }`} />
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

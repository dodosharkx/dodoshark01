'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import { normalizeYouTubeEmbedUrl } from '@/app/lib/video'
import VideoLightbox from '@/components/page-builder/VideoLightbox'
import Icon from '@/components/ui/Icon'

export type VlogVideoCardItem = {
  id: string
  title: string
  excerpt: string
  imageSrc?: string
  imageAlt?: string
  youtubeUrl?: string
  tagLabel: string
}

type ActiveVideo = {
  src: string
  title: string
}

type VlogVideoGridProps = {
  items: VlogVideoCardItem[]
}

function PlayButton() {
  return (
    <div className="relative z-[1] flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110">
      <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  )
}

function toSentenceCase(value: string) {
  const normalized = value.trim().replace(/\s+/g, ' ').toLowerCase()
  if (!normalized) return ''

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export default function VlogVideoGrid({ items }: VlogVideoGridProps) {
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null)

  const resolvedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        embedSrc: normalizeYouTubeEmbedUrl(item.youtubeUrl || ''),
      })),
    [items],
  )

  return (
    <>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {resolvedItems.map((item) => {
          const canPlay = Boolean(item.embedSrc)

          return (
            <article key={item.id} className="premium-card group flex flex-col overflow-hidden">
              <button
                type="button"
                className={`flex h-full flex-col text-left ${canPlay ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => {
                  if (!item.embedSrc) return
                  setActiveVideo({
                    src: item.embedSrc,
                    title: item.title,
                  })
                }}
                disabled={!canPlay}
                aria-label={canPlay ? `Play ${item.title}` : `${item.title} video is unavailable`}
              >
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt || item.title || 'Video cover'}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Icon icon="film" className="h-10 w-10" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/20 transition-colors group-hover:bg-slate-900/10 group-focus-visible:bg-slate-900/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {canPlay ? (
                      <PlayButton />
                    ) : (
                      <div className="rounded-full bg-slate-900/75 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                        Unavailable
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-8">
                  <div className="mb-4 flex justify-center">
                    <div
                      className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[13px] font-semibold leading-none text-orange-600 shadow-[0_8px_24px_rgba(249,115,22,0.08)]"
                      title={toSentenceCase(item.tagLabel)}
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                      <span className="block truncate max-w-[180px]">
                        {toSentenceCase(item.tagLabel)}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-4 line-clamp-2 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-orange-500 group-focus-visible:text-orange-500">
                    {item.title}
                  </h3>
                  <p className="line-clamp-3 text-sm font-light text-slate-500">
                    {item.excerpt || 'Watch the full video for equipment demos and process highlights.'}
                  </p>
                  <div className="mt-auto flex items-center justify-center border-t border-slate-50 pt-6">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#14b8a6] underline decoration-current underline-offset-4 transition-colors duration-200 group-hover:text-[#f59e0b] group-focus-visible:text-[#f59e0b]">
                      {canPlay ? 'Play Video' : 'Video Unavailable'}
                      <Icon icon="arrow-right" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </button>
            </article>
          )
        })}
      </div>

      {activeVideo ? (
        <VideoLightbox
          src={activeVideo.src}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      ) : null}
    </>
  )
}

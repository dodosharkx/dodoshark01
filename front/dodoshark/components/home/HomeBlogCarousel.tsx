'use client'

import { useEffect, useState } from 'react'

import VideoPreviewTrigger from '@/components/ui/VideoPreviewTrigger'

export type HomeBlogCarouselItem = {
  id: string
  title: string
  metaText: string
  youtubeUrl?: string
  imageSrc?: string
  imageAlt?: string
}

type HomeBlogCarouselProps = {
  items: HomeBlogCarouselItem[]
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" />
    </svg>
  )
}

export default function HomeBlogCarousel({ items }: HomeBlogCarouselProps) {
  const [itemsVisible, setItemsVisible] = useState(4)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    function syncItemsVisible() {
      if (window.innerWidth < 768) {
        setItemsVisible(1)
        return
      }

      if (window.innerWidth < 1200) {
        setItemsVisible(2)
        return
      }

      setItemsVisible(4)
    }

    syncItemsVisible()
    window.addEventListener('resize', syncItemsVisible)
    return () => window.removeEventListener('resize', syncItemsVisible)
  }, [])

  const maxIndex = Math.max(0, items.length - itemsVisible)
  const safeCurrentIndex = Math.min(currentIndex, maxIndex)

  return (
    <div className="group/carousel relative mx-auto max-w-7xl">
      <button
        type="button"
        aria-label="Previous videos"
        className="absolute left-2 top-[35%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 md:-left-3 xl:opacity-0 xl:group-hover/carousel:opacity-100"
        disabled={safeCurrentIndex === 0}
        onClick={() => setCurrentIndex(Math.max(0, safeCurrentIndex - 1))}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        aria-label="Next videos"
        className="absolute right-2 top-[35%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 md:-right-3 xl:opacity-0 xl:group-hover/carousel:opacity-100"
        disabled={safeCurrentIndex >= maxIndex}
        onClick={() => setCurrentIndex(Math.min(maxIndex, safeCurrentIndex + 1))}
      >
        <ArrowRight className="h-6 w-6" />
      </button>

      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          id="home-blog-carousel-track"
        >
          <style>
            {`
              #home-blog-carousel-track {
                transform: translateX(-${safeCurrentIndex * (100 / itemsVisible)}%);
              }
              .home-blog-card {
                width: calc(${100 / itemsVisible}% - ${(itemsVisible - 1) * 24 / itemsVisible}px);
              }
            `}
          </style>
          {items.map((item) => (
            <article
              key={item.id}
              className="home-blog-card box-border flex-shrink-0 rounded-[1rem] border border-slate-200 bg-white shadow-sm"
            >
              <VideoPreviewTrigger
                title={item.title}
                youtubeUrl={item.youtubeUrl}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt || item.title}
                className="group"
                mediaClassName="h-56 overflow-hidden bg-slate-100 md:h-48"
                imageSizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
              >
                <div className="border-t border-slate-200 bg-white p-4">
                  <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-xs text-slate-400">{item.metaText}</p>
                </div>
              </VideoPreviewTrigger>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

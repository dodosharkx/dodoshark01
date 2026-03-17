'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type BlogItem = {
  title: string
  views: string
  image: string
}

type HomeBlogCarouselProps = {
  items: BlogItem[]
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

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.25 6.402c0-.81.878-1.312 1.572-.9l8.625 5.098a1.04 1.04 0 0 1 0 1.8l-8.625 5.098c-.694.41-1.572-.09-1.572-.9V6.402Z" />
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
    <div className="group relative mx-auto max-w-7xl">
      <button
        type="button"
        aria-label="Previous videos"
        className="absolute left-2 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 md:h-11 md:w-11 md:-left-3 xl:opacity-0 xl:group-hover:opacity-100"
        disabled={safeCurrentIndex === 0}
        onClick={() => setCurrentIndex(Math.max(0, safeCurrentIndex - 1))}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="Next videos"
        className="absolute right-2 top-[35%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 md:h-11 md:w-11 md:-right-3 xl:opacity-0 xl:group-hover:opacity-100"
        disabled={safeCurrentIndex >= maxIndex}
        onClick={() => setCurrentIndex(Math.min(maxIndex, safeCurrentIndex + 1))}
      >
        <ArrowRight className="h-5 w-5" />
      </button>

      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${safeCurrentIndex * (100 / itemsVisible)}%)`,
          }}
        >
          {items.map((item) => (
            <article
              key={item.title}
              className="group home-blog-card box-border flex-shrink-0 rounded-[1rem] border border-slate-200 bg-white shadow-sm"
              style={{ width: `calc(${100 / itemsVisible}% - ${(itemsVisible - 1) * 24 / itemsVisible}px)` }}
            >
              <div className="relative h-56 overflow-hidden md:h-48">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="home-play-button">
                  <PlayIcon className="ml-1 h-5 w-5" />
                </div>
              </div>
              <div className="border-t border-slate-200 bg-white p-4">
                <h4 className="line-clamp-2 text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="mt-2 text-xs text-slate-400">{item.views}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

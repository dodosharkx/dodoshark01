'use client'

import dynamic from 'next/dynamic'

import type { HomeBlogCarouselItem } from '@/components/home/HomeBlogCarousel'

type DeferredHomeBlogCarouselProps = {
  items: HomeBlogCarouselItem[]
}

const HomeBlogCarousel = dynamic(() => import('@/components/home/HomeBlogCarousel'), {
  ssr: false,
  loading: () => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1rem] border border-slate-200 bg-white shadow-sm">
          <div className="h-56 bg-slate-200 md:h-48" />
          <div className="space-y-3 border-t border-slate-200 p-4">
            <div className="h-5 w-4/5 rounded bg-slate-200" />
            <div className="h-4 w-1/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  ),
})

export default function DeferredHomeBlogCarousel(props: DeferredHomeBlogCarouselProps) {
  return <HomeBlogCarousel {...props} />
}

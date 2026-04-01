'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'

import type { ProductImageAsset } from '@/app/lib/mvp-data'

type ProductImageStripProps = {
  images: ProductImageAsset[]
  productName: string
}

function buildUniqueImages(images: ProductImageAsset[]) {
  const seen = new Set<string>()
  return images.filter((image) => {
    if (!image.src || seen.has(image.src)) return false
    seen.add(image.src)
    return true
  })
}

export default function ProductImageStrip({ images, productName }: ProductImageStripProps) {
  const uniqueImages = useMemo(() => buildUniqueImages(images), [images])
  const [activeIndex, setActiveIndex] = useState(0)

  if (uniqueImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500">
        Images are not available for this category yet.
      </div>
    )
  }

  const safeActiveIndex = Math.min(activeIndex, uniqueImages.length - 1)
  const activeImage = uniqueImages[safeActiveIndex]

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-orange-300 bg-slate-50 shadow-[0_10px_24px_-18px_rgba(249,115,22,0.8)]">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="(min-width: 1024px) 20vw, 44vw"
          className="object-contain p-3 sm:p-4"
        />
      </div>

      {uniqueImages.length > 1 ? (
        <div className="no-scrollbar mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
          {uniqueImages.map((image, index) => {
            const isActive = index === safeActiveIndex
            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={isActive ? `Currently viewing image ${index + 1}` : `Show image ${index + 1} for ${productName}`}
                {...(isActive ? { 'aria-current': 'true' } : {})}
                className={`relative block h-16 w-16 shrink-0 snap-start overflow-hidden rounded-md border bg-slate-50 transition sm:h-20 sm:w-20 ${
                  isActive
                    ? 'border-orange-400 shadow-[0_10px_20px_-16px_rgba(249,115,22,0.9)]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Image src={image.src} alt={image.alt} fill sizes="80px" className="object-contain p-1" />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type VideoLightboxProps = {
  src: string
  title: string
  aspectRatio?: string
  onClose: () => void
}

export default function VideoLightbox({ src, title, aspectRatio = 'aspect-video', onClose }: VideoLightboxProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  if (!mounted) return null

  const isVertical = aspectRatio === 'aspect-[9/16]'
  const maxWidth = isVertical ? 'calc(80vh * 9 / 16)' : '72rem' // 72rem = max-w-6xl

  const content = (
    <div
      className="fixed inset-0 z-[120] bg-black/80 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="mx-auto flex h-full w-full items-center justify-center">
        <div 
          className="w-full mx-auto" 
          style={{ maxWidth }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between text-white">
            <h3 className="text-sm font-semibold tracking-wide md:text-base line-clamp-1 mr-4">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/30 px-4 py-1.5 text-xs transition-colors hover:bg-white/15 md:text-sm whitespace-nowrap"
            >
              Close
            </button>
          </div>
          <div className={`relative w-full overflow-hidden rounded-lg bg-black shadow-2xl ${aspectRatio}`} style={{ maxHeight: '85vh' }}>
            <iframe
              src={src}
              title={title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

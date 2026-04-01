'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { VideoOrientation } from '@/app/lib/video'

type VideoLightboxProps = {
  src: string
  title: string
  orientation?: VideoOrientation
  onClose: () => void
}

export default function VideoLightbox({ src, title, orientation = 'landscape', onClose }: VideoLightboxProps) {
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

  const isPortrait = orientation === 'portrait'
  const frameClassName = isPortrait ? 'aspect-[9/16]' : 'aspect-video'
  const containerMaxWidth = isPortrait
    ? 'min(100%, 28rem, calc((100dvh - 7rem) * 9 / 16))'
    : 'min(100%, 72rem)'
  const frameStyle = isPortrait
    ? { maxHeight: 'calc(100dvh - 7rem)' }
    : { maxHeight: '85vh' }

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
          className="mx-auto w-full" 
          id="video-lightbox-container"
          onClick={(event) => event.stopPropagation()}
        >
          <style>
            {`
              #video-lightbox-container { max-width: ${containerMaxWidth}; }
              #video-lightbox-frame { max-height: ${frameStyle.maxHeight}; }
            `}
          </style>
          <div className="mb-3 flex items-center justify-between text-white">
            <h3 className="mr-4 line-clamp-1 text-sm font-semibold tracking-wide md:text-base">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="whitespace-nowrap rounded-md border border-white/30 px-4 py-1.5 text-xs transition-colors hover:bg-white/15 md:text-sm"
            >
              Close
            </button>
          </div>
          <div 
            className={`relative w-full overflow-hidden rounded-lg bg-black shadow-2xl ${frameClassName}`} 
            id="video-lightbox-frame"
          >
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

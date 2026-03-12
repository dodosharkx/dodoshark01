'use client'

import { useEffect } from 'react'

type VideoLightboxProps = {
  src: string
  title: string
  onClose: () => void
}

export default function VideoLightbox({ src, title, onClose }: VideoLightboxProps) {
  useEffect(() => {
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

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
        <div className="w-full" onClick={(event) => event.stopPropagation()}>
          <div className="mb-3 flex items-center justify-between text-white">
            <h3 className="text-sm font-semibold tracking-wide md:text-base">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/30 px-4 py-1.5 text-xs transition-colors hover:bg-white/15 md:text-sm"
            >
              Close
            </button>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
            <iframe
              src={src}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

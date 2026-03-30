'use client'

import Image from 'next/image'

import { useState, type ReactNode } from 'react'
import CMSImage from '@/components/ui/CMSImage'
import type { SanityImage } from '@/app/lib/types/sanity'

import { getVideoOrientation, normalizeYouTubeEmbedUrl, resolveYouTubeThumbnailUrl, type VideoOrientation } from '@/app/lib/video'
import VideoLightbox from '@/components/page-builder/VideoLightbox'
import Icon from '@/components/ui/Icon'

type VideoPreviewTriggerProps = {
  title: string
  youtubeUrl?: string
  imageSrc?: string
  sanityImage?: SanityImage
  imageAlt?: string
  mediaClassName?: string
  imageClassName?: string
  imageSizes?: string
  className?: string
  overlayClassName?: string
  playButtonClassName?: string
  unavailableBadgeClassName?: string
  ariaLabel?: string
  orientation?: VideoOrientation
  children?: ReactNode
}

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export default function VideoPreviewTrigger({
  title,
  youtubeUrl,
  imageSrc,
  imageAlt,
  mediaClassName = 'aspect-video rounded-lg',
  imageClassName,
  imageSizes = '100vw',
  className,
  overlayClassName,
  playButtonClassName,
  unavailableBadgeClassName,
  ariaLabel,
  orientation,
  children,
  sanityImage,
}: VideoPreviewTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const embedSrc = youtubeUrl ? normalizeYouTubeEmbedUrl(youtubeUrl) : undefined
  const resolvedPosterSrc = imageSrc || resolveYouTubeThumbnailUrl(youtubeUrl)
  const resolvedOrientation = orientation ?? getVideoOrientation(youtubeUrl)
  const canPlay = Boolean(embedSrc)

  return (
    <>
      <button
        type="button"
        className={joinClasses(
          'flex h-full w-full flex-col text-left',
          canPlay ? 'cursor-pointer' : 'cursor-not-allowed',
          className,
        )}
        onClick={() => {
          if (!embedSrc) return
          setIsOpen(true)
        }}
        disabled={!canPlay}
        aria-label={ariaLabel || (canPlay ? `Play ${title}` : `${title} video is unavailable`)}
      >
        <div className={joinClasses('relative overflow-hidden bg-slate-100', mediaClassName)}>
          {sanityImage?.asset ? (
            <CMSImage
              image={sanityImage}
              alt={imageAlt || title || 'Video cover'}
              fill
              sizes={imageSizes}
              className={joinClasses(
                'object-cover transition-transform duration-700 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]',
                imageClassName,
              )}
            />
          ) : resolvedPosterSrc ? (
            <Image
              src={resolvedPosterSrc}
              alt={imageAlt || title || 'Video cover'}
              fill
              sizes={imageSizes}
              className={joinClasses(
                'object-cover transition-transform duration-700 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]',
                imageClassName,
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <Icon icon="film" className="h-10 w-10" />
            </div>
          )}

          <div
            className={joinClasses(
              'absolute inset-0 bg-slate-900/20 transition-colors group-hover:bg-slate-900/10 group-focus-visible:bg-slate-900/10',
              overlayClassName,
            )}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {canPlay ? (
              <div
                className={joinClasses(
                  'relative z-[1] flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110',
                  playButtonClassName,
                )}
              >
                <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            ) : (
              <div
                className={joinClasses(
                  'rounded-full bg-slate-900/75 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white',
                  unavailableBadgeClassName,
                )}
              >
                Unavailable
              </div>
            )}
          </div>
        </div>

        {children}
      </button>

      {isOpen && embedSrc ? (
        <VideoLightbox
          src={embedSrc}
          title={title}
          orientation={resolvedOrientation}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  )
}

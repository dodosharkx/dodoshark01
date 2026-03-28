'use client'

import Image from 'next/image'
import { useState } from 'react'
import { normalizeYouTubeEmbedUrl } from '@/app/lib/video'
import VideoLightbox from '@/components/page-builder/VideoLightbox'

interface AboutVideoCardProps {
  youtubeUrl: string
  title: string
  thumbnailUrl?: string
  thumbnailAlt?: string
  aspectRatio?: string // e.g., 'aspect-video' or 'aspect-[9/16]'
}

export default function AboutVideoCard({
  youtubeUrl,
  title,
  thumbnailUrl,
  thumbnailAlt,
  aspectRatio = 'aspect-video'
}: AboutVideoCardProps) {
  const [showLightbox, setShowLightbox] = useState(false)
  
  const embedUrl = normalizeYouTubeEmbedUrl(youtubeUrl)
  
  // Extract video ID for high quality thumbnail if not provided
  const extractVideoId = (url: string) => {
    if (url.includes('shorts/')) return url.split('shorts/')[1]?.split('?')[0]
    if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0]
    return url.split('/').pop()?.split('?')[0]
  }
  
  const videoId = extractVideoId(youtubeUrl)
  const finalThumbnail = thumbnailUrl || (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80')

  return (
    <>
      <div 
        className={`group relative overflow-hidden rounded-lg bg-slate-900 shadow-2xl cursor-pointer border border-slate-200 hover:border-orange-500 transition-all duration-500 ${aspectRatio}`}
        onClick={() => embedUrl && setShowLightbox(true)}
      >
        <Image
          src={finalThumbnail}
          alt={thumbnailAlt || title}
          fill
          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        
        {/* Overlay with Title */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-8 md:p-10 pt-20">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-orange-400 transition-colors drop-shadow-lg">
            {title}
          </h3>
          <div className="flex items-center gap-3">
             <span className="w-10 h-[2px] bg-orange-500 rounded-full"></span>
             <p className="text-orange-200 text-sm font-black uppercase tracking-widest animate-pulse">
               Watch Brand Story
             </p>
          </div>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/90 shadow-[0_0_50px_rgba(249,115,22,0.5)] transition-all duration-500 group-hover:scale-125 group-hover:bg-orange-500 group-active:scale-90">
            <svg
              className="ml-1 h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            {/* Multi-layered Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-orange-500 animate-[ping_2s_linear_infinite] opacity-25"></div>
          </div>
        </div>
      </div>

      {showLightbox && embedUrl && (
        <VideoLightbox
          src={embedUrl}
          title={title}
          aspectRatio={aspectRatio}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </>
  )
}

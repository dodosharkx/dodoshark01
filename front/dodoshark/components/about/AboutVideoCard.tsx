'use client'

import Image from 'next/image'
import { useState } from 'react'
import { normalizeYouTubeEmbedUrl } from '@/app/lib/video'
import VideoLightbox from '@/components/page-builder/VideoLightbox'

interface AboutVideoCardProps {
  youtubeUrl: string
  title: string
  thumbnailUrl?: string
}

export default function AboutVideoCard({
  youtubeUrl,
  title,
  thumbnailUrl
}: AboutVideoCardProps) {
  const [showLightbox, setShowLightbox] = useState(false)
  
  const embedUrl = normalizeYouTubeEmbedUrl(youtubeUrl)
  // Extract video ID for high quality thumbnail if not provided
  const videoId = youtubeUrl.includes('v=') ? youtubeUrl.split('v=')[1]?.split('&')[0] : youtubeUrl.split('/').pop()
  const finalThumbnail = thumbnailUrl || (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80')

  return (
    <>
      <div 
        className="group relative aspect-video overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-xl cursor-pointer border border-slate-200 hover:border-orange-500 transition-all duration-300"
        onClick={() => embedUrl && setShowLightbox(true)}
      >
        <Image
          src={finalThumbnail}
          alt={title}
          fill
          className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-90"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        
        {/* Overlay with Title */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-8">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-orange-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-300 text-sm font-light flex items-center gap-2">
            <span className="w-8 h-[1px] bg-orange-500"></span>
            Watch Brand Story
          </p>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-500 shadow-2xl transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <svg
              className="ml-1 h-10 w-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-25 group-hover:opacity-40"></div>
          </div>
        </div>
      </div>

      {showLightbox && embedUrl && (
        <VideoLightbox
          src={embedUrl}
          title={title}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </>
  )
}

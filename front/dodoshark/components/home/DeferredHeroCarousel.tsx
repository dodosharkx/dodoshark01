'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import HeroCarousel, { type HeroCarouselProps } from '@/components/home/HeroCarousel'

export default function DeferredHeroCarousel(props: HeroCarouselProps) {
  const [hasMounted, setHasMounted] = useState(false)
  const fallbackSlide = props.images.find((item) => Boolean(item?.src))

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasMounted(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (!hasMounted) {
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#64748b_0,#475569_45%,#334155_100%)]" />
        {fallbackSlide ? <Image src={fallbackSlide.src} alt={fallbackSlide.alt} fill sizes="100vw" className="object-cover" priority /> : null}
      </div>
    )
  }

  return <HeroCarousel {...props} />
}

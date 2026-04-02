'use client'

import {useEffect, useRef, useState} from 'react'

type SolutionHtmlTemplateFrameProps = {
  src: string
  templateKey: string
  title?: string
}

export default function SolutionHtmlTemplateFrame({
  src,
  templateKey,
  title,
}: SolutionHtmlTemplateFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [height, setHeight] = useState(640)

  useEffect(() => {
    setHeight(640)

    const frame = iframeRef.current
    if (!frame) return

    let resizeObserver: ResizeObserver | null = null
    let animationFrame = 0
    let imageListeners: Array<{image: HTMLImageElement; handler: () => void}> = []

    const measure = () => {
      const doc = frame.contentDocument
      if (!doc) return

      const nextHeight = Math.max(
        doc.documentElement?.scrollHeight ?? 0,
        doc.body?.scrollHeight ?? 0,
        480,
      )

      setHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    const requestMeasure = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(measure)
    }

    const attachObservers = () => {
      const doc = frame.contentDocument
      if (!doc) return

      requestMeasure()

      resizeObserver?.disconnect()
      resizeObserver = new ResizeObserver(requestMeasure)

      if (doc.documentElement) {
        resizeObserver.observe(doc.documentElement)
      }

      if (doc.body) {
        resizeObserver.observe(doc.body)
      }

      imageListeners.forEach(({image, handler}) => image.removeEventListener('load', handler))
      imageListeners = Array.from(doc.images).map((image) => {
        const handler = () => requestMeasure()
        image.addEventListener('load', handler)
        return {image, handler}
      })
    }

    frame.addEventListener('load', attachObservers)

    if (frame.contentDocument?.readyState === 'complete') {
      attachObservers()
    }

    window.addEventListener('resize', requestMeasure)

    return () => {
      frame.removeEventListener('load', attachObservers)
      window.removeEventListener('resize', requestMeasure)
      resizeObserver?.disconnect()
      cancelAnimationFrame(animationFrame)
      imageListeners.forEach(({image, handler}) => image.removeEventListener('load', handler))
    }
  }, [src, templateKey])

  return (
    <div className="bg-white">
      <iframe
        key={templateKey}
        ref={iframeRef}
        title={title || 'Solution template'}
        src={src}
        sandbox="allow-same-origin"
        scrolling="no"
        className="block w-full border-0 bg-white"
        style={{height}}
      />
    </div>
  )
}

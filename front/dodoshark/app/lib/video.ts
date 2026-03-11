export function normalizeYouTubeEmbedUrl(raw: string) {
  const value = raw.trim()
  if (!value) return undefined

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return undefined
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) return undefined

  const host = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname

  const extractYouTubeId = () => {
    if (host === 'youtu.be') {
      const id = pathname.split('/').filter(Boolean)[0]
      return id || undefined
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      if (pathname === '/watch') return parsed.searchParams.get('v') || undefined

      const segments = pathname.split('/').filter(Boolean)
      if (!segments.length) return undefined

      if (segments[0] === 'embed' && segments[1]) return segments[1]
      if ((segments[0] === 'shorts' || segments[0] === 'live') && segments[1]) return segments[1]
    }

    return undefined
  }

  const videoId = extractYouTubeId()
  if (!videoId) return undefined

  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
}


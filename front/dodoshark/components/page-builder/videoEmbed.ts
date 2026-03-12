export function extractYouTubeVideoId(url?: string) {
  const raw = url?.trim()
  if (!raw) return undefined

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return undefined
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) return undefined

  const host = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname
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

export function resolveVideoEmbedSrc(url?: string) {
  const raw = url?.trim()
  if (!raw) return undefined

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return undefined
  }

  if (!['https:', 'http:'].includes(parsed.protocol)) return undefined

  const host = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname

  const withParam = (key: string, value: string) => {
    parsed.searchParams.set(key, value)
    return parsed.toString()
  }

  const youtubeId = extractYouTubeVideoId(url)
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
  }

  if (host.includes('vimeo.com')) {
    const segments = pathname.split('/').filter(Boolean)
    const videoId = segments.reverse().find((segment) => /^\d+$/.test(segment))
    if (videoId) return `https://player.vimeo.com/video/${videoId}?autoplay=1`
  }

  if (host.includes('bilibili.com')) {
    if (host.includes('player.bilibili.com')) return withParam('autoplay', '1')
    const match = pathname.match(/\/video\/([a-zA-Z0-9]+)/)
    if (match?.[1]) {
      return `https://player.bilibili.com/player.html?bvid=${match[1]}&autoplay=1`
    }
  }

  if (pathname.includes('/embed/')) return withParam('autoplay', '1')

  return withParam('autoplay', '1')
}

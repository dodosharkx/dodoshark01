const EXTERNAL_HREF_PATTERN = /^(https?:|mailto:|tel:)/i

function isSafeInternalHref(href: string) {
  return href.startsWith('/') || href.startsWith('#') || href.startsWith('?')
}

export function getSafeHref(rawHref?: string | null) {
  const href = rawHref?.trim()
  if (!href) return undefined

  if (EXTERNAL_HREF_PATTERN.test(href)) return href
  if (isSafeInternalHref(href)) return href

  return undefined
}

export function isExternalHref(href: string) {
  return EXTERNAL_HREF_PATTERN.test(href)
}

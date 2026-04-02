export type SolutionTemplateImageBinding = {
  _key?: string
  key?: string
  image?: {
    alt?: string
    asset?: {
      _ref?: string
      _type?: 'reference'
    }
  }
}

export type SolutionCodeFieldValue =
  | string
  | {
      _type?: 'code'
      code?: string
      language?: string
    }

export type RenderedSolutionTemplateStatus = 'pending' | 'ready' | 'failed'

export type SolutionHtmlTemplateData = {
  html?: SolutionCodeFieldValue
  customCss?: SolutionCodeFieldValue
  templateImages?: SolutionTemplateImageBinding[]
  renderedHtml?: string
  renderedSignature?: string
  renderedAt?: string
  renderStatus?: RenderedSolutionTemplateStatus
  renderError?: string
}

export function buildSolutionTemplateFrameSrc(
  slug: string,
  signature?: string | null,
) {
  const params = new URLSearchParams()
  const encodedSlug = encodeURIComponent(slug)

  if (signature) {
    params.set('v', signature)
  }

  const query = params.toString()

  return query
    ? `/api/solutions/template/${encodedSlug}?${query}`
    : `/api/solutions/template/${encodedSlug}`
}

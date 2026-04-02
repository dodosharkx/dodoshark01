import {fetchSanityData} from '@/lib/sanity.live'
import {cleanText} from '@/lib/sanity-utils'

export const runtime = 'nodejs'

type SolutionTemplateRouteProps = {
  params: Promise<{slug: string}>
}

type SolutionTemplateRouteData = {
  title?: string
  htmlTemplate?: {
    renderedHtml?: string
    renderStatus?: string
    renderError?: string
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildErrorDocument(title: string, message: string, detail?: string) {
  const safeTitle = escapeHtml(title)
  const safeMessage = escapeHtml(message)
  const safeDetail = detail ? escapeHtml(detail) : ''

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${safeTitle}</title>`,
    '<style>body{margin:0;padding:32px;font-family:Inter,"Segoe UI",Arial,sans-serif;background:#f8fafc;color:#0f172a}main{max-width:760px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px 28px;box-shadow:0 20px 40px -16px rgba(15,23,42,.12)}h1{margin:0 0 12px;font-size:24px}p{margin:0 0 12px;line-height:1.7}pre{margin:16px 0 0;padding:16px;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:auto;white-space:pre-wrap;word-break:break-word}</style>',
    '</head>',
    '<body>',
    '<main>',
    `<h1>${safeTitle}</h1>`,
    `<p>${safeMessage}</p>`,
    safeDetail ? `<pre>${safeDetail}</pre>` : '',
    '</main>',
    '</body>',
    '</html>',
  ].join('')
}

async function getSolutionTemplate(slug: string) {
  const query = `*[_type == "solution" && slug.current == $slug][0]{
    title,
    htmlTemplate{
      renderedHtml,
      renderStatus,
      renderError
    }
  }`

  return fetchSanityData<SolutionTemplateRouteData | null>({
    query,
    params: {slug},
    stega: false,
  })
}

export async function GET(request: Request, {params}: SolutionTemplateRouteProps) {
  const {slug} = await params
  const solution = await getSolutionTemplate(slug)
  const requestedVersion = new URL(request.url).searchParams.get('v')

  if (!solution) {
    return new Response(
      buildErrorDocument(
        'Template Not Found',
        'The requested solution template could not be found.',
        `slug: ${slug}`,
      ),
      {
        status: 404,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
        },
      },
    )
  }

  const renderedHtml =
    typeof solution.htmlTemplate?.renderedHtml === 'string'
      ? solution.htmlTemplate.renderedHtml
      : undefined
  const renderStatus = cleanText(solution.htmlTemplate?.renderStatus) || 'pending'
  const renderError = cleanText(solution.htmlTemplate?.renderError)

  if (!renderedHtml?.trim()) {
    return new Response(
      buildErrorDocument(
        'Template Not Ready',
        'This solution template has not been rendered for production yet.',
        `slug: ${slug}\nstatus: ${renderStatus}${renderError ? `\nerror: ${renderError}` : ''}`,
      ),
      {
        status: renderStatus === 'failed' ? 500 : 503,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
        },
      },
    )
  }

  return new Response(renderedHtml, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': requestedVersion
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

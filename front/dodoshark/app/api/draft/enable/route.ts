import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {client} from '@/app/lib/sanity'

export const dynamic = 'force-dynamic'

export const GET = async (request: Request) => {
  const url = new URL(request.url)

  // Temporary debug endpoint — visit /api/draft/enable?debug=1
  if (url.searchParams.get('debug') === '1') {
    const allKeys = Object.keys(process.env || {})
    const sanityKeys = allKeys.filter(
      (k) => k.includes('SANITY') || k.includes('NEXT_PUBLIC')
    )
    return new Response(
      JSON.stringify(
        {
          processType: typeof process,
          processEnvType: typeof process?.env,
          envKeyCount: allKeys.length,
          sanityRelatedKeys: sanityKeys,
          hasReadToken: !!process.env['SANITY_API_READ_TOKEN'],
          hasReadTokenDynamic: !!process.env[('SANITY' + '_API_READ_TOKEN') as string],
          readTokenLength: process.env['SANITY_API_READ_TOKEN']?.length ?? 0,
          sampleKeys: allKeys.slice(0, 20),
        },
        null,
        2
      ),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  const envKey = 'SANITY_API_READ_TOKEN' as string
  const token = process.env[envKey]?.trim()

  if (!token) {
    return new Response(
      'Visual editing is disabled: Missing SANITY_API_READ_TOKEN environment variable in production. Configure it on the deployed frontend as a Cloudflare Worker secret.',
      {status: 401}
    )
  }

  const {GET: enableDraftMode} = defineEnableDraftMode({
    client: client.withConfig({
      token: token,
      useCdn: false,
    }),
  })

  return enableDraftMode(request)
}

import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {client} from '@/app/lib/sanity'

export const dynamic = 'force-dynamic'

export const GET = async (request: Request) => {
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

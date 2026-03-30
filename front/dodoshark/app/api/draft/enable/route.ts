import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {client} from '@/app/lib/sanity'
import {sanityReadToken} from '@/app/lib/sanity.token'

export const GET = async (request: Request) => {
  if (!sanityReadToken) {
    return new Response(
      'Visual editing is disabled: Missing SANITY_API_READ_TOKEN environment variable in production.',
      {status: 401}
    )
  }

  const {GET: enableDraftMode} = defineEnableDraftMode({
    client: client.withConfig({
      token: sanityReadToken,
      useCdn: false,
    }),
  })

  return enableDraftMode(request)
}

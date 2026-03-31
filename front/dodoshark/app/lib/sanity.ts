import {createImageUrlBuilder} from '@sanity/image-url'
import {createClient} from 'next-sanity'


import {
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  SANITY_API_VERSION,
  SANITY_STUDIO_URL,
  SANITY_API_READ_TOKEN,
} from '@/app/lib/env'

export const studioUrl = SANITY_STUDIO_URL

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
  stega: {
    studioUrl,
  },
})

const token = SANITY_API_READ_TOKEN

export const previewClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token,
  stega: {
    enabled: true, // Explicitly enable stega for the preview client
    studioUrl,
  },
})

export function getClient(preview?: boolean) {
  if (preview && token) {
    return previewClient
  }

  return client
}

const builder = createImageUrlBuilder(client)

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}

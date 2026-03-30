import {createImageUrlBuilder} from '@sanity/image-url'
import {createClient} from 'next-sanity'

function normalizeUrl(value?: string) {
  return value?.trim().replace(/\/+$/, '')
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || 'nljl95h9'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2024-01-01'
const defaultStudioUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://dodoshark.sanity.studio'
    : 'http://localhost:3333'
export const studioUrl =
  normalizeUrl(process.env.NEXT_PUBLIC_SANITY_STUDIO_URL) || defaultStudioUrl

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl,
  },
})

const envKey = 'SANITY_API_READ_TOKEN' as string
const token = process.env[envKey]?.trim()

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  stega: {
    enabled: true,
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

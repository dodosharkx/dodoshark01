import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
    projectId: 'nljl95h9',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
})

const token = process.env.SANITY_API_READ_TOKEN?.trim()

export const previewClient = createClient({
    projectId: 'nljl95h9',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: token,
    stega: {
        enabled: true,
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://dodoshark.sanity.studio',
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

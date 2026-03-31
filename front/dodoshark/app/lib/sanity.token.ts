import { SANITY_API_READ_TOKEN } from '@/app/lib/env'

export const sanityReadToken = SANITY_API_READ_TOKEN

export function getSanityReadToken() {
  if (!sanityReadToken) {
    console.warn('Missing SANITY_API_READ_TOKEN. Visual editing will be disabled.')
  }

  return sanityReadToken
}

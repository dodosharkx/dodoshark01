// Use dynamic property access to fully bypass Next.js Webpack static compilation
const envKey = 'SANITY_API_READ_TOKEN' as string
export const sanityReadToken = process.env[envKey]?.trim()

export function getSanityReadToken() {
  if (!sanityReadToken) {
    console.warn('Missing SANITY_API_READ_TOKEN. Visual editing will be disabled.')
  }

  return sanityReadToken
}

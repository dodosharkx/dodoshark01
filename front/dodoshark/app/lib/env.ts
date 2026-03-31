/**
 * Centralized Environment Variable Validation
 * This module ensures that all required Sanity and application settings are present
 * before we attempt to initialize clients or fetch data.
 * 
 * IMPORTANT: Next.js only inlines NEXT_PUBLIC_ variables for the client bundle 
 * if they are referenced LITERALLY (e.g. process.env.NEXT_PUBLIC_VAR).
 */

function getEnv(key: string, defaultValue?: string, required = false): string {
  // Dynamic access is only safe on the server
  const value = process.env[key]?.trim()

  if (!value) {
    if (required && process.env.NODE_ENV === 'production') {
      throw new Error(`Critical environment variable "${key}" is missing.`)
    }
    return defaultValue ?? ''
  }

  return value
}

// 1. Literal access for NEXT_PUBLIC_ variables to ensure client-side availability
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || ''
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production'
export const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2024-01-01'

// Validation for critical public variables (runs on server and client during SSR)
if (!SANITY_PROJECT_ID && (process.env.NODE_ENV === 'production' || typeof window === 'undefined')) {
  const errorMsg = 'Critical environment variable "NEXT_PUBLIC_SANITY_PROJECT_ID" is missing. Please check your .env files.'
  if (process.env.NODE_ENV === 'production') {
    throw new Error(errorMsg)
  } else if (typeof window === 'undefined') {
    console.warn(`[ENV WARNING]: ${errorMsg}`)
  }
}

// Studio URL logic
const defaultStudioUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://dodoshark.sanity.studio'
    : 'http://localhost:3333'

export const SANITY_STUDIO_URL = (process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.trim() || defaultStudioUrl).replace(/\/+$/, '')

// 2. Secret Tokens (Runtime only, MUST NOT be prefixed with NEXT_PUBLIC_)
// Using literal access for better consistency with Next.js bundling/runtime variations
export const SANITY_API_READ_TOKEN = process.env.SANITY_API_READ_TOKEN?.trim()

// 3. Server-only Settings
export const RESEND_API_KEY = getEnv('RESEND_API_KEY', undefined, false)
export const LEAD_TO_EMAIL = getEnv('LEAD_TO_EMAIL', undefined, false)
export const LEAD_FROM_EMAIL = getEnv('LEAD_FROM_EMAIL', 'DoDoShark Leads <onboarding@resend.dev>')

// Server-side logging for verification
if (typeof window === 'undefined') {
  console.log('[ENV] Project ID:', SANITY_PROJECT_ID || 'MISSING')
  console.log('[ENV] Dataset:', SANITY_DATASET)
  console.log('[ENV] Studio URL:', SANITY_STUDIO_URL)
  console.log('[ENV] Read Token present:', !!SANITY_API_READ_TOKEN)
}

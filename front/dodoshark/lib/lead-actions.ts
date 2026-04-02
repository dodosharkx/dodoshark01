'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'

import type { InquiryType } from '@/lib/mvp-data'

export type LeadInquiry = {
  inquiryType: InquiryType
  name: string
  city?: string
  company?: string
  email: string
  whatsapp?: string
  material?: string
  targetFineness?: string
  preferredTime?: string
  message?: string
}

export type LeadActionResult = {
  success: boolean
  message: string
}

type LeadRateLimitEntry = {
  count: number
  resetAt: number
}

type RequiredLeadField = 'name' | 'email' | 'city' | 'material' | 'preferredTime'

const BOT_TRAP_FIELD = 'companyWebsite'
const FORM_STARTED_AT_FIELD = 'formStartedAt'
const LEAD_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const LEAD_RATE_LIMIT_MAX_REQUESTS = 5
const MIN_FORM_COMPLETION_MS = 800
const MAX_FORM_COMPLETION_MS = 30 * 60 * 1000

const REQUIRED_FIELDS_BY_INQUIRY_TYPE: Record<InquiryType, RequiredLeadField[]> = {
  quote: ['name', 'email', 'city'],
  video_demo: ['name', 'email', 'material', 'preferredTime'],
}

const globalLeadRateLimitStore = globalThis as typeof globalThis & {
  __dodosharkLeadRateLimit?: Map<string, LeadRateLimitEntry>
}

function cleanValue(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function getLeadRateLimitStore() {
  if (!globalLeadRateLimitStore.__dodosharkLeadRateLimit) {
    globalLeadRateLimitStore.__dodosharkLeadRateLimit = new Map()
  }

  return globalLeadRateLimitStore.__dodosharkLeadRateLimit
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getInquirySubject(type: InquiryType) {
  return type === 'video_demo' ? '[Video Demo Booking]' : '[Quote Request]'
}

function getSuccessMessage(type: InquiryType) {
  if (type === 'video_demo') {
    return 'Thank you. We will confirm your video demo time within 24 hours.'
  }

  return 'Thank you. Our team will contact you within 24 hours.'
}

function hasValue(value?: string) {
  return Boolean(value?.trim())
}

function hasValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value)
}

function getClientIdentifier(headerStore: Headers) {
  const forwardedFor = headerStore.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor
      .split(',')
      .map((item) => item.trim())
      .find(Boolean)
  }

  return (
    headerStore.get('cf-connecting-ip')?.trim() ||
    headerStore.get('x-real-ip')?.trim() ||
    undefined
  )
}

function pruneExpiredRateLimitEntries(store: Map<string, LeadRateLimitEntry>, now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}

function consumeRateLimit(identifier?: string) {
  if (!identifier) return false

  const now = Date.now()
  const store = getLeadRateLimitStore()
  pruneExpiredRateLimitEntries(store, now)

  const existing = store.get(identifier)
  if (!existing || existing.resetAt <= now) {
    store.set(identifier, {
      count: 1,
      resetAt: now + LEAD_RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (existing.count >= LEAD_RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  existing.count += 1
  store.set(identifier, existing)
  return false
}

function shouldTreatAsBotSubmission(elapsedMs?: number) {
  if (elapsedMs === undefined) return false
  if (elapsedMs < 0) return true
  if (elapsedMs < MIN_FORM_COMPLETION_MS) return true
  if (elapsedMs > MAX_FORM_COMPLETION_MS) return true
  return false
}

function getFieldLabel(field: RequiredLeadField) {
  if (field === 'name') return 'Name'
  if (field === 'email') return 'Email'
  if (field === 'city') return 'City'
  if (field === 'material') return 'Material'
  return 'Preferred Time'
}

function formatList(values: string[]) {
  if (values.length <= 1) return values[0] || ''
  if (values.length === 2) return `${values[0]} and ${values[1]}`
  return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`
}

function parseInquiryType(formData: FormData): InquiryType {
  const inquiryTypeValue = cleanValue(formData.get('inquiryType'))
  return inquiryTypeValue === 'video_demo' ? 'video_demo' : 'quote'
}

function parseLeadPayload(formData: FormData): LeadInquiry {
  const inquiryType = parseInquiryType(formData)

  return {
    inquiryType,
    name: cleanValue(formData.get('name')),
    city: cleanValue(formData.get('city')),
    company: cleanValue(formData.get('company')),
    email: cleanValue(formData.get('email')),
    whatsapp: cleanValue(formData.get('whatsapp')),
    material: cleanValue(formData.get('material')),
    targetFineness: cleanValue(formData.get('targetFineness')),
    preferredTime: cleanValue(formData.get('preferredTime')),
    message: cleanValue(formData.get('message')),
  }
}

function validateLeadPayload(payload: LeadInquiry): LeadActionResult | null {
  const missingFields = REQUIRED_FIELDS_BY_INQUIRY_TYPE[payload.inquiryType].filter((field) => {
    if (field === 'name') return !hasValue(payload.name)
    if (field === 'email') return !hasValue(payload.email)
    if (field === 'city') return !hasValue(payload.city)
    if (field === 'material') return !hasValue(payload.material)
    return !hasValue(payload.preferredTime)
  })

  if (missingFields.length > 0) {
    return {
      success: false,
      message: `Please fill in ${formatList(missingFields.map(getFieldLabel))}.`,
    }
  }

  if (!hasValidEmail(payload.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    }
  }

  return null
}

async function guardLeadSubmission(formData: FormData, inquiryType: InquiryType) {
  const botTrapValue = cleanValue(formData.get(BOT_TRAP_FIELD))
  const startedAtValue = Number.parseInt(cleanValue(formData.get(FORM_STARTED_AT_FIELD)), 10)
  const elapsedMs = Number.isFinite(startedAtValue) ? Date.now() - startedAtValue : undefined

  if (botTrapValue || shouldTreatAsBotSubmission(elapsedMs)) {
    return {
      blocked: true,
      result: { success: true, message: getSuccessMessage(inquiryType) },
      headerStore: null,
    } as const
  }

  const headerStore = await headers()
  if (consumeRateLimit(getClientIdentifier(headerStore))) {
    return {
      blocked: true,
      result: {
        success: false,
        message: 'Too many submissions. Please wait a few minutes and try again.',
      },
      headerStore,
    } as const
  }

  return {
    blocked: false,
    result: null,
    headerStore,
  } as const
}

function buildEmailFields(payload: LeadInquiry) {
  return payload.inquiryType === 'video_demo'
    ? [
        ['Inquiry Type', 'Video Demo Booking'],
        ['Name', payload.name],
        ['Company', payload.company || 'Not provided'],
        ['Email', payload.email],
        ['Phone / WhatsApp', payload.whatsapp || 'Not provided'],
        ['Material', payload.material || 'Not provided'],
        ['Target Fineness', payload.targetFineness || 'Not provided'],
        ['Preferred Time', payload.preferredTime || 'Not provided'],
        ['Message', payload.message || 'Not provided'],
      ]
    : [
        ['Inquiry Type', 'Quote Request'],
        ['Name', payload.name],
        ['Email', payload.email],
        ['City', payload.city || 'Not provided'],
        ['Phone / WhatsApp', payload.whatsapp || 'Not provided'],
        ['Message', payload.message || 'Not provided'],
      ]
}

async function sendLeadEmail({
  payload,
  apiKey,
  toEmail,
  fromEmail,
}: {
  payload: LeadInquiry
  apiKey: string
  toEmail: string
  fromEmail: string
}) {
  const resend = new Resend(apiKey)
  const subject = `${getInquirySubject(payload.inquiryType)} ${payload.name} | ${payload.company || 'No Company'}`
  const fields = buildEmailFields(payload)

  const rowsHtml = fields
    .map(
      ([label, value], index) =>
        `<tr><td style="padding:10px;font-weight:600;background:${index % 2 ? '#ffffff' : '#f8fafc'};width:36%;">${escapeHtml(label)}</td><td style="padding:10px;background:${index % 2 ? '#ffffff' : '#f8fafc'};">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject,
    replyTo: payload.email,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1e293b;">
        <h2 style="margin:0 0 12px 0;color:#0f172a;">DoDoShark New Lead</h2>
        <p style="margin:0 0 16px 0;color:#475569;">A new lead has been submitted from the website.</p>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;">${rowsHtml}</table>
      </div>
    `,
  })
}

export async function submitLeadInquiry(formData: FormData): Promise<LeadActionResult> {
  const inquiryType = parseInquiryType(formData)
  const guard = await guardLeadSubmission(formData, inquiryType)
  if (guard.blocked) {
    return guard.result
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.LEAD_TO_EMAIL || 'service@dodoshark.com'
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'DoDoShark Leads <onboarding@resend.dev>'

  if (!apiKey) {
    return {
      success: false,
      message:
        'Form service is not configured yet. Please email us directly at your business contact address.',
    }
  }

  const payload = parseLeadPayload(formData)
  const validationError = validateLeadPayload(payload)
  if (validationError) {
    return validationError
  }

  try {
    await sendLeadEmail({
      payload,
      apiKey,
      toEmail,
      fromEmail,
    })

    return { success: true, message: getSuccessMessage(payload.inquiryType) }
  } catch (error) {
    console.error('Failed to send lead email:', error)
    return {
      success: false,
      message: 'Submission failed. Please try again or contact us by email/WhatsApp directly.',
    }
  }
}

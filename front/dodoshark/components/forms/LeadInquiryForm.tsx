'use client'

import { useState } from 'react'

import { submitLeadInquiry, type LeadActionResult } from '@/lib/lead-actions'
import type { InquiryType } from '@/lib/mvp-data'

type LeadInquiryFormProps = {
  inquiryType: InquiryType
  variant?: 'contact' | 'video_demo' | 'mini'
  submitLabel?: string
  introText?: string
  className?: string
  showMessageField?: boolean
}

const FIELD_CLASS =
  'w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200'

export default function LeadInquiryForm({
  inquiryType,
  variant,
  submitLabel,
  introText,
  className,
  showMessageField = true,
}: LeadInquiryFormProps) {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<LeadActionResult | null>(null)
  const [formStartedAt] = useState(() => Date.now())

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setResult(null)

    try {
      const response = await submitLeadInquiry(formData)
      setResult(response)
    } catch {
      setResult({
        success: false,
        message: 'Submission failed. Please try again or contact us by email/WhatsApp directly.',
      })
    } finally {
      setPending(false)
    }
  }

  const resolvedVariant = variant || (inquiryType === 'video_demo' ? 'video_demo' : 'contact')
  const isContactVariant = resolvedVariant === 'contact'
  const isVideoDemoVariant = resolvedVariant === 'video_demo'
  const isMiniVariant = resolvedVariant === 'mini'
  const isPreferredTimeRequired = inquiryType === 'video_demo'
  const buttonText = submitLabel || (resolvedVariant === 'video_demo' ? 'Book Video Demo' : 'Send Inquiry')
  const materialPlaceholder = 'e.g. corn, chili, herbal powder'
  const preferredTimePlaceholder = 'e.g. Tuesday 15:00 UTC+8'
  const notesPlaceholder = isVideoDemoVariant
    ? 'Optional: sample details, required output, power standard...'
    : 'Optional: your needs, quantity plan, and timeline.'

  return (
    <form action={handleSubmit} className={className || 'space-y-4'}>
      <input type="hidden" name="inquiryType" value={inquiryType} />
      <input type="hidden" name="formStartedAt" value={String(formStartedAt)} />
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label>
          Company website
          <input
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>
      {introText ? <p className="text-sm leading-6 text-slate-600">{introText}</p> : null}

      {isContactVariant ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Name *</span>
              <input name="name" required placeholder="Your full name" className={FIELD_CLASS} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Business Email *</span>
              <input name="email" type="email" required placeholder="name@company.com" className={FIELD_CLASS} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">City / Country *</span>
              <input name="city" required placeholder="e.g. Jakarta, Indonesia" className={FIELD_CLASS} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Phone / WhatsApp</span>
              <input name="whatsapp" className={FIELD_CLASS} />
            </label>
          </div>
        </>
      ) : isMiniVariant ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Name *</span>
              <input name="name" required placeholder="Your full name" className={FIELD_CLASS} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Business Email *</span>
              <input name="email" type="email" required placeholder="name@company.com" className={FIELD_CLASS} />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">City *</span>
              <input name="city" required placeholder="e.g. Jakarta" className={FIELD_CLASS} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Phone / WhatsApp</span>
              <input name="whatsapp" className={FIELD_CLASS} />
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Name *</span>
              <input name="name" required placeholder="Your full name" className={FIELD_CLASS} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Company</span>
              <input name="company" placeholder="Company name" className={FIELD_CLASS} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Business Email *</span>
              <input name="email" type="email" required placeholder="name@company.com" className={FIELD_CLASS} />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">WhatsApp</span>
              <input name="whatsapp" className={FIELD_CLASS} />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Material *</span>
              <input
                name="material"
                required
                placeholder={materialPlaceholder}
                className={FIELD_CLASS}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Target Fineness</span>
              <input name="targetFineness" placeholder="e.g. 20-80 mesh" className={FIELD_CLASS} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-600">
              Preferred Time (with timezone){isPreferredTimeRequired ? ' *' : ''}
            </span>
            <input
              name="preferredTime"
              required={isPreferredTimeRequired}
              placeholder={preferredTimePlaceholder}
              className={FIELD_CLASS}
            />
          </label>
        </>
      )}

      {showMessageField ? (
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-slate-600">Notes / Message</span>
          <textarea
            name="message"
            rows={4}
            placeholder={notesPlaceholder}
            className={FIELD_CLASS}
          />
        </label>
      ) : null}

      {result ? (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${result.success
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700'
            }`}
        >
          {result.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Submitting...' : buttonText}
      </button>
    </form>
  )
}

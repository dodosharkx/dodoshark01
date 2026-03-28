import { getGlobalSettings } from '@/app/lib/global-settings'

export type GlobalContact = {
  email: string
  whatsapp: string
  phone: string
}

const FALLBACK_CONTACT: GlobalContact = {
  email: 'service@dodoshark.com',
  whatsapp: '+86 13662385371',
  phone: '+86 13662385371',
}

const FIXED_BUSINESS_EMAIL = 'service@dodoshark.com'

function getNormalizedValue(rawValue: string | undefined, fallback: string) {
  const normalized = rawValue?.trim()
  return normalized || fallback
}

export async function getGlobalContact(): Promise<GlobalContact> {
  const global = await getGlobalSettings()
  return {
    email: FIXED_BUSINESS_EMAIL,
    whatsapp: getNormalizedValue(global?.contact?.whatsapp, FALLBACK_CONTACT.whatsapp),
    phone: getNormalizedValue(global?.contact?.phone, FALLBACK_CONTACT.phone),
  }
}

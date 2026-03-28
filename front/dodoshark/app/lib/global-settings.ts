import { client } from '@/app/lib/sanity'
import type { SanityImage } from '@/app/lib/types/sanity'

type GlobalSettingsContact = {
  email?: string
  whatsapp?: string
  phone?: string
}

export type GlobalSettingsData = {
  siteName?: string
  favicon?: SanityImage
  contact?: GlobalSettingsContact
}

const GLOBAL_SETTINGS_QUERY = `*[_id == "globalSettings"][0]{
  siteName,
  favicon{
    alt,
    asset->{
      _id,
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    }
  },
  contact{
    email,
    whatsapp,
    phone
  }
}`

export async function getGlobalSettings(): Promise<GlobalSettingsData | null> {
  try {
    return await client.fetch<GlobalSettingsData | null>(GLOBAL_SETTINGS_QUERY)
  } catch {
    return null
  }
}

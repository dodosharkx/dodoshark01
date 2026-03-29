import {sanityFetch} from '@/app/lib/sanity.live'
import type {SanityImage} from '@/app/lib/types/sanity'

export type GlobalNavItem = {
  label?: string
  href?: string
}

export type GlobalSocialLink = {
  label?: string
  icon?: string
  href?: string
}

export type GlobalSettingsData = {
  _id?: string
  siteName?: string
  favicon?: SanityImage
  logo?: SanityImage
  header?: {
    sloganLabel?: string
    sloganText?: string
    workingHoursLabel?: string
    workingHoursText?: string
    navigation?: GlobalNavItem[]
    desktopCtaLabel?: string
    desktopCtaHref?: string
    mobileCtaLabel?: string
    mobileCtaHref?: string
  }
  contact?: {
    email?: string
    supportEmail?: string
    whatsapp?: string
    phone?: string
    websiteLabel?: string
    websiteUrl?: string
  }
  footer?: {
    headquartersKicker?: string
    headquartersBody?: string
    networkItems?: string[]
    socialLinks?: GlobalSocialLink[]
    footerLinks?: GlobalNavItem[]
    copyrightText?: string
  }
}

const GLOBAL_SETTINGS_QUERY = `*[_id == "globalSettings"][0]{
  _id,
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
  logo{
    alt,
    asset
  },
  header{
    sloganLabel,
    sloganText,
    workingHoursLabel,
    workingHoursText,
    navigation[]{
      label,
      href
    },
    desktopCtaLabel,
    desktopCtaHref,
    mobileCtaLabel,
    mobileCtaHref
  },
  contact{
    email,
    supportEmail,
    whatsapp,
    phone,
    websiteLabel,
    websiteUrl
  },
  footer{
    headquartersKicker,
    headquartersBody,
    networkItems,
    socialLinks[]{
      label,
      icon,
      href
    },
    footerLinks[]{
      label,
      href
    },
    copyrightText
  }
}`

export async function getGlobalSettings(stega = false): Promise<GlobalSettingsData | null> {
  try {
    const {data} = await sanityFetch({
      query: GLOBAL_SETTINGS_QUERY,
      stega,
    })
    return data
  } catch {
    return null
  }
}

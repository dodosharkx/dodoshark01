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
    topBar?: {
      backgroundColor?: string
      borderColor?: string
      sloganIcon?: SanityImage
      workingHoursIcon?: SanityImage
    }
    sloganLabel?: string
    sloganText?: string
    workingHoursLabel?: string
    workingHoursText?: string
    navBackground?: SanityImage
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
    headquartersTitle?: string
    headquartersBody?: string
    phoneLabel?: string
    websiteLabelTitle?: string
    emailLabel?: string
    networkKicker?: string
    networkTitle?: string
    networkItems?: string[]
    socialKicker?: string
    socialTitle?: string
    footerMap?: {
      image?: SanityImage
      ariaLabel?: string
    }
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
    topBar{
      backgroundColor,
      borderColor,
      sloganIcon{
        alt,
        asset
      },
      workingHoursIcon{
        alt,
        asset
      }
    },
    sloganLabel,
    sloganText,
    workingHoursLabel,
    workingHoursText,
    navBackground{
      alt,
      asset
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
    headquartersTitle,
    headquartersBody,
    phoneLabel,
    websiteLabelTitle,
    emailLabel,
    networkKicker,
    networkTitle,
    networkItems,
    socialKicker,
    socialTitle,
    footerMap{
      image{
        alt,
        asset
      },
      ariaLabel
    },
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

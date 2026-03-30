import Image from 'next/image'
import Link from 'next/link'
import {createDataAttribute} from 'next-sanity'

import type {GlobalSettingsData} from '@/app/lib/global-settings'
import {cleanText, renderText, toImageSrc} from '@/app/lib/sanity-utils'
import CMSImage from '@/components/ui/CMSImage'
import {studioUrl} from '@/app/lib/sanity'

type FooterProps = {
  settings?: GlobalSettingsData | null
}

type ResolvedSocialLink = {
  label: string
  icon?: string
  href: string
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value != null
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.25 4.5C2.25 14.0269 9.97309 21.75 19.5 21.75H20.25C21.0784 21.75 21.75 21.0784 21.75 20.25V17.067C21.75 16.6532 21.478 16.2889 21.0822 16.1713L17.5809 15.1291C17.2338 15.0258 16.8609 15.1178 16.6013 15.3683L15.135 16.7832C14.7076 17.1956 14.0466 17.3121 13.4951 17.0706C10.5305 15.7723 8.22774 13.4695 6.92937 10.5049C6.6879 9.95335 6.80443 9.2924 7.2168 8.865L8.63173 7.39869C8.88219 7.13913 8.97418 6.76616 8.87088 6.41911L7.82872 2.91778C7.71106 2.52203 7.34682 2.25 6.93295 2.25H3.75C2.92157 2.25 2.25 2.92157 2.25 3.75V4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12M12 21C7.02944 21 3 16.9706 3 12M12 21C14.2513 18.5376 15.5305 15.3439 15.6 12C15.5305 8.65614 14.2513 5.46243 12 3M12 21C9.74873 18.5376 8.46949 15.3439 8.4 12C8.46949 8.65614 9.74873 5.46243 12 3M21 12C21 7.02944 16.9706 3 12 3M21 12H3M3 12C3 7.02944 7.02944 3 12 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.75 6.75V17.25C21.75 18.4926 20.7426 19.5 19.5 19.5H4.5C3.25736 19.5 2.25 18.4926 2.25 17.25V6.75M21.75 6.75C21.75 5.50736 20.7426 4.5 19.5 4.5H4.5C3.25736 4.5 2.25 5.50736 2.25 6.75M21.75 6.75L12.966 12.2401C12.3572 12.6206 11.5928 12.6206 10.984 12.2401L2.25 6.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SocialIcon({icon}: {icon?: string}) {
  switch (icon) {
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.901 4.153H21.98L15.255 11.839L23.166 20.847H16.972L12.121 15.379L7.336 20.847H4.255L11.449 12.622L3.859 4.153H10.209L14.594 9.151L18.901 4.153ZM17.82 18.99H19.526L9.282 5.912H7.451L17.82 18.99Z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.153 3C16.4265 5.02461 17.6319 6.38484 19.5 7.017V9.7425C18.3301 9.74268 17.1766 9.46484 16.134 8.9325V14.4975C16.134 18.069 13.2435 21 9.636 21C6.0285 21 3 18.069 3 14.4975C3 10.926 5.8905 7.995 9.498 7.995C9.91387 7.9938 10.3287 8.03402 10.736 8.115V10.98C10.3517 10.8599 9.95095 10.8017 9.549 10.8075C7.587 10.8075 5.997 12.387 5.997 14.3408C5.997 16.2945 7.587 17.874 9.549 17.874C11.763 17.874 13.251 16.185 13.251 14.0408V3H16.153Z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.582 7.18875C21.357 6.34125 20.6948 5.67825 19.8465 5.454C18.303 5.04 12 5.04 12 5.04C12 5.04 5.697 5.04 4.1535 5.454C3.30525 5.67825 2.643 6.34125 2.418 7.18875C2.004 8.73075 2.004 11.9978 2.004 11.9978C2.004 11.9978 2.004 15.2648 2.418 16.8068C2.643 17.6543 3.30525 18.2895 4.1535 18.5138C5.697 18.9278 12 18.9278 12 18.9278C12 18.9278 18.303 18.9278 19.8465 18.5138C20.6948 18.2895 21.357 17.6543 21.582 16.8068C21.996 15.2648 21.996 11.9978 21.996 11.9978C21.996 11.9978 21.996 8.73075 21.582 7.18875ZM9.99 14.883V9.1125L15.006 11.9978L9.99 14.883Z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 21V13.875H15.9L16.26 11.1H13.5V9.3375C13.5 8.55 13.71 8.025 14.85 8.025H16.35V5.55C15.6153 5.45727 14.8754 5.4122 14.135 5.415C11.94 5.415 10.44 6.7425 10.44 9.18V11.1H8.25V13.875H10.44V21H13.5Z" />
        </svg>
      )
  }
}

function getSocialLinks(settings?: GlobalSettingsData | null): ResolvedSocialLink[] {
  const items =
    settings?.footer?.socialLinks
      ?.map((item) => {
        const label = renderText(item?.label)
        const href = cleanText(item?.href)
        if (!label || !href) return null
        return {label, icon: cleanText(item?.icon), href}
      })
      .filter(isNonNullable) ?? []

  if (items.length > 0) return items

  return [
    {label: 'Facebook', href: '/contact', icon: 'facebook'},
    {label: 'X', href: '/vlog', icon: 'x'},
    {label: 'TikTok', href: '/vlog', icon: 'tiktok'},
    {label: 'YouTube', href: '/vlog', icon: 'youtube'},
  ]
}

export default function Footer({settings}: FooterProps) {
  const phoneLabel = renderText(settings?.footer?.phoneLabel) || 'Phone'
  const emailLabel = renderText(settings?.footer?.emailLabel) || 'Email'
  const websiteLabelTitle = renderText(settings?.footer?.websiteLabelTitle) || 'Website'
  const networkKicker = renderText(settings?.footer?.networkKicker) || 'Regional Coverage'
  const networkTitle = renderText(settings?.footer?.networkTitle) || 'Our Network'
  const socialKicker = renderText(settings?.footer?.socialKicker) || 'Stay Connected'
  const socialTitle = renderText(settings?.footer?.socialTitle) || 'Follow Us'

  const phone = renderText(settings?.contact?.phone) || '+86 19941519694'
  const email = renderText(settings?.contact?.email) || 'sales@dodoshark.com'
  const supportEmail = renderText(settings?.contact?.supportEmail) || 'support@dodoshark.com'
  const websiteLabelValue = renderText(settings?.contact?.websiteLabel) || 'www.dodoshark.com'
  const websiteUrl = cleanText(settings?.contact?.websiteUrl) || 'https://www.dodoshark.com'
  const headquartersKicker = renderText(settings?.footer?.headquartersKicker) || 'Headquarters'
  const headquartersTitle = renderText(settings?.footer?.headquartersTitle) || renderText(settings?.siteName) || 'DoDoShark'
  const logoSrc = toImageSrc(settings?.logo, 360)
  const headquartersBody =
    renderText(settings?.footer?.headquartersBody) ||
    'Located in Nanjing, Jiangsu, China.\nDoDoShark is a brand of Nanjing Heici Machinery Co., Ltd.'
  const networkItems =
    settings?.footer?.networkItems?.map((item) => renderText(item)).filter((item): item is string => Boolean(item)) ??
    []
  const resolvedNetworkItems =
    networkItems.length > 0
      ? networkItems
      : [
          'Customers cover 1,000+ cities across China',
          'Business operations cover 12+ countries worldwide',
          'Three major production bases: Jinan / Liaocheng / Weifang',
        ]
  const socialLinks = getSocialLinks(settings)
  const footerLinks =
    settings?.footer?.footerLinks
      ?.map((item) => {
        const label = renderText(item?.label)
        const href = cleanText(item?.href)
        if (!label || !href) return null
        return {label, href}
      })
      .filter((item): item is {label: string; href: string} => Boolean(item)) ?? []
  const resolvedFooterLinks =
    footerLinks.length > 0
      ? footerLinks
      : [
          {label: 'Terms of Service', href: '/terms'},
          {label: 'Privacy Policy', href: '/privacy'},
        ]
  const copyrightText = renderText(settings?.footer?.copyrightText) || '© 2026 DoDoShark. All rights reserved.'

  const footerMap = settings?.footer?.footerMap
  const footerMapImage = footerMap?.image
  const footerMapAria = renderText(footerMap?.ariaLabel) || 'Worldwide customer distribution map'

  const getSanityDataAttr = (path: string) => {
    if (!settings?._id) return undefined
    return createDataAttribute({
      id: settings._id.replace('drafts.', ''), // Ensure clean ID for the intent
      type: 'globalSettings',
      path,
      projectId: 'nljl95h9',
      dataset: 'production',
    }).toString()
  }

  const footerDataAttribute = getSanityDataAttr('footer')
  const footerLinksDataAttribute = getSanityDataAttr('footer.footerLinks')

  return (
    <footer className="industrial-footer" data-sanity={footerDataAttribute}>
      <div className="industrial-footer__inner">
        <div className="industrial-footer__grid">
          <section className="footer-block" aria-labelledby="footer-company-title">
            <p className="footer-kicker" data-sanity={getSanityDataAttr('footer.headquartersKicker')}>{headquartersKicker}</p>
            <h2 className="footer-title" id="footer-company-title" data-sanity={getSanityDataAttr('footer.headquartersTitle')}>
              {headquartersTitle}
            </h2>
            <div className="footer-rule" />
            <p className="footer-copy whitespace-pre-line" data-sanity={getSanityDataAttr('footer.headquartersBody')}>{headquartersBody}</p>

            <ul className="footer-contact-list" data-sanity={getSanityDataAttr('contact')}>
              {[
                {
                  label: phoneLabel,
                  values: [{label: phone, href: `tel:${phone.replace(/\s+/g, '')}`}],
                  icon: <PhoneIcon />,
                  sanityPath: 'phoneLabel',
                },
                {
                  label: websiteLabelTitle,
                  values: [{label: websiteLabelValue, href: websiteUrl}],
                  icon: <WebsiteIcon />,
                  sanityPath: 'websiteLabelTitle',
                },
                {
                  label: emailLabel,
                  values: [
                    {label: email, href: `mailto:${email}`},
                    {label: supportEmail, href: `mailto:${supportEmail}`},
                  ],
                  icon: <EmailIcon />,
                  sanityPath: 'emailLabel',
                },
              ].map((item) => (
                <li key={item.label} className="footer-contact-item">
                  <span className="footer-icon-chip">{item.icon}</span>
                  <div>
                    <span className="footer-meta-label" data-sanity={getSanityDataAttr(`footer.${item.sanityPath}`)}>{item.label}</span>
                    <div className="flex flex-col">
                      {item.values.map((value) => (
                        <span key={value.label} className="footer-meta-value">
                          <a
                            href={value.href}
                            target={value.href.startsWith('https') ? '_blank' : undefined}
                            rel={value.href.startsWith('https') ? 'noreferrer' : undefined}
                            data-sanity={getSanityDataAttr(
                              `contact.${
                                item.sanityPath === 'websiteLabelTitle'
                                  ? 'websiteLabel'
                                  : item.sanityPath.replace('Label', '')
                              }`
                            )}
                          >
                            {value.label}
                          </a>
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="footer-block" aria-labelledby="footer-network-title">
            <p className="footer-kicker" data-sanity={getSanityDataAttr('footer.networkKicker')}>{networkKicker}</p>
            <h2 className="footer-title" id="footer-network-title" data-sanity={getSanityDataAttr('footer.networkTitle')}>
              {networkTitle}
            </h2>
            <div className="footer-rule" />

            <ul className="footer-network-list">
              {resolvedNetworkItems.map((item, index) => (
                <li key={item} className="footer-network-item">
                  <span className="footer-icon-chip">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 21C15.75 16.5 18 13.3176 18 10.5C18 7.18629 15.3137 4.5 12 4.5C8.68629 4.5 6 7.18629 6 10.5C6 13.3176 8.25 16.5 12 21Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 12.75C13.2426 12.75 14.25 11.7426 14.25 10.5C14.25 9.25736 13.2426 8.25 12 8.25C10.7574 8.25 9.75 9.25736 9.75 10.5C9.75 11.7426 10.7574 12.75 12 12.75Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="footer-network-title" data-sanity={getSanityDataAttr(`footer.networkItems[${index}]`)}>{item}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="footer-block" aria-labelledby="footer-social-title">
            <p className="footer-kicker" data-sanity={getSanityDataAttr('footer.socialKicker')}>{socialKicker}</p>
            <h2 className="footer-title" id="footer-social-title" data-sanity={getSanityDataAttr('footer.socialTitle')}>
              {socialTitle}
            </h2>
            <div className="footer-rule" />

            <div className="footer-social-grid">
              {socialLinks.map((item, index) => (
                <Link key={item.label} className="footer-social-link" href={item.href || '/'} aria-label={item.label} data-sanity={getSanityDataAttr(`footer.socialLinks[${index}]`)} >
                  <span className="footer-social-badge">
                    <SocialIcon icon={item.icon} />
                  </span>
                </Link>
              ))}
            </div>
            <div className="footer-map-wrap" aria-label={footerMapAria} data-sanity={getSanityDataAttr('footer.footerMap')}>
              {footerMapImage?.asset ? (
                <CMSImage
                  image={footerMapImage}
                  width={320}
                  height={156}
                  className="footer-map-image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                />
              ) : (
                <Image
                  src="/assets/images/background/footer-map-image.png"
                  alt="World map showing DoDoShark global presence"
                  width={320}
                  height={156}
                  className="footer-map-image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                />
              )}
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright" data-sanity={getSanityDataAttr('footer.copyrightText')}>{copyrightText}</div>
          <div className="footer-legal" data-sanity={footerLinksDataAttribute}>
            {resolvedFooterLinks.map((item, index) => (
              <span key={`${item.label}-${item.href}`} className="contents">
                {index > 0 ? <span className="footer-legal-separator">|</span> : null}
                <Link href={item.href} className="footer-legal-link">
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

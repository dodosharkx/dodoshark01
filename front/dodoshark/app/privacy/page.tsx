import type {Metadata} from 'next'
import Link from 'next/link'

import {PortableText, type PortableTextBlock} from 'next-sanity'

import {fetchSanityData} from '@/app/lib/sanity.live'
import {buildPageMetadata} from '@/app/lib/seo'
import {cleanText, renderText} from '@/app/lib/sanity-utils'
import type {SeoMeta} from '@/app/lib/types/sanity'

type PrivacyPageData = {
  seo?: SeoMeta
  lastUpdated?: string
  heroTitle?: string
  heroDescription?: string
  content?: PortableTextBlock[]
  bottomCta?: {
    title?: string
    description?: string
    buttonLabel?: string
    buttonHref?: string
  }
}

const PRIVACY_PAGE_QUERY = `coalesce(
  *[_id == "privacyPage"][0],
  *[_type == "privacyPage"][0]
){
  seo,
  lastUpdated,
  heroTitle,
  heroDescription,
  content,
  bottomCta{
    title,
    description,
    buttonLabel,
    buttonHref
  }
}`

// Hardcoded fallback removed after CMS migration

async function getPrivacyPageData(stega?: boolean) {
  return fetchSanityData<PrivacyPageData | null>({
    query: PRIVACY_PAGE_QUERY,
    stega,
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPrivacyPageData(false)
  return buildPageMetadata({
    seo: pageData?.seo,
    fallbackTitle: 'Privacy Policy | DoDoShark',
    fallbackDescription: 'How DoDoShark collects, uses, and protects business and website data.',
  })
}

export default async function PrivacyPage() {
  const pageData = await getPrivacyPageData()
  const lastUpdated = renderText(pageData?.lastUpdated) || 'March 4, 2026'
  const heroTitle = renderText(pageData?.heroTitle) || 'Privacy Policy'
  const heroDescription =
    renderText(pageData?.heroDescription) ||
    'How we protect your data across industrial sales, technical support, and website operations.'

  const ctaTitle = renderText(pageData?.bottomCta?.title) || 'Need Data Compliance Support?'
  const ctaDescription =
    renderText(pageData?.bottomCta?.description) ||
    'For NDA workflows, procurement compliance, or customer data handling requests, our team will respond within 2 business days.'
  const ctaLabel = renderText(pageData?.bottomCta?.buttonLabel) || 'Contact Privacy Team'
  const ctaHref = cleanText(pageData?.bottomCta?.buttonHref) || '/contact'

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      <section className="border-b border-slate-100 bg-slate-50 pb-20 pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
            <span>Last updated {lastUpdated}</span>
          </div>
          <h1 className="mb-6 text-5xl font-display font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            {heroTitle.includes('Privacy') ? (
              <>
                Privacy <span className="accent-gradient-text">Policy</span>
              </>
            ) : (
              heroTitle
            )}
          </h1>
          <p className="text-lg font-light text-slate-500">{heroDescription}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="portable-text-content">
            {pageData?.content ? (
              <PortableText
                value={pageData.content}
                components={{
                  block: {
                    h2: ({children}) => (
                      <h2 className="mb-5 mt-12 text-2xl font-display font-black uppercase tracking-wide text-slate-900 first:mt-0">
                        {children}
                      </h2>
                    ),
                    normal: ({children}) => <p className="mb-6 leading-8 text-slate-600 last:mb-0">{children}</p>,
                  },
                }}
              />
            ) : (
              <p className="text-slate-500 italic">Policy content coming soon...</p>
            )}
          </div>

          <div className="mt-20 rounded-lg bg-slate-800 p-10 text-white">
            <h2 className="mb-4 text-xl font-display font-black uppercase tracking-tight">{ctaTitle}</h2>
            <p className="mb-8 text-sm font-light italic text-slate-300">{ctaDescription}</p>
            <Link
              href={ctaHref}
              className="inline-block rounded-md bg-orange-500 px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-orange-400"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

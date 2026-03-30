import type {Metadata} from 'next'
import Link from 'next/link'

import {PortableText, type PortableTextBlock} from 'next-sanity'

import {fetchSanityData} from '@/app/lib/sanity.live'
import {buildPageMetadata} from '@/app/lib/seo'
import {cleanText, renderText} from '@/app/lib/sanity-utils'
import type {SeoMeta} from '@/app/lib/types/sanity'

type TermsPageData = {
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

const TERMS_PAGE_QUERY = `coalesce(
  *[_id == "termsPage"][0],
  *[_type == "termsPage"][0]
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

async function getTermsPageData(stega?: boolean) {
  return fetchSanityData<TermsPageData | null>({
    query: TERMS_PAGE_QUERY,
    stega,
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getTermsPageData(false)
  return buildPageMetadata({
    seo: pageData?.seo,
    fallbackTitle: 'Terms of Service | DoDoShark',
    fallbackDescription: 'Terms and conditions for using DoDoShark industrial equipment and website services.',
  })
}

export default async function TermsPage() {
  const pageData = await getTermsPageData()
  const lastUpdated = renderText(pageData?.lastUpdated) || 'March 4, 2026'
  const heroTitle = renderText(pageData?.heroTitle) || 'Terms of Service'
  const heroDescription =
    renderText(pageData?.heroDescription) ||
    'Legal terms for accessing and using DoDoShark products, website, and related services.'

  const ctaTitle = renderText(pageData?.bottomCta?.title) || 'Need Contract Clarification?'
  const ctaDescription =
    renderText(pageData?.bottomCta?.description) ||
    'Our engineering and compliance teams can align legal terms with your procurement process and local project requirements.'
  const ctaLabel = renderText(pageData?.bottomCta?.buttonLabel) || 'Contact DoDoShark'
  const ctaHref = cleanText(pageData?.bottomCta?.buttonHref) || '/contact'

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      <section className="border-b border-slate-100 bg-slate-50 pb-20 pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-3 rounded-md border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
            <span>Last updated {lastUpdated}</span>
          </div>
          <h1 className="mb-6 text-5xl font-display font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            {heroTitle.includes('Terms') ? (
              <>
                Terms of <span className="accent-gradient-text">Service</span>
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
              <p className="text-slate-500 italic">Terms content coming soon...</p>
            )}
          </div>

          <div className="premium-card mt-20 border-orange-500/30 bg-white p-10 shadow-2xl">
            <h2 className="mb-4 text-xl font-display font-black uppercase tracking-tight text-slate-900">
              {ctaTitle}
            </h2>
            <p className="mb-8 text-sm font-light leading-relaxed text-slate-500">{ctaDescription}</p>
            <Link
              href={ctaHref}
              className="inline-block rounded-md bg-slate-800 px-10 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-orange-500"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { fetchSanityData } from '@/app/lib/sanity.live'
import { buildPageMetadata } from '@/app/lib/seo'
import { cleanText, renderText, toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityImage, SeoMeta } from '@/app/lib/types/sanity'
import HeroTitle from '@/components/ui/HeroTitle'
import CMSImage from '@/components/ui/CMSImage'

type RecruitAgentsPageData = {
  seo?: SeoMeta
  hero?: {
    title?: string
    eyebrow?: string
    subtitle?: string
    primaryCtaLabel?: string
    primaryCtaHref?: string
  }
  scope?: {
    title?: string
    description?: string
  }
  whyChooseUs?: Array<{
    title?: string
    description?: string
  }>
  scopeRegions?: Array<{
    region?: string
    countries?: string[]
  }>
  requirements?: Array<{
    title?: string
    items?: string[]
  }>
  supportSections?: Array<{
    title?: string
    items?: string[]
  }>
  cta?: {
    title?: string
    description?: string
    buttonLabel?: string
    buttonHref?: string
  }
  images?: {
    heroBackground?: SanityImage
    recruitmentScopeImage?: SanityImage
  }
}

type WhyChooseUsItem = {
  title: string
  description: string
  icon: ReactNode
}

type ScopeRegion = {
  region: string
  countries: string[]
  color: string
}

type RequirementSection = {
  title: string
  items: string[]
  borderClass: string
}

type SupportSection = {
  title: string
  items: string[]
}

const RECRUIT_AGENTS_PAGE_QUERY = `coalesce(
  *[_id == "recruitAgentsPage"][0],
  *[_type == "recruitAgentsPage"][0]
){
  seo,
  hero,
  whyChooseUs[]{
    title,
    description
  },
  scope,
  scopeRegions[]{
    region,
    countries
  },
  requirements[]{
    title,
    items
  },
  supportSections[]{
    title,
    items
  },
  cta,
  images{
    heroBackground{
      alt,
      asset
    },
    recruitmentScopeImage{
      alt,
      asset
    }
  }
}`

async function getRecruitAgentsPageData(stega?: boolean) {
  return fetchSanityData<RecruitAgentsPageData | null>({
    query: RECRUIT_AGENTS_PAGE_QUERY,
    stega,
  })
}


export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getRecruitAgentsPageData(false)
  return buildPageMetadata({
    seo: pageData?.seo,
    fallbackTitle: 'Recruit Agents | DoDoShark Machinery',
    fallbackDescription:
      'Join the DoDoShark global network. We are looking for high-quality partners to share global industrial dividends and set new brand benchmarks.',
  })
}

export default async function RecruitAgentsPage() {
  const pageData = await getRecruitAgentsPageData()
  const heroTitle =
    renderText(pageData?.hero?.title) || 'Partner with DoDoShark Explore Global Blue Oceans'
  const heroEyebrow =
    renderText(pageData?.hero?.eyebrow) || 'Overseas Partner (Agent) Recruitment Plan'
  const heroSubtitle =
    renderText(pageData?.hero?.subtitle) ||
    'In the wave of global manufacturing upgrades, premium mechanical equipment is the core competitiveness. DoDoShark invites you to seize regional market dividends and embark on a new journey of growth together.'
  const heroCtaLabel = renderText(pageData?.hero?.primaryCtaLabel) || 'Apply Now'
  const heroCtaHref = cleanText(pageData?.hero?.primaryCtaHref) || '/contact'
  const scopeTitle = renderText(pageData?.scope?.title) || 'Strategic Layout, Precise Recruitment'
  const scopeDescription =
    renderText(pageData?.scope?.description) ||
    'We are actively expanding our global presence, focusing on regions with high agricultural and industrial potential.'

  const whyChooseUs: WhyChooseUsItem[] = (pageData?.whyChooseUs && pageData.whyChooseUs.length > 0)
    ? pageData.whyChooseUs.map((item, index) => {
        const icons = [
          (
            <svg key="innovation" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-1.02l-.547-.548z" />
            </svg>
          ),
          (
            <svg key="quality" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
            </svg>
          ),
          (
            <svg key="portfolio" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
          (
            <svg key="supply" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        ]
        return {
          title: renderText(item.title) || 'Continuity',
          description: renderText(item.description) || '',
          icon: icons[index % icons.length]
        }
      })
    : []

  const scopeRegions: ScopeRegion[] = (pageData?.scopeRegions && pageData.scopeRegions.length > 0)
    ? pageData.scopeRegions.map((item, index) => {
        const colors = [
          'from-orange-500/10 to-transparent',
          'from-blue-500/10 to-transparent',
          'from-green-500/10 to-transparent',
          'from-purple-500/10 to-transparent'
        ]
        return {
          region: renderText(item.region) || 'Global',
          countries: (item.countries && item.countries.length > 0)
            ? item.countries.map(c => renderText(c)).filter((c): c is string => Boolean(c))
            : [],
          color: colors[index % colors.length],
        }
      })
    : []

  const requirements: RequirementSection[] = (pageData?.requirements && pageData.requirements.length > 0)
    ? pageData.requirements.map((section, index) => {
        const borderClasses = ['border-orange-500', 'border-slate-900', 'border-orange-500']
        return {
          title: renderText(section.title) || 'Requirement',
          items: (section.items && section.items.length > 0)
            ? section.items.map(i => renderText(i)).filter((i): i is string => Boolean(i))
            : [],
          borderClass: borderClasses[index % borderClasses.length]
        }
      })
    : []

  const supportSections: SupportSection[] = (pageData?.supportSections && pageData.supportSections.length > 0)
    ? pageData.supportSections.map((section) => ({
        title: renderText(section.title) || 'Support',
        items: (section.items && section.items.length > 0)
          ? section.items.map(i => renderText(i)).filter((i): i is string => Boolean(i))
          : []
      }))
    : []
  const ctaTitle = renderText(pageData?.cta?.title) || 'Act Now and Share the Dividends'
  const ctaDescription =
    renderText(pageData?.cta?.description) ||
    "We believe that combining DoDoShark's excellent products with your localized advantages will create miracles. If you are ready to start a new chapter, contact us today."
  const ctaButtonLabel = renderText(pageData?.cta?.buttonLabel) || 'Contact Us To Apply'
  const ctaButtonHref = cleanText(pageData?.cta?.buttonHref) || '/contact'

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      <section className="relative overflow-hidden bg-slate-800 pb-48 pt-32">
        <div className="absolute inset-0 opacity-30">
          {pageData?.images?.heroBackground?.asset ? (
            <CMSImage
              image={pageData.images.heroBackground}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <Image
              src="/assets/images/about/join-us.jpg"
              alt="DoDoShark Global Partnership"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/30 to-slate-900" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            <HeroTitle title={heroTitle} fallback="Partner with DoDoShark Explore Global Blue Oceans" />
          </h1>
          <p className="mb-8 font-serif text-xl font-bold italic text-orange-400">{heroEyebrow}</p>
          <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-slate-300">
            {heroSubtitle}
          </p>
          <div className="mt-12">
            <Link
              href={heroCtaHref}
              className="inline-block rounded-full bg-orange-500 px-10 py-4 text-sm font-bold tracking-widest text-white shadow-xl shadow-orange-500/30 transition-all hover:bg-orange-600"
            >
              {heroCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-16 bg-white py-24 md:rounded-t-[1rem]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Choice is Greater Than <span className="text-orange-500">Effort</span>
            </h2>
            <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-orange-500" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col items-center text-center rounded-xl border border-slate-200 bg-slate-50 p-8 shadow-xl transition-all duration-300 hover:border-orange-500"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg transition-colors group-hover:bg-orange-500">
                  {item.icon}
                </div>
                <h3 className="mb-4 text-xl font-black tracking-tight text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <h2 className="mb-6 text-3xl font-black tracking-tight">{scopeTitle}</h2>
              <p className="mb-10 text-lg font-light leading-relaxed text-slate-600">
                {scopeDescription}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {scopeRegions.map((item) => (
                  <div
                    key={item.region}
                    className={`rounded-xl border border-slate-200 bg-gradient-to-br p-6 ${item.color}`}
                  >
                    <h4 className="mb-3 font-black tracking-tight text-slate-900">
                      {item.region}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.countries.map((country) => (
                        <span
                          key={country}
                          className="rounded-full border border-slate-200 bg-white/50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-full overflow-hidden rounded-xl shadow-2xl md:aspect-video lg:w-1/2 lg:aspect-square">
              {pageData?.images?.recruitmentScopeImage?.asset ? (
                <CMSImage
                  image={pageData.images.recruitmentScopeImage}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/assets/images/about/global-layout.jpg"
                  alt="DoDoShark Global Layout"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-black tracking-tight">
            One Mind, <span className="text-orange-500">One Journey</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl font-light text-slate-500">
            Successful cooperation stems from shared philosophy and strength.
          </p>

          <div className="grid gap-8 text-left md:grid-cols-3">
            {requirements.map((section) => (
              <div key={section.title} className={`rounded-b-xl border-t-4 ${section.borderClass} bg-white p-8 shadow-xl`}>
                <h3 className="mb-6 text-xl font-black tracking-tight">{section.title}</h3>
                <ul className="space-y-4 font-light text-slate-600">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3"><span className="shrink-0 font-bold text-orange-500">+</span>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,100 100,0 100,100" />
          </svg>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Your Success, <span className="text-orange-500">Our Promise</span>
            </h2>
            <p className="mt-4 font-light text-slate-400">
              Empowering Partners, Achieving Shared Value.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {supportSections.map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10"
              >
                <h3 className="mb-6 text-lg font-black tracking-tight text-orange-500">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm font-light text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 p-12 text-center shadow-2xl lg:p-16">
            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />
            <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-900">
              {ctaTitle}
            </h2>
            <p className="mx-auto mb-10 max-w-3xl text-lg font-light leading-relaxed text-slate-600">
              {ctaDescription}
            </p>

            <Link
              href={ctaButtonHref}
              className="inline-block rounded-full bg-slate-900 px-10 py-4 text-sm font-black tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-orange-500"
            >
              {ctaButtonLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

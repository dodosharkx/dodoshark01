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

type ServiceStageImageKey =
  | 'preSalesStageImage'
  | 'midSalesStageImage'
  | 'afterSalesStageImage'

type ServiceStage = {
  id: string
  phase: string
  title: string
  description: string
  features: string[]
  image?: SanityImage
  imageKey: ServiceStageImageKey
  fallbackImageSrc: string
  icon: ReactNode
}

type SupportPageData = {
  seo?: SeoMeta
  hero?: {
    eyebrow?: string
    title?: string
    description?: string
  }
  urgentAssistance?: {
    title?: string
    description?: string
    hotlineLabel?: string
    hotlineValue?: string
    salesLabel?: string
    salesEmail?: string
    supportLabel?: string
    supportEmail?: string
    teamCaptionTitle?: string
    teamCaptionDescription?: string
  }
  stats?: Array<{ label?: string; value?: string }>
  serviceIntro?: {
    eyebrow?: string
    title?: string
  }
  serviceStages?: Array<{
    id?: string
    phase?: string
    title?: string
    description?: string
    features?: string[]
    image?: SanityImage
  }>
  cta?: {
    title?: string
    description?: string
    buttonLabel?: string
    buttonHref?: string
  }
  images?: {
    heroBackground?: SanityImage
    preSalesStageImage?: SanityImage
    midSalesStageImage?: SanityImage
    afterSalesStageImage?: SanityImage
    supportTeamImage?: SanityImage
  }
}

const SUPPORT_PAGE_QUERY = `coalesce(
  *[_id == "supportPage"][0],
  *[_type == "supportPage"][0]
){
  seo,
  hero,
  urgentAssistance,
  stats[]{
    label,
    value
  },
  serviceIntro{
    eyebrow,
    title
  },
  serviceStages[]{
    id,
    phase,
    title,
    description,
    features,
    image{
      alt,
      asset
    }
  },
  cta,
  images{
    heroBackground{
      alt,
      asset
    },
    preSalesStageImage{
      alt,
      asset
    },
    midSalesStageImage{
      alt,
      asset
    },
    afterSalesStageImage{
      alt,
      asset
    },
    supportTeamImage{
      alt,
      asset
    }
  }
}`

async function getSupportPageData(stega?: boolean) {
  return fetchSanityData<SupportPageData | null>({
    query: SUPPORT_PAGE_QUERY,
    stega,
  })
}


const SERVICE_STAGES: ServiceStage[] = [
  {
    id: '01',
    phase: 'Pre-Sales',
    title: 'Solution Co-creation & Professional Selection',
    description:
      'Beyond selling equipment, we guarantee results. Through deep research into material properties, capacity requirements, and site conditions, we output precision analysis reports to anchor your efficiency targets.',
    features: [
      'Full-Dimensional Deep Research',
      'Customized Process Solutions',
      'Free Trial Production & Optimization',
      'Transparent Efficiency Modeling',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    imageKey: 'preSalesStageImage' as const,
    fallbackImageSrc: '/assets/images/about/support-hero.jpg',
  },
  {
    id: '02',
    phase: 'Mid-Sales',
    title: 'Precise Implementation & Efficiency Delivery',
    description:
      'A seamless transfer of knowledge and technology. All equipment undergoes 12-hour factory stress tests of core components and full-system assembly trails to ensure stability before arrival.',
    features: [
      '12h Factory Performance Test',
      'Professional Export Packaging',
      'Technical Documentation Transfer',
      '30-Day Priority Response Support',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    imageKey: 'midSalesStageImage' as const,
    fallbackImageSrc: '/assets/images/about/dust-control.png',
  },
  {
    id: '03',
    phase: 'After-Sales',
    title: 'Lifelong Service & Continuous Optimization',
    description:
      'Beyond standard maintenance, we safeguard your full lifecycle efficiency. This includes remote guidance for technical challenges, 3-year core warranty, and annual reviews to identify upgrade potential.',
    features: [
      '3-Year Core Component Warranty',
      'Annual Efficiency Review & Upgrade',
      'Ongoing Technical Empowerment',
      'Rapid Maintenance Support',
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    imageKey: 'afterSalesStageImage' as const,
    fallbackImageSrc: '/assets/images/about/join-us.jpg',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getSupportPageData(false)
  return buildPageMetadata({
    seo: pageData?.seo,
    fallbackTitle: 'Service & Support | DoDoShark Machinery',
    fallbackDescription:
      'We are more than just an equipment supplier, we are your lifelong partner in value co-creation. From tailored pre-sales solutions to a 3-year core warranty, we ensure your production efficiency.',
  })
}

export default async function SupportPage() {
  const pageData = await getSupportPageData()
  const heroEyebrow = renderText(pageData?.hero?.eyebrow) || 'World-Class Service Network'
  const heroTitle = renderText(pageData?.hero?.title) || 'Service That Powers Results'
  const heroDescription =
    renderText(pageData?.hero?.description) ||
    'We are not just an equipment supplier, but your lifelong partner in value co-creation. We deliver measurable, continuously optimized production results.'
  const urgentAssistanceTitle =
    renderText(pageData?.urgentAssistance?.title) || 'Need Urgent Assistance?'
  const urgentAssistanceDescription =
    renderText(pageData?.urgentAssistance?.description) ||
    'Our global technical response team is on standby to help you resolve equipment issues, order spare parts, or schedule an efficiency audit.'
  const parsedStats = pageData?.stats?.map((stat) => {
    const label = renderText(stat?.label)
    const value = renderText(stat?.value)
    if (!label || !value) return null
    return { label, val: value }
  }).filter((item): item is { label: string; val: string } => Boolean(item)) ?? []
  const stats = (parsedStats && parsedStats.length > 0) ? parsedStats : [
    { label: 'Core Component Warranty', val: '3 Years' },
    { label: 'Technical Response Time', val: '24/7' },
    { label: 'Countries Served', val: '100+' },
    { label: 'Spare Parts Availability', val: '99%' },
  ]
  const serviceEyebrow = renderText(pageData?.serviceIntro?.eyebrow) || 'Value Co-Creation'
  const serviceTitle = renderText(pageData?.serviceIntro?.title) || 'Full-Lifecycle Efficiency Empowerment'
  const serviceStages: ServiceStage[] = SERVICE_STAGES.map((fallback, index) => {
    const cmsStage = pageData?.serviceStages?.[index]
    if (!cmsStage) return fallback

    return {
      ...fallback,
      id: renderText(cmsStage.id) || fallback.id,
      phase: renderText(cmsStage.phase) || fallback.phase,
      title: renderText(cmsStage.title) || fallback.title,
      description: renderText(cmsStage.description) || fallback.description,
      features: (cmsStage.features && cmsStage.features.length > 0)
        ? cmsStage.features.map(f => renderText(f)).filter((f): f is string => Boolean(f))
        : fallback.features,
      image: cmsStage.image
    }
  })
  const hotlineLabel = renderText(pageData?.urgentAssistance?.hotlineLabel) || '24/7 Hotline'
  const hotlineValue = renderText(pageData?.urgentAssistance?.hotlineValue) || '+86 19941519694'
  const salesLabel = renderText(pageData?.urgentAssistance?.salesLabel) || 'Sales'
  const salesEmail = renderText(pageData?.urgentAssistance?.salesEmail) || 'sales@dodoshark.com'
  const supportLabel = renderText(pageData?.urgentAssistance?.supportLabel) || 'Technical Support'
  const supportEmail = renderText(pageData?.urgentAssistance?.supportEmail) || 'support@dodoshark.com'
  const teamCaptionTitle = renderText(pageData?.urgentAssistance?.teamCaptionTitle) || 'Experts You Can Trust'
  const teamCaptionDescription =
    renderText(pageData?.urgentAssistance?.teamCaptionDescription) || 'Direct connection to senior engineers.'
  const ctaTitle = renderText(pageData?.cta?.title) || 'Ready to Optimize Your Value Partnership?'
  const ctaDescription =
    renderText(pageData?.cta?.description) ||
    'Experience the DoDoShark difference with a partner that accompanies your growth from equipment service to full-lifecycle empowerment.'
  const ctaButtonLabel = renderText(pageData?.cta?.buttonLabel) || 'Request Efficiency Audit'
  const ctaButtonHref = cleanText(pageData?.cta?.buttonHref) || '/contact'

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      <section className="relative overflow-hidden bg-slate-800 pb-32 pt-24">
        <div className="absolute inset-0 z-0">
          {pageData?.images?.heroBackground?.asset ? (
            <CMSImage
              image={pageData.images.heroBackground}
              fill
              priority
              className="object-cover opacity-40"
            />
          ) : (
            <Image
              src="/assets/images/about/support-hero.jpg"
              alt="DoDoShark Global Service"
              fill
              sizes="100vw"
              className="object-cover opacity-40"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-400">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span>{heroEyebrow}</span>
            </div>
            <h1 className="mb-8 font-display text-5xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white md:text-7xl">
              <HeroTitle title={heroTitle} fallback="Service That Powers Results" />
            </h1>
            <p className="mb-10 border-l-2 border-orange-500/50 pl-6 text-lg font-normal leading-relaxed text-slate-300 md:text-xl">
              {heroDescription}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-[#fcfdfd] to-transparent" />
      </section>

      <section className="relative z-20 -mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-xl"
              >
                <div className="mb-1 text-2xl font-display font-extrabold text-slate-900">
                  {stat.val}
                </div>
                <div className="text-[10px] font-display font-semibold uppercase tracking-widest text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fcfdfd] py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-24 text-center">
            <h2 className="mb-4 text-sm font-display font-semibold uppercase tracking-[0.3em] text-orange-500">
              {serviceEyebrow}
            </h2>
            <h3 className="font-display text-4xl font-extrabold leading-[1.15] tracking-[-0.02em] text-slate-900 md:text-5xl">
              {serviceTitle}
            </h3>
          </div>

          <div className="space-y-32">
            {serviceStages.map((stage, idx) => (
              <div
                key={stage.id}
                className={`flex flex-col items-center gap-16 lg:flex-row lg:gap-24 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="mb-6 flex items-center space-x-4">
                    <span className="text-6xl font-display font-black leading-none text-orange-500/80">
                      {stage.id}
                    </span>
                    <div>
                      <span className="mb-1 block text-xs font-display font-semibold uppercase tracking-widest text-orange-500">
                        {stage.phase}
                      </span>
                      <h4 className="text-3xl font-display font-extrabold leading-tight tracking-[-0.02em] text-slate-900">
                        {stage.title}
                      </h4>
                    </div>
                  </div>
                  <p className="mb-8 text-lg font-light leading-relaxed text-slate-600">
                    {stage.description}
                  </p>
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {stage.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center space-x-3 text-sm font-medium text-slate-700"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                    {stage.image?.asset ? (
                      <CMSImage
                        image={stage.image}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={stage.fallbackImageSrc}
                        alt={stage.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-orange-500/10 transition-colors duration-500 group-hover:bg-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-24">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-orange-500 opacity-10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-500 opacity-10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/5 bg-slate-900/50 p-10 backdrop-blur-sm md:p-16">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-display font-extrabold uppercase tracking-[-0.02em] text-white md:text-4xl">
                  {urgentAssistanceTitle}
                </h2>
                <p className="mb-8 text-lg font-light leading-relaxed text-slate-400">
                  {urgentAssistanceDescription}
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="mb-1 font-bold text-white">{hotlineLabel}</div>
                      <div className="text-2xl font-black text-orange-400">{hotlineValue}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4 font-bold text-white">Email Channels</div>
                      <div className="flex flex-col gap-y-6 sm:flex-row sm:gap-x-12">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            {salesLabel}
                          </div>
                          <div className="text-lg font-medium tracking-tight text-white">
                            {salesEmail}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            {supportLabel}
                          </div>
                          <div className="text-lg font-medium tracking-tight text-white">
                            {supportEmail}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="group flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 text-center">
                  {pageData?.images?.supportTeamImage?.asset ? (
                    <CMSImage
                      image={pageData.images.supportTeamImage}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <Image
                      src="/assets/images/about/team.jpg"
                      alt="DoDoShark Global Support Team"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-xl font-display font-extrabold uppercase tracking-tight text-white">
                      {teamCaptionTitle}
                    </p>
                    <p className="text-sm font-light text-slate-400">
                      {teamCaptionDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-display font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900 md:text-5xl">
            {ctaTitle}
          </h2>
          <p className="mb-12 text-lg font-light text-slate-500">{ctaDescription}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={ctaButtonHref}
              className="rounded-full bg-orange-500 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-600"
            >
              {ctaButtonLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

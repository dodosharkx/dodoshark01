import type { Metadata } from 'next'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { fetchSanityData } from '@/lib/sanity.live'
import { buildPageMetadata } from '@/lib/seo'
import { cleanText, renderText, toImageSrc } from '@/lib/sanity-utils'
import type { SanityImage, SeoMeta } from '@/lib/types/sanity'
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
  images?: {
    heroBackground?: SanityImage
    preSalesStageImage?: SanityImage
    midSalesStageImage?: SanityImage
    afterSalesStageImage?: SanityImage
  }
}

const SUPPORT_PAGE_QUERY = `coalesce(
  *[_id == "supportPage"][0],
  *[_type == "supportPage"][0]
){
  seo,
  hero,
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
    }
  }
} `

async function getSupportPageData(stega?: boolean) {
  return fetchSanityData<SupportPageData | null>({
    query: SUPPORT_PAGE_QUERY,
    stega,
  })
}

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
  const serviceEyebrow = renderText(pageData?.serviceIntro?.eyebrow) || 'Value Co-Creation'
  const serviceTitle = renderText(pageData?.serviceIntro?.title) || 'Full-Lifecycle Efficiency Empowerment'

  const rawStats = (pageData?.stats && pageData.stats.length > 0) ? pageData.stats : []
  const parsedStats = rawStats.map((stat) => {
    const label = renderText(stat?.label)
    const value = renderText(stat?.value)
    if (!label || !value) return null
    return { label, val: value }
  }).filter((item): item is { label: string; val: string } => Boolean(item))
  const stats = (parsedStats && parsedStats.length > 0) ? parsedStats : [
    { label: 'Core Component Warranty', val: '3 Years' },
    { label: 'Technical Response Time', val: '24/7' },
    { label: 'Countries Served', val: '100+' },
    { label: 'Spare Parts Availability', val: '99%' },
  ]

  const serviceStages = (pageData?.serviceStages && pageData.serviceStages.length > 0)
    ? pageData.serviceStages.map((stage, index) => {
        const icons = [
          (
            <svg key="01" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          (
            <svg key="02" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          ),
          (
            <svg key="03" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        ]

        return {
          id: renderText(stage.id) || `0${index + 1}`,
          phase: renderText(stage.phase) || 'Service Stage',
          title: renderText(stage.title) || 'Service Details',
          description: renderText(stage.description) || '',
          features: (stage.features && stage.features.length > 0)
            ? stage.features.map(f => renderText(f)).filter((f): f is string => Boolean(f))
            : [],
          image: stage.image,
          imageKey: 'preSalesStageImage' as const,
          fallbackImageSrc: '/assets/images/about/support-hero.jpg',
          icon: icons[index] || icons[0]
        }
      })
    : []


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


    </main>
  )
}

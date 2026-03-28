import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { client } from '@/app/lib/sanity'
import { toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityImage } from '@/app/lib/types/sanity'

type SupportPageData = {
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

function resolvePageImage(
  image: SanityImage | undefined,
  fallbackSrc: string,
  fallbackAlt: string,
  width: number,
) {
  return {
    src: toImageSrc(image, width) || fallbackSrc,
    alt: image?.alt?.trim() || fallbackAlt,
  }
}

export const metadata: Metadata = {
  title: 'Service & Support | DoDoShark Machinery',
  description: 'We are more than just an equipment supplier—we are your lifelong partner in value co-creation. From tailored pre-sales solutions to a 3-year core warranty, we ensure your production efficiency.',
}

const SERVICE_STAGES = [
  {
    id: '01',
    phase: 'Pre-Sales',
    title: 'Solution Co-creation & Professional Selection',
    description: 'Beyond selling equipment, we guarantee results. Through deep research into material properties, capacity requirements, and site conditions, we output precision analysis reports to anchor your efficiency targets.',
    features: ['Full-Dimensional Deep Research', 'Customized Process Solutions', 'Free Trial Production & Optimization', 'Transparent Efficiency Modeling'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    imageKey: 'preSalesStageImage' as const,
    fallbackImageSrc: '/assets/images/about/support-hero.jpg',
  },
  {
    id: '02',
    phase: 'Mid-Sales',
    title: 'Precise Implementation & Efficiency Delivery',
    description: 'A seamless transfer of knowledge and technology. All equipment undergoes 12-hour factory stress tests of core components and full-system assembly trails to ensure stability before arrival.',
    features: ['12h Factory Performance Test', 'Professional Export Packaging', 'Technical Documentation Transfer', '30-Day Priority Response Support'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    ),
    imageKey: 'midSalesStageImage' as const,
    fallbackImageSrc: '/assets/images/about/dust-control.png',
  },
  {
    id: '03',
    phase: 'After-Sales',
    title: 'Lifelong Service & Continuous Optimization',
    description: 'Beyond standard maintenance—we safeguard your full lifecycle efficiency. This includes remote guidance for technical challenges, 3-year core warranty, and annual reviews to identify upgrade potential.',
    features: ['3-Year Core Component Warranty', 'Annual Efficiency Review & Upgrade', 'Ongoing Technical Empowerment', 'Rapid Maintenance Support'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    imageKey: 'afterSalesStageImage' as const,
    fallbackImageSrc: '/assets/images/about/join-us.jpg',
  },
]

export default async function SupportPage() {
  const pageData = await client.fetch<SupportPageData | null>(SUPPORT_PAGE_QUERY)
  const heroImage = resolvePageImage(
    pageData?.images?.heroBackground,
    '/assets/images/about/support-hero.jpg',
    'DoDoShark Global Service',
    1800,
  )
  const supportTeamImage = resolvePageImage(
    pageData?.images?.supportTeamImage,
    '/assets/images/about/team.jpg',
    'DoDoShark Global Support Team',
    1400,
  )

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-slate-800">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>World-Class Service Network</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
              Service That <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">Powers Results</span>
            </h1>
            <p className="text-xl text-slate-300 font-light leading-relaxed mb-10 border-l-2 border-orange-500/50 pl-6">
              We are not just an equipment supplier, but your lifelong partner in value co-creation. We deliver measurable, continuously optimized production results.
            </p>

          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fcfdfd] to-transparent z-10" />
      </section>

      {/* Trust Badges */}
      <section className="relative z-20 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Core Component Warranty', val: '3 Years' },
              { label: 'Technical Response Time', val: '24/7' },
              { label: 'Countries Served', val: '100+' },
              { label: 'Spare Parts Availability', val: '99%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-center">
                <div className="text-2xl font-black text-slate-900 mb-1">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Stages */}
      <section className="py-32 bg-[#fcfdfd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Value Co-Creation</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Full-Lifecycle Efficiency Empowerment</h3>
          </div>

          <div className="space-y-32">
            {SERVICE_STAGES.map((stage, idx) => {
              const stageImage = resolvePageImage(
                pageData?.images?.[stage.imageKey],
                stage.fallbackImageSrc,
                stage.title,
                1400,
              )

              return (
                <div key={stage.id} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-6xl font-black text-slate-100 leading-none">{stage.id}</span>
                      <div>
                        <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-1">{stage.phase}</span>
                        <h4 className="text-3xl font-black text-slate-900 leading-tight">{stage.title}</h4>
                      </div>
                    </div>
                    <p className="text-slate-600 font-light text-lg leading-relaxed mb-8">
                      {stage.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {stage.features.map(feat => (
                        <li key={feat} className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full lg:w-1/2">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
                      <Image
                        src={stageImage.src}
                        alt={stageImage.alt}
                        fill
                        className={`object-cover group-hover:scale-105 transition-transform duration-700 ${idx === 1 ? 'object-contain bg-white p-8' : ''}`}
                      />
                      <div className="absolute inset-0 bg-orange-500/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Global Tech Support / Hotline */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-[2rem] p-10 md:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Need Urgent Assistance?</h2>
                <p className="text-slate-400 font-light text-lg leading-relaxed mb-8">
                  Our global technical response team is on standby to help you resolve equipment issues, order spare parts, or schedule an efficiency audit.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <div className="text-white font-bold mb-1">24/7 Hotline</div>
                      <div className="text-orange-400 text-2xl font-black">+86 182-5199-9196</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <div className="text-white font-bold mb-1">Email Support</div>
                      <div className="text-slate-400 font-medium">sales@dodoshark.com</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 p-2 flex flex-col justify-center items-center text-center group overflow-hidden">
                  <Image
                    src={supportTeamImage.src}
                    alt={supportTeamImage.alt}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-white font-black text-xl uppercase tracking-tighter">Experts You Can Trust</p>
                    <p className="text-slate-400 text-sm font-light">Direct connection to senior engineers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">Ready to Optimize Your <br /> <span className="text-orange-500">Value Partnership?</span></h2>
          <p className="text-slate-500 font-light text-lg mb-12">
            Experience the DoDoShark difference with a partner that accompanies your growth from equipment service to full-lifecycle empowerment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20">
              Request Efficiency Audit
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

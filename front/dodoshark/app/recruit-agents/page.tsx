import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

import { client } from '@/app/lib/sanity'
import { toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityImage } from '@/app/lib/types/sanity'

type RecruitAgentsPageData = {
  images?: {
    heroBackground?: SanityImage
    recruitmentScopeImage?: SanityImage
  }
}

const RECRUIT_AGENTS_PAGE_QUERY = `coalesce(
  *[_id == "recruitAgentsPage"][0],
  *[_type == "recruitAgentsPage"][0]
){
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
  title: 'Recruit Agents | DoDoShark Machinery',
  description: 'Join the DoDoShark global network. We are looking for high-quality partners to share global industrial dividends and set new brand benchmarks.',
}

const WHY_CHOOSE_US = [
  {
    title: 'Continuous Innovation',
    description: 'Our professional R&D team focuses on "differentiated product value," establishing unique competitive advantages in regional markets beyond low-price competition.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.593-1.02l-.547-.548z" /></svg>
    )
  },
  {
    title: 'Superior Quality',
    description: 'Combined cutting-edge technology with precision manufacturing. High satisfaction, low failure rates, and long service life across all processing scenarios.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    )
  },
  {
    title: 'Diverse Portfolio',
    description: 'Full-category matrix from small crushers to large-scale equipment, covering agriculture, food, and chemicals with precise configuration coverage.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )
  },
  {
    title: 'Stable Supply',
    description: 'Independent control from R&D to assembly. No chain-break risks, fast order response, and timely global delivery guaranteed.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    )
  }
]

const SCOPE = [
  { region: 'Africa', countries: ['Nigeria', 'Ghana', 'Benin', 'Kenya', 'Ethiopia', 'Senegal'], color: 'from-orange-500/10 to-transparent' },
  { region: 'Southeast Asia', countries: ['Philippines', 'Indonesia', 'Thailand', 'Vietnam', 'Laos', 'Cambodia'], color: 'from-blue-500/10 to-transparent' },
  { region: 'South America', countries: ['Brazil', 'Mexico', 'Argentina'], color: 'from-green-500/10 to-transparent' },
  { region: 'Central Asia', countries: ['Kazakhstan', 'Pakistan', 'Uzbekistan'], color: 'from-purple-500/10 to-transparent' },
]

const SUPPORT = [
  {
    title: 'Product & Supply Chain',
    items: ['Competitive pricing & flex ordering', 'Intelligent inventory management', 'Customized SKU for regional needs']
  },
  {
    title: 'Brand & Marketing',
    items: ['Unified VI & multi-lang materials', 'Global promotion resources', 'Localized marketing guidance']
  },
  {
    title: 'Training & After-Sales',
    items: ['24/7 dedicated technical support', 'Remote troubleshooting & spare parts', 'Master product selling points & setup']
  },
  {
    title: 'Cooperation Model',
    items: ['Exclusive & regional agency options', 'Transparent commission & incentives', 'Standardized sustainable agreements']
  }
]

export default async function RecruitAgentsPage() {
  const pageData = await client.fetch<RecruitAgentsPageData | null>(
    RECRUIT_AGENTS_PAGE_QUERY,
  )
  const heroImage = resolvePageImage(
    pageData?.images?.heroBackground,
    '/assets/images/about/join-us.jpg',
    'DoDoShark Global Partnership',
    1800,
  )
  const scopeImage = resolvePageImage(
    pageData?.images?.recruitmentScopeImage,
    '/assets/images/about/global-layout.jpg',
    'DoDoShark Global Layout',
    1400,
  )

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-slate-800">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/30 to-slate-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Partner with DoDoShark <br /> <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">Explore Global Blue Oceans</span>
          </h1>
          <p className="text-xl font-bold italic text-orange-400 mb-8 font-serif">
            Overseas Partner (Agent) Recruitment Plan
          </p>
          <p className="text-lg text-slate-300 max-w-4xl mx-auto font-light leading-relaxed">
            In the wave of global manufacturing upgrades, premium mechanical equipment is the core competitiveness. DoDoShark invites you to seize regional market dividends and embark on a new journey of growth together.
          </p>
          <div className="mt-12">
            <Link href="/contact" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-orange-500/30">
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white relative z-20 -mt-16 rounded-none md:rounded-t-[1rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Choice is Greater Than <span className="text-orange-500">Effort</span></h2>
            <div className="mt-4 h-1.5 w-24 bg-orange-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:border-orange-500 transition-all duration-300 shadow-xl group">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-orange-500 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-slate-900 leading-tight">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Scope */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Strategic Layout, <br /><span className="text-orange-500">Precise Recruitment</span></h2>
              <p className="text-slate-600 font-light leading-relaxed mb-10 text-lg">
                We are actively expanding our global presence, focusing on regions with high agricultural and industrial potential.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {SCOPE.map((item) => (
                  <div key={item.region} className={`p-6 rounded-xl border border-slate-200 bg-gradient-to-br ${item.color}`}>
                    <h4 className="font-black uppercase tracking-tight text-slate-900 mb-3">{item.region}</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.countries.map(c => (
                        <span key={c} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/50 px-2 py-0.5 rounded-full border border-slate-200">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2 relative aspect-square md:aspect-video lg:aspect-square rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={scopeImage.src}
                alt={scopeImage.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">One Mind, <span className="text-orange-500">One Journey</span></h2>
          <p className="text-slate-500 font-light max-w-2xl mx-auto mb-16">Successful cooperation stems from shared philosophy and strength.</p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white border-t-4 border-orange-500 p-8 shadow-xl rounded-b-xl">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Qualifications</h3>
              <ul className="space-y-4 text-slate-600 font-light">
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Legal operating status & qualifications</li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Familiarity with local market & laws</li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Strong local customer resources</li>
              </ul>
            </div>
            <div className="bg-white border-t-4 border-slate-900 p-8 shadow-xl rounded-b-xl">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Capabilities</h3>
              <ul className="space-y-4 text-slate-600 font-light">
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> 3+ years mechanical sales experience</li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Professional tech & sales team</li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Full lifecycle service capability</li>
              </ul>
            </div>
            <div className="bg-white border-t-4 border-orange-500 p-8 shadow-xl rounded-b-xl">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Compliance</h3>
              <ul className="space-y-4 text-slate-600 font-light">
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Adherence to market rules & integrity</li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Solid financial & credit standing</li>
                <li className="flex gap-3"><span className="text-orange-500 font-bold shrink-0">✓</span> Adequate capital for operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Support System */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="0,100 100,0 100,100" /></svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Your Success, <span className="text-orange-500">Our Promise</span></h2>
            <p className="mt-4 text-slate-400 font-light">Empowering Partners, Achieving Shared Value.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SUPPORT.map((s) => (
              <div key={s.title} className="bg-white/5 border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-black uppercase tracking-tight text-orange-500 mb-6">{s.title}</h3>
                <ul className="space-y-4">
                  {s.items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-300 font-light flex gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200 rounded-[1rem] p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tight text-slate-900">Act Now and Share the Dividends</h2>
            <p className="text-slate-600 mb-10 text-lg max-w-3xl mx-auto font-light leading-relaxed">
              We believe that combining DoDoShark's excellent products with your localized advantages will create miracles. If you are ready to start a new chapter, contact us today.
            </p>

            <Link href="/contact" className="inline-block bg-slate-900 hover:bg-orange-500 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20">
              Contact Us To Apply
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

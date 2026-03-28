import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { client } from '@/app/lib/sanity'
import { toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityImage } from '@/app/lib/types/sanity'
import AboutVideoCard from '@/components/about/AboutVideoCard'

export const metadata: Metadata = {
  title: 'About Us | DoDoShark Machinery',
  description:
    "Rooted in China, Serving the World. Discover DoDoShark's 50-year engineering heritage and our commitment to high-performance agricultural and food processing machinery.",
}

type AboutPageImages = {
  brandStoryThumbnail?: SanityImage
  productSystemAgricultureImage?: SanityImage
  productSystemFoodImage?: SanityImage
  globalLayoutBackgroundImage?: SanityImage
  teamImage?: SanityImage
  valuePropositionBackgroundImage?: SanityImage
  joinUsImage?: SanityImage
  timelineStateOwnedHeritageImage?: SanityImage
  timelineBrandFoundationImage?: SanityImage
  timelineMarketRootsImage?: SanityImage
  timelineDualTrackExpansionImage?: SanityImage
  timelineAutomationUpgradeImage?: SanityImage
  timelineFutureOutlookImage?: SanityImage
}

type AboutPageData = {
  hero?: {
    image?: SanityImage
  }
  images?: AboutPageImages
}

type ProductSystemImageKey =
  | 'productSystemAgricultureImage'
  | 'productSystemFoodImage'

type TimelineImageKey =
  | 'timelineStateOwnedHeritageImage'
  | 'timelineBrandFoundationImage'
  | 'timelineMarketRootsImage'
  | 'timelineDualTrackExpansionImage'
  | 'timelineAutomationUpgradeImage'
  | 'timelineFutureOutlookImage'

type ProductSystem = {
  title: string
  description: string
  icon: ReactNode
  tags: string[]
  imageKey: ProductSystemImageKey
  fallbackImageSrc: string
}

type TimelineItem = {
  year: string
  phase: string
  title: string
  desc: string
  imageKey: TimelineImageKey
  fallbackImageSrc: string
}

const ABOUT_PAGE_QUERY = `coalesce(
  *[_id == "aboutPage"][0],
  *[_type == "aboutPage"][0]
){
  hero{
    image{
      alt,
      asset
    }
  },
  images{
    brandStoryThumbnail{
      alt,
      asset
    },
    productSystemAgricultureImage{
      alt,
      asset
    },
    productSystemFoodImage{
      alt,
      asset
    },
    globalLayoutBackgroundImage{
      alt,
      asset
    },
    teamImage{
      alt,
      asset
    },
    valuePropositionBackgroundImage{
      alt,
      asset
    },
    joinUsImage{
      alt,
      asset
    },
    timelineStateOwnedHeritageImage{
      alt,
      asset
    },
    timelineBrandFoundationImage{
      alt,
      asset
    },
    timelineMarketRootsImage{
      alt,
      asset
    },
    timelineDualTrackExpansionImage{
      alt,
      asset
    },
    timelineAutomationUpgradeImage{
      alt,
      asset
    },
    timelineFutureOutlookImage{
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

const PRODUCT_SYSTEMS: ProductSystem[] = [
  {
    title: 'Agricultural Processing Machinery',
    description:
      'Designed for durability and precision in large-scale agricultural scenarios. Covering cast iron crushers, roller crushers, rice millers, and wheat flour mills.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    tags: ['Cast Iron Crushers', 'Roller Crushers', 'Rice Millers', 'Wheat Mills'],
    imageKey: 'productSystemAgricultureImage',
    fallbackImageSrc: '/assets/images/about/dual-track-agri.jpg',
  },
  {
    title: 'Food Processing Machinery',
    description:
      'Meeting rigorous food production standards with premium materials and precision craftsmanship. Solutions for high-end processing and commercial kitchens.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.25 10.5V2.25M14.25 10.5c0 1.243-1.007 2.25-2.25 2.25s-2.25-1.007-2.25-2.25V2.25M14.25 10.5c1.243 0 2.25 1.007 2.25 2.25A2.25 2.25 0 0112 15a2.25 2.25 0 01-2.25-2.25A2.25 2.25 0 0112 12.75"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 19.5v-15m15 15v-15"
        />
      </svg>
    ),
    tags: ['Stainless Crushers', 'Industrial Mixers', 'Dough Mixers', 'Juicers'],
    imageKey: 'productSystemFoodImage',
    fallbackImageSrc: '/assets/images/about/dual-track-food.jpg',
  },
]

const TIMELINE: TimelineItem[] = [
  {
    year: '1970 - 2019',
    phase: 'State-Owned Heritage',
    title: 'A Foundation of Engineering',
    desc:
      'Our predecessor was founded in 1970. Half a century of deep technical accumulation established a solid engineering foundation and robust manufacturing capabilities.',
    imageKey: 'timelineStateOwnedHeritageImage',
    fallbackImageSrc: '/assets/images/about/history-1.jpg',
  },
  {
    year: '2019',
    phase: 'Brand Foundation',
    title: 'The DoDoShark Era Begins',
    desc:
      'DoDoShark Machinery was officially established in the historical capital of Nanjing, locking its focus on empowering agricultural and food processing productivity.',
    imageKey: 'timelineBrandFoundationImage',
    fallbackImageSrc: '/assets/images/about/history-2.jpg',
  },
  {
    year: '2020 - 2021',
    phase: 'Market Roots & Reputation',
    title: 'Iterative Excellence',
    desc:
      'Leveraged deep technical strength to resolve dozens of common industry crusher issues. Gained a firm market foothold with new models featuring high crushing rates and extreme durability.',
    imageKey: 'timelineMarketRootsImage',
    fallbackImageSrc: '/assets/images/about/history-3.jpg',
  },
  {
    year: '2022 - 2023',
    phase: 'Track Expansion',
    title: 'Dual-Track Business Model',
    desc:
      'Extended beyond agricultural machinery into stainless steel food crushers and mixers, successfully forming the "Agriculture + Food" dual-track processing layout.',
    imageKey: 'timelineDualTrackExpansionImage',
    fallbackImageSrc: '/assets/images/about/history-4.jpg',
  },
  {
    year: '2024 - 2025',
    phase: 'Innovation & Lean Manufacturing',
    title: 'Smart Automation Upgrades',
    desc:
      'Core products received hardcore upgrades: Intelligent Control + Energy Saving designs. Introduced lean production systems for dual upgrades in quality and efficiency.',
    imageKey: 'timelineAutomationUpgradeImage',
    fallbackImageSrc: '/assets/images/about/history-5.jpg',
  },
  {
    year: '2026+',
    phase: 'Brand Elevation & Future Outlook',
    title: 'Industry Solution Provider',
    desc:
      'Evolving from an equipment supplier to a comprehensive industry solutions provider. Opening a new global chapter driven by technological depth and effect-based sales.',
    imageKey: 'timelineFutureOutlookImage',
    fallbackImageSrc: '/assets/images/about/history-6.jpg',
  },
]

export default async function AboutPage() {
  const pageData = await client.fetch<AboutPageData | null>(ABOUT_PAGE_QUERY)

  const heroImage = resolvePageImage(
    pageData?.hero?.image,
    '/assets/images/factory.jpg',
    'DoDoShark Production Facility',
    1800,
  )
  const brandStoryThumbnail = resolvePageImage(
    pageData?.images?.brandStoryThumbnail,
    '/assets/images/brand/DoDoShark-Brand-cover.jpg',
    'DoDoShark Brand Story',
    900,
  )
  const globalLayoutImage = resolvePageImage(
    pageData?.images?.globalLayoutBackgroundImage,
    '/assets/images/about/global-layout.jpg',
    'DoDoShark Global Layout',
    1800,
  )
  const teamImage = resolvePageImage(
    pageData?.images?.teamImage,
    '/assets/images/about/team.jpg',
    'DoDoShark Elite Team',
    1400,
  )
  const valuePropositionBackgroundImage = resolvePageImage(
    pageData?.images?.valuePropositionBackgroundImage,
    '/assets/images/about/value-proposition.jpg',
    'Value Proposition Background',
    1800,
  )
  const joinUsImage = resolvePageImage(
    pageData?.images?.joinUsImage,
    '/assets/images/about/join-us.jpg',
    'Join DoDoShark Team',
    1200,
  )

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-800 pt-24 pb-32">
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
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 font-display font-extrabold text-5xl md:text-7xl leading-[1.1] tracking-[-0.02em] text-white">
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              DoDoShark Machinery
            </span>
            <br />
            Rooted in China <br />{' '}
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Empowering the World
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed font-normal text-slate-300">
            We provide stable, efficient, and worry-free DoDoShark machinery.
          </p>
        </div>
      </section>

      {/* Video & Technical Strength */}
      <section className="relative z-20 -mt-16 rounded-none bg-slate-50 py-24 md:rounded-t-[1rem]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
            <div className="w-full lg:sticky lg:top-32 lg:w-5/12">
              <AboutVideoCard
                youtubeUrl="https://www.youtube.com/shorts/C_JWSMn42eA"
                title="DoDoShark Brand Story"
                thumbnailUrl={brandStoryThumbnail.src}
                thumbnailAlt={brandStoryThumbnail.alt}
                aspectRatio="aspect-[9/16]"
              />
            </div>

            <div className="w-full space-y-8 lg:w-7/12">
              <div className="group rounded-xl border border-slate-200 bg-white p-10 shadow-xl transition-all duration-300 hover:border-orange-500 hover:shadow-2xl md:p-12">
                <h2 className="mb-6 font-display text-3xl font-extrabold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-orange-500">
                  Our slogan
                </h2>
                <p className="mb-6 font-serif text-xl font-bold italic leading-relaxed text-orange-600 md:text-2xl">
                  "Work with Confidence, Reap in Joy"
                </p>
                <p className="text-lg leading-relaxed font-light text-slate-600">
                  We aim to build partnerships that transcend equipment, serving every workshop globally with the philosophy of "Work with Confidence, Reap in Joy".
                </p>
              </div>

              <div className="group rounded-xl border border-slate-200 bg-white p-10 shadow-xl transition-all duration-300 hover:border-orange-500 hover:shadow-2xl md:p-12">
                <h2 className="mb-6 font-display text-3xl font-extrabold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-orange-500">
                  Corporate <span className="text-orange-500">DNA</span>
                </h2>
                <p className="mb-6 text-lg leading-relaxed font-light text-slate-600">
                  With a heritage stemming from a state-owned factory founded in 1970, we carry half a century of engineering depth. DoDoShark Machinery was established in Nanjing in 2019, anchoring our core mission as <strong>"Empowering Productivity."</strong>
                </p>
                <p className="text-lg leading-relaxed font-light text-slate-600">
                  We prioritize a "Technology-led Development" model, rejecting homogenization to build a three-dimensional ecosystem: <strong>R&D as the core, Manufacturing as the base, and Service as the wings.</strong>
                </p>
              </div>

              <div className="group rounded-xl border border-slate-200 bg-white p-10 shadow-xl transition-all duration-300 hover:border-orange-500 hover:shadow-2xl md:p-12">
                <h2 className="mb-6 font-display text-3xl font-extrabold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-orange-500">
                  Technical <span className="text-orange-500">Strength</span>
                </h2>
                <p className="text-lg leading-relaxed font-light text-slate-600">
                  Our products significantly outperform peers. For instance, our stainless steel crushers were the first to achieve <strong>150-mesh fineness at 1 ton/hour</strong>, supporting 12 hours continuous operation鈥攎ultiplying standard industry efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product System: Dual-Track */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Dual-Track <br />
              <span className="text-orange-500">Product System</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-light text-slate-500">
              Exceeding industry standards to meet diverse production needs with full-process customized solutions. Seamlessly connecting production segments for maximum efficiency.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="rounded-full bg-orange-500 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600"
              >
                View Product Matrices
              </Link>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {PRODUCT_SYSTEMS.map((sys) => {
              const systemImage = resolvePageImage(
                pageData?.images?.[sys.imageKey],
                sys.fallbackImageSrc,
                sys.title,
                1400,
              )

              return (
                <div key={sys.title} className="group overflow-hidden rounded-xl bg-slate-900 text-white">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={systemImage.src}
                      alt={systemImage.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900 p-8">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                        {sys.icon}
                      </div>
                      <h3 className="mb-2 font-display text-2xl font-extrabold uppercase tracking-tight">{sys.title}</h3>
                    </div>
                  </div>
                  <div className="p-8 pt-4">
                    <p className="mb-6 font-light leading-relaxed text-slate-300">{sys.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {sys.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Global Assets & Team (Stats) */}
      <section className="relative overflow-hidden bg-orange-600 py-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={globalLayoutImage.src}
            alt={globalLayoutImage.alt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-orange-600/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                High-End Talent & <br /> Global Layout
              </h2>
              <p className="mb-4 inline-block rounded bg-white/90 px-3 py-1 text-sm font-bold text-orange-500">
                Our Elite Engineering Team
              </p>
              <div className="relative mb-6 aspect-video overflow-hidden rounded-xl border-4 border-white/20 shadow-2xl">
                <Image
                  src={teamImage.src}
                  alt={teamImage.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mb-6 font-light leading-relaxed text-orange-100">
                Integrating foundational physics, mechanical automation, and IT technology to produce intellectual property. We operate 3 major production bases in Shandong (Jinan, Liaocheng, Weifang) with advanced laser cutting and static pressure casting technologies.
              </p>
              <p className="font-light leading-relaxed text-orange-100">
                From serving every major city in China to expanding into over a dozen countries globally. DoDoShark stands as a new name card for <strong>Intelligent Manufacturing in China</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur transition-colors hover:bg-white/20">
                <div className="mb-2 text-4xl font-black">10+</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Senior Engineers</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur transition-colors hover:bg-white/20">
                <div className="mb-2 text-4xl font-black">3</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Production Bases</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur transition-colors hover:bg-white/20">
                <div className="mb-2 text-4xl font-black">60+</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Skilled Technicians</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur transition-colors hover:bg-white/20">
                <div className="mb-2 text-4xl font-black">10+</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development History Timeline */}
      <section className="overflow-hidden bg-slate-50 py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-24 text-center">
            <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight text-slate-900 md:text-5xl">
              The Journey of <span className="text-orange-500">DoDoShark</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-slate-500">
              From our state-owned origins to a modern global enterprise. Constantly evolving in reliability and innovation.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl space-y-24 before:absolute before:inset-y-0 before:left-[24px] before:w-0.5 before:bg-slate-200 md:before:left-1/2 md:before:-translate-x-1/2">
            {TIMELINE.map((item, idx) => {
              const timelineImage = resolvePageImage(
                pageData?.images?.[item.imageKey],
                item.fallbackImageSrc,
                item.title,
                1200,
              )

              return (
                <div key={item.year} className="group relative flex flex-col items-center md:flex-row">
                  <div className="absolute left-[10px] z-10 h-5 w-5 rounded-full border-4 border-white bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.2)] transition-transform duration-300 group-hover:scale-125 group-hover:bg-orange-600 md:left-1/2 md:-translate-x-1/2" />

                  {idx % 2 === 0 ? (
                    <>
                      <div className="w-full pl-14 text-left md:w-1/2 md:pr-16 md:pl-0 md:text-right">
                        <div className="mb-4 inline-block rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-bold tracking-widest text-slate-900">
                          {item.year}
                        </div>
                        <h3 className="mb-2 font-display text-2xl font-extrabold text-slate-900">{item.title}</h3>
                        <h4 className="mb-4 text-md font-bold text-orange-500">{item.phase}</h4>
                        <p className="font-light leading-relaxed text-slate-600">{item.desc}</p>
                      </div>
                      <div className="mt-8 w-full pl-14 md:mt-0 md:w-1/2 md:pl-16">
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-colors group-hover:border-orange-500">
                          <Image
                            src={timelineImage.src}
                            alt={timelineImage.alt}
                            width={600}
                            height={400}
                            className="h-full w-full rounded-lg object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-2 mt-8 flex w-full pl-14 md:order-1 md:mt-0 md:w-1/2 md:justify-end md:pr-16 md:pl-0">
                        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-colors group-hover:border-orange-500">
                          <Image
                            src={timelineImage.src}
                            alt={timelineImage.alt}
                            width={600}
                            height={400}
                            className="h-full w-full rounded-lg object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="order-1 w-full pl-14 text-left md:order-2 md:w-1/2 md:pl-16">
                        <div className="mb-4 inline-block rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-bold tracking-widest text-slate-900">
                          {item.year}
                        </div>
                        <h3 className="mb-2 font-display text-2xl font-extrabold text-slate-900">{item.title}</h3>
                        <h4 className="mb-4 text-md font-bold text-orange-500">{item.phase}</h4>
                        <p className="font-light leading-relaxed text-slate-600">{item.desc}</p>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mx-auto mt-24 max-w-3xl border-t border-slate-200 pt-16 text-center">
            <p className="mb-4 text-2xl font-black uppercase tracking-tighter text-slate-900">
              Settling in Reliability, Innovating in Evolution.
            </p>
            <p className="font-light text-slate-500">
              From a single machine to a diverse ecosystem. We invite you to co-create the future of intelligent manufacturing.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition / CTA */}
      <section className="relative z-20 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[1rem] border border-slate-800 bg-slate-900 p-12 text-white shadow-2xl lg:p-16">
            <div className="absolute inset-0 opacity-30">
              <Image
                src={valuePropositionBackgroundImage.src}
                alt={valuePropositionBackgroundImage.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-orange-500 opacity-20 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-slate-500 opacity-20 blur-[100px]" />

            <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row">
              <div className="text-center lg:w-7/12 lg:text-left">
                <h2 className="mb-4 font-display font-semibold uppercase tracking-[0.2em] text-orange-500 text-xs text-center lg:text-left">
                  Value Proposition
                </h2>
                <h3 className="mb-8 font-display text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl">
                  Partnerships Beyond Equipment
                </h3>
                <p className="mb-10 text-lg leading-relaxed font-light text-slate-300">
                  We have moved beyond simple equipment sales to an "Effect-based Sales" model, providing full life-cycle solutions from process planning to technical implementation. With an industry-leading <strong>10-year warranty on core components</strong>, we upgrade short-term cooperation into long-term strategic partnerships.
                </p>
                <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                  <Link
                    href="/contact"
                    className="inline-block rounded-full bg-orange-500 px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-600"
                  >
                    Connect With Us Today
                  </Link>
                </div>
              </div>
              <div className="lg:w-5/12">
                <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border-8 border-white/10 shadow-2xl">
                  <Image
                    src={joinUsImage.src}
                    alt={joinUsImage.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="mb-2 text-sm font-black uppercase tracking-widest text-white">
                      Join Our Journey
                    </p>
                    <p className="text-xs font-light text-slate-300">
                      Become part of the global DoDoShark ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

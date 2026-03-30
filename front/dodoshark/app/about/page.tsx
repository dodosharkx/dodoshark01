import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { fetchSanityData } from '@/app/lib/sanity.live'
import { buildPageMetadata } from '@/app/lib/seo'
import { cleanText, renderText, toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityImage, SeoMeta } from '@/app/lib/types/sanity'
import AboutVideoCard from '@/components/about/AboutVideoCard'
import CMSImage from '@/components/ui/CMSImage'

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
  seo?: SeoMeta
  hero?: {
    titleLineOne?: string
    titleLineTwo?: string
    titleLineThree?: string
    description?: string
    image?: SanityImage
  }
  storyCards?: Array<{
    title?: string
    subtitle?: string
    description?: string
  }>
  productSystems?: Array<{
    title?: string
    description?: string
    tags?: string[]
    image?: SanityImage
  }>
  productSystemIntro?: {
    titleLineOne?: string
    titleLineTwo?: string
    description?: string
    buttonLabel?: string
    buttonHref?: string
  }
  globalLayout?: {
    title?: string
    badge?: string
    descriptionOne?: string
    descriptionTwo?: string
    stats?: Array<{ label?: string; value?: string }>
  }
  timeline?: Array<{
    year?: string
    phase?: string
    title?: string
    description?: string
    image?: SanityImage
  }>
  timelineIntro?: {
    titleLineOne?: string
    titleLineTwo?: string
    description?: string
  }
  timelineClosing?: {
    title?: string
    description?: string
  }
  images?: AboutPageImages
  brandStoryTitle?: string
  brandStoryVideoUrl?: string
  cta?: {
    eyebrow?: string
    title?: string
    description?: string
    buttonLabel?: string
    buttonHref?: string
    joinUsTitle?: string
    joinUsDescription?: string
  }
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
  image?: SanityImage
  imageKey: ProductSystemImageKey
  fallbackImageSrc: string
}

type StoryCard = {
  title: string
  subtitle?: string
  description: string
}

type TimelineItem = {
  year: string
  phase: string
  title: string
  desc: string
  image?: SanityImage
  imageKey: TimelineImageKey
  fallbackImageSrc: string
}

const ABOUT_PAGE_QUERY = `coalesce(
  *[_id == "aboutPage"][0],
  *[_type == "aboutPage"][0]
){
  seo,
  hero{
    titleLineOne,
    titleLineTwo,
    titleLineThree,
    description,
    image{
      alt,
      asset
    }
  },
  storyCards[]{
    title,
    subtitle,
    description
  },
  productSystems[]{
    title,
    description,
    tags,
    image{
      alt,
      asset
    }
  },
  productSystemIntro{
    titleLineOne,
    titleLineTwo,
    description,
    buttonLabel,
    buttonHref
  },
  globalLayout{
    title,
    badge,
    descriptionOne,
    descriptionTwo,
    stats[]{
      label,
      value
    }
  },
  timeline[]{
    year,
    phase,
    title,
    description,
    image{
      alt,
      asset
    }
  },
  timelineIntro{
    titleLineOne,
    titleLineTwo,
    description
  },
  timelineClosing{
    title,
    description
  },
  images{
    brandStoryThumbnail{
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
    }
  },
  brandStoryTitle,
  brandStoryVideoUrl,
  cta{
    eyebrow,
    title,
    description,
    buttonLabel,
    buttonHref,
    joinUsTitle,
    joinUsDescription
  }
}`

async function getAboutPageData(stega?: boolean) {
  return fetchSanityData<AboutPageData | null>({
    query: ABOUT_PAGE_QUERY,
    stega,
  })
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value != null
}

const PRODUCT_SYSTEMS_ICONS = [
  (
    <svg key="agri" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  ),
  (
    <svg key="food" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
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
]

// Hardcoded constants removed in favor of CMS data.

export default async function AboutPage() {
  const pageData = await getAboutPageData(true)

  const heroImage = pageData?.hero?.image
  const heroTitleLineOne = renderText(pageData?.hero?.titleLineOne) || 'DoDoShark Machinery'
  const heroTitleLineTwo = renderText(pageData?.hero?.titleLineTwo) || 'Rooted in China'
  const heroTitleLineThree = renderText(pageData?.hero?.titleLineThree) || 'Empowering the World'
  const heroDescription =
    renderText(pageData?.hero?.description) || 'We provide stable, efficient, and worry-free DoDoShark machinery.'
  
  const storyCards = (pageData?.storyCards && pageData.storyCards.length > 0) ? pageData.storyCards : []
  const brandStoryTitle = renderText(pageData?.brandStoryTitle) || 'DoDoShark Brand Story'
  const brandStoryThumbnail = pageData?.images?.brandStoryThumbnail
  const brandStoryVideoUrl = cleanText(pageData?.brandStoryVideoUrl) || 'https://www.youtube.com/shorts/C_JWSMn42eA'

  const productSystemIntro = pageData?.productSystemIntro
  const productSystemTitleLineOne = renderText(productSystemIntro?.titleLineOne) || 'Dual-Track'
  const productSystemTitleLineTwo = renderText(productSystemIntro?.titleLineTwo) || 'Product System'
  const productSystemDescription = renderText(productSystemIntro?.description) || 'Exceeding industry standards to meet diverse production needs with full-process customized solutions. Seamlessly connecting production segments for maximum efficiency.'
  const productSystemButtonLabel = renderText(productSystemIntro?.buttonLabel) || 'View Product Matrices'
  const productSystemButtonHref = cleanText(productSystemIntro?.buttonHref) || '/products'

  const aboutProductSystems = (pageData?.productSystems && pageData.productSystems.length > 0) ? pageData.productSystems : []
  
  const globalLayout = pageData?.globalLayout
  const globalLayoutTitle = renderText(globalLayout?.title) || 'High-End Talent & Global Layout'
  const globalLayoutBadge = renderText(globalLayout?.badge) || 'Our Elite Engineering Team'
  const globalLayoutDescriptionOne = renderText(globalLayout?.descriptionOne)
  const globalLayoutDescriptionTwo = renderText(globalLayout?.descriptionTwo)
  const globalLayoutStats = (globalLayout?.stats && globalLayout.stats.length > 0) ? globalLayout.stats : []
  const globalLayoutBackgroundImage = pageData?.images?.globalLayoutBackgroundImage
  const teamImage = pageData?.images?.teamImage

  const timelineIntro = pageData?.timelineIntro
  const timelineTitleLineOne = renderText(timelineIntro?.titleLineOne) || 'The Journey of'
  const timelineTitleLineTwo = renderText(timelineIntro?.titleLineTwo) || 'DoDoShark'
  const timelineDescription = renderText(timelineIntro?.description) || 'From our state-owned origins to a modern global enterprise. Constantly evolving in reliability and innovation.'

  const resolvedTimeline = (pageData?.timeline && pageData.timeline.length > 0) ? pageData.timeline : []
  const timelineClosingTitle = renderText(pageData?.timelineClosing?.title)
  const timelineClosingDescription = renderText(pageData?.timelineClosing?.description)

  const cta = pageData?.cta
  const ctaEyebrow = renderText(cta?.eyebrow) || 'Value Proposition'
  const ctaTitle = renderText(cta?.title) || 'Partnerships Beyond Equipment'
  const ctaDescription = renderText(cta?.description)
  const ctaButtonLabel = renderText(cta?.buttonLabel) || 'Connect With Us Today'
  const ctaButtonHref = cleanText(cta?.buttonHref) || '/contact'
  const joinUsTitle = renderText(cta?.joinUsTitle) || 'Join Our Journey'
  const joinUsDescription = renderText(cta?.joinUsDescription) || 'Become part of the global DoDoShark ecosystem.'
  
  const valuePropositionBackgroundImage = pageData?.images?.valuePropositionBackgroundImage
  const joinUsImage = pageData?.images?.joinUsImage

  const heroImageSrc = toImageSrc(heroImage, 1800) || '/assets/images/factory.jpg'

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-800 pt-24 pb-32">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={heroImageSrc}
            alt={cleanText(heroImage?.alt) || 'DoDoShark Hero'}
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
              {heroTitleLineOne}
            </span>
            <br />
            {heroTitleLineTwo} <br />{' '}
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              {heroTitleLineThree}
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed font-normal text-slate-300">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* Video & Technical Strength */}
      <section className="relative z-20 -mt-16 rounded-none bg-slate-50 py-24 md:rounded-t-[1rem]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
            <div className="w-full lg:sticky lg:top-32 lg:w-5/12">
              <AboutVideoCard
                youtubeUrl={brandStoryVideoUrl}
                title={brandStoryTitle}
                thumbnailUrl={toImageSrc(brandStoryThumbnail, 1000) || '/assets/images/brand/DoDoShark-Brand-cover.jpg'}
                thumbnailAlt={cleanText(brandStoryThumbnail?.alt) || brandStoryTitle}
                aspectRatio="aspect-[9/16]"
              />
            </div>

            <div className="w-full space-y-8 lg:w-7/12">
              {storyCards.map((card, index) => (
                <div key={`${renderText(card.title)}-${index}`} className="group rounded-xl border border-slate-200 bg-white p-10 shadow-xl transition-all duration-300 hover:border-orange-500 hover:shadow-2xl md:p-12">
                  <h2 className="mb-6 font-display text-3xl font-extrabold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-orange-500">
                    {renderText(card.title)}
                    {renderText(card.title) === 'Corporate DNA' ? <span className="text-orange-500"> DNA</span> : null}
                    {renderText(card.title) === 'Technical Strength' ? <span className="text-orange-500"> Strength</span> : null}
                  </h2>
                  {card.subtitle ? (
                    <p className="mb-6 font-serif text-xl font-bold italic leading-relaxed text-orange-600 md:text-2xl">
                      {renderText(card.subtitle)}
                    </p>
                  ) : null}
                  <p className="text-lg leading-relaxed font-light text-slate-600">
                    {renderText(card.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product System: Dual-Track */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              {productSystemTitleLineOne} <br />
              <span className="text-orange-500">{productSystemTitleLineTwo}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-light text-slate-500">
              {productSystemDescription}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={productSystemButtonHref}
                className="rounded-full bg-orange-500 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600"
              >
                {productSystemButtonLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {aboutProductSystems.map((sys, index) => (
              <div key={renderText(sys.title)} className="group overflow-hidden rounded-xl bg-slate-900 text-white">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <CMSImage
                    image={sys.image}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    fallbackAlt={renderText(sys.title)}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900 p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                      {PRODUCT_SYSTEMS_ICONS[index] || PRODUCT_SYSTEMS_ICONS[0]}
                    </div>
                    <h3 className="mb-2 font-display text-2xl font-extrabold uppercase tracking-tight">{renderText(sys.title)}</h3>
                  </div>
                </div>
                <div className="p-8 pt-4">
                  <p className="mb-6 font-light leading-relaxed text-slate-300">{renderText(sys.description)}</p>
                  <div className="flex flex-wrap gap-2">
                    {sys.tags?.map((tag) => (
                      <span
                        key={renderText(tag)}
                        className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300"
                      >
                        {renderText(tag)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Assets & Team (Stats) */}
      <section className="relative overflow-hidden bg-orange-600 py-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={toImageSrc(globalLayoutBackgroundImage, 1800) || '/assets/images/about/global-layout.jpg'}
            alt={cleanText(globalLayoutBackgroundImage?.alt) || 'Global Layout'}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-orange-600/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-display text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
                {globalLayoutTitle}
              </h2>
              <p className="mb-4 inline-block rounded bg-white/90 px-3 py-1 text-sm font-bold text-orange-500">
                {globalLayoutBadge}
              </p>
              <div className="relative mb-6 aspect-video overflow-hidden rounded-xl border-4 border-white/20 shadow-2xl">
                <CMSImage
                  image={teamImage}
                  fill
                  className="object-cover"
                  fallbackAlt="DoDoShark Elite Team"
                />
              </div>
              <p className="mb-6 font-light leading-relaxed text-orange-100">
                {globalLayoutDescriptionOne}
              </p>
              <p className="font-light leading-relaxed text-orange-100">
                {globalLayoutDescriptionTwo}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {globalLayoutStats.map((stat) => (
                <div key={`${renderText(stat.label)}-${renderText(stat.value)}`} className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur transition-colors hover:bg-white/20">
                  <div className="mb-2 text-4xl font-black">{renderText(stat.value)}</div>
                  <div className="text-xs uppercase tracking-widest text-orange-200">{renderText(stat.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Development History Timeline */}
      <section className="overflow-hidden bg-slate-50 py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-24 text-center">
            <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight text-slate-900 md:text-5xl">
              {timelineTitleLineOne} <span className="text-orange-500">{timelineTitleLineTwo}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-slate-500">
              {timelineDescription}
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl space-y-24 before:absolute before:inset-y-0 before:left-[24px] before:w-0.5 before:bg-slate-200 md:before:left-1/2 md:before:-translate-x-1/2">
            {resolvedTimeline.map((item, idx) => (
              <div key={renderText(item.year)} className="group relative flex flex-col items-center md:flex-row">
                <div className="absolute left-[10px] z-10 h-5 w-5 rounded-full border-4 border-white bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.2)] transition-transform duration-300 group-hover:scale-125 group-hover:bg-orange-600 md:left-1/2 md:-translate-x-1/2" />

                {idx % 2 === 0 ? (
                  <>
                    <div className="w-full pl-14 text-left md:w-1/2 md:pr-16 md:pl-0 md:text-right">
                      <div className="mb-4 inline-block rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-bold tracking-widest text-slate-900">
                        {renderText(item.year)}
                      </div>
                      <h3 className="mb-2 font-display text-2xl font-extrabold text-slate-900">{renderText(item.title)}</h3>
                      <h4 className="mb-4 text-md font-bold text-orange-500">{renderText(item.phase)}</h4>
                      <p className="font-light leading-relaxed text-slate-600">{renderText(item.description)}</p>
                    </div>
                    <div className="mt-8 w-full pl-14 md:mt-0 md:w-1/2 md:pl-16">
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-colors group-hover:border-orange-500">
                        <CMSImage
                          image={item.image}
                          width={600}
                          height={400}
                          className="h-full w-full rounded-lg object-cover transition-transform duration-700 group-hover:scale-105"
                          fallbackAlt={renderText(item.title)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="order-2 mt-8 flex w-full pl-14 md:order-1 md:mt-0 md:w-1/2 md:justify-end md:pr-16 md:pl-0">
                      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-colors group-hover:border-orange-500">
                        <CMSImage
                          image={item.image}
                          width={600}
                          height={400}
                          className="h-full w-full rounded-lg object-cover transition-transform duration-700 group-hover:scale-105"
                          fallbackAlt={renderText(item.title)}
                        />
                      </div>
                    </div>
                    <div className="order-1 w-full pl-14 text-left md:order-2 md:w-1/2 md:pl-16">
                      <div className="mb-4 inline-block rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-bold tracking-widest text-slate-900">
                        {renderText(item.year)}
                      </div>
                      <h3 className="mb-2 font-display text-2xl font-extrabold text-slate-900">{renderText(item.title)}</h3>
                      <h4 className="mb-4 text-md font-bold text-orange-500">{renderText(item.phase)}</h4>
                      <p className="font-light leading-relaxed text-slate-600">{renderText(item.description)}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-24 max-w-3xl border-t border-slate-200 pt-16 text-center">
            <p className="mb-4 text-2xl font-black uppercase tracking-tighter text-slate-900">{timelineClosingTitle}</p>
            <p className="font-light text-slate-500">{timelineClosingDescription}</p>
          </div>
        </div>
      </section>

      {/* Value Proposition / CTA */}
      <section className="relative z-20 bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[1rem] border border-slate-800 bg-slate-900 p-12 text-white shadow-2xl lg:p-16">
            <div className="absolute inset-0 opacity-30">
              <Image
                src={toImageSrc(valuePropositionBackgroundImage, 1800) || '/assets/images/about/value-proposition.jpg'}
                alt={cleanText(valuePropositionBackgroundImage?.alt) || 'Value Proposition'}
                fill
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-orange-500 opacity-20 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-slate-500 opacity-20 blur-[100px]" />

            <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row">
              <div className="text-center lg:w-7/12 lg:text-left">
                <h2 className="mb-4 font-display font-semibold uppercase tracking-[0.2em] text-orange-500 text-xs text-center lg:text-left">
                  {ctaEyebrow}
                </h2>
                <h3 className="mb-8 font-display text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl">
                  {ctaTitle}
                </h3>
                <p className="mb-10 text-lg leading-relaxed font-light text-slate-300">
                  {ctaDescription}
                </p>
                <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                  <Link
                    href={ctaButtonHref}
                    className="inline-block rounded-full bg-orange-500 px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 transition-all hover:bg-orange-600"
                  >
                    {ctaButtonLabel}
                  </Link>
                </div>
              </div>
              <div className="lg:w-5/12">
                <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border-8 border-white/10 shadow-2xl">
                  <CMSImage
                    image={joinUsImage}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    fallbackAlt="Join Our Journey"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="mb-2 text-sm font-black uppercase tracking-widest text-white">
                      {joinUsTitle}
                    </p>
                    <p className="text-xs font-light text-slate-300">
                      {joinUsDescription}
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

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getAboutPageData(false)
  return buildPageMetadata({
    seo: pageData?.seo,
    fallbackTitle: 'About Us | DoDoShark Machinery',
    fallbackDescription:
      "Rooted in China, Serving the World. Discover DoDoShark's 50-year engineering heritage and our commitment to high-performance agricultural and food processing machinery.",
  })
}

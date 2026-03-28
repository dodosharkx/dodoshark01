import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { client, urlFor } from '@/app/lib/sanity'
import { buildPageMetadata } from '@/app/lib/seo'
import { normalizeYouTubeEmbedUrl, resolveYouTubeThumbnailUrl } from '@/app/lib/video'
import type { SeoMeta, SanityImage } from '@/app/lib/types/sanity'
import DeferredHeroCarousel from '@/components/home/DeferredHeroCarousel'
import DeferredHomeBlogCarousel from '@/components/home/DeferredHomeBlogCarousel'
import DeferredProjectCasesCarousel from '@/components/home/DeferredProjectCasesCarousel'
import { type HeroCarouselImage } from '@/components/home/HeroCarousel'
import HeroTitle from '@/components/ui/HeroTitle'
import VideoPreviewTrigger from '@/components/ui/VideoPreviewTrigger'
import ViewDetailsLink from '@/components/ui/ViewDetailsLink'

type HomeSanityImage = SanityImage & {
  imageUrl?: string
}

type HomeSlug = {
  current?: string
}

type HomeCategoryItem = {
  title?: string
}

type HomeTagItem = {
  title?: string
}

type FeaturedHomeProduct = {
  _id: string
  title?: string
  slug?: HomeSlug
  shortDescription?: string
  seriesTag?: string
  mainImage?: HomeSanityImage
  category?: HomeCategoryItem
}

type FeaturedHomeSolution = {
  _id: string
  title?: string
  slug?: HomeSlug
  summary?: string
  heroImage?: HomeSanityImage
}

type FeaturedHomeCase = {
  _id: string
  title?: string
  slug?: HomeSlug
  excerpt?: string
  coverImage?: HomeSanityImage
  clientLogo?: HomeSanityImage
}

type FeaturedHomeVideo = {
  _id: string
  title?: string
  youtubeUrl?: string
  publishedAt?: string
  coverImage?: HomeSanityImage
  tags?: HomeTagItem[]
  status?: string
}

type HomeProductCard = {
  title: string
  description: string
  image: string
  badge?: { label: string; className: string }
  href?: string
}

type HomeSolutionCard = {
  title: string
  description: string
  image: string
  href?: string
}

type HomeCaseCard = {
  title: string
  description: string
  image: string
  logo?: string | null
  href: string
}

type HomePageData = {
  seo?: SeoMeta
  heroEyebrow?: string
  heroTitle?: string
  heroSubtitle?: string
  heroDescription?: string
  heroBackgrounds?: HomeSanityImage[]
  featuredAgriProducts?: FeaturedHomeProduct[]
  featuredFoodProducts?: FeaturedHomeProduct[]
  featuredSolutions?: FeaturedHomeSolution[]
  featuredCases?: FeaturedHomeCase[]
  featuredHomeVideos?: FeaturedHomeVideo[]
  whyChooseUsVideoUrl?: string
  whyChooseUsVideoCoverImage?: HomeSanityImage
}

const homeQuery = `coalesce(
  *[_type == "homePage" && _id == "homePage"][0],
  *[_type == "homePage"][0]
){
  seo {
    title,
    description,
    keywords,
    ogImage{
      alt,
      asset
    },
    canonicalUrl,
    noIndex
  },
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  heroDescription,
  heroBackgrounds[] {
    asset,
    alt,
    "imageUrl": asset->url
  },
  featuredAgriProducts[]->{
    _id,
    title,
    slug{current},
    shortDescription,
    seriesTag,
    mainImage{
      asset,
      alt,
      "imageUrl": asset->url
    },
    category->{
      title
    }
  },
  featuredFoodProducts[]->{
    _id,
    title,
    slug{current},
    shortDescription,
    seriesTag,
    mainImage{
      asset,
      alt,
      "imageUrl": asset->url
    },
    category->{
      title
    }
  },
  featuredSolutions[]->{
    _id,
    title,
    slug{current},
    summary,
    heroImage{
      asset,
      alt,
      "imageUrl": asset->url
    }
  },
  featuredCases[]->{
    _id,
    title,
    slug{current},
    excerpt,
    coverImage{
      asset,
      alt,
      "imageUrl": asset->url
    },
    clientLogo{
      asset,
      alt,
      "imageUrl": asset->url
    }
  },
  featuredHomeVideos[]->{
    _id,
    title,
    youtubeUrl,
    publishedAt,
    status,
    coverImage{
      asset,
      alt,
      "imageUrl": asset->url
    },
    tags[]->{
      title
    }
  },
  whyChooseUsVideoUrl,
  whyChooseUsVideoCoverImage{
    asset,
    alt,
    "imageUrl": asset->url
  }
}`

const stats = [
  { value: '55', suffix: 'Years', label: 'Industry History' },
  { value: '10,000', suffix: 'sqm', label: 'Factory Area' },
  { value: '1,000', suffix: '+', label: 'Export Regions' },
  { value: '10,000', suffix: '+', label: 'Annual Yield' },
]

const aboutFeatures = [
  {
    title: 'Est. 1970',
    description:
      'Formerly a state-owned mill factory, DoDoShark was established in 2019 after restructuring. Anchored by the mission of "Empowering Productivity," we began a new brand journey.',
    image: '/assets/images/icon-since-1970.png',
  },
  {
    title: 'Three Production Bases',
    description:
      'A modern production network delivers stable output, standardized manufacturing, and the flexibility required for custom industrial projects.',
    image: '/assets/images/icon-three-production-bases.png',
  },
  {
    title: 'Two Product Lines',
    description:
      'Agri-processing and food-processing machinery operate as dual growth engines, covering crushing, grinding, mixing, and integrated line solutions.',
    image: '/assets/images/icon-two-product-lines.png',
  },
]

const confidenceCards = [
  {
    title: 'Technical Lead',
    subtitle: 'Continuous Innovation as Industry Model',
    points: ['Grain grinding fineness up to 150 mesh', 'Uniform mixing of dozens of powders in 15 min', 'Dust suppression ratio up to 99.99%'],
    image: '/assets/images/technology-leadership.png',
  },
  {
    title: 'Rigorous Delivery',
    subtitle: 'Factory Inspection on Every Critical Detail',
    points: ['Strict process inspection before shipment', 'Stable structure for long-cycle operation', 'Delivery quality controlled by full-line checks'],
    image: '/assets/images/rigorous-factory-inspection.png',
  },
  {
    title: 'Beyond Single Products',
    subtitle: 'Integrated Equipment for Complete Workflows',
    points: ['Single-machine and line integration available', 'Flexible matching for powders and granules', 'One supplier for equipment and process support'],
    image: '/assets/images/beyond-single-products.png',
  },
]

const agriProducts = [
  {
    title: 'Iron Hammer Mill',
    description: 'Suitable for grain, corn, and tuber crops, with fineness reaching 10-150 mesh.',
    image: '/assets/images/grinding-category.png',
    badge: { label: 'Hot', className: 'bg-orange-500' },
  },
  {
    title: 'Wheat Grinder',
    description: 'Handles wheat, corn, and sorghum with efficiency, fineness up to 40-100 mesh.',
    image: '/assets/images/corn-materials.png',
    badge: { label: 'New', className: 'bg-green-500' },
  },
  {
    title: 'Mixer Machine',
    description: 'For feed, chemical, and building materials. High uniformity with variation coefficient under 5.',
    image: '/assets/images/machinery-category.png',
  },
]

const foodProducts = [
  {
    title: 'SUS304 Grinder',
    description: 'For food, herbs, and corrosive materials. Dust-free, fineness up to 10-150 mesh.',
    image: '/assets/images/corn-materials.png',
  },
  {
    title: 'SUS304 Mixer',
    description: 'Highly uniform mixing for powders and fine particles in food and chemical sectors.',
    image: '/assets/images/manual-model-50.png',
  },
  {
    title: 'Dough Mixer',
    description: 'Fast and durable for large batches, ideal for eateries and food factories.',
    image: '/assets/images/rigorous-factory-inspection.png',
  },
]

const grindingSolutions = [
  {
    title: 'Corn Milling Solution',
    description: 'Efficient corn crushing and milling for individuals to large factories.',
    image: '/assets/images/grinding-category.png',
  },
  {
    title: 'Grain Milling Solution',
    description: 'Dust-free grain processing for agricultural and industrial sectors.',
    image: '/assets/images/grinding-category.png',
  },
  {
    title: 'Salt & Sugar Milling',
    description: 'Precise milling for spice, salt, and sugar with dust control.',
    image: '/assets/images/machinery-category.png',
  },
]

const mixingSolutions = [
  {
    title: 'Powder Mixing Solution',
    description: 'High-uniformity mixing for fine powders in industrial sectors.',
    image: '/assets/images/grain-processing.png',
  },
  {
    title: 'Granule Mixing Solution',
    description: 'Stable mixing performance for diverse granular materials.',
    image: '/assets/images/manual-model-50.png',
  },
  {
    title: 'Fertilizer Mixing',
    description: 'Massive throughput for agricultural compound fertilizer production.',
    image: '/assets/images/mixing-equipment.png',
  },
]

const projectCaseItems = [
  {
    title: 'New Hope Group',
    description: 'Complete 100-mesh dust-free corn processing line for international export standard.',
    image: '/assets/images/showroom-1.jpg',
    logo: '/assets/images/featured-project-logo-new-hope.png',
    href: '#',
  },
  {
    title: 'Uni-President Milling Upgrade',
    description: 'Integrated grinding workflow designed for stable output and cleaner industrial processing conditions.',
    image: '/assets/images/showroom-1.jpg',
    logo: '/assets/images/featured-project-logo-uni-president.png',
    href: '#'
  },
  {
    title: 'Angel Yeast Powder System',
    description: 'Customized stainless processing solution balancing food-grade standards with long-cycle plant operation.',
    image: '/assets/images/showroom-1.jpg',
    logo: '/assets/images/featured-project-logo-angel-yeast.png',
    href: '#',
  },
  {
    title: 'Changming Pharma Material Line',
    description: 'Precision handling and low-dust conveying for fine pharmaceutical material preparation workflows.',
    image: '/assets/images/showroom-1.jpg',
    logo: '/assets/images/featured-project-logo-changming-pharma.png',
    href: '#',
  },
  {
    title: 'New Hope Overseas Delivery',
    description: 'Benchmark export project built around dependable commissioning, throughput stability, and after-sales support.',
    image: '/assets/images/showroom-1.jpg',
    logo: '/assets/images/featured-project-logo-new-hope.png',
    href: '#',
  },
]

const advantages = [
  {
    title: 'Smart Mfg. Strength',
    description: 'Scale efficiency balanced with bespoke innovation.',
    image: '/assets/images/icon-professional-technology.png',
  },
  {
    title: 'Total Range Strategy',
    description: 'One-stop solutions reducing costs and boosting speed.',
    image: '/assets/images/icon-craftsmanship.png',
  },
  {
    title: 'Full-Life Service',
    description: 'From process design to training, we navigate with you.',
    image: '/assets/images/icon-custom-solutions.png',
  },
  {
    title: 'Extended Warranty',
    description: '10-year core component warranty for total peace of mind.',
    image: '/assets/images/icon-one-choice.png',
  },
]

function getSanityImageUrl(image?: HomeSanityImage, options?: { width?: number; height?: number }) {
  if (!image) return null

  if (image.asset?._ref || image.asset?._id) {
    let builder = urlFor(image)
    if (options?.width) builder = builder.width(options.width)
    if (options?.height) builder = builder.height(options.height)
    return builder.fit(options?.height ? 'crop' : 'max').auto('format').quality(75).url()
  }

  if (image.imageUrl?.trim()) return image.imageUrl
  if (image.asset?.url?.trim()) return image.asset.url

  return null
}

function hasSanityImageAsset(image?: HomeSanityImage) {
  return Boolean(image?.asset?._ref || image?.asset?._id || image?.asset?.url || image?.imageUrl?.trim())
}

function buildDetailHref(basePath: '/products' | '/solutions' | '/cases', slug?: HomeSlug) {
  const current = slug?.current?.trim()
  return current ? `${basePath}/${current}` : basePath
}

function formatHomeVideoMeta(publishedAt?: string, firstTagTitle?: string) {
  if (publishedAt) {
    const date = new Date(publishedAt)
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(date)
    }
  }

  return firstTagTitle?.trim() || 'Video'
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value != null
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}

function ProductCard({
  title,
  description,
  image,
  badge,
  href,
}: {
  title: string
  description: string
  image: string
  badge?: { label: string; className: string }
  href?: string
}) {
  return (
    <article className="home-product-card flex h-full flex-col overflow-hidden rounded-[1rem] bg-white">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image src={image} alt={title} fill sizes="(max-width: 1023px) 100vw, 33vw" className="object-cover" />
        {badge ? <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white ${badge.className}`}>{badge.label}</div> : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h4 className="text-lg font-bold text-slate-900">{title}</h4>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-auto pt-5 flex items-center justify-center">
          <ViewDetailsLink href={href || '/products'} />
        </div>
      </div>
    </article>
  )
}

function SolutionCard({ title, description, image, href }: { title: string; description: string; image: string; href?: string }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-100 bg-white transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image src={image} alt={title} fill sizes="(max-width: 1023px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h4 className="relative inline-block text-lg font-bold text-slate-900">
          {title}
        </h4>
        <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
        <div className="mt-auto pt-5 flex items-center justify-center">
          <ViewDetailsLink href={href || '/solutions'} />
        </div>
      </div>
    </article>
  )
}

async function getHomePageData() {
  try {
    return await client.fetch<HomePageData | null>(homeQuery)
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData()
  return buildPageMetadata({
    seo: data?.seo,
    fallbackTitle: 'DoDoShark - Professional Crushing & Grinding Equipment Manufacturer',
    fallbackDescription:
      'DoDoShark Machinery, 20 years of focus on industrial crushing, grinding, and mixing equipment, serving 100+ countries.',
  })
}

export default async function HomePage() {
  const data = await getHomePageData()

  const heroSlides: HeroCarouselImage[] = (data?.heroBackgrounds ?? [])
    .map((image, index) => {
      const src = getSanityImageUrl(image, { width: 1920 })
      if (!src) return null
      return {
        src,
        alt: image.alt || `DoDoShark hero ${index + 1}`,
      }
    })
    .filter((item): item is HeroCarouselImage => Boolean(item))

  const fallbackHeroSlides =
    heroSlides.length > 0
      ? heroSlides
      : [{ src: '/assets/images/banner.png', alt: 'DoDoShark factory banner' }]

  const heroVideoUrl = data?.whyChooseUsVideoUrl?.trim()
  const whyChooseUsCoverImageSrc =
    getSanityImageUrl(data?.whyChooseUsVideoCoverImage, { width: 1200 }) ??
    resolveYouTubeThumbnailUrl(heroVideoUrl, 'maxresdefault') ??
    '/assets/images/factory-showcase.png'
  const whyChooseUsCoverImageAlt = hasSanityImageAsset(data?.whyChooseUsVideoCoverImage)
    ? data?.whyChooseUsVideoCoverImage?.alt?.trim() || 'DoDoShark Factory Video'
    : 'DoDoShark Factory Video'
  const featuredAgriProducts: HomeProductCard[] =
    data?.featuredAgriProducts
      ?.map((product) => {
        const image = getSanityImageUrl(product.mainImage, { width: 800, height: 800 })
        if (!image) return null

        return {
          title: product.title?.trim() || 'Product',
          description:
            product.shortDescription?.trim() || 'High performance industrial processing equipment.',
          image,
          href: buildDetailHref('/products', product.slug),
          badge: product.seriesTag?.trim()
            ? { label: product.seriesTag.trim(), className: 'bg-orange-500' }
            : undefined,
        }
      })
      .filter(isDefined) ?? []
  const featuredFoodProducts: HomeProductCard[] =
    data?.featuredFoodProducts
      ?.map((product) => {
        const image = getSanityImageUrl(product.mainImage, { width: 800, height: 800 })
        if (!image) return null

        return {
          title: product.title?.trim() || 'Product',
          description:
            product.shortDescription?.trim() || 'High performance industrial processing equipment.',
          image,
          href: buildDetailHref('/products', product.slug),
          badge: product.seriesTag?.trim()
            ? { label: product.seriesTag.trim(), className: 'bg-orange-500' }
            : undefined,
        }
      })
      .filter(isDefined) ?? []
  const featuredSolutions: HomeSolutionCard[] =
    data?.featuredSolutions
      ?.map((solution) => {
        const image = getSanityImageUrl(solution.heroImage, { width: 800, height: 800 })
        if (!image) return null

        return {
          title: solution.title?.trim() || 'Solution',
          description:
            solution.summary?.trim() || 'High-efficiency and stable industrial process design.',
          image,
          href: buildDetailHref('/solutions', solution.slug),
        }
      })
      .filter(isDefined) ?? []
  const featuredCases: HomeCaseCard[] =
    data?.featuredCases
      ?.map((caseItem) => {
        const image = getSanityImageUrl(caseItem.coverImage, { width: 1200, height: 600 })
        if (!image) return null

        return {
          title: caseItem.title?.trim() || 'Case Study',
          description:
            caseItem.excerpt?.trim() || 'Detailed case study content is available in the full project report.',
          image,
          logo: getSanityImageUrl(caseItem.clientLogo, { width: 264 }),
          href: buildDetailHref('/cases', caseItem.slug),
        }
      })
      .filter(isDefined) ?? []
  const homeAgriProducts = featuredAgriProducts.length > 0 ? featuredAgriProducts : agriProducts
  const homeFoodProducts = featuredFoodProducts.length > 0 ? featuredFoodProducts : foodProducts
  const homeSolutions = featuredSolutions.length > 0 ? featuredSolutions : grindingSolutions
  const homeCaseItems = featuredCases.length > 0 ? featuredCases : projectCaseItems
  const homeVideoItems =
    data?.featuredHomeVideos
      ?.filter((video) => video?.status === 'published')
      .map((video) => {
        const youtubeUrl = video.youtubeUrl?.trim()
        if (!youtubeUrl || !normalizeYouTubeEmbedUrl(youtubeUrl)) return null

        return {
          id: video._id,
          title: video.title?.trim() || 'Video',
          imageSrc: getSanityImageUrl(video.coverImage, { width: 1200 }) || undefined,
          imageAlt: hasSanityImageAsset(video.coverImage) ? video.coverImage?.alt || video.title || 'Video cover' : video.title || 'Video cover',
          youtubeUrl,
          metaText: formatHomeVideoMeta(video.publishedAt, video.tags?.[0]?.title),
        }
      })
      .filter(isDefined) ?? []

  return (
    <main className="bg-white text-slate-700">
      <section className="relative flex min-h-[620px] items-center overflow-hidden md:min-h-[700px] xl:-mt-[72px] xl:pt-[72px]">
        <DeferredHeroCarousel images={fallbackHeroSlides} autoplayMs={5500} pauseOnHover showDots showArrows />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] hidden h-[220px] bg-gradient-to-b from-slate-950/68 via-slate-950/34 to-transparent xl:block" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/35 to-transparent" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-300">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span>{data?.heroEyebrow ?? '20 Years of Focus in Crushing & Grinding'}</span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              <HeroTitle title={data?.heroTitle} fallback="Dual-Engine Business Model" />
            </h1>
            <p className="mt-4 text-lg font-medium text-white/85 sm:text-xl">
              {data?.heroSubtitle ?? 'Agri-Processing + Food Processing'}
            </p>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              {data?.heroDescription ??
                'DoDoShark is dedicated to providing professional crushing, grinding, and mixing solutions, boosting efficiency and product quality for enterprises.'}
            </p>
            <div className="mt-8">
              <Link
                href="#products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b]"
              >
                <span>Explore Products</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 hidden h-2/3 w-1/3 -translate-y-1/2 opacity-20 lg:block">
          <div className="h-full w-full rounded-l-full bg-gradient-to-l from-orange-500/40 to-transparent" />
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-y-12">
            {stats.map((item) => (
              <div key={item.label} className="text-center">
                <div className="inline-flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold leading-none text-orange-500 sm:text-5xl md:text-6xl">{item.value}</span>
                  <span className="text-base font-bold uppercase tracking-tight text-slate-400 md:text-xl">{item.suffix}</span>
                </div>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 sm:text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-about-bg relative overflow-hidden py-10 text-white sm:py-14">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            <h2 className="font-display text-3xl font-bold tracking-[0.08em] text-white sm:text-5xl">About &nbsp;Us</h2>
            <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-orange-500" />
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3 lg:gap-12">
            {aboutFeatures.map((item) => (
              <article key={item.title} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Image src={item.image} alt={item.title} width={48} height={48} className="h-12 w-12 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-40 w-60 items-center justify-center backdrop-blur-sm">
              <Image src="/assets/images/dodoshark-logo-04.png" alt="DoDoShark" width={160} height={110} className="h-60 w-auto object-contain brightness-110" />
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="pt-2 sm:pt-8">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"><span>Choose DodoShark</span><br /><span>Choose Confidence</span></h2>
              <div className="mt-5 h-1 w-16 bg-[#f5a623]" />
              <p className="mt-8 text-base leading-8 text-slate-600 sm:text-lg">
                DoDoShark practices &quot;Carefree Production, Joyful Harvest&quot; through innovation and high quality.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1rem] shadow-2xl">
              <VideoPreviewTrigger
                title="DoDoShark Factory Video"
                youtubeUrl={heroVideoUrl}
                imageSrc={whyChooseUsCoverImageSrc}
                imageAlt={whyChooseUsCoverImageAlt}
                className="group"
                mediaClassName="aspect-video rounded-[1rem]"
                imageSizes="(max-width: 1023px) 100vw, 50vw"
                playButtonClassName="h-20 w-20 bg-black/60 group-hover:bg-black/70"
                overlayClassName="bg-black/20 transition group-hover:bg-black/30"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {confidenceCards.map((card) => (
              <article key={card.title} className="overflow-hidden rounded-[1rem] bg-white shadow-sm transition duration-300 hover:shadow-xl">
                <div className="p-8 pb-6">
                  <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                  <h4 className="mt-1 text-lg font-bold text-slate-900">{card.subtitle}</h4>
                  <div className="mt-6 h-0.5 w-12 bg-[#f5a623]" />
                  <div className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
                    {card.points.map((point) => (
                      <p key={point}>{point}</p>
                    ))}
                  </div>
                </div>
                <div className="relative h-56 overflow-hidden">
                  <Image src={card.image} alt={card.title} fill sizes="(max-width: 1279px) 100vw, 33vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="bg-slate-100 pb-16 sm:pb-20">
        <div className="relative h-[300px] overflow-hidden sm:h-[360px] lg:h-[420px]">
          <Image src="/assets/images/banner.png" alt="Industrial Background" fill sizes="100vw" className="object-cover" />
          <div className="relative z-10 mx-auto px-4 pt-16 text-center sm:px-6 sm:pt-20 lg:max-w-7xl lg:px-8">
            <h2 className="font-display text-3xl font-bold tracking-wide text-white sm:text-4xl md:text-5xl">Wonderful Products</h2>
            <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-orange-500" />
          </div>
        </div>

        <div className="relative z-20 mx-auto -mt-24 max-w-6xl px-4 sm:px-6 lg:px-8 lg:-mt-28">
          <div className="rounded-lg bg-white shadow-xl">
            <div className="border-b border-slate-200 py-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900">Agri-Processing Machinery</h3>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {homeAgriProducts.map((product) => (
                  <ProductCard key={product.title} {...product} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/products" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto">
                  View More
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-white shadow-xl">
            <div className="border-b border-slate-200 py-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900">Food Processing Machinery</h3>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {homeFoodProducts.map((product) => (
                  <ProductCard key={product.title} {...product} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/products" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto">
                  View More
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="relative h-[300px] overflow-hidden sm:h-[360px] lg:h-[420px]">
          <Image src="/assets/images/factory.jpg" alt="Factory Solution Background" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-blue-900/60 to-blue-950/70" />
          <div className="relative z-10 mx-auto px-4 pt-16 text-center sm:px-6 sm:pt-20 lg:max-w-7xl lg:px-8">
            <h2 className="font-display text-3xl font-bold tracking-wide text-white sm:text-4xl md:text-5xl">Efficient Solutions</h2>
            <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-orange-500" />
          </div>
        </div>

        <div className="relative z-20 mx-auto -mt-24 max-w-6xl px-4 sm:px-6 lg:px-8 lg:-mt-28">
          <div className="rounded-lg bg-white shadow-xl">
            <div className="border-b border-slate-200 py-8 text-center">
              <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Grinding & Mixing Solutions <br />(Dust-Free)</h3>
            </div>
            <div className="p-6 sm:p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {homeSolutions.map((item) => (
                  <SolutionCard key={item.title} {...item} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href="/solutions" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto">
                  View More
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        </div>
      </section>

      <section className="overflow-hidden bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-slate-900 sm:text-4xl md:text-5xl">
              Project Cases
            </h2>
            <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-slate-300" />
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Every case is a benchmark for industrial excellence.
            </p>
          </div>

          <DeferredProjectCasesCarousel items={homeCaseItems} />
        </div>
      </section>

      <section className="home-cta-bg relative overflow-hidden py-12 text-white sm:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-orange-500 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500 blur-3xl sm:h-96 sm:w-96" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 inline-flex h-24 w-40 items-center justify-center backdrop-blur-sm">
              <Image src="/assets/images/dodoshark-logo-04.png" alt="DoDoShark" width={160} height={110} className="h-40 w-auto object-contain brightness-110" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Right Choice, Lifelong Performance</h2>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {advantages.map((item) => (
                <article key={item.title} className="home-advantage-item rounded-[1rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="home-advantage-icon">
                    <Image src={item.image} alt={item.title} width={56} height={56} className="h-14 w-14 object-contain" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-7 text-white/60">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      {homeVideoItems.length > 0 ? (
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">BLOG - Explore the Real DoDoShark</h2>
              <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-orange-500" />
            </div>

            <DeferredHomeBlogCarousel items={homeVideoItems} />

            <div className="mt-10 text-center">
              <Link href="/vlog" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#fbbf24] px-8 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#f59e0b] sm:w-auto">
                More Videos
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}

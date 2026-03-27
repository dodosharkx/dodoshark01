import type { Metadata } from 'next'
import Link from 'next/link'
import { client, urlFor } from '@/app/lib/sanity'
import type { SeoMeta, SanityImage } from '@/app/lib/types/sanity'
import ExternalImageWithFallback from '@/components/home/ExternalImageWithFallback'
import HeroCarousel, { type HeroCarouselImage } from '@/components/home/HeroCarousel'

export const revalidate = 60

type HomeSanityImage = SanityImage & {
  imageUrl?: string
}

type HomePageData = {
  seo?: SeoMeta
  heroBackgrounds?: HomeSanityImage[]
  whyChooseUsVideoUrl?: string
}

type CapabilityCard = {
  title: string
  detail: string
  imageUrl: string
  imageAlt: string
}

type ProductFamily = {
  title: string
  description: string
  href: string
  tag: string
  imageUrl: string
  imageAlt: string
}

type SolutionCard = {
  title: string
  desc: string
  href: string
  imageUrl: string
  imageAlt: string
}

type ProcessStep = {
  name: string
  note: string
  imageUrl: string
  imageAlt: string
}

const TRUST_METRICS = [
  { value: '50+', label: 'Years of Engineering' },
  { value: '10,000+', label: 'Sqm Factory Area' },
  { value: '100+', label: 'Export Regions' },
  { value: '10,000+', label: 'Annual Production' },
]

const CAPABILITY_CARDS: CapabilityCard[] = [
  {
    title: 'Precision Grinding',
    detail: 'Stable mesh size control across maize, feed, spice and grain lines.',
    imageUrl:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Industrial operator reviewing precision machine output',
  },
  {
    title: 'Modular Capacity',
    detail: 'From pilot setup to full plant throughput with scalable machine combinations.',
    imageUrl:
      'https://images.pexels.com/photos/3846553/pexels-photo-3846553.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: 'Modular industrial production line in a factory',
  },
  {
    title: 'Field-Proven Durability',
    detail: 'Industrial-grade materials and simplified maintenance for long duty cycles.',
    imageUrl:
      'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Heavy duty metal machinery components',
  },
]

const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    title: 'Hammer Mill Series',
    description: 'High-efficiency crushing for corn, grain and feed with flexible sieve options.',
    href: '/products',
    tag: 'Grinding',
    imageUrl:
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Industrial crushing equipment and motor system',
  },
  {
    title: 'Disc Mill Series',
    description: 'Fine powder output for spices and food materials with steady particle uniformity.',
    href: '/products',
    tag: 'Fine Milling',
    imageUrl:
      'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: 'Fine processing machine in food production workshop',
  },
  {
    title: 'Rice Mill Series',
    description: 'Household to commercial rice processing solutions focused on clean bran separation.',
    href: '/products',
    tag: 'Rice Processing',
    imageUrl:
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1600&q=80',
    imageAlt: 'Rice processing line with conveyor and separator',
  },
  {
    title: 'Feed Mixer Series',
    description: 'Horizontal and vertical mixers for consistent blending and recipe repeatability.',
    href: '/products',
    tag: 'Mixing',
    imageUrl:
      'https://images.pexels.com/photos/162568/mill-windmill-factory-industry-162568.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: 'Feed mixing machinery in an industrial plant',
  },
]

const SOLUTION_CARDS: SolutionCard[] = [
  {
    title: 'Corn & Grain Grinding',
    desc: 'Designing reliable milling lines for farms and feed mills.',
    href: '/solutions',
    imageUrl:
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Grain handling and grinding process equipment',
  },
  {
    title: 'Spice Powder Processing',
    desc: 'Delivering sanitary and fine-particle workflows for food factories.',
    href: '/solutions',
    imageUrl:
      'https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=1400',
    imageAlt: 'Food-grade processing setup for powder production',
  },
  {
    title: 'Feed Production Systems',
    desc: 'Optimizing raw-material flow from crushing to mixing and packing.',
    href: '/solutions',
    imageUrl:
      'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Large-scale feed production and packing line',
  },
]

const PROCESS_STEPS: ProcessStep[] = [
  {
    name: 'Requirement Mapping',
    note: 'Material, target fineness, capacity, and installation constraints.',
    imageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Engineering team discussing technical requirements',
  },
  {
    name: 'Line Configuration',
    note: 'Machine pairing, utility planning, and workflow matching.',
    imageUrl:
      'https://images.pexels.com/photos/257904/pexels-photo-257904.jpeg?auto=compress&cs=tinysrgb&w=1000',
    imageAlt: 'Factory line planning with technical drawings',
  },
  {
    name: 'Factory Validation',
    note: 'Video inspection, parameter checks, and QA before shipment.',
    imageUrl:
      'https://images.unsplash.com/photo-1581091012184-5c81f1d6bcd9?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Quality engineer validating machine performance',
  },
  {
    name: 'Global Deployment',
    note: 'Commissioning support and lifecycle spare-part assurance.',
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1661963336914-52f8a2f57f04?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Global logistics and machine installation service',
  },
]

async function getHomePage() {
  const query = `coalesce(
    *[_type == "homePage" && _id == "homePage"][0],
    *[_type == "homePage"][0]
  ) {
    seo {
      title,
      description,
      keywords,
      canonicalUrl,
      noIndex,
      ogImage {
        asset,
        alt,
        "imageUrl": asset->url
      }
    },
    heroBackgrounds[] {
      asset,
      alt,
      "imageUrl": asset->url
    },
    whyChooseUsVideoUrl
  }`

  return client.fetch<HomePageData | null>(query)
}

function getSanityImageUrl(image?: HomeSanityImage, options?: { width?: number; height?: number }) {
  if (!image) return null
  if (image.imageUrl?.trim()) return image.imageUrl
  if (image.asset?.url?.trim()) return image.asset.url
  if (image.asset?._ref || image.asset?._id) {
    let builder = urlFor(image)
    if (options?.width) builder = builder.width(options.width)
    if (options?.height) builder = builder.height(options.height)
    return builder.fit('crop').url()
  }
  return null
}

function toEmbedVideoUrl(rawUrl?: string) {
  if (!rawUrl?.trim()) return null

  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace('www.', '')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }

      if (url.pathname.startsWith('/embed/')) return rawUrl

      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/').filter(Boolean)[1]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
    }

    if (host === 'vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    return null
  }

  return null
}

function splitMetricValue(value: string) {
  const sanitized = value.trim()
  const match = sanitized.match(/^([\d,]+(?:\.\d+)?)(.*)$/)

  if (!match) {
    return { primary: sanitized, suffix: '' }
  }

  return {
    primary: match[1],
    suffix: match[2].trim(),
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePage()
  const seo = data?.seo
  const title = seo?.title?.trim() || 'DoDoShark - Industrial Milling Systems'
  const description =
    seo?.description?.trim() || 'Precision Grinding, Global Performance for industrial processing lines.'
  const ogImage = getSanityImageUrl(seo?.ogImage, { width: 1200, height: 630 }) || undefined
  const canonical = seo?.canonicalUrl?.trim()

  return {
    title,
    description,
    keywords: seo?.keywords?.filter(Boolean),
    alternates: canonical ? { canonical } : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage, alt: seo?.ogImage?.alt || title }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function Home() {
  const data = await getHomePage()
  const heroSlides: HeroCarouselImage[] = (data?.heroBackgrounds ?? [])
    .map((image, index) => {
      const src = getSanityImageUrl(image, { width: 2400, height: 1400 })
      if (!src) return null
      return {
        src,
        alt: image.alt || `DoDoShark hero background ${index + 1}`,
      }
    })
    .filter((item): item is HeroCarouselImage => Boolean(item))
  const embedVideoUrl = toEmbedVideoUrl(data?.whyChooseUsVideoUrl)

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      <section className="relative isolate min-h-[760px] overflow-hidden bg-slate-800">
        <HeroCarousel images={heroSlides} autoplayMs={5500} pauseOnHover showDots showArrows />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-800/85 via-slate-800/70 to-slate-800/30" />
        <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-md bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-md bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-6 inline-flex rounded-md border border-orange-400/40 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
              Industrial Milling Systems
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Precision Grinding
              <br />
              Global Performance
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
              From crushing to mixing, we provide complete processing solutions for modern agriculture and food processing. Built with premium materials for maximum durability.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-md bg-orange-500 px-8 py-4 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-orange-400"
              >
                Explore Product Lines
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-white/35 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
              >
                Talk to Engineers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#edf1f5] py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
            {TRUST_METRICS.map((item) => {
              const { primary, suffix } = splitMetricValue(item.value)

              return (
                <div key={item.label} className="text-center">
                  <p className="font-display text-5xl font-extrabold leading-none text-orange-500 sm:text-6xl lg:text-7xl">
                    {primary}
                    {suffix ? (
                      <span className="ml-1 align-top text-[0.58em] font-bold text-slate-900">{suffix}</span>
                    ) : null}
                  </p>
                  <p className="mx-auto mt-4 max-w-[15rem] text-sm font-medium leading-snug text-slate-500 sm:text-base">
                    {item.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,#fff7ed_0%,#fcfdfd_45%,#ecfeff_100%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Why Global Buyers Choose Us</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Built for throughput, tuned for reliability</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {CAPABILITY_CARDS.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-lg border border-slate-200/70 bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-1"
              >
                <ExternalImageWithFallback
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
                  className="relative aspect-[16/9] overflow-hidden"
                  imageClassName="object-cover"
                  fallbackClassName="bg-[linear-gradient(135deg,#64748b_0%,#475569_55%,#334155_100%)]"
                />
                <div className="p-8">
                  <div className="h-1 w-14 rounded-md bg-orange-500" />
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{card.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Core Product Lines</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Industrial equipment for every processing stage</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-slate-700 underline decoration-orange-400 decoration-2 underline-offset-4">
              View Full Catalog
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PRODUCT_FAMILIES.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-[linear-gradient(140deg,#f8fafc_0%,#ffffff_35%,#fff7ed_100%)] transition hover:border-orange-300"
              >
                <ExternalImageWithFallback
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="relative aspect-[16/9] overflow-hidden border-b border-slate-200/80"
                  imageClassName="object-cover"
                  fallbackClassName="bg-[linear-gradient(135deg,#64748b_0%,#475569_50%,#334155_100%)]"
                />
                <div className="p-8">
                  <span className="inline-flex rounded-md bg-slate-800 px-3 py-1 text-xs font-medium tracking-wide text-white">
                    {item.tag}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-8 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition group-hover:border-orange-400 group-hover:text-orange-600"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Solution Focus</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">From raw material to final consistency</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SOLUTION_CARDS.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <ExternalImageWithFallback
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw"
                  className="relative aspect-[16/9] overflow-hidden"
                  imageClassName="object-cover"
                  fallbackClassName="bg-[linear-gradient(135deg,#f59e0b_0%,#ea580c_45%,#7c2d12_100%)]"
                />
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.desc}</p>
                  <Link href={item.href} className="mt-7 inline-flex text-sm font-semibold text-orange-600">
                    See Related Solutions
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-800 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-300">Why Choose Us Video</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">See how DoDoShark delivers operational confidence</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300">
              From design details to production workflow, our teams focus on machine stability, maintenance simplicity,
              and real factory output. Review our process and decide faster with technical clarity.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PROCESS_STEPS.map((step, idx) => (
                <div key={step.name} className="overflow-hidden rounded-md border border-white/15 bg-white/5">
                  <ExternalImageWithFallback
                    src={step.imageUrl}
                    alt={step.imageAlt}
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 42vw, 100vw"
                    className="relative aspect-[16/9] overflow-hidden border-b border-white/10"
                    imageClassName="object-cover"
                    fallbackClassName="bg-[linear-gradient(135deg,#64748b_0%,#475569_55%,#334155_100%)]"
                  />
                  <div className="p-4">
                    <p className="text-sm font-semibold text-orange-200">{`0${idx + 1}`}</p>
                    <p className="mt-2 text-base font-semibold">{step.name}</p>
                    <p className="mt-2 text-xs leading-6 text-slate-300">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/20 bg-slate-800/70 p-4 shadow-2xl">
            {embedVideoUrl ? (
              <div className="relative aspect-video overflow-hidden rounded-md">
                <iframe
                  src={embedVideoUrl}
                  title="Why Choose DoDoShark"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center rounded-md border border-dashed border-white/25 bg-white/5 p-6 text-center">
                <p className="text-base font-semibold">Video link not configured</p>
                <p className="mt-2 text-sm text-slate-300">
                  Please set <code className="rounded bg-white/10 px-1 py-0.5">whyChooseUsVideoUrl</code> in Sanity.
                </p>
              </div>
            )}
            {data?.whyChooseUsVideoUrl && (
              <a
                href={data.whyChooseUsVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-sm font-medium text-orange-300 underline underline-offset-4"
              >
                Open Original Video Link
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fff7ed] py-20">
        <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-md bg-orange-300/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-4 h-72 w-72 rounded-md bg-cyan-200/45 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Ready to Discuss Your Line</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Tell us your material and target output</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600">
            Get a practical equipment recommendation with capacity range, key component notes, and delivery timeline.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-slate-800 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Request a Quote
            </Link>
            <Link
              href="/cases"
              className="rounded-md border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

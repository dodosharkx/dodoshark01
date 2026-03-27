import type { Metadata } from 'next'
import Link from 'next/link'
import { client, urlFor } from '@/app/lib/sanity'
import type { SeoMeta, SanityImage } from '@/app/lib/types/sanity'

export const revalidate = 60

type HomeSanityImage = SanityImage & {
  imageUrl?: string
}

type HomePageData = {
  seo?: SeoMeta
  heroBackgrounds?: HomeSanityImage[]
  whyChooseUsVideoUrl?: string
}

type TrustMetric = { value: string; label: string; hint?: string }

type ProductLine = {
  title: string
  tagline: string
  highlights: string[]
  href: string
  forMaterials: string[]
}

type IndustrySolution = {
  title: string
  outcomes: string[]
  href: string
}

type ProcessStep = {
  name: string
  note: string
  deliverables: string[]
}

type FaqItem = {
  q: string
  a: string
}

const TRUST_METRICS: TrustMetric[] = [
  { value: '50+', label: 'Years of Engineering', hint: 'Manufacturing & export experience' },
  { value: '10,000+', label: 'Sqm Factory Area', hint: 'Workshop + assembly + testing' },
  { value: '100+', label: 'Export Regions', hint: 'Serving global buyers' },
  { value: '10,000+', label: 'Annual Production', hint: 'Stable supply capacity' },
]

const PRODUCT_LINES: ProductLine[] = [
  {
    title: 'Hammer Mill Series',
    tagline: 'High-efficiency crushing for grain & feed lines.',
    highlights: ['Flexible sieve options', 'Stable throughput', 'Easy maintenance access'],
    href: '/products',
    forMaterials: ['Corn', 'Wheat', 'Sorghum', 'Feed ingredients'],
  },
  {
    title: 'Disc Mill Series',
    tagline: 'Fine milling for spices and food powders.',
    highlights: ['Uniform particle size', 'Consistent output', 'Simplified cleaning concept'],
    href: '/products',
    forMaterials: ['Spices', 'Grains', 'Food materials'],
  },
  {
    title: 'Rice Mill Series',
    tagline: 'From small processing to commercial rice workflows.',
    highlights: ['Clean bran separation', 'Stable dehusking', 'Operator-friendly setup'],
    href: '/products',
    forMaterials: ['Paddy rice', 'Rice'],
  },
  {
    title: 'Feed Mixer Series',
    tagline: 'Reliable blending for repeatable recipes.',
    highlights: ['Consistent mixing', 'Horizontal/vertical options', 'Production-line integration'],
    href: '/products',
    forMaterials: ['Feed premix', 'Powders', 'Granules'],
  },
]

const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    title: 'Corn & Grain Grinding',
    outcomes: ['Throughput-oriented configuration', 'Dust control considerations', 'Stable target fineness'],
    href: '/solutions',
  },
  {
    title: 'Spice Powder Processing',
    outcomes: ['Sanitary workflow options', 'Fine-powder uniformity', 'Easy cleaning process'],
    href: '/solutions',
  },
  {
    title: 'Feed Production Systems',
    outcomes: ['Raw-material flow planning', 'Crush → mix → pack rhythm', 'Spare parts & uptime focus'],
    href: '/solutions',
  },
]

const PROCESS_STEPS: ProcessStep[] = [
  {
    name: 'Requirement Mapping',
    note: 'Confirm material, target fineness, capacity, utilities, and site constraints.',
    deliverables: ['Material checklist', 'Target output definition', 'Power & layout assumptions'],
  },
  {
    name: 'Line Configuration',
    note: 'Match equipment combination to workflow and budget constraints.',
    deliverables: ['Configuration proposal', 'Key component list', 'Quotation + lead time'],
  },
  {
    name: 'Factory Validation',
    note: 'Pre-shipment checks with clear documentation for buyers.',
    deliverables: ['Inspection checklist', 'Test run evidence', 'Packing & shipping plan'],
  },
  {
    name: 'Global Deployment',
    note: 'Commissioning support and lifecycle service preparation.',
    deliverables: ['Installation guidance', 'Training outline', 'Spare-part package suggestion'],
  },
]

const FAQ: FaqItem[] = [
  {
    q: 'What information do you need to recommend a model?',
    a: 'Material type, moisture (if relevant), target fineness/mesh, capacity (t/h), power supply (voltage/Hz), and available installation space.',
  },
  {
    q: 'Can you customize voltage, materials, or line configuration?',
    a: 'Yes. Typical customization includes voltage/Hz, wear parts, and workflow configuration based on capacity and target output.',
  },
  {
    q: 'How do you verify quality before shipment?',
    a: 'We use a structured inspection checklist and run validation steps before packing to ensure the build matches the confirmed configuration.',
  },
  {
    q: 'Do you provide installation and after-sales support?',
    a: 'We provide commissioning guidance, training outline, and spare-part preparation suggestions to support stable long-term operation.',
  },
  {
    q: 'What about spare parts?',
    a: 'We recommend a practical spare-part package based on operating hours and wear parts, helping buyers reduce downtime risk.',
  },
  {
    q: 'How long is the typical lead time?',
    a: 'Lead time depends on configuration and customization. Share your requirements and we will provide a clear delivery estimate in the quotation.',
  },
]

/* =========================
   SANITY FETCH (DO NOT EDIT)
   ========================= */

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

/* =========================
   PAGE
   ========================= */

export default async function Home() {
  const data = await getHomePage()
  const embedVideoUrl = toEmbedVideoUrl(data?.whyChooseUsVideoUrl)

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.35),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.28),transparent_55%)]" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-6 inline-flex rounded-md border border-orange-400/40 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
              Industrial Milling • Rice Processing • Feed Mixing
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Build a stable production line
              <br />
              with clear technical decisions
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
              We support global buyers with practical equipment selection and line configuration—focused on stable output,
              predictable quality, and maintenance-friendly operation.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-md bg-orange-500 px-8 py-4 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-orange-400"
              >
                Get Selection & Quote
              </Link>
              <Link
                href="/products"
                className="rounded-md border border-white/35 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
              >
                View Product Lines
              </Link>
              <Link
                href="/solutions"
                className="rounded-md border border-white/20 bg-transparent px-8 py-4 text-sm font-semibold text-white/90 transition hover:border-white/35 hover:bg-white/5"
              >
                See Typical Configurations
              </Link>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
                <p className="font-semibold text-white">Fast evaluation</p>
                <p className="mt-1 text-slate-300">Material → target output → capacity</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
                <p className="font-semibold text-white">Clear deliverables</p>
                <p className="mt-1 text-slate-300">Proposal + key parts + lead time</p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3">
                <p className="font-semibold text-white">Lifecycle focus</p>
                <p className="mt-1 text-slate-300">Maintenance + spare-part planning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST METRICS */}
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
                  <p className="mx-auto mt-3 max-w-[16rem] text-sm font-semibold leading-snug text-slate-700 sm:text-base">
                    {item.label}
                  </p>
                  {item.hint ? <p className="mt-2 text-xs leading-5 text-slate-500">{item.hint}</p> : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PRODUCT LINES */}
      <section id="products" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Core Product Lines</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Equipment coverage across key processing stages
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Choose by your material, target fineness, and capacity. If you’re unsure, send your requirements and we’ll
                propose a practical configuration.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-slate-700 underline decoration-orange-400 decoration-2 underline-offset-4"
            >
              View Full Catalog
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PRODUCT_LINES.map((p) => (
              <article
                key={p.title}
                className="rounded-lg border border-slate-200/80 bg-[linear-gradient(140deg,#f8fafc_0%,#ffffff_35%,#fff7ed_100%)] p-8 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]"
              >
                <h3 className="text-2xl font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{p.tagline}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Highlights</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Typical materials</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.forMaterials.map((m) => (
                        <span
                          key={m}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={p.href}
                    className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Learn More
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                  >
                    Ask for Recommendation
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">Solution Focus</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Typical workflows buyers ask for</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Use these as starting points. Final configuration depends on your material properties and target output.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {INDUSTRY_SOLUTIONS.map((s) => (
              <article key={s.title} className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">{s.title}</h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-700">
                  {s.outcomes.map((o) => (
                    <li key={o} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
                <Link href={s.href} className="mt-7 inline-flex text-sm font-semibold text-orange-600">
                  See related solutions →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTION GUIDE (LIGHTWEIGHT CTA) */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#0f172a_100%)] p-8 text-white shadow-2xl md:grid-cols-[1.1fr_0.9fr] md:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-300">Selection Starter</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Send 5 details, get a practical proposal</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200">
                Share your material and target output. We’ll respond with a recommended product line, configuration notes,
                and a clear lead-time estimate.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  'Material (and moisture if relevant)',
                  'Target fineness / mesh',
                  'Capacity (t/h)',
                  'Power supply (V/Hz)',
                  'Installation space constraints',
                  'Any special requirements (food-grade, dust control, etc.)',
                ].map((t) => (
                  <div key={t} className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    {t}
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-md bg-orange-500 px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-orange-400"
                >
                  Request Selection & Quote
                </Link>
                <Link
                  href="/cases"
                  className="rounded-md border border-white/25 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  View Case Studies
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 md:p-8">
              <p className="text-sm font-semibold text-orange-200">What you receive</p>
              <ul className="mt-5 space-y-3 text-sm text-slate-200">
                {[
                  'Recommended product line + key options',
                  'Configuration proposal (crush/mill/mix flow)',
                  'Quotation with lead time and packing notes',
                  'Spare-part suggestion for stable operation',
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-lg border border-white/10 bg-slate-900/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Tip</p>
                <p className="mt-2 text-sm text-slate-200">
                  If you have an existing line, include a brief list of your current machines and bottlenecks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS + VIDEO (IF PROVIDED) */}
      <section className="bg-slate-900 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-300">Delivery Process</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">A clear path from requirements to delivery</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200">
                Buyers move faster when expectations and deliverables are clear. Here’s how we typically work.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {PROCESS_STEPS.map((step, idx) => (
                  <article key={step.name} className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <p className="text-sm font-semibold text-orange-200">{`0${idx + 1}`}</p>
                    <h3 className="mt-2 text-lg font-semibold">{step.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-200">{step.note}</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-200">
                      {step.deliverables.map((d) => (
                        <li key={d} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl">
              {embedVideoUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <iframe
                    src={embedVideoUrl}
                    title="Why Choose DoDoShark"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-slate-900/30 p-6 text-center">
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

              <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/30 p-5">
                <p className="text-sm font-semibold text-orange-200">Prefer specs first?</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  Share your target output and capacity. We’ll reply with a clear recommendation and next steps.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-orange-400"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/products"
                    className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/5"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-500">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Common questions from buyers</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              These answers help you prepare requirements and shorten evaluation time.
            </p>
          </div>

          <div className="mt-10 grid gap-6">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-6 open:bg-white open:shadow-sm"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-orange-500 align-middle" />
                  {item.q}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact" className="inline-flex rounded-md bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Ask a technical question
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#fff7ed] py-20">
        <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-md bg-orange-300/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-4 h-72 w-72 rounded-md bg-cyan-200/45 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-600">Ready to Move Forward</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Share your material + target output, get a clear plan
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600">
            We’ll help you choose the right product line and configuration with practical deliverables and a transparent lead time.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Request a Quote
            </Link>
            <Link
              href="/cases"
              className="rounded-md border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              View Case Studies
            </Link>
            <Link
              href="/solutions"
              className="rounded-md border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
            >
              Typical Workflows
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

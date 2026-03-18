import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { getSafeHref, isExternalHref } from '@/app/lib/safeHref'
import { client, urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'

type QueryParamValue = string | string[] | undefined

type SeoMeta = {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
}

type SanityImage = {
  alt?: string
  asset?: {
    _id?: string
    _ref?: string
    url?: string
  }
}

type CategoryItem = {
  _id?: string
  title?: string
  slug?: { current?: string }
}

type CaseStat = {
  label?: string
  value?: string
}

type CaseCard = {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  location?: string
  coverImage?: SanityImage
  industry?: CategoryItem
  impactStats?: CaseStat[]
}

type CasesLandingData = {
  seo?: SeoMeta
  hero?: {
    badge?: string
    title?: string
    subtitle?: string
    image?: SanityImage
    stats?: CaseStat[]
  }
  industries?: CategoryItem[]
  cta?: {
    title?: string
    buttonText?: string
    buttonLink?: string
  }
}

type CasesPageProps = {
  searchParams: Promise<Record<string, QueryParamValue>>
}

const PAGE_SIZE = 6

const casesLandingQuery = `*[_type == "casesPage"][0]{
  seo,
  hero{
    badge,
    title,
    subtitle,
    image{
      alt,
      asset
    },
    stats[]{
      label,
      value
    }
  },
  industries[]->{
    _id,
    title,
    slug{current}
  },
  cta{
    title,
    buttonText,
    buttonLink
  }
}`

const casesCountQuery = `count(*[
  _type == "caseStudy"
  && defined(slug.current)
  && ($industry == "" || industry->slug.current == $industry)
])`

const casesListQuery = `*[
  _type == "caseStudy"
  && defined(slug.current)
  && ($industry == "" || industry->slug.current == $industry)
] | order(_createdAt desc)[$start...$end]{
  _id,
  title,
  slug{current},
  excerpt,
  location,
  coverImage{
    alt,
    asset
  },
  industry->{
    _id,
    title,
    slug{current}
  },
  impactStats[]{
    label,
    value
  }
}`

const allCategoriesQuery = `*[_type == "category"] | order(title asc){
  _id,
  title,
  slug{current}
}`

function firstParam(value: QueryParamValue) {
  if (Array.isArray(value)) return value[0]
  return value
}

function parsePositiveInt(value: string | undefined, fallback = 1) {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

function toImageSrc(image?: SanityImage, width = 1200) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl

  const hasIdentity = Boolean(image.asset?._id || image.asset?._ref)
  if (!hasIdentity) return undefined

  try {
    return urlFor(image).width(width).fit('max').url()
  } catch {
    return undefined
  }
}

function buildHref({ industry, page }: { industry?: string; page?: number }) {
  const params = new URLSearchParams()
  if (industry) params.set('industry', industry)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/cases?${query}` : '/cases'
}

export async function generateMetadata(): Promise<Metadata> {
  const landing = await client.fetch<CasesLandingData | null>(casesLandingQuery)
  const seo = landing?.seo

  return {
    title: seo?.title || 'Global Success Stories | DoDoShark',
    description: seo?.description || 'Explore real industrial project case studies and outcomes.',
    keywords: seo?.keywords,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: false, follow: false },
  }
}

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const params = await searchParams
  const industry = firstParam(params.industry)?.trim() || ''
  const requestedPage = parsePositiveInt(firstParam(params.page), 1)

  const landing = await client.fetch<CasesLandingData | null>(casesLandingQuery)
  const total = await client.fetch<number>(casesCountQuery, { industry })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [cases, fallbackIndustries] = await Promise.all([
    client.fetch<CaseCard[]>(casesListQuery, { industry, start, end }),
    client.fetch<CategoryItem[]>(allCategoriesQuery),
  ])

  const configuredIndustries = landing?.industries?.filter((item) => item?.slug?.current) ?? []
  const industries = configuredIndustries.length > 0 ? configuredIndustries : fallbackIndustries
  const heroImageSrc = toImageSrc(landing?.hero?.image, 1800)
  const heroBadge = landing?.hero?.badge?.trim()
  const heroTitle = landing?.hero?.title?.trim()
  const heroSubtitle =
    landing?.hero?.subtitle?.trim() ||
    'Discover how industrial partners improve throughput and efficiency with real deployments.'
  const heroStats = landing?.hero?.stats ?? []
  const ctaTitle = landing?.cta?.title?.trim()
  const ctaHref = getSafeHref(landing?.cta?.buttonLink) || '/contact'
  const ctaButtonText = landing?.cta?.buttonText || 'Request Simulation Hub'
  const ctaIsExternal = isExternalHref(ctaHref)

  return (
    <main className="bg-[#f8fafc] text-slate-900">
      <section className="relative overflow-hidden bg-slate-800 pb-24 pt-32">
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt={landing?.hero?.image?.alt || 'Cases hero'}
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
        )}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-3xl">
            {heroBadge && (
              <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-blue-500/30 bg-blue-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                <Icon icon="globe" className="h-4 w-4" />
                <span>{heroBadge}</span>
              </div>
            )}
            <h1 className="mb-8 text-6xl font-display font-black leading-tight tracking-tight text-white md:text-8xl">
              {heroTitle ? (
                heroTitle
              ) : (
                <>
                  Success in <span className="text-blue-500">Operation</span>
                </>
              )}
            </h1>
            <p className="mb-12 text-xl font-light leading-relaxed text-slate-400">{heroSubtitle}</p>
            {heroStats.length ? (
              <div className="flex flex-wrap items-center gap-10">
                {heroStats.slice(0, 3).map((stat, index) => (
                  <div key={`${stat.label}-${index}`}>
                    <div className="text-3xl font-display font-black text-white">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-40 border-b border-slate-100 bg-white/80 py-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={buildHref({})}
            className={`rounded-md border px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${
              industry
                ? 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                : 'border-blue-600 bg-blue-600 text-white'
            }`}
          >
            All Industries
          </Link>
          {industries.map((item) => {
            const slug = item.slug?.current
            if (!slug) return null
            const active = slug === industry
            return (
              <Link
                key={item._id ?? slug}
                href={buildHref({ industry: slug })}
                className={`whitespace-nowrap rounded-md border px-5 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                {item.title || slug}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {cases.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
              No case studies found for current industry filter.
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-2">
              {cases.map((item) => {
                const cover = toImageSrc(item.coverImage, 1200)
                const caseHref = item.slug?.current ? `/cases/${item.slug.current}` : undefined
                return (
                  <article key={item._id} className="premium-card group relative overflow-hidden">
                    <div className="relative h-80 overflow-hidden bg-slate-100">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={item.coverImage?.alt || item.title || 'Case cover'}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Icon icon="image" className="h-10 w-10" />
                        </div>
                      )}
                      <div className="absolute left-8 top-8 flex flex-col gap-2">
                        {item.industry?.title && (
                          <span className="rounded-md bg-blue-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                            {item.industry.title}
                          </span>
                        )}
                        {item.location && (
                          <span className="rounded-md bg-white/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl backdrop-blur-md">
                            <Icon icon="location" className="mr-2 inline h-4 w-4" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-10">
                      {!!item.impactStats?.length && (
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                          {item.impactStats.slice(0, 3).map((stat, idx) => (
                            <span
                              key={`${stat.label}-${idx}`}
                              className="rounded-lg bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600"
                            >
                              {stat.value || stat.label}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="mb-6 text-3xl font-display font-black leading-tight text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mb-8 font-light leading-relaxed text-slate-500">
                        {item.excerpt || 'Detailed case study content is available in the full project report.'}
                      </p>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          Case Study
                        </span>
                        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-50 text-slate-900 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                          <Icon icon="arrow-right" className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                    {caseHref && (
                      <Link href={caseHref} className="absolute inset-0 z-10">
                        <span className="sr-only">View case detail</span>
                      </Link>
                    )}
                  </article>
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-3">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={buildHref({ industry, page: pageNumber })}
                  className={`h-3 rounded-full transition-all ${
                    pageNumber === currentPage ? 'w-8 bg-blue-600' : 'w-3 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to page ${pageNumber}`}
                />
              ))}
            </div>
          )}

          {(ctaTitle || landing?.cta?.buttonText) && (
            <div className="relative mt-24 overflow-hidden rounded-lg bg-slate-800 p-12 text-center text-white md:p-16">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10">
                {ctaTitle && <h2 className="mb-8 text-4xl font-display font-black md:text-5xl">{ctaTitle}</h2>}
                {ctaIsExternal ? (
                  <a
                    href={ctaHref}
                    target={ctaHref.startsWith('http') ? '_blank' : undefined}
                    rel={ctaHref.startsWith('http') ? 'noreferrer' : undefined}
                    className="inline-block rounded-md bg-blue-600 px-12 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500"
                  >
                    {ctaButtonText}
                  </a>
                ) : (
                  <Link
                    href={ctaHref}
                    className="inline-block rounded-md bg-blue-600 px-12 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500"
                  >
                    {ctaButtonText}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

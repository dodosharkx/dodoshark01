import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { client, urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'
import LandingCardPager, { type LandingCardItem } from '@/components/ui/LandingCardPager'

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

type ContentTagItem = {
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
  tags?: ContentTagItem[]
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
  tagFilters?: ContentTagItem[]
}

type CasesPageProps = {
  searchParams: Promise<Record<string, QueryParamValue>>
}

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
  tagFilters[]->{
    _id,
    title,
    slug{current}
  }
}`

const casesListQuery = `*[
  _type == "caseStudy"
  && defined(slug.current)
  && ($tag == "" || $tag in tags[]->slug.current)
] | order(_createdAt desc){
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
  tags[]->{
    _id,
    title,
    slug{current}
  },
  impactStats[]{
    label,
    value
  }
}`

const allTagsQuery = `*[_type == "contentTag"] | order(title asc){
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

function buildHref({ tag, page }: { tag?: string; page?: number }) {
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
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
  const tag = firstParam(params.tag)?.trim() || ''
  const initialPage = parsePositiveInt(firstParam(params.page), 1)
  const tagParams: Record<string, string> = { tag }

  const landing = await client.fetch<CasesLandingData | null>(casesLandingQuery)

  const [cases, fallbackTags] = await Promise.all([
    client.fetch<CaseCard[]>(casesListQuery, tagParams),
    client.fetch<ContentTagItem[]>(allTagsQuery),
  ])

  const configuredTags = landing?.tagFilters?.filter((item) => item?.slug?.current) ?? []
  const tags = configuredTags.length > 0 ? configuredTags : fallbackTags
  const heroImageSrc = toImageSrc(landing?.hero?.image, 1800)
  const heroBadge = landing?.hero?.badge?.trim()
  const heroTitle = landing?.hero?.title?.trim()
  const heroSubtitle =
    landing?.hero?.subtitle?.trim() ||
    'Discover how industrial partners improve throughput and efficiency with real deployments.'
  const heroStats = landing?.hero?.stats ?? []
  const caseItems: LandingCardItem[] = cases.map((item) => {
    const slug = item.slug?.current?.trim()

    return {
      id: item._id,
      href: slug ? `/cases/${slug}` : '/cases',
      title: item.title?.trim() || 'Case Study',
      description:
        item.excerpt?.trim() || 'Detailed case study content is available in the full project report.',
      imageSrc: toImageSrc(item.coverImage, 900),
      imageAlt: item.coverImage?.alt || item.title || 'Case cover',
      tag: item.tags?.[0]?.title?.trim() || item.industry?.title?.trim() || 'Case Study',
      metaText: item.location?.trim(),
    }
  })

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
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
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {heroBadge && (
              <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                <Icon icon="globe" className="h-4 w-4" />
                <span>{heroBadge}</span>
              </div>
            )}
            <h1 className="mb-8 text-5xl font-display font-black leading-tight tracking-tight text-white md:text-7xl">
              {heroTitle ? (
                heroTitle
              ) : (
                <>
                  Success Stories <span className="accent-gradient-text">in Action</span>
                </>
              )}
            </h1>
            <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-slate-400">{heroSubtitle}</p>
            {heroStats.length ? (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-10">
                {heroStats.slice(0, 3).map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="min-w-[120px]">
                    <div className="text-3xl font-display font-black text-white">{stat.value}</div>
                    <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="cases" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {cases.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
              No case studies found for the current tag.
            </div>
          ) : (
            <LandingCardPager
              items={caseItems}
              initialPage={initialPage}
              pathname="/cases"
              filterParamName="tag"
              filterParamValue={tag}
              emptyMessage="No case studies found for the current tag."
            />
          )}

          <div className="mt-20 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:overflow-visible md:px-0">
            <div className="inline-flex min-w-full gap-3 md:flex md:w-full md:flex-wrap md:justify-center">
              <Link
                href={buildHref({})}
                className={`shrink-0 whitespace-nowrap rounded-md border-2 px-5 py-2.5 text-[11px] font-black tracking-widest transition-all md:px-6 ${
                  tag
                    ? 'border-slate-200 text-slate-700 hover:border-slate-300'
                    : 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                }`}
              >
                All Tags
              </Link>
              {tags.map((item) => {
                const slug = item.slug?.current
                if (!slug) return null
                const active = slug === tag
                return (
                  <Link
                    key={item._id ?? slug}
                    href={buildHref({ tag: slug })}
                    className={`shrink-0 whitespace-nowrap rounded-md border-2 px-5 py-2.5 text-[11px] font-black tracking-widest transition-all md:px-6 ${
                      active
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {item.title || slug}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

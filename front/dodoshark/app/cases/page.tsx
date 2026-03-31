import type { Metadata } from 'next'
import Image from 'next/image'

import { fetchSanityData } from '@/app/lib/sanity.live'
import { cleanSlug, cleanText, firstParam, renderText, toImageSrc, type QueryParamValue } from '@/app/lib/sanity-utils'
import type { SeoMeta, SanityImage } from '@/app/lib/types/sanity'
import Icon from '@/components/ui/Icon'
import LandingCardPager, { type LandingCardItem } from '@/components/ui/LandingCardPager'
import HeroTitle from '@/components/ui/HeroTitle'
import TagCloudPanel, { type TagCloudItem } from '@/components/ui/TagCloudPanel'

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
  clientLogo?: SanityImage
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

const casesLandingQuery = `coalesce(
  *[_id == "casesPage"][0],
  *[_type == "casesPage"][0]
){
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
    asset->{
      _id,
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    }
  },
  clientLogo{
    alt,
    asset->{
      _id,
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    }
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

function parsePositiveInt(value: string | undefined, fallback = 1) {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

function buildHref({ tag, page }: { tag?: string; page?: number }) {
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/cases?${query}` : '/cases'
}

function getImageAspectRatio(image?: SanityImage, fallback = 2) {
  const width = image?.asset?.metadata?.dimensions?.width
  const height = image?.asset?.metadata?.dimensions?.height

  if (!width || !height) return fallback

  const ratio = width / height
  return Number.isFinite(ratio) && ratio > 0 ? ratio : fallback
}

function getCoverImageAspectRatio(image?: SanityImage, fallback = 2) {
  const ratio = getImageAspectRatio(image, fallback)
  return Math.abs(ratio - fallback) < 0.01 ? fallback : ratio
}

const casesCardTagClassName =
  'border-orange-200/80 bg-orange-50/80 px-3.5 py-1 text-[11px] font-medium text-orange-600 shadow-[0_6px_18px_rgba(249,115,22,0.06)] sm:text-xs'

const casesCardTagLabelClassName = 'max-w-[220px]'

export async function generateMetadata(): Promise<Metadata> {
  const landing = await fetchSanityData<CasesLandingData | null>({
    query: casesLandingQuery,
    stega: false,
  })
  const seo = landing?.seo

  return {
    title: cleanText(seo?.title) || 'Global Success Stories | DoDoShark',
    description: cleanText(seo?.description) || 'Explore real industrial project case studies and outcomes.',
    keywords: seo?.keywords,
    alternates: cleanText(seo?.canonicalUrl) ? { canonical: cleanText(seo?.canonicalUrl) } : undefined,
    robots: { index: false, follow: false },
  }
}

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const params = await searchParams
  const tag = cleanText(firstParam(params.tag)) || ''
  const initialPage = parsePositiveInt(firstParam(params.page), 1)
  const tagParams: Record<string, string> = { tag }

  const landing = await fetchSanityData<CasesLandingData | null>({
    query: casesLandingQuery,
  })

  const [cases, fallbackTags] = await Promise.all([
    fetchSanityData<CaseCard[]>({
      query: casesListQuery,
      params: tagParams,
    }),
    fetchSanityData<ContentTagItem[]>({
      query: allTagsQuery,
    }),
  ])

  const configuredTags = (landing?.tagFilters && landing.tagFilters.length > 0)
    ? landing.tagFilters.filter((item) => cleanSlug(item?.slug))
    : []
  const tags = configuredTags.length > 0 ? configuredTags : (fallbackTags && fallbackTags.length > 0 ? fallbackTags : [])
  const heroImageSrc = toImageSrc(landing?.hero?.image, 1800)
  const heroBadge = renderText(landing?.hero?.badge)
  const heroTitle = renderText(landing?.hero?.title)
  const heroSubtitle =
    renderText(landing?.hero?.subtitle) ||
    'Discover how DoDoShark help customers improve throughput and efficiency with real deployments.'
  const heroStats = (landing?.hero?.stats && landing.hero.stats.length > 0) ? landing.hero.stats : []
  const casesArray = (cases && cases.length > 0) ? cases : []
  const caseItems: LandingCardItem[] = casesArray.map((item) => {
    const slug = cleanSlug(item.slug)

    return {
      id: item._id,
      href: slug ? `/cases/${slug}` : '/cases',
      title: renderText(item.title) || 'Case Study',
      description:
        renderText(item.excerpt) || 'Detailed case study content is available in the full project report.',
      imageSrc: toImageSrc(item.coverImage, 900),
      imageAlt: renderText(item.coverImage?.alt) || renderText(item.title) || 'Case cover',
      imageAspectRatio: getCoverImageAspectRatio(item.coverImage),
      logoSrc: toImageSrc(item.clientLogo, 320),
      logoAlt: renderText(item.clientLogo?.alt) || renderText(item.title) || 'Client logo',
      tag: renderText(item.tags?.[0]?.title) || 'Case Study',
      metaText: renderText(item.location),
    }
  })
  const tagCloudItems: TagCloudItem[] = tags.flatMap((item) => {
    const slug = cleanSlug(item.slug)
    if (!slug) return []

    return [
      {
        key: item._id ?? slug,
        href: buildHref({ tag: slug }),
        label: renderText(item.title) || slug,
        active: slug === tag,
      },
    ]
  })

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      <section className="relative overflow-hidden bg-slate-800 pb-24 pt-32">
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt={renderText(landing?.hero?.image?.alt) || 'Cases hero'}
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] bg-size-[40px_40px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {heroBadge && (
              <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                <Icon icon="globe" className="h-4 w-4" />
                <span>{heroBadge}</span>
              </div>
            )}
            <h1 className="mb-8 text-5xl font-display font-black leading-tight tracking-tight text-white md:text-7xl">
              <HeroTitle
                title={heroTitle}
                fallback={
                  <>
                    Success Stories <span className="accent-gradient-text">in Action</span>
                  </>
                }
              />
            </h1>
            <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-slate-400">{heroSubtitle}</p>
            {heroStats.length ? (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-10">
                {heroStats.slice(0, 3).map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="min-w-30">
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
              imageAspectClassName="aspect-[2/1]"
              tagClassName={casesCardTagClassName}
              tagLabelClassName={casesCardTagLabelClassName}
            />
          )}

          <div className="mt-20">
            <TagCloudPanel
              title="Browse by tag"
              allLabel="All cases"
              allHref={buildHref({})}
              allActive={!tag}
              items={tagCloudItems}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

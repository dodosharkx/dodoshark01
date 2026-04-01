import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { fetchSanityData } from '@/lib/sanity.live'
import { buildPageMetadata } from '@/lib/seo'
import { cleanSlug, cleanText, firstParam, renderText, sanitizeAltText, toImageSrc, type QueryParamValue } from '@/lib/sanity-utils'
import type { SeoMeta, SanityImage } from '@/lib/types/sanity'
import VlogVideoGrid, { type VlogVideoCardItem } from '@/components/vlog/VlogVideoGrid'
import Icon from '@/components/ui/Icon'
import TagCloudPanel, { type TagCloudItem } from '@/components/ui/TagCloudPanel'
import HeroTitle from '@/components/ui/HeroTitle'

type ContentTagItem = {
  _id?: string
  title?: string
  slug?: { current?: string }
}

type VlogItemCard = {
  _id: string
  title?: string
  excerpt?: string
  publishedAt?: string
  youtubeUrl?: string
  coverImage?: SanityImage
  tags?: ContentTagItem[]
  status?: string
}

type VlogLandingData = {
  seo?: SeoMeta
  hero?: {
    badge?: string
    title?: string
    subtitle?: string
    image?: SanityImage
  }
  tagFilters?: ContentTagItem[]
}

type BlogsPageProps = {
  searchParams: Promise<Record<string, QueryParamValue>>
}

const PAGE_SIZE = 9

const blogsLandingQuery = `coalesce(
  *[_id == "blogPage"][0],
  *[_type == "blogPage"][0]
){
  seo,
  hero{
    badge,
    title,
    subtitle,
    image{
      alt,
      asset
    }
  },
  tagFilters[]->{
    _id,
    title,
    slug{current}
  }
}`

const blogsCountQuery = `count(*[
  _type == "vlogItem"
  && status == "published"
  && ($tag == "" || $tag in tags[]->slug.current)
])`

const blogsListQuery = `*[
  _type == "vlogItem"
  && status == "published"
  && ($tag == "" || $tag in tags[]->slug.current)
] | order(coalesce(publishedAt, _createdAt) desc)[$start...$end]{
  _id,
  title,
  excerpt,
  publishedAt,
  youtubeUrl,
  status,
  coverImage{
    alt,
    asset
  },
  tags[]->{
    _id,
    title,
    slug{current}
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

function buildHref({
  tag,
  page,
}: {
  tag?: string
  page?: number
}) {
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/vlog?${query}` : '/vlog'
}

function hasSanityImageAsset(image?: SanityImage) {
  return Boolean(image?.asset?._ref || image?.asset?._id || image?.asset?.url)
}

export async function generateMetadata(): Promise<Metadata> {
  const landing = await fetchSanityData<VlogLandingData | null>({
    query: blogsLandingQuery,
    stega: false,
  })
  return buildPageMetadata({
    seo: landing?.seo,
    fallbackTitle: 'Industrial Video Insights | DoDoShark',
    fallbackDescription: 'Watch machine demos, process walkthroughs, and industrial video updates.',
  })
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams
  const tag = cleanText(firstParam(params.tag)) || ''
  const requestedPage = parsePositiveInt(firstParam(params.page), 1)
  const tagParams: Record<string, string> = { tag }

  const landing = await fetchSanityData<VlogLandingData | null>({
    query: blogsLandingQuery,
  })

  const total = await fetchSanityData<number>({
    query: blogsCountQuery,
    params: tagParams,
  })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [posts, fallbackTags] = await Promise.all([
    fetchSanityData<VlogItemCard[]>({
      query: blogsListQuery,
      params: {
        ...tagParams,
        start,
        end,
      },
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
    renderText(landing?.hero?.subtitle) || 'Product demonstrations, processing materials, integrated solutions, customer usage scenarios, etc.'

  const postsArray = (posts && posts.length > 0) ? posts : []
  const videoItems: VlogVideoCardItem[] = postsArray.map((post) => ({
    id: post._id,
    title: renderText(post.title) || 'Video',
    excerpt: renderText(post.excerpt) || 'Watch the full video for equipment demos and process highlights.',
    imageSrc: toImageSrc(post.coverImage, 900),
    imageAlt: hasSanityImageAsset(post.coverImage)
      ? sanitizeAltText(post.coverImage?.alt, renderText(post.title)) || 'Video cover'
      : sanitizeAltText(renderText(post.title)) || 'Video cover',
    youtubeUrl: cleanText(post.youtubeUrl),
    tagLabel: renderText(post.tags?.[0]?.title) || 'Video',
  }))
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
      <section className="relative overflow-hidden bg-slate-800 pb-20 pt-32">
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt={sanitizeAltText(landing?.hero?.image?.alt) || 'Blog hero'}
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.1"
              strokeDasharray="1 2"
            />
          </svg>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {heroBadge && (
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
              <Icon icon="microchip" className="h-4 w-4" />
              <span>{heroBadge}</span>
            </div>
          )}
          <h1 className="mb-8 text-5xl font-display font-black leading-tight tracking-tight text-white md:text-7xl">
            <HeroTitle
              title={heroTitle}
              fallback={
                <>
                  DoDoShark <span className="accent-gradient-text">Video Hub</span>
                </>
              }
            />
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-slate-400">{heroSubtitle}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
              No videos found for the current tag.
            </div>
          ) : (
            <VlogVideoGrid items={videoItems} />
          )}

          {totalPages > 1 && (
            <div className="mt-20 flex items-center justify-center gap-3">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={buildHref({ tag, page: pageNumber })}
                  className={`flex h-11 w-11 items-center justify-center rounded-md border text-sm font-bold transition-all ${
                    pageNumber === currentPage
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-500'
                  }`}
                >
                  {pageNumber}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-20">
            <TagCloudPanel
              title="Browse by tag"
              allLabel="All videos"
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

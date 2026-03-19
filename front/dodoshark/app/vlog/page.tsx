import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { client, urlFor } from '@/app/lib/sanity'
import VlogVideoGrid, { type VlogVideoCardItem } from '@/components/vlog/VlogVideoGrid'
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

const blogsLandingQuery = `*[_type == "blogPage"][0]{
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

function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

export async function generateMetadata(): Promise<Metadata> {
  const landing = await client.fetch<VlogLandingData | null>(blogsLandingQuery)
  const seo = landing?.seo

  return {
    title: seo?.title || 'Industrial Video Insights | DoDoShark',
    description: seo?.description || 'Watch machine demos, process walkthroughs, and industrial video updates.',
    keywords: seo?.keywords,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: false, follow: false },
  }
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams
  const tag = firstParam(params.tag)?.trim() || ''
  const requestedPage = parsePositiveInt(firstParam(params.page), 1)
  const tagParams: Record<string, string> = { tag }

  const landing = await client.fetch<VlogLandingData | null>(blogsLandingQuery)

  const total = await client.fetch<number>(blogsCountQuery, {
    ...tagParams,
  })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [posts, fallbackTags] = await Promise.all([
    client.fetch<VlogItemCard[]>(blogsListQuery, {
      ...tagParams,
      start,
      end,
    }),
    client.fetch<ContentTagItem[]>(allTagsQuery),
  ])

  const configuredTags = landing?.tagFilters?.filter((item) => item?.slug?.current) ?? []
  const tags = configuredTags.length > 0 ? configuredTags : fallbackTags
  const heroImageSrc = toImageSrc(landing?.hero?.image, 1800)
  const heroBadge = landing?.hero?.badge?.trim()
  const heroTitle = landing?.hero?.title?.trim()
  const heroSubtitle =
    landing?.hero?.subtitle?.trim() || 'Machine demos, process walkthroughs, and industrial video updates.'
  const videoItems: VlogVideoCardItem[] = posts.map((post) => ({
    id: post._id,
    title: post.title?.trim() || 'Video',
    excerpt: post.excerpt?.trim() || 'Watch the full video for equipment demos and process highlights.',
    imageSrc: toImageSrc(post.coverImage, 900),
    imageAlt: post.coverImage?.alt || post.title || 'Video cover',
    youtubeUrl: post.youtubeUrl?.trim(),
    tagLabel: post.tags?.[0]?.title?.trim() || 'Video',
    publishedAtLabel: formatDate(post.publishedAt),
  }))

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 pb-20 pt-32">
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt={landing?.hero?.image?.alt || 'Blog hero'}
            fill
            sizes="100vw"
            className="object-cover opacity-10"
          />
        )}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="currentColor"
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
          <h1 className="mb-8 text-5xl font-display font-black leading-tight tracking-tight text-slate-900 md:text-7xl">
            {heroTitle ? (
              heroTitle
            ) : (
              <>
                Industrial <span className="accent-gradient-text">Video Hub</span>
              </>
            )}
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-slate-500">{heroSubtitle}</p>
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

          <div className="mt-20 rounded-[2rem] border border-slate-100 bg-slate-50/80 p-8 shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-display font-black text-slate-900">Browse By Tag</h2>
              <p className="mt-2 text-sm font-light text-slate-500">
                Filter videos by shared topics managed directly in Sanity.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={buildHref({})}
                className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-all ${
                  tag
                    ? 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    : 'border-slate-900 bg-slate-800 text-white'
                }`}
              >
                All Videos
              </Link>
              {tags.map((item) => {
                const slug = item.slug?.current
                if (!slug) return null
                const active = slug === tag

                return (
                  <Link
                    key={item._id ?? slug}
                    href={buildHref({ tag: slug })}
                    className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-all ${
                      active
                        ? 'border-slate-900 bg-slate-800 text-white'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
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

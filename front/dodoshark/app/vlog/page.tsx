import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

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

type AuthorItem = {
  name?: string
}

type PostCard = {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  mainImage?: SanityImage
  categories?: CategoryItem[]
  author?: AuthorItem
}

type BlogsLandingData = {
  seo?: SeoMeta
  hero?: {
    badge?: string
    title?: string
    subtitle?: string
    image?: SanityImage
  }
  categories?: CategoryItem[]
  featuredPost?: PostCard
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
  categories[]->{
    _id,
    title,
    slug{current}
  },
  featuredPost->{
    _id,
    title,
    slug{current},
    excerpt,
    publishedAt,
    readingTime,
    mainImage{
      alt,
      asset
    },
    categories[]->{
      _id,
      title,
      slug{current}
    },
    author->{
      name
    }
  }
}`

const blogsCountQuery = `count(*[
  _type == "post"
  && defined(slug.current)
  && ($featuredId == "" || _id != $featuredId)
  && ($category == "" || $category in categories[]->slug.current)
  && (
    $search == ""
    || title match $search
    || excerpt match $search
  )
])`

const blogsListQuery = `*[
  _type == "post"
  && defined(slug.current)
  && ($featuredId == "" || _id != $featuredId)
  && ($category == "" || $category in categories[]->slug.current)
  && (
    $search == ""
    || title match $search
    || excerpt match $search
  )
] | order(coalesce(publishedAt, _createdAt) desc)[$start...$end]{
  _id,
  title,
  slug{current},
  excerpt,
  publishedAt,
  readingTime,
  mainImage{
    alt,
    asset
  },
  categories[]->{
    _id,
    title,
    slug{current}
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

function buildHref({
  category,
  q,
  page,
}: {
  category?: string
  q?: string
  page?: number
}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
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
  const landing = await client.fetch<BlogsLandingData | null>(blogsLandingQuery)
  const seo = landing?.seo

  return {
    title: seo?.title || 'Industrial Insights & News | DoDoShark',
    description: seo?.description || 'Latest engineering insights and industrial technology updates.',
    keywords: seo?.keywords,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: false, follow: false },
  }
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams
  const category = firstParam(params.category)?.trim() || ''
  const q = firstParam(params.q)?.trim() || ''
  const requestedPage = parsePositiveInt(firstParam(params.page), 1)
  const search = q ? `*${q}*` : ''

  const landing = await client.fetch<BlogsLandingData | null>(blogsLandingQuery)
  const featuredId = landing?.featuredPost?._id || ''
  const featuredIdForList = !category && !q ? featuredId : ''

  const total = await client.fetch<number>(blogsCountQuery, {
    featuredId: featuredIdForList,
    category,
    search,
  })
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [posts, fallbackCategories] = await Promise.all([
    client.fetch<PostCard[]>(blogsListQuery, {
      featuredId: featuredIdForList,
      category,
      search,
      start,
      end,
    }),
    client.fetch<CategoryItem[]>(allCategoriesQuery),
  ])

  const configuredCategories = landing?.categories?.filter((item) => item?.slug?.current) ?? []
  const categories = configuredCategories.length > 0 ? configuredCategories : fallbackCategories
  const heroImageSrc = toImageSrc(landing?.hero?.image, 1800)
  const heroBadge = landing?.hero?.badge?.trim()
  const shouldShowFeatured = Boolean(landing?.featuredPost) && !category && !q && currentPage === 1
  const featuredPost = shouldShowFeatured ? landing?.featuredPost : undefined
  const featuredImageSrc = featuredPost ? toImageSrc(featuredPost.mainImage, 1200) : undefined
  const heroTitle = landing?.hero?.title?.trim()
  const heroSubtitle =
    landing?.hero?.subtitle?.trim() || 'Tech trends, field data, and engineering thinking for industrial teams.'

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
                Industrial <span className="accent-gradient-text">Insights</span>
              </>
            )}
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-slate-500">{heroSubtitle}</p>
        </div>
      </section>

      <section className="sticky top-20 z-40 border-b border-slate-100 bg-[#fcfdfd]/80 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <Link
                href={buildHref({ q })}
                className={`rounded-md border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  category
                    ? 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    : 'border-slate-900 bg-slate-800 text-white'
                }`}
              >
                All Posts
              </Link>
              {categories.map((item) => {
                const slug = item.slug?.current
                if (!slug) return null
                const active = slug === category
                return (
                  <Link
                    key={item._id ?? slug}
                    href={buildHref({ category: slug, q })}
                    className={`rounded-md border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
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

            <form action="/vlog" method="get" className="relative w-full lg:w-96">
              {category && <input type="hidden" name="category" value={category} />}
              <Icon icon="search" className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search insights..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
              />
            </form>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {featuredPost ? (
            <div className="mb-20">
              <Link
                href={featuredPost.slug?.current ? `/vlog/${featuredPost.slug.current}` : '/vlog'}
                className="group flex flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-2xl transition-all duration-500 lg:flex-row"
              >
                <div className="h-[400px] w-full overflow-hidden lg:w-3/5">
                  {featuredImageSrc ? (
                    <Image
                      src={featuredImageSrc}
                      alt={featuredPost.mainImage?.alt || featuredPost.title || 'Featured post'}
                      width={1200}
                      height={800}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-100 text-slate-300">
                      <Icon icon="image" className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col justify-center p-12 lg:w-2/5">
                  <div className="mb-6 text-[10px] font-black uppercase tracking-widest text-orange-500">
                    Featured Insight
                  </div>
                  <h2 className="mb-6 text-4xl font-display font-black leading-tight text-slate-900 transition-colors group-hover:text-orange-500">
                    {featuredPost.title}
                  </h2>
                  <p className="mb-8 line-clamp-3 font-light text-slate-500">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 font-bold text-slate-500">
                      {(featuredPost.author?.name || 'DS')
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-slate-900">
                        {featuredPost.author?.name || 'DoDoShark Team'}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {formatDate(featuredPost.publishedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ) : null}

          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
              No blog posts found for current filter/search.
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const imageSrc = toImageSrc(post.mainImage, 900)
                const primaryCategory = post.categories?.[0]?.title || 'Insights'
                return (
                  <article key={post._id} className="premium-card flex flex-col overflow-hidden">
                    <div className="relative h-64 overflow-hidden bg-slate-100">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={post.mainImage?.alt || post.title || 'Post cover'}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Icon icon="image" className="h-10 w-10" />
                        </div>
                      )}
                      <div className="absolute left-6 top-6 rounded-md bg-white/90 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg backdrop-blur-md">
                        {primaryCategory}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-8">
                      <h3 className="mb-4 line-clamp-2 text-xl font-bold leading-snug text-slate-900 transition-colors hover:text-orange-500">
                        {post.title}
                      </h3>
                      <p className="mb-8 line-clamp-3 text-sm font-light text-slate-500">
                        {post.excerpt || 'Read the full technical article for detailed insights.'}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {formatDate(post.publishedAt)}
                          {post.readingTime ? ` · ${post.readingTime} min` : ''}
                        </span>
                        <Link
                          href={post.slug?.current ? `/vlog/${post.slug.current}` : '/vlog'}
                          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500"
                        >
                          Read More
                          <Icon icon="arrow-right" className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-20 flex items-center justify-center gap-3">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={buildHref({ category, q, page: pageNumber })}
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
        </div>
      </section>
    </main>
  )
}

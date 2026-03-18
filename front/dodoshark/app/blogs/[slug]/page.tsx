import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'

import { getSafeHref, isExternalHref } from '@/app/lib/safeHref'
import { client, urlFor } from '@/app/lib/sanity'
import Icon from '@/components/ui/Icon'

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

type SanityAsset = {
  _ref?: string
  _id?: string
  url?: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width?: number
      height?: number
    }
  }
}

type SanityImage = {
  _type?: string
  asset?: SanityAsset
  alt?: string
}

type SeoMeta = {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
  ogImage?: SanityImage
}

type CategoryData = {
  _id?: string
  title?: string
  slug?: { current?: string }
}

type AuthorData = {
  _id?: string
  name?: string
  role?: string
  image?: SanityImage
}

type InlineProductReference = {
  _id?: string
  _type?: 'product'
  title?: string
  slug?: { current?: string }
}

type InlineProductMark = {
  _key?: string
  _type?: 'inlineProductRef'
  product?: InlineProductReference
}

type PortableTextLinkMark = {
  _key?: string
  _type?: 'link'
  href?: string
}

type PortableTextChild = {
  _type?: 'span'
  text?: string
  marks?: string[]
}

type PortableTextBlockNode = PortableTextBlock & {
  _type?: 'block'
  _key?: string
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote' | string
  children?: PortableTextChild[]
  markDefs?: Array<InlineProductMark | PortableTextLinkMark | Record<string, unknown>>
}

type PortableTextImageNode = {
  _type?: 'image'
  _key?: string
  asset?: SanityAsset
  alt?: string
}

type PortableTextTableNode = {
  _type?: 'table'
  _key?: string
  rows?: Array<{
    _key?: string
    cells?: string[]
  }>
}

type PortableTextNode =
  | PortableTextBlockNode
  | PortableTextImageNode
  | PortableTextTableNode
  | Record<string, unknown>

type RelatedPostData = {
  _id?: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  categories?: CategoryData[]
  mainImage?: SanityImage
}

type PostData = {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  publishedAt?: string
  readingTime?: number
  seo?: SeoMeta
  categories?: CategoryData[]
  author?: AuthorData
  mainImage?: SanityImage
  body?: PortableTextNode[]
  relatedPosts?: RelatedPostData[]
}

type TocItem = {
  id: string
  text: string
  level: 'h2' | 'h3'
}

const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug { current },
  excerpt,
  publishedAt,
  readingTime,
  seo {
    title,
    description,
    keywords,
    canonicalUrl,
    noIndex,
    ogImage {
      ...,
      asset
    }
  },
  categories[] -> {
    _id,
    title,
    slug { current }
  },
  author -> {
    _id,
    name,
    role,
    image {
      ...,
      asset
    }
  },
  mainImage {
    ...,
    asset
  },
  body[] {
    ...,
    _type == "block" => {
      ...,
      markDefs[] {
        ...,
        _type == "inlineProductRef" => {
          ...,
          product -> {
            _id,
            _type,
            title,
            slug { current }
          }
        }
      }
    },
    _type == "image" => {
      ...,
      asset
    },
    _type == "table" => {
      ...
    }
  },
  relatedPosts[] -> {
    _id,
    title,
    slug { current },
    excerpt,
    publishedAt,
    readingTime,
    categories[] -> {
      _id,
      title,
      slug { current }
    },
    mainImage {
      ...,
      asset
    }
  }
}`

const fallbackRelatedPostsQuery = `*[_type == "post" && _id != $postId] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug { current },
  excerpt,
  publishedAt,
  readingTime,
  categories[] -> {
    _id,
    title,
    slug { current }
  },
  mainImage {
    ...,
    asset
  }
}`

async function getPostBySlug(slug: string) {
  return client.fetch<PostData | null>(postBySlugQuery, { slug })
}

async function getFallbackRelatedPosts(postId: string) {
  return client.fetch<RelatedPostData[]>(fallbackRelatedPostsQuery, { postId })
}

function toImageSrc(image?: SanityImage, width = 1400) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl

  const hasIdentity = Boolean(image.asset?._ref || image.asset?._id)
  if (!hasIdentity) return undefined

  try {
    return urlFor(image).width(width).fit('max').url()
  } catch {
    return undefined
  }
}

function isBlockNode(node: PortableTextNode): node is PortableTextBlockNode {
  return node?._type === 'block'
}

function extractBlockText(block: PortableTextBlockNode) {
  return (block.children ?? [])
    .map((child) => child.text ?? '')
    .join('')
    .trim()
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function buildToc(body: PortableTextNode[] = []) {
  const items: TocItem[] = []
  const headingIdByKey = new Map<string, string>()
  const used = new Map<string, number>()

  for (const node of body) {
    if (!isBlockNode(node)) continue

    const level = node.style === 'h2' || node.style === 'h3' ? node.style : undefined
    if (!level) continue

    const text = extractBlockText(node)
    if (!text) continue

    const base = slugify(text) || `section-${items.length + 1}`
    const count = (used.get(base) ?? 0) + 1
    used.set(base, count)
    const id = count === 1 ? base : `${base}-${count}`

    if (node._key) headingIdByKey.set(node._key, id)
    items.push({ id, text, level })
  }

  return { items, headingIdByKey }
}

function estimateReadingTime(body: PortableTextNode[] = []) {
  const text = body
    .filter(isBlockNode)
    .map(extractBlockText)
    .join(' ')
    .trim()

  if (!text) return 1
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function buildPortableTextComponents(headingIdByKey: Map<string, string>): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => (
        <p className="mb-7 text-lg leading-[1.85] text-slate-600 font-normal">{children}</p>
      ),
      h2: ({ children, value }) => {
        const key = (value as { _key?: string } | undefined)?._key
        const id = key ? headingIdByKey.get(key) : undefined

        return (
          <h2
            id={id}
            className="mt-14 mb-6 text-[2rem] leading-tight font-display font-extrabold tracking-tight text-slate-900 scroll-mt-32"
          >
            {children}
          </h2>
        )
      },
      h3: ({ children, value }) => {
        const key = (value as { _key?: string } | undefined)?._key
        const id = key ? headingIdByKey.get(key) : undefined

        return (
          <h3
            id={id}
            className="mt-10 mb-4 text-2xl leading-tight font-display font-bold tracking-tight text-slate-800 scroll-mt-32"
          >
            {children}
          </h3>
        )
      },
      h4: ({ children }) => (
        <h4 className="mt-8 mb-4 text-xl font-display font-bold text-slate-800">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-10 border-l-4 border-blue-500 ps-6 text-slate-600 text-xl leading-relaxed italic font-light">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="mb-8 space-y-3">{children}</ul>,
      number: ({ children }) => <ol className="mb-8 list-decimal ps-6 space-y-3">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="relative ps-6 text-slate-600 leading-relaxed before:content-['→'] before:absolute before:left-0 before:text-blue-500 before:font-bold">
          {children}
        </li>
      ),
      number: ({ children }) => <li className="ps-1 text-slate-600 leading-relaxed">{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      underline: ({ children }) => <span className="underline">{children}</span>,
      link: ({ children, value }) => {
        const href = getSafeHref((value as PortableTextLinkMark | undefined)?.href)
        if (!href) return <>{children}</>

        const className = 'text-orange-500 underline underline-offset-4 hover:text-orange-700 transition-colors'

        if (isExternalHref(href)) {
          return (
            <a href={href} className={className} target="_blank" rel="noreferrer">
              {children}
            </a>
          )
        }

        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        )
      },
      inlineProductRef: ({ children, value }) => {
        const mark = value as InlineProductMark | undefined
        const productTitle = mark?.product?.title?.trim()
        const label = children || productTitle || 'Recommended Product'
        const slug = mark?.product?.slug?.current?.trim()
        const href = slug ? `/products/${slug}` : undefined
        const content = (
          <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-sm font-semibold text-blue-700 align-baseline">
            {label}
            <Icon icon="arrow-right" className="h-3 w-3" />
          </span>
        )

        if (!href) return content

        return (
          <Link href={href} className="no-underline hover:opacity-90 transition-opacity">
            {content}
          </Link>
        )
      },
    },
    types: {
      image: ({ value }) => {
        const image = value as PortableTextImageNode
        if (!image?.asset) return null

        const imageSrc = toImageSrc(image as SanityImage, 1400)
        if (!imageSrc) return null

        const width = image.asset.metadata?.dimensions?.width ?? 1400
        const height = image.asset.metadata?.dimensions?.height ?? 900
        const hasLqip = Boolean(image.asset.metadata?.lqip)

        return (
          <figure className="my-12">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <Image
                src={imageSrc}
                alt={image.alt || 'Post image'}
                width={width}
                height={height}
                className="w-full h-auto object-cover"
                placeholder={hasLqip ? 'blur' : 'empty'}
                blurDataURL={image.asset.metadata?.lqip}
              />
            </div>
            {image.alt && <figcaption className="mt-3 text-center text-xs text-slate-500">{image.alt}</figcaption>}
          </figure>
        )
      },
      table: ({ value }) => {
        const table = value as PortableTextTableNode
        const rows = (table.rows ?? []).filter((row) => (row.cells?.length ?? 0) > 0)
        if (rows.length === 0) return null

        const maxCols = rows.reduce((max, row) => Math.max(max, row.cells?.length ?? 0), 0)
        const normalizedRows = rows.map((row) =>
          Array.from({ length: maxCols }, (_, idx) => row.cells?.[idx] ?? ''),
        )
        const header = normalizedRows[0]
        const bodyRows = normalizedRows.slice(1)

        return (
          <div className="my-12 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    {header.map((cell, idx) => (
                      <th
                        key={idx}
                        className="px-5 py-4 text-center text-xs md:text-sm font-black uppercase tracking-wider whitespace-nowrap"
                      >
                        {cell || '-'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-t border-slate-100">
                      {row.map((cell, cellIdx) => (
                        <td
                          key={`${rowIdx}-${cellIdx}`}
                          className="px-5 py-4 text-sm text-center text-slate-600 align-middle"
                        >
                          {cell || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      },
    },
  }
}

function resolveReadingTime(post: PostData) {
  if (typeof post.readingTime === 'number' && post.readingTime > 0) {
    return `${Math.round(post.readingTime)} Min Read`
  }
  return `${estimateReadingTime(post.body)} Min Read`
}

function normalizeRelatedPosts(posts: RelatedPostData[] = []) {
  return posts.filter((post) => Boolean(post.slug?.current))
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found | DoDoShark',
      description: 'The requested blog post is not available.',
      robots: { index: false, follow: false },
    }
  }

  const title = post.seo?.title?.trim() || post.title || 'DoDoShark Blog'
  const description =
    post.seo?.description?.trim() ||
    post.excerpt?.trim() ||
    'Industrial milling insights and engineering knowledge from DoDoShark.'
  const ogImage = toImageSrc(post.seo?.ogImage || post.mainImage, 1200)
  const canonical = post.seo?.canonicalUrl?.trim() || `/blogs/${post.slug?.current || slug}`

  return {
    title,
    description,
    keywords: post.seo?.keywords?.filter(Boolean),
    alternates: { canonical },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      images: ogImage ? [{ url: ogImage, alt: post.seo?.ogImage?.alt || post.mainImage?.alt || title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { items: tocItems, headingIdByKey } = buildToc(post.body)
  const components = buildPortableTextComponents(headingIdByKey)
  const mainImageSrc = toImageSrc(post.mainImage, 1600)
  const authorImageSrc = toImageSrc(post.author?.image, 200)
  const publishedDate = formatDate(post.publishedAt)
  const readingTimeLabel = resolveReadingTime(post)
  const categories = (post.categories ?? []).filter((category) => Boolean(category?.title))
  const directRelated = normalizeRelatedPosts(post.relatedPosts)
  const relatedPosts =
    directRelated.length > 0 ? directRelated.slice(0, 3) : normalizeRelatedPosts(await getFallbackRelatedPosts(post._id)).slice(0, 3)

  return (
    <div className="bg-slate-50 text-slate-900">
      <header className="pt-32 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {categories.map((category, idx) => (
                <span
                  key={category._id || idx}
                  className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {post.title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-8 leading-tight tracking-tight text-slate-900">
              {post.title}
            </h1>
          )}

          {post.excerpt && (
            <p className="text-xl text-slate-500 font-light leading-relaxed mb-10 max-w-3xl mx-auto">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6">
            {(post.author?.name || post.author?.role || authorImageSrc) && (
              <div className="flex items-center gap-3 text-left">
                {authorImageSrc && (
                  <Image
                    src={authorImageSrc}
                    alt={post.author?.image?.alt || post.author?.name || 'Author'}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                )}
                <div>
                  {post.author?.name && <p className="text-sm font-bold text-slate-900 m-0">{post.author.name}</p>}
                  {post.author?.role && <p className="text-xs text-slate-500 m-0">{post.author.role}</p>}
                </div>
              </div>
            )}

            {(publishedDate || readingTimeLabel) && (
              <>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div className="text-left text-xs uppercase tracking-widest font-bold text-slate-400 space-y-1">
                  {publishedDate && (
                    <p>
                      <Icon icon="calendar" className="h-4 w-4" /> {publishedDate}
                    </p>
                  )}
                  <p>
                    <Icon icon="clock" className="h-4 w-4" /> {readingTimeLabel}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {mainImageSrc && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -translate-y-6 relative z-10">
          <div className="aspect-video lg:aspect-[21/9] rounded-lg overflow-hidden shadow-2xl border-4 border-white bg-slate-800">
            <Image
              src={mainImageSrc}
              alt={post.mainImage?.alt || post.title || 'Post cover image'}
              width={1600}
              height={900}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          {tocItems.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">In This Article</h4>
                <nav className="space-y-4 text-sm text-slate-600">
                  {tocItems.map((item, idx) => (
                    <a
                      key={`${item.id}-${idx}`}
                      href={`#${item.id}`}
                      className={`block pl-4 border-l-2 transition-colors hover:text-orange-500 hover:border-orange-500 ${
                        item.level === 'h3' ? 'ml-3 text-slate-500 border-slate-100' : 'border-slate-200'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <article className={tocItems.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}>
            <div className="portable-text">
              <PortableText value={(post.body ?? []) as PortableTextBlock[]} components={components} />
            </div>
          </article>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-display font-black text-slate-900 mb-12 uppercase tracking-tight">
              Further Reading
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, idx) => {
                const href = relatedPost.slug?.current ? `/blogs/${relatedPost.slug.current}` : undefined
                const imageSrc = toImageSrc(relatedPost.mainImage, 900)
                const categoryTitle = relatedPost.categories?.[0]?.title || 'Blog'
                const relatedReadingTime = relatedPost.readingTime
                  ? `${Math.round(relatedPost.readingTime)} Min Read`
                  : undefined

                if (!href) return null

                return (
                  <Link key={relatedPost._id || idx} href={href} className="group">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6 bg-slate-100">
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={relatedPost.mainImage?.alt || relatedPost.title || 'Related post image'}
                          width={900}
                          height={675}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>

                    <div className="px-2">
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3 block">
                        {categoryTitle}
                      </span>
                      {relatedPost.title && (
                        <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {relatedPost.title}
                        </h4>
                      )}
                      {relatedPost.excerpt && (
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                      )}
                      {(relatedReadingTime || relatedPost.publishedAt) && (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <Icon icon="clock" className="mr-1 inline h-4 w-4" />{' '}
                          {relatedReadingTime || formatDate(relatedPost.publishedAt)}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

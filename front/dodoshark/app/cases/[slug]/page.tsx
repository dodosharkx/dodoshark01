import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity'

import { getSafeHref, isExternalHref } from '@/lib/safeHref'
import { fetchSanityData } from '@/lib/sanity.live'
import { cleanSlug, cleanText, renderSentenceCase, renderText, sanitizeAltText, toImageSrc } from '@/lib/sanity-utils'
import type { SanityAsset, SanityImage, SeoMeta } from '@/lib/types/sanity'
import Icon from '@/components/ui/Icon'

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>
}

type ContentTagData = {
  _id?: string
  title?: string
  slug?: { current?: string }
}

type CaseMetric = {
  label?: string
  value?: string
}

type PortableTextLinkMark = {
  _type?: 'link'
  href?: string
}

type PortableTextImageNode = {
  _type?: 'image'
  alt?: string
  caption?: string
  asset?: SanityAsset
}

type CaseEquipment = {
  _id?: string
  title?: string
  modelName?: string
  slug?: { current?: string }
  shortDescription?: string
  description?: string
  excerpt?: string
  image?: SanityImage
}

type CaseStudyData = {
  _id: string
  title?: string
  slug?: { current?: string }
  excerpt?: string
  location?: string
  seo?: SeoMeta
  coverImage?: SanityImage
  clientLogo?: SanityImage
  tags?: ContentTagData[]
  metrics?: CaseMetric[]
  body?: PortableTextBlock[]
  usedEquipment?: CaseEquipment[]
}

const caseBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  title,
  slug{current},
  excerpt,
  location,
  seo{
    title,
    description,
    keywords,
    canonicalUrl,
    noIndex,
    ogImage{
      ...,
      asset
    }
  },
  coverImage{
    ...,
    asset
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
  metrics[]{
    label,
    value
  },
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset
    }
  },
  usedEquipment[]->{
    _id,
    title,
    modelName,
    slug{current},
    shortDescription,
    description,
    excerpt,
    "image": coalesce(mainImage, image, coverImage, heroImage){
      ...,
      asset
    }
  }
}`

async function getCaseBySlug(slug: string, stega?: boolean) {
  try {
    return await fetchSanityData<CaseStudyData | null>({
      query: caseBySlugQuery,
      params: { slug },
      stega,
    })
  } catch (error) {
    console.error('Error fetching case study:', error)
    return null
  }
}

function buildPortableTextComponents(): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => (
        <p className="mb-7 text-lg leading-[1.85] text-slate-600 font-light">{children}</p>
      ),
      h2: ({ children }) => (
        <h2 className="mt-14 mb-6 text-[2rem] leading-tight font-display font-black tracking-tight text-slate-900">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-10 mb-5 text-2xl leading-tight font-display font-bold tracking-tight text-slate-800">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mt-8 mb-4 text-xl font-display font-bold text-slate-800">{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-10 rounded-r-2xl border-l-4 border-orange-500 bg-orange-50 px-6 py-5 text-slate-600 text-lg leading-relaxed italic">
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
        <li className="relative ps-6 text-slate-600 leading-relaxed before:content-['–'] before:absolute before:left-0 before:text-orange-500 before:font-black">
          {children}
        </li>
      ),
      number: ({ children }) => <li className="ps-1 text-slate-600 leading-relaxed">{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
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
    },
    types: {
      image: ({ value }) => {
        const image = value as PortableTextImageNode
        if (!image?.asset) return null

        const imageSrc = toImageSrc(image, 1400)
        if (!imageSrc) return null

        const width = image.asset.metadata?.dimensions?.width ?? 1400
        const height = image.asset.metadata?.dimensions?.height ?? 900
        const hasLqip = Boolean(image.asset.metadata?.lqip)

        return (
          <figure className="my-12">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <Image
                src={imageSrc}
                alt={sanitizeAltText(image.alt) || 'Case study image'}
                width={width}
                height={height}
                className="w-full h-auto object-cover"
                placeholder={hasLqip ? 'blur' : 'empty'}
                blurDataURL={image.asset.metadata?.lqip}
              />
            </div>
            {renderText(image.caption) && (
              <figcaption className="mt-3 text-center text-xs text-slate-500">
                {renderText(image.caption)}
              </figcaption>
            )}
          </figure>
        )
      },
    },
  }
}

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = await getCaseBySlug(slug, false)

  if (!caseStudy) {
    return {
      title: 'Case Not Found | DoDoShark',
      description: 'The requested case study is not available.',
      robots: { index: false, follow: false },
    }
  }

  const title = cleanText(caseStudy.seo?.title) || cleanText(caseStudy.title) || 'DoDoShark Case Study'
  const description =
    cleanText(caseStudy.seo?.description) ||
    cleanText(caseStudy.excerpt) ||
    'Discover how DoDoShark delivers measurable industrial processing outcomes.'
  const canonical = cleanText(caseStudy.seo?.canonicalUrl) || `/cases/${cleanSlug(caseStudy.slug) || slug}`
  const ogImage = toImageSrc(caseStudy.seo?.ogImage || caseStudy.coverImage, 1200)

  return {
    title,
    description,
    keywords: caseStudy.seo?.keywords?.filter(Boolean),
    alternates: { canonical },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'article',
      images: ogImage ? [{ url: ogImage, alt: sanitizeAltText(caseStudy.seo?.ogImage?.alt, caseStudy.coverImage?.alt, title) || title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { slug } = await params
  const caseStudy = await getCaseBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  const coverImageSrc = toImageSrc(caseStudy.coverImage, 1800)
  const clientLogoSrc = toImageSrc(caseStudy.clientLogo, 420)
  const usedEquipment = (caseStudy.usedEquipment && caseStudy.usedEquipment.length > 0)
    ? caseStudy.usedEquipment.filter(
        (item) => item?._id && (item?.title || item?.modelName),
      )
    : []
  const components = buildPortableTextComponents()
  const caseTags = (caseStudy.tags && caseStudy.tags.length > 0)
    ? caseStudy.tags.filter((item) => cleanText(item?.title) && cleanSlug(item?.slug))
    : []
  const tagMetaClassName =
    'inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/6 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.08em] text-slate-200 transition sm:text-xs'

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-800 pb-24 pt-28 text-white">
        {coverImageSrc && (
          <div className="absolute inset-0 opacity-30">
            <Image
              src={coverImageSrc}
              alt={sanitizeAltText(caseStudy.coverImage?.alt, renderText(caseStudy.title)) || 'Case cover image'}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/85 via-slate-800/70 to-slate-800" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-300">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Customer Cases</span>
          </div>
          {clientLogoSrc ? (
            <div className="mx-auto mt-8 w-full max-w-[220px] rounded-[1.5rem] border border-white/20 bg-white/92 px-4 py-3 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.95)] backdrop-blur-sm">
              <Image
                src={clientLogoSrc}
                alt={sanitizeAltText(caseStudy.clientLogo?.alt, renderText(caseStudy.title)) || 'Client logo'}
                width={176}
                height={56}
                sizes="176px"
                className="mx-auto h-10 w-auto object-contain"
                priority
              />
            </div>
          ) : null}
          {renderText(caseStudy.title) && (
            <h1 className="mb-8 mt-8 text-4xl font-display font-black leading-tight tracking-tight md:text-6xl">
              {renderText(caseStudy.title)}
            </h1>
          )}

          {(caseTags.length > 0 || renderText(caseStudy.location)) && (
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              {caseTags.map((tag) => (
                <Link
                  key={tag._id || tag.slug?.current}
                  href={`/cases?${new URLSearchParams({ tag: cleanSlug(tag.slug) ?? '' }).toString()}`}
                  className={`${tagMetaClassName} hover:border-orange-400/35 hover:bg-white/10 hover:text-white`}
                >
                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                  <span>{renderSentenceCase(tag.title)}</span>
                </Link>
              ))}
              {renderText(caseStudy.location) && (
                <div className={tagMetaClassName}>
                  <Icon icon="location" className="h-4 w-4 text-orange-400" />
                  <span>{renderText(caseStudy.location)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <article className="bg-white py-24">

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="portable-text">
            <PortableText value={(caseStudy.body && caseStudy.body.length > 0) ? caseStudy.body : []} components={components} />
          </div>
        </div>
      </article>

      {usedEquipment.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-12 text-center text-3xl font-display font-black uppercase tracking-tight text-slate-900">
              Related products in this Project
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
              {usedEquipment.map((item, idx) => {
                const href = cleanSlug(item.slug) ? `/products/${cleanSlug(item.slug)}` : undefined
                const imageSrc = toImageSrc(item.image, 900)
                const title = renderText(item.title) || renderText(item.modelName) || 'Equipment'
                const description = renderText(item.shortDescription) || renderText(item.description) || renderText(item.excerpt)
                const cardContent = (
                  <>
                    <div className="w-full flex-shrink-0 rounded-lg bg-slate-50 p-4 sm:w-1/3">
                      <div className="flex aspect-square items-center justify-center">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={sanitizeAltText(item.image?.alt, title) || title}
                            width={320}
                            height={320}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl text-slate-300">
                            <Icon icon="cubes" className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full sm:w-2/3">
                      <h4 className="mb-2 text-xl font-display font-black text-slate-900">{title}</h4>
                      {description && (
                        <p className="mb-4 text-sm font-light leading-relaxed text-slate-500">
                          {description}
                        </p>
                      )}
                      {href && (
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500">
                          View Product
                          <Icon icon="arrow-right" className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </>
                )

                if (!href) {
                  return (
                    <div
                      key={item._id || idx}
                      className="premium-card flex flex-col items-center gap-6 overflow-hidden p-6 shadow-md sm:flex-row"
                    >
                      {cardContent}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item._id || idx}
                    href={href}
                    className="premium-card flex flex-col items-center gap-6 overflow-hidden p-6 shadow-md transition-all hover:shadow-xl sm:flex-row"
                  >
                    {cardContent}
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

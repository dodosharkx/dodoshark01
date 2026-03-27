import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity'

import { getSafeHref, isExternalHref } from '@/app/lib/safeHref'
import { client } from '@/app/lib/sanity'
import { toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityAsset, SanityImage, SeoMeta } from '@/app/lib/types/sanity'
import Icon from '@/components/ui/Icon'

interface CaseDetailPageProps {
  params: Promise<{ slug: string }>
}

type CategoryData = {
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
  industry?: CategoryData
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
  industry->{
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

async function getCaseBySlug(slug: string) {
  return client.fetch<CaseStudyData | null>(caseBySlugQuery, { slug })
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
        <li className="relative ps-6 text-slate-600 leading-relaxed before:content-['•'] before:absolute before:left-0 before:text-orange-500 before:font-black">
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
                alt={image.alt || 'Case study image'}
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
    },
  }
}

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = await getCaseBySlug(slug)

  if (!caseStudy) {
    return {
      title: 'Case Not Found | DoDoShark',
      description: 'The requested case study is not available.',
      robots: { index: false, follow: false },
    }
  }

  const title = caseStudy.seo?.title?.trim() || caseStudy.title || 'DoDoShark Case Study'
  const description =
    caseStudy.seo?.description?.trim() ||
    caseStudy.excerpt?.trim() ||
    'Discover how DoDoShark delivers measurable industrial processing outcomes.'
  const canonical = caseStudy.seo?.canonicalUrl?.trim() || `/cases/${caseStudy.slug?.current || slug}`
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
      images: ogImage ? [{ url: ogImage, alt: caseStudy.seo?.ogImage?.alt || caseStudy.coverImage?.alt || title }] : undefined,
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
  const metrics = (caseStudy.metrics ?? []).filter((item) => item?.label || item?.value)
  const usedEquipment = (caseStudy.usedEquipment ?? []).filter(
    (item) => item?._id && (item?.title || item?.modelName),
  )
  const components = buildPortableTextComponents()

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-800 pb-40 pt-32 text-white">
        {coverImageSrc && (
          <div className="absolute inset-0 opacity-30">
            <Image
              src={coverImageSrc}
              alt={caseStudy.coverImage?.alt || caseStudy.title || 'Case cover image'}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/85 via-slate-800/70 to-slate-800" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
            customer cases
          </div>

          {caseStudy.title && (
            <h1 className="mb-8 text-4xl font-display font-black leading-tight tracking-tight md:text-6xl">
              {caseStudy.title}
            </h1>
          )}

          {(caseStudy.industry?.title || caseStudy.location) && (
            <div className="mb-8 flex flex-wrap justify-center gap-4">
              {caseStudy.industry?.title && (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Icon icon="industry" className="h-4 w-4 text-orange-400" />
                  <span>{caseStudy.industry.title}</span>
                </div>
              )}
              {caseStudy.location && (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Icon icon="location" className="h-4 w-4 text-orange-400" />
                  <span>{caseStudy.location}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <article className="bg-white py-24">

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="portable-text">
            <PortableText value={caseStudy.body ?? []} components={components} />
          </div>
        </div>
      </article>

      {usedEquipment.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-12 text-center text-3xl font-display font-black uppercase tracking-tight text-slate-900">
              Equipment Deployed in this Project
            </h3>

            <div className="grid gap-8 md:grid-cols-2">
              {usedEquipment.map((item, idx) => {
                const href = item.slug?.current ? `/products/${item.slug.current}` : undefined
                const imageSrc = toImageSrc(item.image, 900)
                const title = item.title || item.modelName || 'Equipment'
                const description = item.shortDescription || item.description || item.excerpt
                const cardContent = (
                  <>
                    <div className="w-full flex-shrink-0 rounded-lg bg-slate-50 p-4 sm:w-1/3">
                      <div className="flex aspect-square items-center justify-center">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={item.image?.alt || title}
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

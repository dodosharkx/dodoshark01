import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {createDataAttribute} from 'next-sanity'
import type {ReactNode} from 'react'

import dynamic from 'next/dynamic'
import { fetchSanityData } from '@/lib/sanity.live'
import {cleanSlug, cleanText, hasStegaMetadata, renderText, sanitizeAltText, toImageSrc} from '@/lib/sanity-utils'
import {
  prepareSolutionTemplate,
  type SolutionHtmlTemplateData,
} from '@/lib/solution-template'
import type {SanityImage, SeoMeta} from '@/lib/types/sanity'

const CardGridBlock = dynamic(() => import('@/components/page-builder/CardGridBlock'))
const CollectionReferenceBlock = dynamic(() => import('@/components/page-builder/CollectionReferenceBlock'))
const CtaBlock = dynamic(() => import('@/components/page-builder/CtaBlock'))
const FeatureListBlock = dynamic(() => import('@/components/page-builder/FeatureListBlock'))
const HeroBlock = dynamic(() => import('@/components/page-builder/HeroBlock'))
const MediaGalleryBlock = dynamic(() => import('@/components/page-builder/MediaGalleryBlock'))
const MergedRichFeatureSection = dynamic(() => import('@/components/page-builder/MergedRichFeatureSection'))
const MachineSelectorBlock = dynamic(() => import('@/components/page-builder/MachineSelectorBlock'))
const MetricsBlock = dynamic(() => import('@/components/page-builder/MetricsBlock'))
const PortableTextBlock = dynamic(() => import('@/components/page-builder/PortableTextBlock'))
const RichSectionBlock = dynamic(() => import('@/components/page-builder/RichSectionBlock'))
const ShowcaseBlock = dynamic(() => import('@/components/page-builder/ShowcaseBlock'))
const TableBlock = dynamic(() => import('@/components/page-builder/TableBlock'))

import type { CardGridBlockData } from '@/components/page-builder/CardGridBlock'
import type { CollectionReferenceBlockData } from '@/components/page-builder/CollectionReferenceBlock'
import type { CtaBlockData } from '@/components/page-builder/CtaBlock'
import type { FeatureListBlockData } from '@/components/page-builder/FeatureListBlock'
import type { HeroBlockData } from '@/components/page-builder/HeroBlock'
import type { MediaGalleryBlockData } from '@/components/page-builder/MediaGalleryBlock'
import type { MachineSelectorBlockData } from '@/components/page-builder/MachineSelectorBlock'
import type { MetricsBlockData } from '@/components/page-builder/MetricsBlock'
import type { PortableTextBlockData } from '@/components/page-builder/PortableTextBlock'
import type { RichSectionBlockData } from '@/components/page-builder/RichSectionBlock'
import type { ShowcaseBlockData } from '@/components/page-builder/ShowcaseBlock'
import type { TableBlockData } from '@/components/page-builder/TableBlock'

import {
  groupPageBuilderBlocks,
  type PageBuilderRenderGroup,
} from '@/components/page-builder/richFeatureMerge'
import SolutionHtmlTemplateFrame from '@/components/solutions/SolutionHtmlTemplateFrame'
import Icon from '@/components/ui/Icon'
import RelatedProductsSection from '@/components/solutions/RelatedProductsSection'
import RelatedVlogsSection from '@/components/solutions/RelatedVlogsSection'

export const runtime = 'nodejs'

interface SolutionPageProps {
  params: Promise<{slug: string}>
}

type CategoryData = {
  _id?: string
  title?: string
  slug?: {current?: string}
}

type FeatureGridItem = {
  _key?: string
  title?: string
  description?: string
  icon?: string
  image?: SanityImage
}

type VideoItem = {
  _key?: string
  title?: string
  url?: string
  thumbnail?: SanityImage
}

type FeatureGridBlock = {
  _type: 'featureGridBlock'
  _key?: string
  title?: string
  items?: FeatureGridItem[]
}

type VideoGalleryBlock = {
  _type: 'videoGalleryBlock'
  _key?: string
  title?: string
  videos?: VideoItem[]
}

type SolutionBlock =
  | HeroBlockData
  | RichSectionBlockData
  | FeatureListBlockData
  | MediaGalleryBlockData
  | MachineSelectorBlockData
  | CardGridBlockData
  | TableBlockData
  | MetricsBlockData
  | CtaBlockData
  | PortableTextBlockData
  | CollectionReferenceBlockData
  | ShowcaseBlockData
  | FeatureGridBlock
  | VideoGalleryBlock

type SolutionData = {
  _id: string
  seo?: SeoMeta
  title?: string
  slug?: {current?: string}
  summary?: string
  category?: CategoryData
  heroImage?: SanityImage
  detailRenderMode?: 'pageBuilder' | 'htmlTemplate'
  htmlTemplate?: SolutionHtmlTemplateData
  contentBlocks?: SolutionBlock[]
  relatedProducts?: any[]
  relatedVlogs?: any[]
}

function splitTitle(title?: string) {
  const displayTitle = renderText(title)
  if (!displayTitle) return {head: '', tail: ''}
  if (hasStegaMetadata(displayTitle)) {
    return {head: displayTitle, tail: ''}
  }

  const parts = displayTitle.split(/\s+/)
  const middle = Math.ceil(parts.length / 2)

  return {
    head: parts.slice(0, middle).join(' '),
    tail: parts.slice(middle).join(' '),
  }
}

async function getSolution(slug: string, stega?: boolean) {
  const query = `*[_type == "solution" && slug.current == $slug][0] {
    _id,
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
    title,
    slug { current },
    summary,
    detailRenderMode,
    htmlTemplate {
      html,
      customCss,
      templateImages[] {
        _key,
        key,
        image {
          ...,
          asset
        }
      }
    },
    category -> {
      _id,
      title,
      slug { current }
    },
    heroImage {
      ...,
      asset
    },
    contentBlocks[] {
      ...,
      backgroundImage {
        ...,
        asset
      },
      content[] {
        ...,
        _type == "image" => {
          ...,
          asset
        },
        _type == "productReference" => {
          ...,
          titleOverride,
          product->{
            _id,
            _type,
            title,
            name,
            modelName,
            slug { current },
            shortDescription,
            description,
            excerpt,
            mainImage { ..., asset },
            image { ..., asset },
            coverImage { ..., asset },
            heroImage { ..., asset }
          }
        }
      },
      media {
        ...,
        asset
      },
      mediaItems[] {
        ...,
        image {
          ...,
          asset
        }
      },
      images[] {
        ...,
        asset
      },
      items[] {
        ...,
        icon {
          ...,
          asset
        },
        image {
          ...,
          asset
        },
        logo {
          ...,
          asset
        },
        videoThumbnail {
          ...,
          asset
        }
      },
      footerCta {
        ...
      },
      videos[] {
        ...,
        thumbnail {
          ...,
          asset
        }
      },
      references[] {
        ...,
        reference->{
          _id,
          _type,
          title,
          name,
          modelName,
          slug { current },
          shortDescription,
          description,
          excerpt,
          mainImage { ..., asset },
          image { ..., asset },
          coverImage { ..., asset },
          heroImage { ..., asset }
        }
      },
      enableBannerOverlap,
      bannerImage {
        ...,
        asset
      },
      bannerOverlayColor,
      groups[] {
        ...,
        items[] {
          ...,
          productVariant->{
            _id,
            modelName,
            shortDescription,
            image {
              ...,
              asset
            }
          }
        }
      },
      defaultGroupIndex,
      maxItemsPerRow,
      showModelDescription,
      footerText,
      rows[] {
        ...,
        cards[] {
          ...,
          reference->{
            _id,
            _type,
            title,
            name,
            modelName,
            slug { current },
            shortDescription,
            description,
            excerpt,
            mainImage { ..., asset },
            image { ..., asset },
            coverImage { ..., asset },
            heroImage { ..., asset }
          },
          inlineCard {
            ...,
            image { ..., asset }
          }
        }
      }
    },
    relatedProducts[]->{
      _id,
      _type,
      title,
      name,
      modelName,
      slug { current },
      shortDescription,
      mainImage { ..., asset }
    },
    relatedVlogs[]->{
      _id,
      title,
      excerpt,
      youtubeUrl,
      thumbnail { ..., asset },
      category->{ title }
    }
  }`

  return fetchSanityData<SolutionData | null>({
    query,
    params: {slug},
    stega,
  })
}

async function getSolutionMetadata(slug: string) {
  const query = `*[_type == "solution" && slug.current == $slug][0] {
    _id,
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
    title,
    slug { current },
    summary,
    heroImage {
      ...,
      asset
    }
  }`

  return fetchSanityData<SolutionData | null>({
    query,
    params: {slug},
    stega: false,
  })
}

function wrapSolutionBlockForPresentation(documentId: string, blockKey: string | undefined, element: ReactNode) {
  if (!blockKey) return element

  const dataAttribute = createDataAttribute({
    id: documentId,
    type: 'solution',
    path: `contentBlocks[_key=="${blockKey}"]`,
  }).toString()

  return <div data-sanity={dataAttribute}>{element}</div>
}

function renderSolutionGroup(group: PageBuilderRenderGroup<SolutionBlock>, documentId: string) {
  if (group.kind === 'mergedRichFeature') {
    return wrapSolutionBlockForPresentation(
      documentId,
      group.richBlock._key ?? group.featureBlock._key,
      <MergedRichFeatureSection
        key={group.key}
        richBlock={group.richBlock}
        featureBlock={group.featureBlock}
      />
    )
  }

  const {block, key} = group

  if (block._type === 'heroBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <HeroBlock key={key} block={block} />)
  }

  if (block._type === 'richSectionBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <RichSectionBlock key={key} block={block} />)
  }

  if (block._type === 'featureListBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <FeatureListBlock key={key} block={block} />)
  }

  if (block._type === 'mediaGalleryBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <MediaGalleryBlock key={key} block={block} />)
  }

  if (block._type === 'machineSelectorBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <MachineSelectorBlock key={key} block={block} />)
  }

  if (block._type === 'cardGridBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <CardGridBlock key={key} block={block} />)
  }

  if (block._type === 'tableBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <TableBlock key={key} block={block} />)
  }

  if (block._type === 'metricsBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <MetricsBlock key={key} block={block} />)
  }

  if (block._type === 'ctaBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <CtaBlock key={key} block={block} />)
  }

  if (block._type === 'portableTextBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <PortableTextBlock key={key} block={block} />)
  }

  if (block._type === 'collectionReferenceBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <CollectionReferenceBlock key={key} block={block} />)
  }

  if (block._type === 'showcaseBlock') {
    return wrapSolutionBlockForPresentation(documentId, block._key, <ShowcaseBlock key={key} block={block} />)
  }

  if (block._type !== 'featureGridBlock' && block._type !== 'videoGalleryBlock') {
    return null
  }

  return wrapSolutionBlockForPresentation(
    documentId,
    block._key,
    <section key={key} className="bg-white py-16 text-slate-900 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {block._type === 'featureGridBlock' && (
          <div>
            {block.title && (
              <h2 className="text-3xl font-display font-black mb-12 text-center section-title relative inline-block uppercase tracking-tight left-1/2 -translate-x-1/2">
                {block.title}
              </h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {block.items?.map((item: FeatureGridItem, itemIdx: number) => {
                const featureImageSrc = toImageSrc(item.image, 800, {
                  height: 500,
                  fit: 'crop',
                })

                return (
                  <div
                    key={item._key ?? itemIdx}
                    className="bg-slate-50 rounded-lg p-8 premium-card"
                  >
                    <div className="w-14 h-14 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center mb-6">
                          <Icon icon={cleanText(item.icon) || 'gear'} className="h-5 w-5" />
                    </div>
                    {featureImageSrc && (
                      <div className="h-48 rounded-lg overflow-hidden mb-6 bg-white">
                        <Image
                          src={featureImageSrc}
                          alt={sanitizeAltText(item.image?.alt, item.title) || 'Feature image'}
                          width={800}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {item.title && (
                      <h3 className="text-xl font-display font-black mb-3">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {block._type === 'videoGalleryBlock' && (
          <div>
            {block.title && (
              <h2 className="text-3xl font-display font-black mb-12 text-center section-title relative inline-block uppercase tracking-tight left-1/2 -translate-x-1/2">
                {block.title}
              </h2>
            )}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {block.videos?.map((video: VideoItem, videoIdx: number) => {
                const videoThumbnailSrc = toImageSrc(video.thumbnail, 1280, {
                  height: 720,
                  fit: 'crop',
                })

                return (
                  <a
                    key={video._key ?? videoIdx}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    <div className="aspect-video bg-slate-800 rounded-lg relative overflow-hidden mb-4 shadow-xl">
                      {videoThumbnailSrc && (
                        <Image
                          src={videoThumbnailSrc}
                          alt={sanitizeAltText(video.thumbnail?.alt, video.title) || 'Video thumbnail'}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all text-white">
                          <Icon icon="play" className="ml-1 h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    {video.title && (
                      <h5 className="text-center font-bold font-display uppercase tracking-widest text-sm">
                        {video.title}
                      </h5>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function renderSolutionHero(solution: SolutionData) {
  const titleParts = splitTitle(solution.title)
  const heroImageSrc = toImageSrc(solution.heroImage, 1800, {height: 1200, fit: 'crop'})

  return (
    <section className="relative pt-32 pb-32 overflow-hidden bg-slate-800 text-white">
      {heroImageSrc && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={heroImageSrc}
            alt={sanitizeAltText(solution.heroImage?.alt, solution.title) || 'Solution hero image'}
            fill
            sizes="100vw"
            preload
            fetchPriority="high"
            loading="eager"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-800/40" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          {solution.category?.title && (
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-md text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-8">
              <Icon icon="seedling" className="h-4 w-4" />
              <span>{solution.category.title}</span>
            </div>
          )}

          {solution.title && (
            <h1 className="text-5xl md:text-7xl font-display font-black mb-8 leading-tight tracking-tight">
              {titleParts.head}
              {titleParts.tail && (
                <>
                  <br />
                  <span className="accent-gradient-text">{titleParts.tail}</span>
                </>
              )}
            </h1>
          )}

          {solution.summary && (
            <p className="text-xl text-slate-300 font-light leading-relaxed mb-12">
              {solution.summary}
            </p>
          )}

          <div className="flex flex-wrap gap-5">
            <Link
              href="#solution-content"
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md font-bold text-sm shadow-2xl transition-all"
            >
              Explore Solution
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-md font-bold text-sm backdrop-blur-md transition-all"
            >
              Talk to Engineers
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const {slug} = await params
  const solution = await getSolutionMetadata(slug)

  if (!solution) {
    return {
      title: 'Solution Not Found | DoDoShark',
      description: 'The requested solution page is not available.',
      robots: {index: false, follow: false},
    }
  }

  const title = cleanText(solution.seo?.title) || cleanText(solution.title) || 'DoDoShark Solution'
  const description =
    cleanText(solution.seo?.description) ||
    cleanText(solution.summary) ||
    'Explore DoDoShark industrial processing solutions and deployment details.'
  const canonical =
    cleanText(solution.seo?.canonicalUrl) || `/solutions/${cleanSlug(solution.slug) || slug}`
  const ogImage = toImageSrc(solution.seo?.ogImage || solution.heroImage, 1200, {
    height: 630,
    fit: 'crop',
  })

  return {
    title,
    description,
    keywords: solution.seo?.keywords?.filter(Boolean),
    alternates: {canonical},
    robots: {index: false, follow: false},
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage
        ? [{url: ogImage, alt: sanitizeAltText(solution.seo?.ogImage?.alt, solution.heroImage?.alt, title) || title}]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function SolutionPage({params}: SolutionPageProps) {
  const {slug} = await params
  const solution = await getSolution(slug)

  if (!solution) {
    notFound()
  }

  const contentBlocks = (solution.contentBlocks && solution.contentBlocks.length > 0)
    ? solution.contentBlocks.filter((block) => Boolean(block))
    : []
  const renderGroups = groupPageBuilderBlocks(contentBlocks)
  const hasBuilderHero = solution.contentBlocks?.some((block) => block?._type === 'heroBlock')
  const preparedTemplate =
    solution.detailRenderMode === 'htmlTemplate'
      ? await prepareSolutionTemplate(solution.htmlTemplate)
      : null

  if (solution.detailRenderMode === 'htmlTemplate' && preparedTemplate?.html) {
    return (
      <main className="bg-white text-slate-900">
        <SolutionHtmlTemplateFrame
          title={cleanText(solution.title) || 'Solution template'}
          srcDoc={preparedTemplate.html}
        />
        <RelatedProductsSection products={solution.relatedProducts || []} />
        <RelatedVlogsSection vlogs={solution.relatedVlogs || []} />
      </main>
    )
  }

  return (
    <div className="bg-white text-slate-900">
      {!hasBuilderHero && renderSolutionHero(solution)}
      <div id="solution-content">{renderGroups.map((group) => renderSolutionGroup(group, solution._id))}</div>
      <RelatedProductsSection products={solution.relatedProducts || []} />
      <RelatedVlogsSection vlogs={solution.relatedVlogs || []} />
    </div>
  )
}

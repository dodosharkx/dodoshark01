import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

import { draftMode } from 'next/headers'
import { getClient } from '@/app/lib/sanity'
import { toImageSrc } from '@/app/lib/sanity-utils'
import type { SanityImage, SeoMeta } from '@/app/lib/types/sanity'

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

import SectionHeader from '@/components/page-builder/SectionHeader'
import SectionShell from '@/components/page-builder/SectionShell'
import {
  groupPageBuilderBlocks,
  type PageBuilderRenderGroup,
} from '@/components/page-builder/richFeatureMerge'
import { bodyTextClass, cardTitleClass } from '@/components/page-builder/sectionStyles'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

type FeatureGridItem = {
  _key?: string
  title?: string
  description?: string
  image?: SanityImage
}

type VideoItem = {
  _key?: string
  title?: string
  url?: string
  thumbnail?: SanityImage
}

type FeatureGridBlockData = {
  _type: 'featureGridBlock'
  _key?: string
  title?: string
  items?: FeatureGridItem[]
}

type VideoGalleryBlockData = {
  _type: 'videoGalleryBlock'
  _key?: string
  title?: string
  videos?: VideoItem[]
}

type ProductBlock =
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
  | FeatureGridBlockData
  | VideoGalleryBlockData
  | { _type?: string; _key?: string }

type ProductData = {
  _id: string
  seo?: SeoMeta
  title?: string
  seriesTag?: string
  shortDescription?: string
  slug?: { current?: string }
  mainImage?: SanityImage
  contentBlocks?: ProductBlock[]
}

const productQuery = `*[_type == "product" && slug.current == $slug][0] {
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
  seriesTag,
  shortDescription,
  slug { current },
  mainImage {
    ...,
    asset
  },
  contentBlocks[] {
    ...,
    backgroundImage {
      ...,
      asset
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
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset
      },
      _type == "productReference" => {
        ...,
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
  }
}`

const productMetadataQuery = `*[_type == "product" && slug.current == $slug][0] {
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
  shortDescription,
  slug { current },
  mainImage {
    ...,
    asset
  }
}`

async function getProduct(slug: string, preview = false) {
  return getClient(preview).fetch<ProductData | null>(productQuery, { slug })
}

async function getProductMetadata(slug: string) {
  return getClient().fetch<ProductData | null>(productMetadataQuery, { slug })
}

function renderLegacyFeatureGrid(block: FeatureGridBlockData, key: string | number) {
  return (
    <SectionShell key={key} sectionClassName="bg-white text-slate-900">
      <div className="mb-10 md:mb-12">
        <SectionHeader title={block.title} />
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {block.items?.map((item, idx) => {
          const imageSrc = toImageSrc(item.image, 900)

          return (
            <div
              key={item._key ?? idx}
              className="premium-card rounded-lg bg-slate-50 p-8"
            >
              <div className="mb-6 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-white p-4">
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt={item.image?.alt || item.title || 'Feature image'}
                    width={500}
                    height={350}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <h3 className={`mb-3 ${cardTitleClass}`}>{item.title}</h3>
              <p className={`text-slate-500 ${bodyTextClass}`}>{item.description}</p>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}

function renderLegacyVideoGallery(block: VideoGalleryBlockData, key: string | number) {
  return (
    <SectionShell key={key} sectionClassName="bg-white text-slate-900">
      <div className="mb-10 md:mb-12">
        <SectionHeader title={block.title} />
      </div>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        {block.videos?.map((video, idx) => {
          const thumbnailSrc = toImageSrc(video.thumbnail, 1200)

          return (
            <div key={video._key ?? idx} className="group cursor-pointer">
              <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-slate-800 shadow-xl">
                {thumbnailSrc && (
                  <Image
                    src={thumbnailSrc}
                    alt={video.thumbnail?.alt || video.title || 'Video thumbnail'}
                    fill
                    className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white/20 text-white transition-all group-hover:scale-110 group-hover:bg-orange-500 backdrop-blur-md">
                    <svg className="ml-1 h-6 w-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h5 className="text-center text-sm font-semibold tracking-[0.16em] text-slate-700">
                {video.title}
              </h5>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}

function renderPageBuilderGroup(group: PageBuilderRenderGroup<ProductBlock>) {
  if (group.kind === 'mergedRichFeature') {
    return (
      <MergedRichFeatureSection
        key={group.key}
        richBlock={group.richBlock}
        featureBlock={group.featureBlock}
      />
    )
  }

  const { block, key } = group

  switch (block._type) {
    case 'heroBlock':
      return <HeroBlock key={key} block={block as HeroBlockData} />
    case 'richSectionBlock':
      return <RichSectionBlock key={key} block={block as RichSectionBlockData} />
    case 'featureListBlock':
      return <FeatureListBlock key={key} block={block as FeatureListBlockData} />
    case 'mediaGalleryBlock':
      return <MediaGalleryBlock key={key} block={block as MediaGalleryBlockData} />
    case 'machineSelectorBlock':
      return (
        <MachineSelectorBlock key={key} block={block as MachineSelectorBlockData} />
      )
    case 'cardGridBlock':
      return <CardGridBlock key={key} block={block as CardGridBlockData} />
    case 'tableBlock':
      return <TableBlock key={key} block={block as TableBlockData} />
    case 'metricsBlock':
      return <MetricsBlock key={key} block={block as MetricsBlockData} />
    case 'ctaBlock':
      return <CtaBlock key={key} block={block as CtaBlockData} />
    case 'portableTextBlock':
      return <PortableTextBlock key={key} block={block as PortableTextBlockData} />
    case 'collectionReferenceBlock':
      return (
        <CollectionReferenceBlock
          key={key}
          block={block as CollectionReferenceBlockData}
        />
      )
    case 'showcaseBlock':
      return <ShowcaseBlock key={key} block={block as ShowcaseBlockData} />
    case 'featureGridBlock':
      return renderLegacyFeatureGrid(block as FeatureGridBlockData, key)
    case 'videoGalleryBlock':
      return renderLegacyVideoGallery(block as VideoGalleryBlockData, key)
    default:
      return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {

  const { slug } = await params
  const product = await getProductMetadata(slug)

  if (!product) {
    return {
      title: 'Product Not Found | DoDoShark',
      description: 'The requested product page is not available.',
      robots: { index: false, follow: false },
    }
  }

  const title = product.seo?.title?.trim() || product.title || 'DoDoShark Product'
  const description =
    product.seo?.description?.trim() ||
    product.shortDescription?.trim() ||
    'Explore DoDoShark industrial processing equipment and machine details.'
  const canonical = product.seo?.canonicalUrl?.trim() || `/products/${product.slug?.current || slug}`
  const ogImage = toImageSrc(product.seo?.ogImage || product.mainImage, 1200)

  return {
    title,
    description,
    keywords: product.seo?.keywords?.filter(Boolean),
    alternates: { canonical },
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage
        ? [{ url: ogImage, alt: product.seo?.ogImage?.alt || product.mainImage?.alt || title }]
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

export default async function ProductPage({ params }: ProductPageProps) {
  const draft = await draftMode()
  const { slug } = await params
  const product = await getProduct(slug, draft.isEnabled)

  if (!product) {
    notFound()
  }

  const blocks = (product.contentBlocks ?? []).filter(Boolean)
  const renderGroups = groupPageBuilderBlocks(blocks)
  const hasBuilderHero = blocks.some((block) => block._type === 'heroBlock')
  const mainImageSrc = toImageSrc(product.mainImage, 1200)

  return (
    <div className="bg-white">
      {!hasBuilderHero && (
        <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-900">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                {product.seriesTag && (
                  <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-blue-100 rounded-md text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-8">
                    <i className="fas fa-bolt" /> <span>{product.seriesTag}</span>
                  </div>
                )}
                <h1 className="text-6xl md:text-7xl font-display font-black mb-8 leading-[1.05] tracking-tight">
                  {product.title}
                </h1>
                <p className="text-xl text-slate-500 mb-12 leading-relaxed font-light">
                  {product.shortDescription}
                </p>
              </div>

              <div className="relative">
                <div className="p-4 bg-white rounded-lg shadow-2xl overflow-hidden">
                  {mainImageSrc && (
                    <Image
                      src={mainImageSrc}
                      alt={product.mainImage?.alt || product.title || 'Product image'}
                      width={1000}
                      height={800}
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {renderGroups.map((group) => renderPageBuilderGroup(group))}
    </div>
  )
}


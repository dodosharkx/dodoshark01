import Image from 'next/image'
import { notFound } from 'next/navigation'

import { client, urlFor } from '@/app/lib/sanity'
import CardGridBlock, { type CardGridBlockData } from '@/components/page-builder/CardGridBlock'
import CollectionReferenceBlock, {
  type CollectionReferenceBlockData,
} from '@/components/page-builder/CollectionReferenceBlock'
import CtaBlock, { type CtaBlockData } from '@/components/page-builder/CtaBlock'
import FeatureListBlock, {
  type FeatureListBlockData,
} from '@/components/page-builder/FeatureListBlock'
import HeroBlock, { type HeroBlockData } from '@/components/page-builder/HeroBlock'
import MediaGalleryBlock, {
  type MediaGalleryBlockData,
} from '@/components/page-builder/MediaGalleryBlock'
import MergedRichFeatureSection from '@/components/page-builder/MergedRichFeatureSection'
import MachineSelectorBlock, {
  type MachineSelectorBlockData,
} from '@/components/page-builder/MachineSelectorBlock'
import MetricsBlock, { type MetricsBlockData } from '@/components/page-builder/MetricsBlock'
import PortableTextBlock, {
  type PortableTextBlockData,
} from '@/components/page-builder/PortableTextBlock'
import RichSectionBlock, {
  type RichSectionBlockData,
} from '@/components/page-builder/RichSectionBlock'
import ShowcaseBlock, {
  type ShowcaseBlockData,
} from '@/components/page-builder/ShowcaseBlock'
import SectionHeader from '@/components/page-builder/SectionHeader'
import SectionShell from '@/components/page-builder/SectionShell'
import TableBlock, { type TableBlockData } from '@/components/page-builder/TableBlock'
import {
  groupPageBuilderBlocks,
  type PageBuilderRenderGroup,
} from '@/components/page-builder/richFeatureMerge'
import { bodyTextClass, cardTitleClass } from '@/components/page-builder/sectionStyles'

interface ProductPageProps {
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
  title?: string
  seriesTag?: string
  shortDescription?: string
  slug?: { current?: string }
  mainImage?: SanityImage
  contentBlocks?: ProductBlock[]
}

const productQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id,
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
          "image": coalesce(mainImage, image, coverImage, heroImage),
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

async function getProduct(slug: string) {
  return client.fetch<ProductData | null>(productQuery, { slug })
}

function toImageSrc(image?: SanityImage, width = 1200) {
  if (!image) return undefined

  const directUrl = image?.asset?.url?.trim()
  if (directUrl) return directUrl

  const hasIdentity = Boolean(image?.asset?._ref || image?.asset?._id)
  if (!hasIdentity) return undefined

  try {
    return urlFor(image).width(width).fit('max').url()
  } catch {
    return undefined
  }
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

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

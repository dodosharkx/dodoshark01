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
import TableBlock, { type TableBlockData } from '@/components/page-builder/TableBlock'
import { mapFeatureBackgroundStyleToVariant } from '@/components/page-builder/backgroundTheme'

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
    media {
      ...,
      asset
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
      videoThumbnail {
        ...,
        asset
      }
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
    },
    nestedCardTitle,
    defaultGroupIndex,
    maxItemsPerRow,
    showModelDescription,
    footerText,
    nestedCards[] {
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
    },
    groups[] {
      ...,
      items[] {
        ...,
        productVariant->{
          _id,
          modelName,
          shortDescription,
          image { ..., asset }
        }
      },
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
      },
      topCards[] {
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
      },
      bottomCards[] {
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

function hasFeatureListHeader(block: FeatureListBlockData) {
  return Boolean(block.title?.trim())
}

function shouldMergeRichAndFeature(
  richBlock?: ProductBlock,
  featureBlock?: ProductBlock,
) {
  if (richBlock?._type !== 'richSectionBlock' || featureBlock?._type !== 'featureListBlock') {
    return false
  }

  const rich = richBlock as RichSectionBlockData
  const feature = featureBlock as FeatureListBlockData

  if (!feature.mergeWithPreviousRichSection) {
    return false
  }

  const richVariant = rich.backgroundVariant ?? 'default'
  const featureVariant = mapFeatureBackgroundStyleToVariant(feature.backgroundStyle ?? 'white')
  return richVariant === featureVariant
}

function renderLegacyFeatureGrid(block: FeatureGridBlockData, key: string | number) {
  return (
    <section key={key} className="py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24">
          <h2 className="text-3xl font-display font-black mb-12 text-center section-title relative inline-block uppercase tracking-tight left-1/2 -translate-x-1/2">
            {block.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {block.items?.map((item, idx) => {
              const imageSrc = toImageSrc(item.image, 900)

              return (
                <div
                  key={item._key ?? idx}
                  className="bg-slate-50 rounded-lg p-8 premium-card"
                >
                  <div className="h-48 rounded-lg overflow-hidden mb-6 bg-white flex items-center justify-center p-4">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt={item.image?.alt || item.title || 'Feature image'}
                        width={500}
                        height={350}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-display font-black mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function renderLegacyVideoGallery(block: VideoGalleryBlockData, key: string | number) {
  return (
    <section key={key} className="py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-black mb-12 text-center section-title relative inline-block uppercase tracking-tight left-1/2 -translate-x-1/2">
          {block.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {block.videos?.map((video, idx) => {
            const thumbnailSrc = toImageSrc(video.thumbnail, 1200)

            return (
              <div key={video._key ?? idx} className="group cursor-pointer">
                <div className="aspect-video bg-slate-800 rounded-lg relative overflow-hidden mb-4 shadow-xl">
                  {thumbnailSrc && (
                    <Image
                      src={thumbnailSrc}
                      alt={video.thumbnail?.alt || video.title || 'Video thumbnail'}
                      fill
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center group-hover:bg-orange-500 group-hover:scale-110 transition-all text-white">
                      <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h5 className="text-center font-bold font-display uppercase tracking-widest text-sm">
                  {video.title}
                </h5>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function renderPageBuilderBlock(block: ProductBlock, idx: number, blocks: ProductBlock[]) {
  const key = (block as { _key?: string })._key ?? idx
  const prevBlock = idx > 0 ? blocks[idx - 1] : undefined
  const nextBlock = idx < blocks.length - 1 ? blocks[idx + 1] : undefined
  const seamlessToNext = shouldMergeRichAndFeature(block, nextBlock)
  const seamlessFromPrev = shouldMergeRichAndFeature(prevBlock, block)

  switch (block._type) {
    case 'heroBlock':
      return <HeroBlock key={key} block={block as HeroBlockData} />
    case 'richSectionBlock':
      return (
        <RichSectionBlock
          key={key}
          block={block as RichSectionBlockData}
          seamlessToNext={seamlessToNext}
        />
      )
    case 'featureListBlock':
      return (
        <FeatureListBlock
          key={key}
          block={block as FeatureListBlockData}
          seamlessFromPrev={seamlessFromPrev}
        />
      )
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

      {blocks.map((block, idx) => renderPageBuilderBlock(block, idx, blocks))}
    </div>
  )
}

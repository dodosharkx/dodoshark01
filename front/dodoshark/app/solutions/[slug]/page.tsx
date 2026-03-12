import type { Metadata } from 'next'
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
import TableBlock, { type TableBlockData } from '@/components/page-builder/TableBlock'
import Icon from '@/components/ui/Icon'
import {
  groupPageBuilderBlocks,
  type PageBuilderRenderGroup,
} from '@/components/page-builder/richFeatureMerge'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface SolutionPageProps {
  params: Promise<{ slug: string }>
}

type SanityAsset = {
  _id?: string
  _ref?: string
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

type CategoryData = {
  _id?: string
  title?: string
  slug?: { current?: string }
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
  title?: string
  slug?: { current?: string }
  summary?: string
  category?: CategoryData
  heroImage?: SanityImage
  contentBlocks?: SolutionBlock[]
}

function splitTitle(title?: string) {
  if (!title) return { head: '', tail: '' }
  const parts = title.trim().split(/\s+/)
  const middle = Math.ceil(parts.length / 2)
  return {
    head: parts.slice(0, middle).join(' '),
    tail: parts.slice(middle).join(' '),
  }
}

async function getSolution(slug: string) {
  const query = `*[_type == "solution" && slug.current == $slug][0] {
    _id,
    title,
    slug { current },
    summary,
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

  return client.fetch<SolutionData | null>(query, { slug })
}

function toImageSrc(
  image?: SanityImage,
  width = 1200,
  options?: { height?: number; fit?: 'crop' | 'max' },
) {
  if (!image) return undefined

  const directUrl = image.asset?.url?.trim()
  if (directUrl) return directUrl

  const hasIdentity = Boolean(image.asset?._ref || image.asset?._id)
  if (!hasIdentity) return undefined

  try {
    let imageBuilder = urlFor(image).width(width)
    if (options?.height) {
      imageBuilder = imageBuilder.height(options.height)
    }
    return imageBuilder.fit(options?.fit ?? 'max').url()
  } catch {
    return undefined
  }
}

function renderSolutionGroup(group: PageBuilderRenderGroup<SolutionBlock>) {
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

  if (block._type === 'heroBlock') {
    return <HeroBlock key={key} block={block} />
  }

  if (block._type === 'richSectionBlock') {
    return <RichSectionBlock key={key} block={block} />
  }

  if (block._type === 'featureListBlock') {
    return <FeatureListBlock key={key} block={block} />
  }

  if (block._type === 'mediaGalleryBlock') {
    return <MediaGalleryBlock key={key} block={block} />
  }

  if (block._type === 'machineSelectorBlock') {
    return <MachineSelectorBlock key={key} block={block} />
  }

  if (block._type === 'cardGridBlock') {
    return <CardGridBlock key={key} block={block} />
  }

  if (block._type === 'tableBlock') {
    return <TableBlock key={key} block={block} />
  }

  if (block._type === 'metricsBlock') {
    return <MetricsBlock key={key} block={block} />
  }

  if (block._type === 'ctaBlock') {
    return <CtaBlock key={key} block={block} />
  }

  if (block._type === 'portableTextBlock') {
    return <PortableTextBlock key={key} block={block} />
  }

  if (block._type === 'collectionReferenceBlock') {
    return <CollectionReferenceBlock key={key} block={block} />
  }

  if (block._type === 'showcaseBlock') {
    return <ShowcaseBlock key={key} block={block} />
  }

  if (block._type !== 'featureGridBlock' && block._type !== 'videoGalleryBlock') {
    return null
  }

  return (
    <section key={key} className="py-24 bg-white text-slate-900">
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
                      <Icon icon={item.icon?.trim() || 'gear'} className="h-5 w-5" />
                    </div>
                    {featureImageSrc && (
                      <div className="h-48 rounded-lg overflow-hidden mb-6 bg-white">
                        <Image
                          src={featureImageSrc}
                          alt={item.image?.alt || item.title || 'Feature image'}
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
                          alt={video.thumbnail?.alt || video.title || 'Video thumbnail'}
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

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params
  const solution = await getSolution(slug)

  if (!solution) {
    notFound()
  }

  const contentBlocks = (solution.contentBlocks ?? []).filter(Boolean)
  const renderGroups = groupPageBuilderBlocks(contentBlocks)
  const hasBuilderHero = solution.contentBlocks?.some((block) => block?._type === 'heroBlock')
  const titleParts = splitTitle(solution.title)
  const heroImageSrc = toImageSrc(solution.heroImage, 1800, { height: 1200, fit: 'crop' })

  return (
    <div className="bg-white text-slate-900">
      {!hasBuilderHero && (
        <section className="relative pt-32 pb-32 overflow-hidden bg-slate-800 text-white">
          {heroImageSrc && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={heroImageSrc}
                alt={solution.heroImage?.alt || solution.title || 'Solution hero image'}
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
      )}

      <div id="solution-content">{renderGroups.map((group) => renderSolutionGroup(group))}</div>
    </div>
  )
}

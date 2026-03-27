import Image from 'next/image'
import Link from 'next/link'
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'

import { getSafeHref, isExternalHref } from '@/app/lib/safeHref'
import { urlFor } from '@/app/lib/sanity'
import type { SanityImage } from '@/app/lib/types/sanity'
import Icon from '@/components/ui/Icon'
import {
  getSharedBackgroundTheme,
  type SharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import SectionShell from './SectionShell'
import { bodyTextClass, cardTitleClass } from './sectionStyles'

type ProductReferenceDoc = {
  _id?: string
  title?: string
  slug?: { current?: string }
  shortDescription?: string
  mainImage?: SanityImage
}

type PortableTextNode = PortableTextBlock & {
  _type?: string
  image?: SanityImage
  product?: ProductReferenceDoc
  titleOverride?: string
}

export type PortableTextBlockData = {
  _type: 'portableTextBlock'
  _key?: string
  backgroundVariant?: SharedBackgroundVariant
  content?: PortableTextNode[]
}

function getPortableTextComponents(theme: SharedBackgroundTheme): PortableTextComponents {
  const textColor = theme.body
  const headingColor = theme.heading
  const blockQuoteClass = 'border-l-4 border-orange-400 bg-orange-50 text-slate-700'
  const listMarkerClass = 'marker:text-orange-500'
  const highlightClass = 'bg-orange-100 text-orange-800'
  const linkClass = 'text-orange-600 underline underline-offset-4 hover:text-orange-700'
  const mediaFrameClass = 'border-slate-200'
  const imageCaptionClass = theme.subtitle
  const productCardClass = `my-10 rounded-lg p-4 md:p-6 ${theme.surfaceElevated}`
  const productTitleClass = theme.heading
  const productDescriptionClass = theme.subtitle
  const productLinkClass = 'text-orange-600 font-bold text-sm hover:text-orange-700'
  const productImageFallbackClass = theme.surfaceMuted

  return {
    block: {
      normal: ({ children }) => (
        <p className={`mb-6 font-normal ${bodyTextClass} ${textColor}`}>
          {children}
        </p>
      ),
      h2: ({ children }) => (
        <h2 className={`mt-12 mb-6 text-2xl font-display font-extrabold tracking-[-0.02em] md:text-3xl ${headingColor}`}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className={`mt-10 mb-4 ${cardTitleClass} ${headingColor}`}>
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className={`text-xl font-display font-bold mt-8 mb-3 ${headingColor}`}>{children}</h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className={`my-8 px-5 py-4 italic ${blockQuoteClass}`}>
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`mb-6 ml-6 list-disc ${listMarkerClass} ${textColor} space-y-2`}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className={`mb-6 ml-6 list-decimal ${listMarkerClass} ${textColor} space-y-2`}>
          {children}
        </ol>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className={`font-bold ${headingColor}`}>{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      highlight: ({ children }) => (
        <span className={`px-1.5 py-0.5 rounded ${highlightClass}`}>{children}</span>
      ),
      link: ({ children, value }) => {
        const href = getSafeHref(value?.href as string | undefined)
        if (!href) return <>{children}</>

        if (isExternalHref(href)) {
          return (
            <a href={href} className={linkClass} target="_blank" rel="noreferrer">
              {children}
            </a>
          )
        }

        return (
          <Link href={href} className={linkClass}>
            {children}
          </Link>
        )
      },
    },
    types: {
      image: ({ value }) => {
        const image = value as SanityImage
        if (!image?.asset) return null

        const width = image.asset.metadata?.dimensions?.width ?? 1200
        const height = image.asset.metadata?.dimensions?.height ?? 800
        const hasLqip = Boolean(image.asset.metadata?.lqip)

        return (
          <figure className="my-10">
            <div className={`rounded-lg overflow-hidden border shadow-xl ${mediaFrameClass}`}>
              <Image
                src={urlFor(image).width(1400).fit('max').url()}
                alt={image.alt || 'Embedded image'}
                width={width}
                height={height}
                className="w-full h-auto object-cover"
                placeholder={hasLqip ? 'blur' : 'empty'}
                blurDataURL={image.asset.metadata?.lqip}
              />
            </div>
            {image.alt && (
              <figcaption className={`mt-3 text-center text-xs ${imageCaptionClass}`}>
                {image.alt}
              </figcaption>
            )}
          </figure>
        )
      },
      productReference: ({ value }) => {
        const data = value as {
          product?: ProductReferenceDoc
          titleOverride?: string
        }

        if (!data?.product) return null

        const title = data.titleOverride || data.product.title || 'Related Product'
        const href = data.product.slug?.current
          ? `/products/${data.product.slug.current}`
          : undefined

        return (
          <article className={productCardClass}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-56 shrink-0">
                <div className={`aspect-[4/3] rounded-lg overflow-hidden ${productImageFallbackClass}`}>
                  {data.product.mainImage?.asset && (
                    <Image
                      src={urlFor(data.product.mainImage).width(600).fit('max').url()}
                      alt={data.product.mainImage.alt || title}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h4 className={`mb-2 ${cardTitleClass} ${productTitleClass}`}>{title}</h4>
                {data.product.shortDescription && (
                  <p className={`mb-4 ${bodyTextClass} ${productDescriptionClass}`}>
                    {data.product.shortDescription}
                  </p>
                )}
                {href && (
                  <Link href={href} className={productLinkClass}>
                    View Product <Icon icon="arrow-right" className="ms-1 inline h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        )
      },
    },
  }
}

export default function PortableTextBlockComponent({
  block,
}: {
  block: PortableTextBlockData
}) {
  const variant = block.backgroundVariant ?? 'white'
  const theme = getSharedBackgroundTheme(variant)
  if (!block.content?.length) return null

  return (
    <SectionShell container="prose" sectionClassName={theme.section}>
      <article className="portable-text">
        <PortableText value={block.content} components={getPortableTextComponents(theme)} />
      </article>
    </SectionShell>
  )
}

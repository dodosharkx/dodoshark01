import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { client } from '@/app/lib/sanity'
import { firstParam, toImageSrc, type QueryParamValue } from '@/app/lib/sanity-utils'
import type { SeoMeta, SanityImage } from '@/app/lib/types/sanity'
import LandingCardPager, { type LandingCardItem } from '@/components/ui/LandingCardPager'

type CategoryItem = {
  _id?: string
  title?: string
  slug?: { current?: string }
}

type SolutionCard = {
  _id: string
  title?: string
  slug?: { current?: string }
  summary?: string
  heroImage?: SanityImage
  category?: CategoryItem
}

type SolutionsLandingData = {
  seo?: SeoMeta
  hero?: {
    badge?: string
    title?: string
    subtitle?: string
    image?: SanityImage
  }
  solutionCategories?: CategoryItem[]
}

type SolutionsPageProps = {
  searchParams: Promise<Record<string, QueryParamValue>>
}

const solutionsLandingQuery = `*[_type == "solutionsPage"][0]{
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
  solutionCategories[]->{
    _id,
    title,
    slug{current}
  }
}`

const solutionsListQuery = `*[
  _type == "solution"
  && defined(slug.current)
  && ($category == "" || category->slug.current == $category)
] | order(_createdAt desc){
  _id,
  title,
  slug{current},
  summary,
  heroImage{
    alt,
    asset
  },
  category->{
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

function parsePositiveInt(value: string | undefined, fallback = 1) {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

function buildHref({
  category,
  page,
}: {
  category?: string
  page?: number
}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/solutions?${query}` : '/solutions'
}

export async function generateMetadata(): Promise<Metadata> {
  const landing = await client.fetch<SolutionsLandingData | null>(solutionsLandingQuery)
  const seo = landing?.seo

  return {
    title: seo?.title || 'Industrial Solutions | DoDoShark',
    description: seo?.description || 'Explore material processing solutions across industries.',
    keywords: seo?.keywords,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: false, follow: false },
  }
}

export default async function SolutionsPage({ searchParams }: SolutionsPageProps) {
  const params = await searchParams
  const category = firstParam(params.category)?.trim() || ''
  const initialPage = parsePositiveInt(firstParam(params.page), 1)

  const landing = await client.fetch<SolutionsLandingData | null>(solutionsLandingQuery)

  const [solutions, fallbackCategories] = await Promise.all([
    client.fetch<SolutionCard[]>(solutionsListQuery, { category }),
    client.fetch<CategoryItem[]>(allCategoriesQuery),
  ])

  const configuredCategories = landing?.solutionCategories?.filter((item) => item?.slug?.current) ?? []
  const categories = configuredCategories.length > 0 ? configuredCategories : fallbackCategories
  const heroImageSrc = toImageSrc(landing?.hero?.image, 1800)
  const heroBadge = landing?.hero?.badge?.trim()
  const heroTitle = landing?.hero?.title?.trim()
  const heroSubtitle =
    landing?.hero?.subtitle?.trim() || 'Discover proven process flows for different materials and industries.'
  const solutionItems: LandingCardItem[] = solutions.map((item) => {
    const slug = item.slug?.current?.trim()

    return {
      id: item._id,
      href: slug ? `/solutions/${slug}` : '/solutions',
      title: item.title?.trim() || 'Solution',
      description: item.summary?.trim() || 'High-efficiency and stable industrial process design.',
      imageSrc: toImageSrc(item.heroImage, 900),
      imageAlt: item.heroImage?.alt || item.title || 'Solution image',
      tag: item.category?.title?.trim() || 'Solution',
    }
  })

  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      <section className="relative overflow-hidden bg-slate-800 pb-24 pt-32">
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt={landing?.hero?.image?.alt || 'Solutions hero'}
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {heroBadge && (
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              <i className="fas fa-microchip" aria-hidden />
              <span>{heroBadge}</span>
            </div>
          )}
          <h1 className="mb-8 text-5xl font-display font-black leading-tight tracking-tight text-white md:text-7xl">
            {heroTitle ? (
              heroTitle
            ) : (
              <>
                Material Processing <span className="accent-gradient-text">Solutions</span>
              </>
            )}
          </h1>
          <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-slate-400">{heroSubtitle}</p>
        </div>
      </section>

      <section id="solutions" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:overflow-visible md:px-0">
            <div className="inline-flex min-w-full gap-3 md:flex md:w-full md:flex-wrap md:justify-center">
              <Link
                href={buildHref({})}
                className={`shrink-0 whitespace-nowrap rounded-md border-2 px-5 py-2.5 text-[11px] font-black tracking-widest transition-all md:px-6 ${category
                    ? 'border-slate-200 text-slate-700 hover:border-slate-300'
                    : 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  }`}
              >
                All Solutions
              </Link>
              {categories.map((item) => {
                const slug = item.slug?.current
                if (!slug) return null
                const active = slug === category
                return (
                  <Link
                    key={item._id ?? slug}
                    href={buildHref({ category: slug })}
                    className={`shrink-0 whitespace-nowrap rounded-md border-2 px-5 py-2.5 text-[11px] font-black tracking-widest transition-all md:px-6 ${active
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    {item.title || slug}
                  </Link>
                )
              })}
            </div>
          </div>

          {solutions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
              No solutions found for the current filter.
            </div>
          ) : (
            <LandingCardPager
              items={solutionItems}
              initialPage={initialPage}
              pathname="/solutions"
              filterParamName="category"
              filterParamValue={category}
              emptyMessage="No solutions found for the current filter."
            />
          )}
        </div>
      </section>
    </main>
  )
}

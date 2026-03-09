import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MVP_CATEGORIES, MVP_CATEGORY_SLUGS, getCategoryBySlug } from '@/app/lib/mvp-data'

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return MVP_CATEGORY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Product Not Found | DoDoShark',
      description: 'Requested product category is not available.',
    }
  }

  return {
    title: `${category.shortName} | DoDoShark`,
    description: category.description,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  return (
    <main className="bg-[#fcfdfd] py-14 text-slate-900 sm:py-20">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="text-sm font-semibold text-slate-600 underline underline-offset-4">
          ← Back to Products
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">{category.tag}</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{category.name}</h1>
        <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">{category.description}</p>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Best Fit</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{category.bestFor}</p>

          <h3 className="mt-6 text-base font-semibold text-slate-900">Key Points</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {category.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <h3 className="mt-6 text-base font-semibold text-slate-900">Typical Applications</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {category.applications.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Representative Models</h2>
          <p className="mt-3 text-sm text-slate-600">{category.highlight}</p>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {category.specColumns.map((column) => (
                    <th key={column} className="px-4 py-3 font-semibold text-slate-700">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {category.specRows.map((row) => (
                  <tr key={row.join('|')} className="border-b border-slate-100">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-3 text-slate-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-10 flex max-w-7xl flex-wrap gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/video-demo"
          className="rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Book Video Demo for This Category
        </Link>
        <Link
          href="/contact"
          className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
        >
          Request Full Recommendation
        </Link>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Other Launch Categories</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MVP_CATEGORIES.filter((item) => item.slug !== category.slug).map((item) => (
            <Link
              key={item.slug}
              href={`/products/${item.slug}`}
              className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
            >
              {item.shortName}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

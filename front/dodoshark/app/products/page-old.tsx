import type { Metadata } from 'next'
import Link from 'next/link'

import { MVP_CATEGORIES } from '@/app/lib/mvp-data'
import ProductImageStrip from '@/components/products/ProductImageStrip'

export const metadata: Metadata = {
  title: 'Products | DoDoShark',
  description:
    'Factory-direct product scope: stainless steel claw mills, cast iron claw mills, roller crushers, and drum mixers.',
}

export default function ProductsPage() {
  return (
    <main className="bg-[#fcfdfd] py-16 text-slate-900 sm:py-20">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">MVP Product Catalog</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">4 Categories for Fast Launch</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          This initial version focuses on four core product categories for faster online launch and clearer sales
          communication.
        </p>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {MVP_CATEGORIES.map((item) => (
          <article key={item.slug} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="p-3">
              <ProductImageStrip images={[item.mainImage, ...item.galleryImages]} productName={item.name} />
            </div>

            <div className="border-t border-slate-100 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">{item.tag}</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{item.name}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>

              <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">Best for:</p>
                <p className="mt-1">{item.bestFor}</p>
              </div>

              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {item.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/products/${item.slug}`}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
                >
                  View Category Specs
                </Link>
                <Link
                  href="/video-demo"
                  className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Book Video Demo
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

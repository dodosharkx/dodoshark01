'use client'

import React from 'react'
import CollectionReferenceBlock, { 
  type CollectionReferenceBlockData 
} from '@/components/page-builder/CollectionReferenceBlock'
import type { SanityImage } from '@/lib/types/sanity'

type RelatedProductDoc = {
  _id: string
  _type: 'product'
  title?: string
  name?: string
  modelName?: string
  slug?: { current?: string }
  shortDescription?: string
  mainImage?: SanityImage
}

type RelatedProductsSectionProps = {
  products: RelatedProductDoc[]
}

export default function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  if (!products || products.length === 0) return null

  // Transform products into the format expected by CollectionReferenceBlock
  const blockData: CollectionReferenceBlockData = {
    _type: 'collectionReferenceBlock',
    title: 'Recommended Products',
    subtitle: 'Explore our precision-engineered equipment related to this solution.',
    backgroundVariant: 'lightGray',
    layout: products.length > 3 ? 'carousel' : 'grid',
    columns: 3,
    references: products.map((product) => ({
      _key: product._id,
      reference: product,
      isClickable: true,
    })),
  }

  return (
    <div id="related-products" className="border-t border-slate-100">
      <CollectionReferenceBlock block={blockData} />
    </div>
  )
}

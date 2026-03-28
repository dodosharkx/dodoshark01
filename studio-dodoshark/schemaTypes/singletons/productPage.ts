import {PackageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, pickText} from '../shared/studio'

export default defineType({
  name: 'productPage',
  title: 'Products Listing Page',
  type: 'document',
  icon: PackageIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'filters', title: 'Filters'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({name: 'hero', title: 'Hero Section', type: 'object', group: 'hero', fields: [defineField({name: 'badge', title: 'Badge', type: 'string'}), defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}), defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}), defineField({name: 'image', title: 'Hero Image', type: 'image', options: {hotspot: true}, fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}]})]}),
    defineField({name: 'productCategories', title: 'Product Category Filters', type: 'array', group: 'filters', of: [{type: 'reference', to: [{type: 'category'}]}], validation: (rule) => rule.unique(), description: 'Categories available as product filters.'}),
  ],
  preview: {select: {title: 'hero.title', subtitle: 'hero.subtitle', media: 'hero.image', categories: 'productCategories'}, prepare({title, subtitle, media, categories}) { return {title: title || 'Products Listing Page', subtitle: pickText(subtitle, itemCount(categories) ? `${itemCount(categories)} category filters` : undefined) || 'Product listing singleton', media} }},
})

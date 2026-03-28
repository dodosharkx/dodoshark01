import {CaseIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, pickText} from '../shared/studio'

export default defineType({
  name: 'casesPage',
  title: 'Case Studies Listing Page',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'filters', title: 'Filters'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({name: 'hero', title: 'Hero Section', type: 'object', group: 'hero', fields: [defineField({name: 'badge', title: 'Badge', type: 'string'}), defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}), defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}), defineField({name: 'image', title: 'Hero Image', type: 'image', options: {hotspot: true}, fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}]}), defineField({name: 'stats', title: 'Hero Stats', type: 'array', of: [{type: 'object', fields: [defineField({name: 'label', title: 'Label', type: 'string'}), defineField({name: 'value', title: 'Value', type: 'string'})], preview: {select: {title: 'label', subtitle: 'value'}}}]})]}),
    defineField({name: 'tagFilters', title: 'Tag Filters', type: 'array', group: 'filters', of: [{type: 'reference', to: [{type: 'contentTag'}]}], validation: (rule) => rule.unique(), description: 'Optional shared tags shown on the listing page. Leave empty to use all shared tags.'}),
  ],
  preview: {select: {title: 'hero.title', subtitle: 'hero.subtitle', media: 'hero.image', stats: 'hero.stats', tags: 'tagFilters'}, prepare({title, subtitle, media, stats, tags}) { return {title: title || 'Case Studies Listing Page', subtitle: pickText(subtitle, itemCount(tags) ? `${itemCount(tags)} tag filters` : undefined, itemCount(stats) ? `${itemCount(stats)} hero stats` : undefined) || 'Case studies listing singleton', media} }},
})

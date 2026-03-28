import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, pickText} from '../shared/studio'

export default defineType({
  name: 'blogPage',
  title: 'Vlog Listing Page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'filters', title: 'Filters'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({name: 'hero', title: 'Hero Section', type: 'object', group: 'hero', fields: [defineField({name: 'badge', title: 'Badge', type: 'string'}), defineField({name: 'title', title: 'Title', type: 'string', description: 'Main listing page heading.', validation: (rule) => rule.required()}), defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}), defineField({name: 'image', title: 'Hero Image', type: 'image', options: {hotspot: true}, fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}]})]}),
    defineField({name: 'tagFilters', title: 'Tag Filters', type: 'array', group: 'filters', of: [{type: 'reference', to: [{type: 'contentTag'}]}], validation: (rule) => rule.unique(), description: 'Optional shared tags shown in the vlog tag cloud. Leave empty to use all shared tags.'}),
  ],
  preview: {select: {title: 'hero.title', subtitle: 'hero.subtitle', media: 'hero.image', tags: 'tagFilters'}, prepare({title, subtitle, media, tags}) { return {title: title || 'Vlog Listing Page', subtitle: pickText(subtitle, itemCount(tags) ? `${itemCount(tags)} tag filters` : undefined) || 'Vlog listing singleton', media} }},
})

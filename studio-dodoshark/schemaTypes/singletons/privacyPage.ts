import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {itemCount, pickText} from '../shared/studio'

const sectionFields = [
  defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
  defineField({
    name: 'body',
    title: 'Paragraphs',
    type: 'array',
    of: [defineArrayMember({type: 'text', rows: 3})],
    validation: (rule) => rule.min(1),
  }),
]

export default defineType({
  name: 'privacyPage',
  title: 'Privacy Page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'content', title: 'Sections'},
    {name: 'cta', title: 'Bottom CTA'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated Label',
      type: 'string',
      group: 'hero',
      description: 'Example: March 4, 2026',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'content',
      title: 'Policy Content',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'block'})],
      description: 'The main rich text content of the privacy policy.',
    }),
    defineField({
      name: 'bottomCta',
      title: 'Bottom CTA',
      type: 'object',
      group: 'cta',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'buttonLabel', title: 'Button Label', type: 'string'}),
        defineField({name: 'buttonHref', title: 'Button Link', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
      lastUpdated: 'lastUpdated',
    },
    prepare({title, lastUpdated}) {
      return {
        title: title || 'Privacy Page',
        subtitle: lastUpdated ? `Last updated: ${lastUpdated}` : 'Privacy policy singleton',
      }
    },
  },
})

import {CaseIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, joinPreview, pickText} from '../shared/studio'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'basic', title: 'Basic', default: true},
    {name: 'content', title: 'Body'},
    {name: 'relations', title: 'Relations'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({name: 'title', title: 'Case Study Title', type: 'string', group: 'basic', description: 'Main case study title.', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'URL Slug', type: 'slug', group: 'basic', options: {source: 'title', maxLength: 96}, description: 'Used for the case study URL.', validation: (rule) => rule.required()}),
    defineField({name: 'coverImage', title: 'Cover Image', type: 'image', group: 'basic', description: 'Main image used in Studio previews and cards.', options: {hotspot: true}, fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}]}),
    defineField({name: 'industry', title: 'Industry', type: 'reference', to: [{type: 'category'}], group: 'basic', description: 'Legacy editorial metadata. No longer used for listing page filters.'}),
    defineField({name: 'tags', title: 'Shared Tags', type: 'array', group: 'basic', description: 'Used in /cases filters and shared with vlog videos.', of: [{type: 'reference', to: [{type: 'contentTag'}]}], validation: (rule) => rule.unique()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, group: 'basic', description: 'Short summary for cards and intros.'}),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'basic', description: 'Example: Thailand / Germany.'}),
    defineField({
      name: 'clientLogo',
      title: 'Client Logo',
      type: 'image',
      group: 'basic',
      description: 'Optional logo used on homepage case cards and other compact case previews.',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt Text'}],
    }),
    defineField({name: 'metrics', title: 'Metrics', type: 'array', group: 'basic', description: 'Detailed metrics for the case study body.', of: [{type: 'object', fields: [defineField({name: 'label', title: 'Label', type: 'string'}), defineField({name: 'value', title: 'Value', type: 'string'})], preview: {select: {title: 'label', subtitle: 'value'}}}]}),
    defineField({name: 'impactStats', title: 'Impact Stats', type: 'array', group: 'basic', description: 'High-level stats for listing cards.', of: [{type: 'object', fields: [defineField({name: 'label', title: 'Fallback Label', type: 'string'}), defineField({name: 'value', title: 'Value', type: 'string'})], preview: {select: {title: 'label', subtitle: 'value'}}}]}),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      description: 'Long-form case study content.',
      of: [
        {type: 'block', styles: [{title: 'Normal', value: 'normal'}, {title: 'H2', value: 'h2'}, {title: 'H3', value: 'h3'}, {title: 'H4', value: 'h4'}, {title: 'Quote', value: 'blockquote'}], marks: {decorators: [{title: 'Bold', value: 'strong'}, {title: 'Italic', value: 'em'}], annotations: [{name: 'link', type: 'object', title: 'Link', fields: [defineField({name: 'href', type: 'url', title: 'URL', validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})})]}]}, lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}]},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional visible text shown below the image on the case detail page.',
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Accessibility text for screen readers and SEO. This is not shown as a visible caption.',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({name: 'usedEquipment', title: 'Used Equipment', type: 'array', group: 'relations', description: 'Products referenced by this case study.', of: [{type: 'reference', to: [{type: 'product'}]}], validation: (rule) => rule.unique()}),
  ],
  preview: {
    select: {title: 'title', location: 'location', industryTitle: 'industry.title', firstTag: 'tags.0.title', excerpt: 'excerpt', metrics: 'impactStats', media: 'coverImage'},
    prepare({title, location, industryTitle, firstTag, excerpt, metrics, media}) {
      return {
        title: title || 'Untitled case study',
        subtitle: pickText(joinPreview([location, firstTag, industryTitle, itemCount(metrics) ? `${itemCount(metrics)} impact stats` : undefined]), excerpt) || 'Case study document',
        media,
      }
    },
  },
})

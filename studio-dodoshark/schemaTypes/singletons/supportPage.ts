import {BulbOutlineIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {joinPreview, pickText} from '../shared/studio'

function imageField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: 'image',
    description,
    options: {hotspot: true},
    fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text'})],
  })
}

export default defineType({
  name: 'supportPage',
  title: 'Support Page',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'content', title: 'Editable Text'},
    {name: 'images', title: 'Images'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({
      name: 'hero',
      title: 'Hero Content',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'text', rows: 2}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'serviceIntro',
      title: 'Service Intro',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
      ],
    }),
    defineField({
      name: 'serviceStages',
      title: 'Service Stages',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'id', title: 'Stage ID', type: 'string'}),
            defineField({name: 'phase', title: 'Phase', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
            defineField({
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
            imageField('image', 'Image', 'Image shown beside the service stage.'),
          ],
          preview: {select: {title: 'title', subtitle: 'phase', media: 'image'}},
        }),
      ],
    }),

    defineField({
      name: 'images',
      title: 'Page Images',
      type: 'object',
      group: 'images',
      fields: [
        imageField('heroBackground', 'Hero Background Image', 'Top hero background image.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
      media: 'images.heroBackground',
    },
    prepare({title, media}) {
      return {
        title: title || 'Support Page',
        subtitle: title ? 'Mapped hero content' : 'Support page image slots and key copy',
        media,
      }
    },
  },
})

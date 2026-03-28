import {BulbOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {joinPreview, pickText} from '../shared/studio'

function imageField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: 'image',
    description,
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        type: 'string',
        title: 'Alt Text',
        validation: (Rule) => Rule.required(),
      }),
    ],
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
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
      ],
    }),
    defineField({
      name: 'urgentAssistance',
      title: 'Urgent Assistance',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Bottom CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
        defineField({name: 'buttonLabel', title: 'Button Label', type: 'string'}),
        defineField({
          name: 'buttonHref',
          title: 'Button Link',
          type: 'string',
          description: 'Internal path like /contact or a full absolute URL.',
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
        imageField(
          'preSalesStageImage',
          'Pre-Sales Stage Image',
          'Image shown beside the Pre-Sales service stage.',
        ),
        imageField(
          'midSalesStageImage',
          'Mid-Sales Stage Image',
          'Image shown beside the Mid-Sales service stage.',
        ),
        imageField(
          'afterSalesStageImage',
          'After-Sales Stage Image',
          'Image shown beside the After-Sales service stage.',
        ),
        imageField(
          'supportTeamImage',
          'Support Team Image',
          'Image shown in the urgent assistance section.',
        ),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
      subtitle: 'urgentAssistance.title',
      media: 'images.heroBackground',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Support Page',
        subtitle:
          joinPreview([pickText(subtitle), pickText(title) ? 'Mapped hero content' : undefined]) ||
          'Support page image slots and key copy',
        media,
      }
    },
  },
})

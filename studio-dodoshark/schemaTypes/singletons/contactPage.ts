import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {pickText} from '../shared/studio'

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
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'content', title: 'Editable Text'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3}),
        imageField('backgroundImage', 'Background Image', 'Hero background image.'),
      ],
    }),
    defineField({
      name: 'showroom',
      title: 'Showroom Card',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        imageField('image', 'Image', 'Main showroom image shown beside the form.'),
      ],
    }),
    defineField({
      name: 'headquarters',
      title: 'Headquarters Card',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'note', title: 'Additional Note', type: 'text', rows: 2}),
      ],
    }),
    defineField({
      name: 'productionBases',
      title: 'Production Bases Card',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({
          name: 'cities',
          title: 'Cities',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
        }),
      ],
    }),
    defineField({
      name: 'directContact',
      title: 'Direct Contact Card',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'phone', title: 'Phone Number', type: 'string'}),
        defineField({name: 'email', title: 'Email Address', type: 'string'}),
        defineField({name: 'websiteLabel', title: 'Website Label', type: 'string'}),
        defineField({name: 'websiteUrl', title: 'Website URL', type: 'string'}),
      ],
    }),
    defineField({
      name: 'inquiryPanel',
      title: 'Inquiry Panel',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title', subtitle: 'inquiryPanel.title', media: 'hero.backgroundImage'},
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Contact Page',
        subtitle: pickText(subtitle) || 'Contact page singleton',
        media,
      }
    },
  },
})

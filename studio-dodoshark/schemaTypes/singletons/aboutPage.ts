import {InfoOutlineIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: InfoOutlineIcon,
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
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({name: 'titleLineOne', title: 'Title Line One', type: 'string'}),
        defineField({name: 'titleLineTwo', title: 'Title Line Two', type: 'string'}),
        defineField({name: 'titleLineThree', title: 'Title Line Three', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        imageField('image', 'Hero Image', 'Used in the page hero and Studio preview.'),
      ],
    }),
    defineField({
      name: 'storyCards',
      title: 'Story Cards',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 5}),
          ],
          preview: {select: {title: 'title', subtitle: 'subtitle'}},
        }),
      ],
    }),
    defineField({
      name: 'brandStoryTitle',
      title: 'Brand Story Title',
      type: 'string',
      group: 'content',
      description: 'Used in the brand story video card card.',
    }),
    defineField({
      name: 'brandStoryVideoUrl',
      title: 'Brand Story Video URL',
      type: 'url',
      group: 'content',
      validation: (rule) => rule.uri({scheme: ['https']}).warning('Use a valid HTTPS video URL.'),
    }),
    defineField({
      name: 'productSystemIntro',
      title: 'Product System Intro',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'titleLineOne', title: 'Title Line One', type: 'string'}),
        defineField({name: 'titleLineTwo', title: 'Title Line Two', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'buttonLabel', title: 'Button Label', type: 'string'}),
        defineField({name: 'buttonHref', title: 'Button Link', type: 'string'}),
      ],
    }),
    defineField({
      name: 'productSystems',
      title: 'Product Systems',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
            imageField('image', 'Image', 'Shown on the product system card.'),
          ],
          preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'globalLayout',
      title: 'Global Layout Section',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'badge', title: 'Badge', type: 'string'}),
        defineField({name: 'descriptionOne', title: 'Description One', type: 'text', rows: 4}),
        defineField({name: 'descriptionTwo', title: 'Description Two', type: 'text', rows: 4}),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'value', title: 'Value', type: 'string'}),
                defineField({name: 'label', title: 'Label', type: 'string'}),
              ],
              preview: {select: {title: 'label', subtitle: 'value'}},
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'timelineIntro',
      title: 'Timeline Intro',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'titleLineOne', title: 'Title Line One', type: 'string'}),
        defineField({name: 'titleLineTwo', title: 'Title Line Two', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline Items',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'year', title: 'Year', type: 'string'}),
            defineField({name: 'phase', title: 'Phase', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
            imageField('image', 'Image', 'Shown beside the timeline entry.'),
          ],
          preview: {select: {title: 'title', subtitle: 'year', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'timelineClosing',
      title: 'Timeline Closing Copy',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Bottom CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
        defineField({name: 'buttonLabel', title: 'Button Label', type: 'string'}),
        defineField({name: 'buttonHref', title: 'Button Link', type: 'string'}),
        defineField({name: 'joinUsTitle', title: 'Join Us Title', type: 'string'}),
        defineField({name: 'joinUsDescription', title: 'Join Us Description', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Page Images',
      type: 'object',
      group: 'images',
      fields: [
        imageField('brandStoryThumbnail', 'Brand Story Video Thumbnail', 'Thumbnail image shown on the brand story video card.'),
        imageField('globalLayoutBackgroundImage', 'Global Layout Background Image', 'Background image used in the global layout section.'),
        imageField('teamImage', 'Team Image', 'Image shown in the elite engineering team card.'),
        imageField('valuePropositionBackgroundImage', 'Value Proposition Background Image', 'Background image used in the value proposition section.'),
        imageField('joinUsImage', 'Join Us Image', 'Portrait image shown in the Join Our Journey card.'),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.titleLineOne',
      media: 'hero.image',
      ctaTitle: 'cta.title',
    },
    prepare({title, media, ctaTitle}) {
      return {
        title: title || 'About Page',
        subtitle: ctaTitle || 'About page singleton',
        media,
      }
    },
  },
})

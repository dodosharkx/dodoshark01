import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { itemCount } from '../shared/studio'

const imageField = defineArrayMember({
  name: 'heroBackgroundItem',
  title: 'Background Image',
  type: 'image',
  options: { hotspot: true },
  fields: [{ name: 'alt', type: 'string', title: 'Alt Text', validation: (rule: any) => rule.required() }],
})

function simpleImageField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
      }),
    ],
  })
}

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'sections', title: 'Sections' },
    { name: 'featured', title: 'Featured Content' },
    { name: 'video', title: 'Videos' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo' }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
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
      name: 'heroBackgrounds',
      title: 'Hero Background Images',
      type: 'array',
      group: 'hero',
      of: [imageField],
      validation: (rule) => rule.required().min(1).error('Please upload at least one hero background image.'),
    }),
    defineField({
      name: 'stats',
      title: 'Hero Stats',
      type: 'array',
      group: 'sections',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
    }),
    defineField({
      name: 'aboutFeatures',
      title: 'About Features',
      type: 'array',
      group: 'sections',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
            simpleImageField('image', 'Image'),
          ],
          preview: { select: { title: 'title', subtitle: 'description', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'confidenceSection',
      title: 'Confidence Section',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({ name: 'titleLineOne', title: 'Title Line One', type: 'string' }),
        defineField({ name: 'titleLineTwo', title: 'Title Line Two', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({
          name: 'cards',
          title: 'Cards',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
                defineField({
                  name: 'points',
                  title: 'Points',
                  type: 'array',
                  of: [defineArrayMember({ type: 'string' })],
                }),
                simpleImageField('image', 'Image'),
              ],
              preview: { select: { title: 'title', subtitle: 'subtitle', media: 'image' } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featuredAgriProducts',
      title: 'Featured Agri-Processing Products',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featuredFoodProducts',
      title: 'Featured Food Processing Products',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featuredSolutions',
      title: 'Featured Solutions',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'solution' }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featuredCases',
      title: 'Featured Cases',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'advantagesSection',
      title: 'Advantages Section',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
                simpleImageField('image', 'Image'),
              ],
              preview: { select: { title: 'title', subtitle: 'description', media: 'image' } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'whyChooseUsVideoUrl',
      title: 'Why Choose Us Video URL',
      type: 'url',
      group: 'video',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }).error('Please enter a valid HTTPS video URL.'),
    }),
    defineField({
      name: 'whyChooseUsVideoCoverImage',
      title: 'Why Choose Us Video Cover Image',
      type: 'image',
      group: 'video',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'featuredHomeVideos',
      title: 'Homepage Featured Videos',
      type: 'array',
      group: 'video',
      of: [
        {
          type: 'reference',
          to: [{ type: 'vlogItem' }],
          options: {
            filter: 'status == $status',
            filterParams: { status: 'published' },
          },
        },
      ],
      validation: (rule) => rule.unique(),
    }),
    simpleImageField('productsBannerImage', 'Wonderful Products Section Banner'),
    simpleImageField('solutionsBackgroundImage', 'Efficient Solutions Section Background'),
    simpleImageField('aboutUsLogoImage', 'Branding Logo (White)'),
  ],
  preview: {
    select: { media: 'heroBackgrounds.0', featuredHomeVideos: 'featuredHomeVideos', stats: 'stats' },
    prepare({ media, featuredHomeVideos, stats }) {
      const featuredCount = itemCount(featuredHomeVideos)
      const statCount = itemCount(stats)

      return {
        title: 'Home Page',
        subtitle:
          featuredCount > 0
            ? `Homepage singleton | ${featuredCount} featured videos | ${statCount} stats`
            : 'Homepage singleton',
        media,
      }
    },
  },
})

import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount} from '../shared/studio'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'featured', title: 'Featured Content'},
    {name: 'video', title: 'Videos'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Small label text shown above the main hero title.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'Primary hero heading shown on the homepage banner.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
      description: 'Secondary line shown under the main hero title.',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Supporting description text shown below the hero subtitle.',
    }),
    defineField({
      name: 'heroBackgrounds',
      title: 'Hero Background Images',
      description: 'Recommended: 2-5 images with a consistent style. At least one image is required.',
      type: 'array',
      group: 'hero',
      of: [{name: 'heroBackgroundItem', title: 'Background Image', type: 'image', options: {hotspot: true}, fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}]}],
      validation: (rule) => rule.required().min(1).error('Please upload at least one hero background image.'),
    }),
    defineField({
      name: 'featuredAgriProducts',
      title: 'Featured Agri-Processing Products',
      type: 'array',
      group: 'featured',
      description: 'Controls the homepage product cards shown in the Agri-Processing Machinery section.',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featuredFoodProducts',
      title: 'Featured Food Processing Products',
      type: 'array',
      group: 'featured',
      description: 'Controls the homepage product cards shown in the Food Processing Machinery section.',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featuredSolutions',
      title: 'Featured Solutions',
      type: 'array',
      group: 'featured',
      description: 'Controls the homepage solution cards and their order.',
      of: [{type: 'reference', to: [{type: 'solution'}]}],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featuredCases',
      title: 'Featured Cases',
      type: 'array',
      group: 'featured',
      description: 'Controls the homepage case study carousel items and their order.',
      of: [{type: 'reference', to: [{type: 'caseStudy'}]}],
      validation: (rule) => rule.unique(),
    }),
    defineField({name: 'whyChooseUsVideoUrl', title: 'Why Choose Us Video URL', type: 'url', group: 'video', description: 'Supports YouTube or Vimeo HTTPS links.', validation: (rule) => rule.required().uri({scheme: ['https']}).error('Please enter a valid HTTPS video URL.')}),
    defineField({
      name: 'featuredHomeVideos',
      title: 'Homepage Featured Videos',
      type: 'array',
      group: 'video',
      description: 'Controls the homepage bottom video carousel content and order.',
      of: [
        {
          type: 'reference',
          to: [{type: 'vlogItem'}],
          options: {
            filter: 'status == $status',
            filterParams: {status: 'published'},
          },
        },
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {media: 'heroBackgrounds.0', featuredHomeVideos: 'featuredHomeVideos'},
    prepare({media, featuredHomeVideos}) {
      const featuredCount = itemCount(featuredHomeVideos)

      return {
        title: 'Home Page',
        subtitle: featuredCount > 0 ? `Homepage singleton | ${featuredCount} featured videos` : 'Homepage singleton',
        media,
      }
    },
  },
})

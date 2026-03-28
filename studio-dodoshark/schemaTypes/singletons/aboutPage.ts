import {InfoOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

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
      fields: [imageField('image', 'Hero Image', 'Used in the page hero and Studio preview.')],
    }),
    defineField({
      name: 'brandStoryVideoUrl',
      title: 'Brand Story Video URL',
      type: 'url',
      group: 'content',
      description: 'YouTube or Vimeo HTTPS URL used by the brand story video card.',
      validation: (rule) =>
        rule.uri({scheme: ['https']}).warning('Use a valid HTTPS video URL.'),
    }),
    defineField({
      name: 'cta',
      title: 'Bottom CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
        }),
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
        imageField(
          'brandStoryThumbnail',
          'Brand Story Video Thumbnail',
          'Thumbnail image shown on the brand story video card.',
        ),
        imageField(
          'productSystemAgricultureImage',
          'Agriculture Product System Image',
          'Image shown for the agricultural processing machinery card.',
        ),
        imageField(
          'productSystemFoodImage',
          'Food Product System Image',
          'Image shown for the food processing machinery card.',
        ),
        imageField(
          'globalLayoutBackgroundImage',
          'Global Layout Background Image',
          'Background image used in the global layout section.',
        ),
        imageField(
          'teamImage',
          'Team Image',
          'Image shown in the elite engineering team card.',
        ),
        imageField(
          'valuePropositionBackgroundImage',
          'Value Proposition Background Image',
          'Background image used in the value proposition section.',
        ),
        imageField(
          'joinUsImage',
          'Join Us Image',
          'Portrait image shown in the Join Our Journey card.',
        ),
        imageField(
          'timelineStateOwnedHeritageImage',
          'Timeline: State-Owned Heritage Image',
          'Image shown for the State-Owned Heritage timeline item.',
        ),
        imageField(
          'timelineBrandFoundationImage',
          'Timeline: Brand Foundation Image',
          'Image shown for the Brand Foundation timeline item.',
        ),
        imageField(
          'timelineMarketRootsImage',
          'Timeline: Market Roots & Reputation Image',
          'Image shown for the Market Roots & Reputation timeline item.',
        ),
        imageField(
          'timelineDualTrackExpansionImage',
          'Timeline: Dual-Track Expansion Image',
          'Image shown for the Dual-Track Business Model timeline item.',
        ),
        imageField(
          'timelineAutomationUpgradeImage',
          'Timeline: Automation Upgrade Image',
          'Image shown for the Smart Automation Upgrades timeline item.',
        ),
        imageField(
          'timelineFutureOutlookImage',
          'Timeline: Future Outlook Image',
          'Image shown for the Industry Solution Provider timeline item.',
        ),
      ],
    }),
  ],
  preview: {
    select: {
      ctaTitle: 'cta.title',
      media: 'hero.image',
      videoUrl: 'brandStoryVideoUrl',
    },
    prepare({ctaTitle, media, videoUrl}) {
      return {
        title: 'About Page',
        subtitle:
          ctaTitle || (videoUrl ? 'Brand story video configured' : 'About page singleton'),
        media,
      }
    },
  },
})

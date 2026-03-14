import {SparklesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {itemCount, joinPreview, pickFirst} from '../../shared/studio'

type FeatureListItemValue = {
  image?: {asset?: unknown; alt?: string}
  icon?: {asset?: unknown}
}

function hasImageAsset(value?: {asset?: unknown}) {
  return Boolean(value?.asset)
}

export default defineType({
  name: 'featureListBlock',
  title: 'Feature List',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'mergeWithPreviousRichSection',
      title: 'Merge With Previous Rich Section',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable only when the previous block uses the centered media-grid Rich Section layout and matches the same background style.',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      hidden: ({parent}) => parent?.mergeWithPreviousRichSection === true,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const shouldMerge = (
            context.parent as {mergeWithPreviousRichSection?: boolean} | undefined
          )?.mergeWithPreviousRichSection

          if (shouldMerge && typeof value === 'string' && value.trim()) {
            return 'Clear the title when merging with the previous rich section.'
          }

          return true
        }),
    }),
    defineField({
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'string',
      initialValue: 'white',
      options: {
        list: [
          {title: 'White', value: 'white'},
          {title: 'Light Gray', value: 'lightGray'},
          {title: 'Blue Gradient Soft', value: 'blueGradientSoft'},
          {title: 'Blue Gradient Air', value: 'blueGradientAir'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Feature Items',
      type: 'array',
      of: [
        defineField({
          name: 'featureItem',
          title: 'Feature Item',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Card Image',
              type: 'image',
              options: {hotspot: true},
              description: 'Preferred for the standalone card layout.',
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  description: 'Describe the image for accessibility.',
                }),
              ],
              validation: (Rule) =>
                Rule.custom((value) => {
                  const image = value as {asset?: unknown; alt?: string} | undefined

                  if (image?.asset && !image.alt?.trim()) {
                    return 'Alt Text is required after uploading a card image.'
                  }

                  return true
                }),
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Fallback media when no card image is provided.',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
            }),
          ],
          validation: (Rule) =>
            Rule.custom((value) => {
              const item = value as FeatureListItemValue | undefined

              if (hasImageAsset(item?.image) || hasImageAsset(item?.icon)) {
                return true
              }

              return 'Add either a card image or an icon.'
            }),
          preview: {
            select: {
              title: 'title',
              image: 'image',
              icon: 'icon',
            },
            prepare({title, image, icon}) {
              return {
                title: title || 'Untitled feature item',
                subtitle: 'Feature item',
                media: pickFirst(image, icon),
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(3).max(6),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
      merged: 'mergeWithPreviousRichSection',
      backgroundStyle: 'backgroundStyle',
    },
    prepare({title, items, merged, backgroundStyle}) {
      const count = itemCount(items)
      const media = Array.isArray(items)
        ? pickFirst(...items.map((item) => pickFirst(item?.image, item?.icon)))
        : undefined

      return {
        title: title || 'Feature List',
        subtitle: merged
          ? `Merged with previous rich section | ${count} items`
          : joinPreview([backgroundStyle, `${count} items`]),
        media,
      }
    },
  },
})

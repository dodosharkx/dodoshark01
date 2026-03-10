import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'featureListBlock',
  title: 'Feature List',
  type: 'object',
  icon: () => '✨',
  fields: [
    defineField({
      name: 'mergeWithPreviousRichSection',
      title: 'Merge With Previous Rich Section',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable when this feature list should visually continue the previous rich section.',
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      hidden: ({ parent }) => parent?.mergeWithPreviousRichSection === true,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const shouldMerge = (context.parent as { mergeWithPreviousRichSection?: boolean } | undefined)
            ?.mergeWithPreviousRichSection

          if (shouldMerge && typeof value === 'string' && value.trim()) {
            return 'Clear section title when merging with the previous rich section.'
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
          { title: 'White', value: 'white' },
          { title: 'Light Gray', value: 'lightGray' },
          { title: 'Dark Gray', value: 'darkGray' },
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
              name: 'icon',
              title: 'Icon',
              type: 'image',
              description: 'Upload a transparent PNG-style icon image.',
              validation: (Rule) => Rule.required(),
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
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title }) {
              return {
                title: title || 'Untitled feature item',
                subtitle: 'Icon item',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(3).max(6),
    }),
  ],
  preview: {
    select: { title: 'title', itemCount: 'items', merged: 'mergeWithPreviousRichSection' },
    prepare({ title, itemCount, merged }) {
      const count = Array.isArray(itemCount) ? itemCount.length : 0
      const stateLabel = merged ? 'Merged with previous rich section' : `${count} item${count === 1 ? '' : 's'}`
      return {
        title: title || 'Feature List',
        subtitle: stateLabel,
      }
    },
  },
})

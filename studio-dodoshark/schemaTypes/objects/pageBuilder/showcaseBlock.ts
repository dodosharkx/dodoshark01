import { defineField, defineType } from 'sanity'

function requireAltText(value: unknown) {
  const image = value as { asset?: unknown; alt?: string } | undefined
  if (image?.asset && !image.alt?.trim()) {
    return '上传图片后必须填写 Alt Text（SEO）'
  }
  return true
}

export default defineType({
  name: 'showcaseBlock',
  title: 'Showcase Block',
  type: 'object',
  icon: () => '🎠',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'backgroundVariant',
      title: 'Background Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default (White)', value: 'default' },
          { title: 'Muted (Light Gray)', value: 'muted' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'muted',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Showcase Items',
      type: 'array',
      of: [
        defineField({
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'image',
              title: 'Main Image',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required().custom(requireAltText),
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.custom(requireAltText),
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'url',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            }),
            defineField({
              name: 'ctaLabel',
              title: 'CTA Label',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Showcase Item',
                subtitle: subtitle || 'No description',
                media,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({
      name: 'footerCta',
      title: 'Footer CTA',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Link URL',
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      itemCount: 'items',
    },
    prepare({ title, itemCount }) {
      const count = Array.isArray(itemCount) ? itemCount.length : 0
      return {
        title: title || 'Showcase Block',
        subtitle: `${count} showcase item${count === 1 ? '' : 's'}`,
      }
    },
  },
})

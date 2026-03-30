import {ThLargeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {iconForSchemaType, itemCount, joinPreview, pickFirst} from '../../shared/studio'

const cardFields = [
  defineField({
    name: 'cardType',
    title: 'Card Type',
    type: 'string',
    options: {
      list: [
        {title: 'Reference', value: 'reference'},
        {title: 'Inline', value: 'inline'},
      ],
    },
    description: 'Reference uses existing content. Inline stores content in this card item.',
    initialValue: 'reference',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    description: 'Leave blank to inherit the referenced title when possible.',
  }),
  defineField({
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 3,
    description: 'Optional supporting copy for both reference and inline cards.',
  }),
  defineField({
    name: 'clickable',
    title: 'Clickable',
    type: 'boolean',
    description: 'Disable when the card should not link anywhere.',
    initialValue: true,
  }),
  defineField({
    name: 'reference',
    title: 'Reference Item',
    type: 'reference',
    to: [{type: 'product'}, {type: 'caseStudy'}, {type: 'post'}, {type: 'solution'}],
    hidden: ({parent}) => parent?.cardType !== 'reference',
    validation: (rule) =>
      rule.custom((value, context) => {
        const cardType = (context.parent as {cardType?: string} | undefined)?.cardType
        if (cardType === 'reference' && !value) {
          return 'Reference Item is required when Card Type is Reference.'
        }
        return true
      }),
  }),
  defineField({
    name: 'inlineCard',
    title: 'Inline Card',
    type: 'object',
    hidden: ({parent}) => parent?.cardType !== 'inline',
    validation: (rule) =>
      rule.custom((value, context) => {
        const cardType = (context.parent as {cardType?: string} | undefined)?.cardType
        if (cardType === 'inline' && !value) {
          return 'Inline Card content is required when Card Type is Inline.'
        }
        return true
      }),
    fields: [
      defineField({
        name: 'image',
        type: 'image',
        title: 'Image',
        options: {hotspot: true},
        fields: [
          defineField({
            name: 'alt',
            type: 'string',
            title: 'Alt Text',
            description: 'Describe the image for accessibility.',
          }),
        ],
        validation: (rule) =>
          rule.custom((value) => {
            const image = value as {asset?: unknown; alt?: string} | undefined
            if (image?.asset && !image.alt?.trim()) {
              return 'Alt Text is required after uploading an image.'
            }
            return true
          }),
      }),
      defineField({
        name: 'cta',
        type: 'object',
        title: 'CTA',
        fields: [
          defineField({name: 'label', type: 'string', title: 'Label'}),
          defineField({
            name: 'href',
            type: 'url',
            title: 'Link',
            validation: (rule) =>
              rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']}),
          }),
        ],
      }),
    ],
  }),
]

const maxCardsPerRow = 12

const rowCardKeySelect = Object.fromEntries(
  Array.from({length: maxCardsPerRow}, (_, index) => [`cardKey${index}`, `cards.${index}._key`]),
)

function countSelectedKeys(source: Record<string, unknown>, prefix: string, size: number) {
  return Array.from({length: size}, (_, index) => source[`${prefix}${index}`]).filter(Boolean).length
}

const cardPreview = {
  select: {
    cardType: 'cardType',
    title: 'title',
    description: 'description',
    refType: 'reference._type',
    refTitle: 'reference.title',
    refName: 'reference.name',
    refModelName: 'reference.modelName',
    refMediaMain: 'reference.mainImage',
    refMediaImage: 'reference.image',
    refMediaCover: 'reference.coverImage',
    refMediaHero: 'reference.heroImage',
    inlineMedia: 'inlineCard.image',
  },
  prepare({
    cardType,
    title,
    description,
    refType,
    refTitle,
    refName,
    refModelName,
    refMediaMain,
    refMediaImage,
    refMediaCover,
    refMediaHero,
    inlineMedia,
  }: {
    cardType?: string
    title?: string
    description?: string
    refType?: string
    refTitle?: string
    refName?: string
    refModelName?: string
    refMediaMain?: unknown
    refMediaImage?: unknown
    refMediaCover?: unknown
    refMediaHero?: unknown
    inlineMedia?: unknown
  }) {
    const isReference = cardType === 'reference'
    const resolvedTitle = title || refTitle || refName || refModelName
    const media = isReference
      ? pickFirst(refMediaMain, refMediaImage, refMediaCover, refMediaHero) || iconForSchemaType(refType)
      : inlineMedia || ThLargeIcon

    return {
      title: resolvedTitle || (isReference ? 'Reference Item' : 'Inline Card'),
      subtitle: isReference ? description || `Reference | ${refType || 'unknown'}` : description || 'Inline card',
      media: media as never,
    }
  },
}

const rowPreview = {
  select: {
    title: 'title',
    cards: 'cards',
    ...rowCardKeySelect,
    inlineMedia: 'cards.0.inlineCard.image',
    inlineMedia2: 'cards.1.inlineCard.image',
    refMediaMain: 'cards.0.reference.mainImage',
    refMediaImage: 'cards.0.reference.image',
    refMediaCover: 'cards.0.reference.coverImage',
    refMediaHero: 'cards.0.reference.heroImage',
    refMediaMain2: 'cards.1.reference.mainImage',
    refMediaImage2: 'cards.1.reference.image',
    refMediaCover2: 'cards.1.reference.coverImage',
    refMediaHero2: 'cards.1.reference.heroImage',
  },
  prepare({
    title,
    cards,
    inlineMedia,
    inlineMedia2,
    refMediaMain,
    refMediaImage,
    refMediaCover,
    refMediaHero,
    refMediaMain2,
    refMediaImage2,
    refMediaCover2,
    refMediaHero2,
    ...selection
  }: {
    title?: string
    cards?: Array<{inlineCard?: {image?: unknown}; reference?: Record<string, unknown>}>
    inlineMedia?: unknown
    inlineMedia2?: unknown
    refMediaMain?: unknown
    refMediaImage?: unknown
    refMediaCover?: unknown
    refMediaHero?: unknown
    refMediaMain2?: unknown
    refMediaImage2?: unknown
    refMediaCover2?: unknown
    refMediaHero2?: unknown
    [key: string]: unknown
  }) {
    const count = countSelectedKeys(selection, 'cardKey', maxCardsPerRow) || itemCount(cards)
    const inlineMediaFallback = Array.isArray(cards)
      ? pickFirst(...cards.map((card) => card?.inlineCard?.image))
      : undefined
    const referenceMediaFallback = Array.isArray(cards)
      ? pickFirst(
          ...cards.flatMap((card) => [
            card?.reference?.mainImage,
            card?.reference?.image,
            card?.reference?.coverImage,
            card?.reference?.heroImage,
          ]),
        )
      : undefined

    return {
      title: title || `Row ${count || 0}`,
      subtitle: joinPreview([count ? `${count} cards` : 'No cards']),
      media: pickFirst(
        inlineMedia,
        inlineMedia2,
        inlineMediaFallback,
        refMediaMain,
        refMediaImage,
        refMediaCover,
        refMediaHero,
        refMediaMain2,
        refMediaImage2,
        refMediaCover2,
        refMediaHero2,
        referenceMediaFallback,
      ) as never,
    }
  },
}

export default defineType({
  name: 'cardGridBlock',
  title: 'Card Grid',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 2,
      description: 'Press Enter to control line breaks.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      description: 'Press Enter to control line breaks.',
    }),
    defineField({
      name: 'backgroundVariant',
      title: 'Background Style',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'white'},
          {title: 'Light Gray', value: 'lightGray'},
          {title: 'Blue Gradient Soft', value: 'blueGradientSoft'},
          {title: 'Blue Gradient Air', value: 'blueGradientAir'},
        ],
        layout: 'radio',
      },
      initialValue: 'lightGray',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'enableBannerOverlap',
      title: 'Enable Banner Overlap Layout',
      description: 'Use a banner image with overlapping content cards.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      hidden: ({parent}) => !parent?.enableBannerOverlap,
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility.',
        }),
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {enableBannerOverlap?: boolean} | undefined
          const image = value as {asset?: unknown; alt?: string} | undefined
          if (!parent?.enableBannerOverlap) return true
          if (image?.asset && !image.alt?.trim()) {
            return 'Alt Text is required after uploading a banner image.'
          }
          return true
        }),
    }),
    defineField({
      name: 'bannerOverlayColor',
      title: 'Banner Overlay Color',
      description: 'Example: rgba(15,23,42,0.45) or #0f172acc.',
      type: 'string',
      hidden: ({parent}) => !parent?.enableBannerOverlap,
      initialValue: 'rgba(15,23,42,0.45)',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      description: 'Add one or more card rows. Each row supports an optional title and 2 to 12 cards.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Row Title',
              type: 'text',
              rows: 2,
              description: 'Optional heading for this row. Press Enter to control line breaks.',
            }),
            defineField({
              name: 'cards',
              title: 'Cards',
              type: 'array',
              of: [{type: 'object', fields: cardFields, preview: cardPreview}],
              validation: (rule) => rule.required().min(2).max(12),
            }),
          ],
          preview: rowPreview,
        },
      ],
    }),
    defineField({
      name: 'disableCardFrameEffect',
      title: 'Disable Card Frame Effect',
      description: 'Removes card borders, radius and shadow effects.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      rows: 'rows',
      bannerEnabled: 'enableBannerOverlap',
      bannerImage: 'bannerImage',
      firstRowInlineMedia: 'rows.0.cards.0.inlineCard.image',
      firstRowInlineMedia2: 'rows.0.cards.1.inlineCard.image',
      firstRowRefMain: 'rows.0.cards.0.reference.mainImage',
      firstRowRefImage: 'rows.0.cards.0.reference.image',
      firstRowRefCover: 'rows.0.cards.0.reference.coverImage',
      firstRowRefHero: 'rows.0.cards.0.reference.heroImage',
      firstRowRefMain2: 'rows.0.cards.1.reference.mainImage',
      firstRowRefImage2: 'rows.0.cards.1.reference.image',
      firstRowRefCover2: 'rows.0.cards.1.reference.coverImage',
      firstRowRefHero2: 'rows.0.cards.1.reference.heroImage',
    },
    prepare({
      title,
      rows,
      bannerEnabled,
      bannerImage,
      firstRowInlineMedia,
      firstRowInlineMedia2,
      firstRowRefMain,
      firstRowRefImage,
      firstRowRefCover,
      firstRowRefHero,
      firstRowRefMain2,
      firstRowRefImage2,
      firstRowRefCover2,
      firstRowRefHero2,
    }: {
      title?: string
      rows?: Array<{
        cards?: Array<{
          inlineCard?: {image?: unknown}
          reference?: Record<string, unknown>
        }>
      }>
      bannerEnabled?: boolean
      bannerImage?: unknown
      firstRowInlineMedia?: unknown
      firstRowInlineMedia2?: unknown
      firstRowRefMain?: unknown
      firstRowRefImage?: unknown
      firstRowRefCover?: unknown
      firstRowRefHero?: unknown
      firstRowRefMain2?: unknown
      firstRowRefImage2?: unknown
      firstRowRefCover2?: unknown
      firstRowRefHero2?: unknown
    }) {
      const rowCount = itemCount(rows)
      const rowCardCounts = Array.isArray(rows)
        ? rows
            .map((row) => itemCount(row?.cards))
            .filter((count) => count > 0)
            .join(' / ')
        : ''

      const inlineMediaFallback = Array.isArray(rows)
        ? pickFirst(
            ...rows.flatMap((row) => (row?.cards ?? []).map((card) => card?.inlineCard?.image)),
          )
        : undefined
      const referenceMediaFallback = Array.isArray(rows)
        ? pickFirst(
            ...rows.flatMap((row) =>
              (row?.cards ?? []).flatMap((card) => [
                card?.reference?.mainImage,
                card?.reference?.image,
                card?.reference?.coverImage,
                card?.reference?.heroImage,
              ]),
            ),
          )
        : undefined

      return {
        title: title || 'Card Grid',
        subtitle:
          joinPreview([
            rowCount ? `${rowCount} rows` : undefined,
            rowCardCounts || undefined,
            bannerEnabled ? 'Banner overlap enabled' : undefined,
          ]) || 'Card grid block',
        media: pickFirst(
          bannerImage,
          firstRowInlineMedia,
          firstRowInlineMedia2,
          inlineMediaFallback,
          firstRowRefMain,
          firstRowRefImage,
          firstRowRefCover,
          firstRowRefHero,
          firstRowRefMain2,
          firstRowRefImage2,
          firstRowRefCover2,
          firstRowRefHero2,
          referenceMediaFallback,
        ) as never,
      }
    },
  },
})

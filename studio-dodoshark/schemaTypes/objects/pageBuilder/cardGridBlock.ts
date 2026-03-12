import {ThLargeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {iconForSchemaType, itemCount, joinPreview, pickFirst} from '../../shared/studio'

const cardFields = [
  defineField({name: 'cardType', title: 'Card Type', type: 'string', options: {list: [{title: 'Reference', value: 'reference'}, {title: 'Inline', value: 'inline'}]}, description: 'Reference uses existing content. Inline stores content in this card item.', initialValue: 'reference', validation: (rule) => rule.required()}),
  defineField({name: 'title', title: 'Title', type: 'string', description: 'Leave blank to inherit the referenced title when possible.'}),
  defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Optional supporting copy for both reference and inline cards.'}),
  defineField({name: 'clickable', title: 'Clickable', type: 'boolean', description: 'Disable when the card should not link anywhere.', initialValue: true}),
  defineField({name: 'reference', title: 'Reference Item', type: 'reference', to: [{type: 'product'}, {type: 'caseStudy'}, {type: 'post'}, {type: 'solution'}], hidden: ({parent}) => parent?.cardType !== 'reference', validation: (rule) => rule.custom((value, context) => { const cardType = (context.parent as {cardType?: string} | undefined)?.cardType; if (cardType === 'reference' && !value) return 'Reference Item is required when Card Type is Reference.'; return true })}),
  defineField({name: 'inlineCard', title: 'Inline Card', type: 'object', hidden: ({parent}) => parent?.cardType !== 'inline', validation: (rule) => rule.custom((value, context) => { const cardType = (context.parent as {cardType?: string} | undefined)?.cardType; if (cardType === 'inline' && !value) return 'Inline Card content is required when Card Type is Inline.'; return true }), fields: [defineField({name: 'image', type: 'image', title: 'Image', options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text', description: 'Describe the image for accessibility.'})], validation: (rule) => rule.custom((value) => { const image = value as {asset?: unknown; alt?: string} | undefined; if (image?.asset && !image.alt?.trim()) return 'Alt Text is required after uploading an image.'; return true })}), defineField({name: 'cta', type: 'object', title: 'CTA', fields: [defineField({name: 'label', type: 'string', title: 'Label'}), defineField({name: 'href', type: 'url', title: 'Link', validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})})]})]}),
]

const cardPreview = {
  select: {cardType: 'cardType', title: 'title', description: 'description', refType: 'reference._type', refTitle: 'reference.title', refName: 'reference.name', refModelName: 'reference.modelName', refMediaMain: 'reference.mainImage', refMediaImage: 'reference.image', refMediaCover: 'reference.coverImage', refMediaHero: 'reference.heroImage', inlineMedia: 'inlineCard.image'},
  prepare({cardType, title, description, refType, refTitle, refName, refModelName, refMediaMain, refMediaImage, refMediaCover, refMediaHero, inlineMedia}) {
    const isReference = cardType === 'reference'
    const resolvedTitle = title || refTitle || refName || refModelName
    const media = isReference ? pickFirst(refMediaMain, refMediaImage, refMediaCover, refMediaHero) || iconForSchemaType(refType) : inlineMedia || ThLargeIcon
    return {title: resolvedTitle || (isReference ? 'Reference Item' : 'Inline Card'), subtitle: isReference ? description || `Reference | ${refType || 'unknown'}` : description || 'Inline card', media}
  },
}

export default defineType({
  name: 'cardGridBlock',
  title: 'Card Grid',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'Default (White)', value: 'default'}, {title: 'Muted (Light Gray)', value: 'muted'}, {title: 'Dark', value: 'dark'}], layout: 'radio'}, initialValue: 'muted', validation: (rule) => rule.required()}),
    defineField({name: 'enableBannerOverlap', title: 'Enable Banner Overlap Layout', description: 'Use a banner image with overlapping content cards.', type: 'boolean', initialValue: false}),
    defineField({name: 'bannerImage', title: 'Banner Image', type: 'image', hidden: ({parent}) => !parent?.enableBannerOverlap, options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string', title: 'Alt Text', description: 'Describe the image for accessibility.'})], validation: (rule) => rule.custom((value, context) => { const parent = context.parent as {enableBannerOverlap?: boolean} | undefined; const image = value as {asset?: unknown; alt?: string} | undefined; if (!parent?.enableBannerOverlap) return true; if (image?.asset && !image.alt?.trim()) return 'Alt Text is required after uploading a banner image.'; return true })}),
    defineField({name: 'bannerOverlayColor', title: 'Banner Overlay Color', description: 'Example: rgba(15,23,42,0.45) or #0f172acc.', type: 'string', hidden: ({parent}) => !parent?.enableBannerOverlap, initialValue: 'rgba(15,23,42,0.45)'}),
    defineField({name: 'firstLineCardTitle', title: 'First Line Card Title', type: 'string', description: 'Optional heading for the first card row.'}),
    defineField({name: 'cards', title: 'Cards (Legacy)', description: 'Legacy first-row card structure.', type: 'array', of: [{type: 'object', fields: cardFields, preview: cardPreview}]}),
    defineField({name: 'nestedCards', title: 'Nested Cards', description: 'Unified card array for the current layout.', type: 'array', of: [{type: 'object', fields: cardFields, preview: cardPreview}], validation: (rule) => rule.max(12)}),
    defineField({name: 'nestedCardTitle', title: 'Nested Card Title', type: 'string', description: 'Optional heading for the nested card area.'}),
    defineField({name: 'disableCardFrameEffect', title: 'Disable Card Frame Effect', description: 'Removes card borders, radius and shadow effects.', type: 'boolean', initialValue: false}),
  ],
  preview: {
    select: {
      title: 'title',
      nestedCards: 'nestedCards',
      legacyCards: 'cards',
      bannerEnabled: 'enableBannerOverlap',
      bannerImage: 'bannerImage',
      nestedInlineMedia: 'nestedCards.0.inlineCard.image',
      nestedInlineMedia2: 'nestedCards.1.inlineCard.image',
      nestedRefMain: 'nestedCards.0.reference.mainImage',
      nestedRefImage: 'nestedCards.0.reference.image',
      nestedRefCover: 'nestedCards.0.reference.coverImage',
      nestedRefHero: 'nestedCards.0.reference.heroImage',
      nestedRefMain2: 'nestedCards.1.reference.mainImage',
      nestedRefImage2: 'nestedCards.1.reference.image',
      nestedRefCover2: 'nestedCards.1.reference.coverImage',
      nestedRefHero2: 'nestedCards.1.reference.heroImage',
      legacyInlineMedia: 'cards.0.inlineCard.image',
      legacyInlineMedia2: 'cards.1.inlineCard.image',
      legacyRefMain: 'cards.0.reference.mainImage',
      legacyRefImage: 'cards.0.reference.image',
      legacyRefCover: 'cards.0.reference.coverImage',
      legacyRefHero: 'cards.0.reference.heroImage',
      legacyRefMain2: 'cards.1.reference.mainImage',
      legacyRefImage2: 'cards.1.reference.image',
      legacyRefCover2: 'cards.1.reference.coverImage',
      legacyRefHero2: 'cards.1.reference.heroImage',
    },
    prepare({
      title,
      nestedCards,
      legacyCards,
      bannerEnabled,
      bannerImage,
      nestedInlineMedia,
      nestedInlineMedia2,
      nestedRefMain,
      nestedRefImage,
      nestedRefCover,
      nestedRefHero,
      nestedRefMain2,
      nestedRefImage2,
      nestedRefCover2,
      nestedRefHero2,
      legacyInlineMedia,
      legacyInlineMedia2,
      legacyRefMain,
      legacyRefImage,
      legacyRefCover,
      legacyRefHero,
      legacyRefMain2,
      legacyRefImage2,
      legacyRefCover2,
      legacyRefHero2,
    }) {
      const nestedLen = itemCount(nestedCards)
      const legacyLen = itemCount(legacyCards)
      const nestedInlineMediaFallback = Array.isArray(nestedCards)
        ? pickFirst(...nestedCards.map((card) => card?.inlineCard?.image))
        : undefined
      const legacyInlineMediaFallback = Array.isArray(legacyCards)
        ? pickFirst(...legacyCards.map((card) => card?.inlineCard?.image))
        : undefined

      return {
        title: title || 'Card Grid',
        subtitle:
          joinPreview([
            nestedLen ? `Nested cards: ${nestedLen}` : undefined,
            legacyLen ? `Legacy cards: ${legacyLen}` : undefined,
            bannerEnabled ? 'Banner overlap enabled' : undefined,
          ]) || 'Card grid block',
        media: pickFirst(
          bannerImage,
          nestedInlineMedia,
          nestedInlineMedia2,
          nestedInlineMediaFallback,
          nestedRefMain,
          nestedRefImage,
          nestedRefCover,
          nestedRefHero,
          nestedRefMain2,
          nestedRefImage2,
          nestedRefCover2,
          nestedRefHero2,
          legacyInlineMedia,
          legacyInlineMedia2,
          legacyInlineMediaFallback,
          legacyRefMain,
          legacyRefImage,
          legacyRefCover,
          legacyRefHero,
          legacyRefMain2,
          legacyRefImage2,
          legacyRefCover2,
          legacyRefHero2,
        ),
      }
    },
  },
})

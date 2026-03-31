import {ControlsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {iconForSchemaType, joinPreview, pickFirst, pickText} from '../../shared/studio'

export default defineType({
  name: 'machineSelectorBlock',
  title: 'Machine Selector',
  type: 'object',
  icon: ControlsIcon,
  fields: [
    defineField({name: 'title', title: 'Block Title', type: 'text', rows: 2, description: 'Press Enter to control line breaks.', initialValue: 'Model Reference'}),
    defineField({name: 'subtitle', title: 'Block Subtitle', type: 'text', rows: 2, description: 'Press Enter to control line breaks.'}),
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'White', value: 'white'}, {title: 'Light Gray', value: 'lightGray'}, {title: 'Blue Gradient Soft', value: 'blueGradientSoft'}, {title: 'Blue Gradient Air', value: 'blueGradientAir'}], layout: 'radio'}, initialValue: 'lightGray', validation: (rule) => rule.required()}),
    defineField({name: 'groups', title: 'Groups', description: 'Clicking a group tab reveals its related variants.', type: 'array', of: [defineField({name: 'group', title: 'Group', type: 'object', fields: [defineField({name: 'label', title: 'Group Label', type: 'string', validation: (rule) => rule.required()}), defineField({name: 'description', title: 'Group Description', type: 'string'}), defineField({name: 'items', title: 'Variants', type: 'array', of: [defineField({name: 'machineItem', title: 'Variant Item', type: 'object', fields: [defineField({name: 'productVariant', title: 'Product Variant', type: 'reference', to: [{type: 'productVariant'}], validation: (rule) => rule.required()}), defineField({name: 'modelLabel', title: 'Model Label Override', type: 'string', description: 'Leave empty to use the variant model name.'}), defineField({name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false})], preview: {select: {title: 'modelLabel', fallbackTitle: 'productVariant.modelName', mediaVariant: 'productVariant.image', description: 'productVariant.shortDescription', refType: 'productVariant._type'}, prepare({title, fallbackTitle, mediaVariant, description, refType}) { return {title: title || fallbackTitle || 'Untitled variant', subtitle: description || 'Variant item', media: pickFirst(mediaVariant, iconForSchemaType(refType))} }}})], validation: (rule) => rule.required().min(1).max(24)} )], preview: {select: {title: 'label', description: 'description'}, prepare({title, description}) { return {title: title || 'Untitled group', subtitle: pickText(description) || 'Group'} }}})], validation: (rule) => rule.required().min(1).max(8)}),
    defineField({name: 'defaultGroupIndex', title: 'Default Group Index', type: 'number', description: 'Starts from 0. Leave empty to default to the first group.', validation: (rule) => rule.min(0).integer()}),
    defineField({name: 'maxItemsPerRow', title: 'Max Items Per Row (Desktop)', type: 'number', description: 'Desktop slider shows 1-4 items per view.', options: {list: [1, 2, 3, 4]}, initialValue: 4, validation: (rule) => rule.required().min(1).max(4)}),
    defineField({name: 'showModelDescription', title: 'Show Model Description', type: 'boolean', description: 'Uses productVariant.shortDescription in cards.', initialValue: true}),
    defineField({
      name: 'imageZoom',
      title: 'Image Zoom (%)',
      type: 'number',
      description: 'Adjust the machine image scale. 100 is original, >100 zooms in.',
      initialValue: 108,
      validation: (Rule) => Rule.min(50).max(180),
    }),
    defineField({name: 'footerText', title: 'Footer Text', type: 'string', description: 'Optional note shown below the selector.'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      firstVariantImage: 'groups.0.items.0.productVariant.image',
      secondVariantImage: 'groups.0.items.1.productVariant.image',
      thirdVariantImage: 'groups.1.items.0.productVariant.image',
      fourthVariantImage: 'groups.1.items.1.productVariant.image',
      maxItemsPerRow: 'maxItemsPerRow',
      showModelDescription: 'showModelDescription',
    },
    prepare({
      title,
      subtitle,
      firstVariantImage,
      secondVariantImage,
      thirdVariantImage,
      fourthVariantImage,
      maxItemsPerRow,
      showModelDescription,
    }) {
      return {
        title: title || 'Machine Selector',
        subtitle:
          pickText(
            subtitle,
            joinPreview([
              maxItemsPerRow ? `${maxItemsPerRow} per row` : undefined,
              showModelDescription ? 'Descriptions on' : undefined,
            ]),
          ) || 'Machine selector block',
        media: pickFirst(
          firstVariantImage,
          secondVariantImage,
          thirdVariantImage,
          fourthVariantImage,
        ),
      }
    },
  },
})

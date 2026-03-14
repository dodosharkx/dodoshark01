import {BarChartIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, joinPreview} from '../../shared/studio'

export default defineType({
  name: 'metricsBlock',
  title: 'Metrics Block',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({name: 'title', title: 'Section Title', type: 'string'}),
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'White', value: 'white'}, {title: 'Light Gray', value: 'lightGray'}, {title: 'Blue Gradient Soft', value: 'blueGradientSoft'}, {title: 'Blue Gradient Air', value: 'blueGradientAir'}], layout: 'radio'}, initialValue: 'white', validation: (rule) => rule.required()}),
    defineField({name: 'items', title: 'Metric Items', type: 'array', description: 'Each item represents one metric card.', of: [{type: 'object', fields: [{name: 'value', title: 'Value', type: 'string', validation: (rule) => rule.required()}, {name: 'unit', title: 'Unit', type: 'string'}, {name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}, {name: 'icon', title: 'Icon Class', type: 'string', description: 'Example: fas fa-users'}], preview: {select: {value: 'value', label: 'label', unit: 'unit'}, prepare({value, label, unit}) { return {title: `${value}${unit || ''} - ${label}`} }}}]}),
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
      firstValue: 'items.0.value',
      firstUnit: 'items.0.unit',
      firstLabel: 'items.0.label',
      backgroundVariant: 'backgroundVariant',
    },
    prepare({title, items, firstValue, firstUnit, firstLabel, backgroundVariant}) {
      return {
        title: title || 'Metrics Block',
        subtitle:
          joinPreview([
            backgroundVariant,
            `${itemCount(items)} metric items`,
            firstValue && firstLabel ? `First: ${firstValue}${firstUnit || ''} ${firstLabel}` : undefined,
          ]) || 'Metrics block',
      }
    },
  },
})

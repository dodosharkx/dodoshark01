import {SparklesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, joinPreview, pickFirst} from '../../shared/studio'

export default defineType({
  name: 'featureListBlock',
  title: 'Feature List',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({name: 'mergeWithPreviousRichSection', title: 'Merge With Previous Rich Section', type: 'boolean', initialValue: false, description: 'Enable only when the previous block is a Rich Section with matching background style.'}),
    defineField({name: 'title', title: 'Section Title', type: 'string', hidden: ({parent}) => parent?.mergeWithPreviousRichSection === true, validation: (Rule) => Rule.custom((value, context) => { const shouldMerge = (context.parent as {mergeWithPreviousRichSection?: boolean} | undefined)?.mergeWithPreviousRichSection; if (shouldMerge && typeof value === 'string' && value.trim()) return 'Clear the title when merging with the previous rich section.'; return true })}),
    defineField({name: 'backgroundStyle', title: 'Background Style', type: 'string', initialValue: 'white', options: {list: [{title: 'White', value: 'white'}, {title: 'Light Gray', value: 'lightGray'}, {title: 'Dark Gray', value: 'darkGray'}], layout: 'radio'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'items', title: 'Feature Items', type: 'array', of: [defineField({name: 'featureItem', title: 'Feature Item', type: 'object', fields: [defineField({name: 'icon', title: 'Icon', type: 'image', description: 'Recommended: transparent PNG icon.', validation: (Rule) => Rule.required()}), defineField({name: 'title', title: 'Title', type: 'text', rows: 2, validation: (Rule) => Rule.required()}), defineField({name: 'description', title: 'Description', type: 'text', rows: 4})], preview: {select: {title: 'title', media: 'icon'}, prepare({title, media}) { return {title: title || 'Untitled feature item', subtitle: 'Feature item', media} }}})], validation: (Rule) => Rule.required().min(3).max(6)}),
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
        ? pickFirst(...items.map((item) => item?.icon))
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

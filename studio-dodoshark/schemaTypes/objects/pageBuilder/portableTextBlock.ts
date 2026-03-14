import {TextIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'
import {itemCount, joinPreview} from '../../shared/studio'

export default defineType({
  name: 'portableTextBlock',
  title: 'Portable Text Block',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'White', value: 'white'}, {title: 'Light Gray', value: 'lightGray'}, {title: 'Blue Gradient Soft', value: 'blueGradientSoft'}, {title: 'Blue Gradient Air', value: 'blueGradientAir'}], layout: 'radio'}, initialValue: 'white', validation: (rule) => rule.required()}),
    defineField({name: 'content', title: 'Rich Text Content', type: 'array', description: 'Use for longer editorial sections and flexible text layout.', of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}, {title: 'H2', value: 'h2'}, {title: 'H3', value: 'h3'}, {title: 'H4', value: 'h4'}, {title: 'Quote', value: 'blockquote'}], lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}], marks: {decorators: [{title: 'Bold', value: 'strong'}, {title: 'Italic', value: 'em'}, {title: 'Highlight', value: 'highlight'}]}}, {type: 'image', options: {hotspot: true}}, {type: 'object', name: 'productReference', title: 'Inline Product Reference', fields: [{name: 'product', type: 'reference', to: [{type: 'product'}]}, {name: 'titleOverride', type: 'string', title: 'Title Override'}]}]}),
  ],
  preview: {
    select: {
      content: 'content',
      backgroundVariant: 'backgroundVariant',
    },
    prepare({content, backgroundVariant}) {
      const imageCount = Array.isArray(content)
        ? content.filter((item) => item?._type === 'image').length
        : 0

      return {
        title: 'Portable Text Block',
        subtitle: joinPreview([
          backgroundVariant,
          itemCount(content) ? `${itemCount(content)} content blocks` : undefined,
          imageCount ? `${imageCount} images` : undefined,
        ]) || 'Flexible rich text container',
      }
    },
  },
})

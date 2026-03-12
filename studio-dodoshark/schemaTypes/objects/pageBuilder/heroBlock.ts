import {PresentationIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, joinPreview, pickFirst} from '../../shared/studio'

export default defineType({
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  icon: PresentationIcon,
  fields: [
    defineField({name: 'variant', title: 'Variant', type: 'string', options: {list: [{title: 'Legacy Background Slider', value: 'legacyBackgroundSlider'}, {title: 'Split Product Showcase', value: 'splitProductShowcase'}], layout: 'radio'}, description: 'Choose the hero layout style.', initialValue: 'legacyBackgroundSlider'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'images', title: 'Images', description: 'At least one image is required.', type: 'array', of: [{type: 'image', options: {hotspot: true}, fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}]}], validation: (rule) => rule.min(1)}),
    defineField({name: 'backgroundImage', title: 'Background Image', description: 'Used only by the split product showcase variant.', type: 'image', options: {hotspot: true}, hidden: ({parent}) => parent?.variant !== 'splitProductShowcase', validation: (rule) => rule.custom((value, context) => { if (context.parent?.variant === 'splitProductShowcase' && !value) return 'Background image is required for split product showcase.'; return true }), fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}]}),
    defineField({name: 'ctaButtons', title: 'CTA Buttons', type: 'array', of: [{type: 'object', fields: [{name: 'label', title: 'Label', type: 'string'}, {name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})}, {name: 'primary', title: 'Primary Button', type: 'boolean', initialValue: false}], preview: {select: {title: 'label', subtitle: 'href', primary: 'primary'}, prepare({title, subtitle, primary}) { return {title: title || 'Untitled button', subtitle: primary ? `Primary | ${subtitle || 'No link yet'}` : subtitle || 'Secondary button'} }}}]}),
    defineField({name: 'alignment', title: 'Alignment', type: 'string', hidden: ({parent}) => parent?.variant === 'splitProductShowcase', options: {list: [{title: 'Left', value: 'left'}, {title: 'Right', value: 'right'}], layout: 'radio'}, initialValue: 'left'}),
    defineField({name: 'mediaLayout', title: 'Media Layout', type: 'string', hidden: ({parent}) => parent?.variant !== 'splitProductShowcase', options: {list: [{title: 'Text Left / Image Right', value: 'textLeftImageRight'}, {title: 'Image Left / Text Right', value: 'imageLeftTextRight'}], layout: 'radio'}, initialValue: 'textLeftImageRight'}),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'images.0',
      backgroundImage: 'backgroundImage',
      variant: 'variant',
      images: 'images',
      ctaButtons: 'ctaButtons',
    },
    prepare({title, subtitle, media, backgroundImage, variant, images, ctaButtons}) {
      const variantLabel =
        variant === 'splitProductShowcase'
          ? 'Split product showcase'
          : 'Legacy background slider'

      return {
        title: title || 'Hero Block',
        subtitle:
          joinPreview([
            subtitle,
            variantLabel,
            itemCount(images) ? `${itemCount(images)} images` : undefined,
            itemCount(ctaButtons) ? `${itemCount(ctaButtons)} CTA buttons` : undefined,
          ]) || 'Hero block',
        media: pickFirst(media, backgroundImage),
      }
    },
  },
})

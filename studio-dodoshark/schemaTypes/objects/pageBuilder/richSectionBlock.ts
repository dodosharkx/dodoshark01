import {BlockContentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {itemCount, joinPreview, pickText} from '../../shared/studio'

export default defineType({
  name: 'richSectionBlock',
  title: 'Rich Section',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'body', title: 'Body Content', type: 'array', description: 'Rich text content displayed alongside the media area.', of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}, {title: 'H2', value: 'h2'}, {title: 'H3', value: 'h3'}]}]}),
    defineField({name: 'mediaItems', title: 'Media Items', type: 'array', description: 'The first image is used as the Studio preview thumbnail.', of: [defineArrayMember({title: 'Media Item', type: 'object', fields: [defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}), defineField({name: 'alt', type: 'string', title: 'Alt Text'}), defineField({name: 'caption', type: 'string', title: 'Caption'})], preview: {select: {image: 'image', title: 'caption', alt: 'alt'}, prepare({image, title, alt}) { return {title: title || alt || 'Media Item', media: image} }}})]}),
    defineField({name: 'layout', title: 'Layout', type: 'string', options: {list: [{title: 'Text Left / Media Right', value: 'textLeftMediaRight'}, {title: 'Media Left / Text Right', value: 'mediaLeftTextRight'}]}, initialValue: 'textLeftMediaRight', validation: (rule) => rule.required()}),
    defineField({name: 'disableMediaFrameEffect', title: 'Disable Media Frame Effect', type: 'boolean', description: 'Removes rounded corners and shadow styling from media.', initialValue: false}),
    defineField({name: 'backgroundVariant', title: 'Background Variant', type: 'string', options: {list: [{title: 'Default', value: 'default'}, {title: 'Muted', value: 'muted'}, {title: 'Dark', value: 'dark'}]}, initialValue: 'default'}),
    defineField({name: 'anchorId', title: 'Anchor ID', type: 'string', description: 'Example: features'}),
  ],
  preview: {
    select: {
      title: 'heading',
      layout: 'layout',
      media: 'mediaItems.0.image',
      mediaItems: 'mediaItems',
      subtitle: 'subtitle',
      disableMediaFrameEffect: 'disableMediaFrameEffect',
      body: 'body',
    },
    prepare({title, layout, media, mediaItems, subtitle, disableMediaFrameEffect, body}) {
      return {
        title: title || 'Rich Section',
        subtitle:
          pickText(
            subtitle,
            joinPreview([
              layout || 'textLeftMediaRight',
              itemCount(mediaItems) ? `${itemCount(mediaItems)} media items` : undefined,
              itemCount(body) ? `${itemCount(body)} body blocks` : undefined,
              disableMediaFrameEffect ? 'Frame effect off' : undefined,
            ]),
          ) || 'Rich section',
        media,
      }
    },
  },
})

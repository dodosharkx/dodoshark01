import {ImagesIcon, PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, joinPreview, pickFirst} from '../../shared/studio'

export default defineType({
  name: 'mediaGalleryBlock',
  title: 'Media Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'layout', title: 'Layout', type: 'string', options: {list: [{title: 'Carousel', value: 'carousel'}, {title: 'Thumbnail Gallery', value: 'thumbnailGallery'}, {title: 'Video Card Carousel', value: 'videoCardCarousel'}], layout: 'radio'}, description: 'Choose the frontend layout style.', initialValue: 'thumbnailGallery'}),
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'Default (White)', value: 'default'}, {title: 'Muted (Light Gray)', value: 'muted'}, {title: 'Dark', value: 'dark'}], layout: 'radio'}, initialValue: 'default', validation: (rule) => rule.required()}),
    defineField({name: 'cta', title: 'Section CTA', type: 'object', description: 'Optional CTA displayed near the section heading.', fields: [defineField({name: 'label', title: 'Button Label', type: 'string'}), defineField({name: 'href', title: 'Button Link', type: 'url', validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})})]}),
    defineField({name: 'items', title: 'Media Items', type: 'array', description: 'Items are rendered in the same order as listed here.', of: [{type: 'object', fields: [defineField({name: 'type', title: 'Media Type', type: 'string', options: {list: [{title: 'Image', value: 'image'}, {title: 'Video URL', value: 'videoUrl'}], layout: 'radio'}, initialValue: 'image', validation: (rule) => rule.required()}), defineField({name: 'image', title: 'Image', type: 'image', hidden: ({parent}) => parent?.type !== 'image', options: {hotspot: true}, fields: [{name: 'alt', title: 'Alt Text', type: 'string'}]}), defineField({name: 'videoUrl', title: 'Video URL', type: 'url', validation: (rule) => rule.uri({scheme: ['http', 'https']}), hidden: ({parent}) => parent?.type !== 'videoUrl'}), defineField({name: 'videoThumbnail', title: 'Video Thumbnail', type: 'image', hidden: ({parent}) => parent?.type !== 'videoUrl', options: {hotspot: true}, description: 'Optional thumbnail for video card layouts.'}), defineField({name: 'caption', title: 'Caption', type: 'string'}), defineField({name: 'metaText', title: 'Meta Text', type: 'string', description: 'Secondary text shown under the card title.'})], preview: {select: {type: 'type', caption: 'caption', image: 'image', videoThumbnail: 'videoThumbnail', videoUrl: 'videoUrl', metaText: 'metaText'}, prepare({type, caption, image, videoThumbnail, videoUrl, metaText}) { const isImage = type === 'image'; return {title: caption || (isImage ? 'Image item' : 'Video item'), subtitle: metaText || videoUrl || (isImage ? 'Image' : 'Video URL'), media: isImage ? image : videoThumbnail || PlayIcon} }}}]}),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
      items: 'items',
      firstImage: 'items.0.image',
      firstVideoThumbnail: 'items.0.videoThumbnail',
      ctaLabel: 'cta.label',
    },
    prepare({title, layout, items, firstImage, firstVideoThumbnail, ctaLabel}) {
      const media = Array.isArray(items)
        ? pickFirst(
            ...items.flatMap((item) => [item?.image, item?.videoThumbnail]),
            firstImage,
            firstVideoThumbnail,
          )
        : pickFirst(firstImage, firstVideoThumbnail)

      return {
        title: title || 'Media Gallery',
        subtitle: joinPreview([
          layout || 'thumbnailGallery',
          `${itemCount(items)} items`,
          ctaLabel ? 'CTA enabled' : undefined,
        ]),
        media,
      }
    },
  },
})

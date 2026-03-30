import {ImagesIcon, PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {joinPreview} from '../../shared/studio'

type StudioImageLike = {
  asset?: {
    _ref?: string
    _id?: string
    url?: string
  }
}

type MediaGalleryPreviewItem = {
  type?: 'image' | 'videoUrl'
  image?: StudioImageLike
  videoThumbnail?: StudioImageLike
  videoUrl?: string
}

function hasImageAsset(image?: StudioImageLike): boolean {
  return Boolean(image?.asset?._ref || image?.asset?._id || image?.asset?.url)
}

function hasVideoUrl(url?: string): boolean {
  return Boolean(url?.trim())
}

function isValidMediaGalleryItem(item?: MediaGalleryPreviewItem): boolean {
  if (!item) return false
  if (item.type === 'videoUrl') return hasVideoUrl(item.videoUrl)
  return hasImageAsset(item.image)
}

function getMediaGalleryPreviewMedia(item?: MediaGalleryPreviewItem) {
  if (!item) return ImagesIcon
  if (item.type === 'videoUrl') return hasImageAsset(item.videoThumbnail) ? item.videoThumbnail : PlayIcon
  return hasImageAsset(item.image) ? item.image : ImagesIcon
}

export default defineType({
  name: 'mediaGalleryBlock',
  title: 'Media Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'text', rows: 2, description: 'Press Enter to control line breaks.'}),
    defineField({name: 'layout', title: 'Layout', type: 'string', options: {list: [{title: 'Carousel', value: 'carousel'}, {title: 'Thumbnail Gallery', value: 'thumbnailGallery'}, {title: 'Video Card Carousel', value: 'videoCardCarousel'}], layout: 'radio'}, description: 'Choose the frontend layout style.', initialValue: 'thumbnailGallery'}),
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'White', value: 'white'}, {title: 'Light Gray', value: 'lightGray'}, {title: 'Blue Gradient Soft', value: 'blueGradientSoft'}, {title: 'Blue Gradient Air', value: 'blueGradientAir'}], layout: 'radio'}, initialValue: 'white', validation: (rule) => rule.required()}),
    defineField({name: 'cta', title: 'Section CTA', type: 'object', description: 'Optional CTA shown below the section heading for standard gallery layouts, or below the carousel for the video card layout.', fields: [defineField({name: 'label', title: 'Button Label', type: 'string'}), defineField({name: 'href', title: 'Button Link', type: 'url', validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})})]}),
    defineField({name: 'items', title: 'Media Items', type: 'array', description: 'Items are rendered in the same order as listed here.', of: [{type: 'object', fields: [defineField({name: 'type', title: 'Media Type', type: 'string', options: {list: [{title: 'Image', value: 'image'}, {title: 'Video URL', value: 'videoUrl'}], layout: 'radio'}, initialValue: 'image', validation: (rule) => rule.required()}), defineField({name: 'image', title: 'Image', type: 'image', hidden: ({parent}) => parent?.type !== 'image', options: {hotspot: true}, fields: [{name: 'alt', title: 'Alt Text', type: 'string'}]}), defineField({name: 'videoUrl', title: 'Video URL', type: 'url', validation: (rule) => rule.uri({scheme: ['http', 'https']}), hidden: ({parent}) => parent?.type !== 'videoUrl'}), defineField({name: 'videoThumbnail', title: 'Video Thumbnail', type: 'image', hidden: ({parent}) => parent?.type !== 'videoUrl', options: {hotspot: true}, description: 'Optional thumbnail for video card layouts.'}), defineField({name: 'caption', title: 'Caption', type: 'string'}), defineField({name: 'metaText', title: 'Meta Text', type: 'string', description: 'Secondary text shown under the card title.'})], preview: {select: {type: 'type', caption: 'caption', image: 'image', videoThumbnail: 'videoThumbnail', videoUrl: 'videoUrl', metaText: 'metaText'}, prepare({type, caption, image, videoThumbnail, videoUrl, metaText}) { const isImage = type === 'image'; return {title: caption || (isImage ? 'Image item' : 'Video item'), subtitle: metaText || videoUrl || (isImage ? 'Image' : 'Video URL'), media: (isImage ? image : videoThumbnail || PlayIcon) as never} }}}]}),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
      items: 'items',
      ctaLabel: 'cta.label',
    },
    prepare({title, layout, items, ctaLabel}) {
      const validItems = Array.isArray(items)
        ? items.filter((item): item is MediaGalleryPreviewItem => isValidMediaGalleryItem(item))
        : []

      return {
        title: title || 'Media Gallery',
        subtitle: joinPreview([
          layout || 'thumbnailGallery',
          `${validItems.length} items`,
          ctaLabel ? 'CTA enabled' : undefined,
        ]),
        media: getMediaGalleryPreviewMedia(validItems[0]) as never,
      }
    },
  },
})

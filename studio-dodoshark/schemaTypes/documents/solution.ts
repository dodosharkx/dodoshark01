import {BulbOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {itemCount, joinPreview, pickText} from '../shared/studio'

export default defineType({
  name: 'solution',
  title: 'Solution',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'basic', title: 'Basic', default: true},
    {name: 'content', title: 'Page Content'},
    {name: 'relations', title: 'Related Items'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'seo', title: 'SEO Settings', type: 'seoMeta', group: 'seo'}),
    defineField({name: 'title', title: 'Solution Title', type: 'string', group: 'basic', description: 'Main solution title.', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'URL Slug', type: 'slug', group: 'basic', options: {source: 'title', maxLength: 96}, description: 'Used for the solution detail URL.', validation: (rule) => rule.required()}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], group: 'basic', description: 'Used in solution filters and cards.'}),
    defineField({
      name: 'detailRenderMode',
      title: 'Detail Render Mode',
      type: 'string',
      group: 'content',
      initialValue: 'pageBuilder',
      options: {
        list: [
          {title: 'Page Builder', value: 'pageBuilder'},
          {title: 'HTML Template', value: 'htmlTemplate'},
        ],
        layout: 'radio',
      },
      description: 'Choose between structured blocks and a fully custom HTML template.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'basic',
      description: 'Main image used in Studio previews and solution cards.',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required()}],
    }),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 4, group: 'basic', description: 'Short summary for cards and intros.'}),
    defineField({
      name: 'contentBlocks',
      title: 'Page Builder',
      type: 'array',
      group: 'content',
      description: 'Blocks are rendered in this order on the solution page.',
      hidden: ({document}) => document?.detailRenderMode === 'htmlTemplate',
      of: [
        {type: 'heroBlock'},
        {type: 'richSectionBlock'},
        {type: 'featureListBlock'},
        {type: 'mediaGalleryBlock'},
        {type: 'cardGridBlock'},
        {type: 'tableBlock'},
        {type: 'metricsBlock'},
        {type: 'ctaBlock'},
        {type: 'portableTextBlock'},
        {type: 'collectionReferenceBlock'},
        {type: 'machineSelectorBlock'},
        {type: 'showcaseBlock'},
        {type: 'referenceSpecBlock'},
      ],
    }),
    defineField({
      name: 'htmlTemplate',
      title: 'HTML Template',
      type: 'solutionHtmlTemplate',
      group: 'content',
      hidden: ({document}) => document?.detailRenderMode !== 'htmlTemplate',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      group: 'relations',
      description: 'Optional products to display at the bottom of the page.',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      name: 'relatedVlogs',
      title: 'Related Vlogs',
      type: 'array',
      group: 'relations',
      description: 'Optional vlogs to display at the bottom of the page.',
      of: [{type: 'reference', to: [{type: 'vlogItem'}]}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      categoryTitle: 'category.title',
      summary: 'summary',
      media: 'heroImage',
      detailRenderMode: 'detailRenderMode',
      templateImages: 'htmlTemplate.templateImages',
      renderStatus: 'htmlTemplate.renderStatus',
      contentBlocks: 'contentBlocks',
    },
    prepare({title, categoryTitle, summary, media, detailRenderMode, templateImages, renderStatus, contentBlocks}) {
      const renderModeSummary =
        detailRenderMode === 'htmlTemplate'
          ? joinPreview([
              'HTML Template',
              itemCount(templateImages) ? `${itemCount(templateImages)} template images` : undefined,
              renderStatus === 'ready'
                ? 'Artifact ready'
                : renderStatus === 'failed'
                  ? 'Artifact failed'
                  : renderStatus === 'pending'
                    ? 'Artifact pending'
                    : undefined,
            ])
          : joinPreview(['Page Builder', itemCount(contentBlocks) ? `${itemCount(contentBlocks)} blocks` : undefined])

      return {
        title: title || 'Untitled solution',
        subtitle: joinPreview([pickText(categoryTitle, summary), renderModeSummary]) || 'Solution document',
        media,
      }
    },
  },
})

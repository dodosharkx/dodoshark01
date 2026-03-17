import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {iconForSchemaType, joinPreview, pickFirst} from '../../shared/studio'

export default defineType({
  name: 'collectionReferenceBlock',
  title: 'Collection Reference',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({name: 'title', title: 'Block Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'White', value: 'white'}, {title: 'Light Gray', value: 'lightGray'}, {title: 'Blue Gradient Soft', value: 'blueGradientSoft'}, {title: 'Blue Gradient Air', value: 'blueGradientAir'}], layout: 'radio'}, initialValue: 'lightGray', validation: (rule) => rule.required()}),
    defineField({name: 'layout', title: 'Layout', type: 'string', options: {list: [{title: 'Grid', value: 'grid'}, {title: 'List', value: 'list'}, {title: 'Carousel', value: 'carousel'}]}, initialValue: 'grid', description: 'Controls how referenced content is displayed.'}),
    defineField({name: 'columns', title: 'Columns (Grid Only)', type: 'number', options: {list: [2, 3, 4]}, initialValue: 3, hidden: ({parent}) => parent?.layout !== 'grid'}),
    defineField({
      name: 'references',
      title: 'Reference Items',
      type: 'array',
      description: 'Add up to 20 referenced items in display order.',
      validation: (rule) =>
        rule
          .max(20)
          .error('You can add up to 20 reference items.'),
      of: [
        {
          type: 'object',
          name: 'referenceItem',
          title: 'Reference Item',
          fields: [
            defineField({
              name: 'reference',
              title: 'Reference',
              type: 'reference',
              to: [
                {type: 'product'},
                {type: 'productVariant'},
                {type: 'accessory'},
                {type: 'author'},
                {type: 'post'},
                {type: 'solution'},
                {type: 'caseStudy'},
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'labelOverride',
              title: 'Label Override',
              type: 'string',
              description: 'Leave empty to use the referenced item title.',
            }),
            defineField({
              name: 'isClickable',
              title: 'Clickable',
              type: 'boolean',
              initialValue: true,
              description: 'Disable when the item should not link anywhere.',
            }),
          ],
          preview: {
            select: {
              refType: 'reference._type',
              refTitle: 'reference.title',
              refName: 'reference.name',
              refModel: 'reference.modelName',
              labelOverride: 'labelOverride',
              isClickable: 'isClickable',
              media: 'reference.mainImage',
              mediaDoc: 'reference.image',
              mediaCover: 'reference.coverImage',
              mediaHero: 'reference.heroImage',
            },
            prepare({
              refType,
              refTitle,
              refName,
              refModel,
              labelOverride,
              isClickable,
              media,
              mediaDoc,
              mediaCover,
              mediaHero,
            }) {
              return {
                title:
                  labelOverride || refTitle || refName || refModel || 'Untitled reference item',
                subtitle: `${isClickable ? 'Clickable' : 'Static'} | ${refType || 'unknown type'}`,
                media:
                  pickFirst(media, mediaDoc, mediaCover, mediaHero) || iconForSchemaType(refType),
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
      firstMediaMain: 'references.0.reference.mainImage',
      firstMediaImage: 'references.0.reference.image',
      firstMediaCover: 'references.0.reference.coverImage',
      firstMediaHero: 'references.0.reference.heroImage',
      secondMediaMain: 'references.1.reference.mainImage',
      secondMediaImage: 'references.1.reference.image',
      secondMediaCover: 'references.1.reference.coverImage',
      secondMediaHero: 'references.1.reference.heroImage',
      thirdMediaMain: 'references.2.reference.mainImage',
      thirdMediaImage: 'references.2.reference.image',
      thirdMediaCover: 'references.2.reference.coverImage',
      thirdMediaHero: 'references.2.reference.heroImage',
      columns: 'columns',
    },
    prepare({
      title,
      layout,
      firstMediaMain,
      firstMediaImage,
      firstMediaCover,
      firstMediaHero,
      secondMediaMain,
      secondMediaImage,
      secondMediaCover,
      secondMediaHero,
      thirdMediaMain,
      thirdMediaImage,
      thirdMediaCover,
      thirdMediaHero,
      columns,
    }) {
      return {
        title: title || 'Collection Reference',
        subtitle: joinPreview([
          layout || 'grid',
          layout === 'grid' && columns ? `${columns} columns` : undefined,
        ]),
        media: pickFirst(
          firstMediaMain,
          firstMediaImage,
          firstMediaCover,
          firstMediaHero,
          secondMediaMain,
          secondMediaImage,
          secondMediaCover,
          secondMediaHero,
          thirdMediaMain,
          thirdMediaImage,
          thirdMediaCover,
          thirdMediaHero,
        ),
      }
    },
  },
})

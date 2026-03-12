import {RocketIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'
import {itemCount, joinPreview} from '../../shared/studio'

export default defineType({
  name: 'ctaBlock',
  title: 'CTA Block',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2}),
    defineField({name: 'variant', title: 'Variant', type: 'string', options: {list: [{title: 'Simple Banner', value: 'banner'}, {title: 'Colorful Card', value: 'card'}, {title: 'Embedded Form', value: 'form'}], layout: 'radio'}, initialValue: 'banner'}),
    defineField({name: 'formType', title: 'Form Type', description: 'Only used when the CTA variant is form.', type: 'string', options: {list: [{title: 'Newsletter / Download', value: 'newsletter'}, {title: 'Contact Form', value: 'contact'}, {title: 'Book Demo', value: 'demo'}]}, hidden: ({parent}) => parent?.variant !== 'form'}),
    defineField({name: 'buttons', title: 'Buttons', type: 'array', of: [{type: 'object', fields: [{name: 'label', title: 'Label', type: 'string'}, {name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})}], preview: {select: {title: 'label', subtitle: 'href'}}}], hidden: ({parent}) => parent?.variant === 'form'}),
  ],
  preview: {
    select: {
      title: 'title',
      variant: 'variant',
      buttons: 'buttons',
      formType: 'formType',
    },
    prepare({title, variant, buttons, formType}) {
      return {
        title: title || 'CTA Block',
        subtitle:
          joinPreview([
            variant || 'banner',
            variant === 'form'
              ? formType || 'form type not set'
              : itemCount(buttons)
                ? `${itemCount(buttons)} buttons`
                : 'no buttons',
          ]) || 'CTA block',
      }
    },
  },
})

import {CodeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {itemCount, joinPreview} from '../shared/studio'

type CodeFieldValue = {
  code?: string
  language?: string
} | string | undefined

type RenderStatusValue = 'pending' | 'ready' | 'failed'

const forbiddenHtmlPatterns = [
  {pattern: /<script\b/i, message: 'Scripts are not allowed.'},
  {pattern: /<iframe\b/i, message: 'Nested iframes are not allowed.'},
  {pattern: /<object\b/i, message: 'Object embeds are not allowed.'},
  {pattern: /<embed\b/i, message: 'Embed tags are not allowed.'},
  {pattern: /<link\b/i, message: 'External stylesheet links are not allowed.'},
  {pattern: /<style\b/i, message: 'Move styles into the Custom CSS field.'},
  {pattern: /\bon[a-z]+\s*=/i, message: 'Inline event handlers are not allowed.'},
  {pattern: /javascript\s*:/i, message: 'javascript: URLs are not allowed.'},
]

const forbiddenCssPatterns = [
  {pattern: /@import/i, message: 'CSS @import is not allowed.'},
  {pattern: /expression\s*\(/i, message: 'CSS expressions are not allowed.'},
]

function validateSource(
  value: unknown,
  patterns: Array<{pattern: RegExp; message: string}>,
) {
  const source = getCodeValue(value)

  for (const {pattern, message} of patterns) {
    if (pattern.test(source)) {
      return message
    }
  }

  return true
}

function getCodeValue(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && 'code' in value) {
    const code = (value as {code?: unknown}).code
    return typeof code === 'string' ? code : ''
  }

  return ''
}

export default defineType({
  name: 'solutionHtmlTemplate',
  title: 'HTML Template',
  type: 'object',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'html',
      title: 'HTML Template',
      type: 'code',
      options: {
        language: 'html',
        languageAlternatives: [{title: 'HTML', value: 'html'}],
      },
      description:
        'Paste HTML markup here. Tailwind utility classes are supported. Scripts are blocked. Use {{asset:key}} for image URLs.',
      validation: (rule) => rule.required().custom((value) => validateSource(value, forbiddenHtmlPatterns)),
    }),
    defineField({
      name: 'customCss',
      title: 'Custom CSS',
      type: 'code',
      options: {
        language: 'css',
        languageAlternatives: [{title: 'CSS', value: 'css'}],
      },
      description:
        'Optional extra CSS for this template. Tailwind @apply is supported. Use {{asset:key}} for image URLs.',
      validation: (rule) => rule.custom((value) => validateSource(value, forbiddenCssPatterns)),
    }),
    defineField({
      name: 'templateImages',
      title: 'Template Images',
      type: 'array',
      description:
        'Images available to the template. Reference them in HTML/CSS using {{asset:key}} with the key defined below.',
      of: [
        defineArrayMember({
          name: 'templateImage',
          title: 'Template Image',
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Key',
              type: 'string',
              description: 'Example: hero-banner',
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-z0-9-]+$/, {
                    name: 'kebab-case key',
                    invert: false,
                  }),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'key',
              media: 'image',
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((value) => {
          if (!Array.isArray(value)) return true

          const keys = value
            .map((item) => {
              const entry = item as {key?: string} | undefined
              return typeof entry?.key === 'string' ? entry.key.trim() : ''
            })
            .filter(Boolean)

          if (new Set(keys).size !== keys.length) {
            return 'Template image keys must be unique.'
          }

          return true
        }),
    }),
    defineField({
      name: 'renderStatus',
      title: 'Render Status',
      type: 'string',
      description: 'Generated automatically when the template is rendered for deployment.',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Ready', value: 'ready'},
          {title: 'Failed', value: 'failed'},
        ],
        layout: 'radio',
      },
      readOnly: true,
    }),
    defineField({
      name: 'renderedAt',
      title: 'Rendered At',
      type: 'datetime',
      description: 'The last time the deployment-ready HTML artifact was generated.',
      readOnly: true,
    }),
    defineField({
      name: 'renderedSignature',
      title: 'Rendered Signature',
      type: 'string',
      description: 'Version identifier for the generated artifact used by the frontend cache key.',
      readOnly: true,
    }),
    defineField({
      name: 'renderError',
      title: 'Render Error',
      type: 'text',
      rows: 5,
      description: 'The latest artifact generation error, if rendering failed.',
      readOnly: true,
    }),
    defineField({
      name: 'renderedHtml',
      title: 'Rendered HTML Artifact',
      type: 'code',
      options: {
        language: 'html',
        languageAlternatives: [{title: 'HTML', value: 'html'}],
      },
      description: 'Generated automatically on publish. The frontend serves this artifact directly in production.',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      html: 'html',
      customCss: 'customCss',
      templateImages: 'templateImages',
      renderStatus: 'renderStatus',
    },
    prepare({
      html,
      customCss,
      templateImages,
      renderStatus,
    }: {
      html?: CodeFieldValue
      customCss?: CodeFieldValue
      templateImages?: unknown[]
      renderStatus?: RenderStatusValue
    }) {
      const hasHtml = getCodeValue(html).trim().length > 0
      const hasCustomCss = getCodeValue(customCss).trim().length > 0
      const renderSummary =
        renderStatus === 'ready'
          ? 'Artifact ready'
          : renderStatus === 'failed'
            ? 'Artifact failed'
            : renderStatus === 'pending'
              ? 'Artifact pending'
              : undefined

      return {
        title: 'HTML Template',
        subtitle:
          joinPreview([
            hasHtml ? 'HTML ready' : 'Missing HTML',
            hasCustomCss ? 'CSS ready' : undefined,
            itemCount(templateImages) ? `${itemCount(templateImages)} template images` : undefined,
            renderSummary,
          ]) || 'Template',
      }
    },
  },
})

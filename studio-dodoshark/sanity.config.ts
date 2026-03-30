import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {schemaTypes, singletonTypes} from './schemaTypes'
import {structure} from './structure'
import {presentationResolve} from './presentation/resolve'

function normalizeOrigin(value?: string) {
  return value?.trim().replace(/\/+$/, '')
}

const defaultPreviewOrigin =
  process.env.NODE_ENV === 'production'
    ? 'https://www.dodoshark.vip'
    : 'http://localhost:3000'

const previewOrigin =
  normalizeOrigin(process.env.SANITY_STUDIO_PREVIEW_ORIGIN) || defaultPreviewOrigin

export default defineConfig({
  name: 'default',
  title: 'Dodoshark',

  projectId: 'nljl95h9',
  dataset: 'production',

  plugins: [
    presentationTool({
      resolve: presentationResolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: '/api/draft/enable',
          disable: '/api/draft/disable',
        },
      },
    }),
    structureTool({structure}),
    visionTool(),
    table(),
    codeInput(),
  ],

  document: {
    actions: (prev, context) =>
      singletonTypes.has(context.schemaType)
        ? prev.filter(({action}) => action !== 'duplicate')
        : prev,
  },

  schema: {
    types: schemaTypes,
    templates: (prev) =>
      prev.filter((template) => !singletonTypes.has(template.schemaType)),
  },
})

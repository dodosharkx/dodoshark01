import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {schemaTypes, singletonTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Dodoshark',

  projectId: 'nljl95h9',
  dataset: 'production',

  plugins: [
    presentationTool({
      previewUrl: {
        origin: 'http://localhost:3000',
        draftMode: {
          enable: '/api/draft/enable',
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

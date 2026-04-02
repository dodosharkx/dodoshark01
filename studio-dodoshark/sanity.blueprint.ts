import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'render-solution-template',
      event: {
        on: ['publish'],
        filter: '_type == "solution" && detailRenderMode == "htmlTemplate"',
        projection: '{_id, _type, title, slug, detailRenderMode, htmlTemplate}',
      },
    }),
  ],
})

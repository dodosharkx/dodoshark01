import {DocumentSheetIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {joinPreview} from '../../shared/studio'

export default defineType({
  name: 'tableBlock',
  title: 'Table Block',
  type: 'object',
  icon: DocumentSheetIcon,
  fields: [
    defineField({name: 'title', title: 'Table Title', type: 'string'}),
    defineField({name: 'description', title: 'Table Description', type: 'text', rows: 2}),
    defineField({name: 'backgroundVariant', title: 'Background Style', type: 'string', options: {list: [{title: 'Default', value: 'default'}, {title: 'Muted', value: 'muted'}, {title: 'Dark', value: 'dark'}], layout: 'radio'}, initialValue: 'muted', validation: (Rule) => Rule.required()}),
    defineField({name: 'table', title: 'Table Data', type: 'table', description: 'Cells support simple escapes: \n for line break and \\ for backslash.', validation: (Rule) => Rule.required().error('Table data is required.')}),
    defineField({name: 'hasHeaderRow', title: 'First Row Is Header', type: 'boolean', initialValue: true}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 2, description: 'Optional note shown below the table.'}),
  ],
  preview: {
    select: {
      title: 'title',
      table: 'table',
      hasHeaderRow: 'hasHeaderRow',
      note: 'note',
    },
    prepare({title, table, hasHeaderRow, note}) {
      const rowCount = Array.isArray(table?.rows) ? table.rows.length : 0
      return {
        title: title || 'Table Block',
        subtitle: joinPreview([
          rowCount ? `${rowCount} rows` : undefined,
          hasHeaderRow ? 'Header row on' : 'Header row off',
          note ? 'Note added' : undefined,
        ]) || 'Table block',
      }
    },
  },
})

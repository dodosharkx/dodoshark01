import {
  getSharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import { sectionSubtitleClass } from './sectionStyles'

type TableRow = {
  _key?: string
  cells?: string[]
}

type TableValue = {
  _type?: 'table'
  rows?: TableRow[]
}

export type TableBlockData = {
  _type: 'tableBlock'
  _key?: string
  title?: string
  description?: string
  backgroundVariant?: SharedBackgroundVariant
  table?: TableValue | TableRow[]
  hasHeaderRow?: boolean
  note?: string
}

type ParsedCellBlock =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'list'; items: string[] }

function normalizeRows(rows: TableRow[]) {
  const maxCols = rows.reduce((max, row) => {
    return Math.max(max, row.cells?.length ?? 0)
  }, 0)

  if (maxCols === 0) return { rows: [] as string[][], maxCols: 0 }

  const normalized = rows.map((row) => {
    const cells = row.cells ?? []
    return Array.from({ length: maxCols }, (_, idx) => cells[idx] ?? '')
  })

  return { rows: normalized, maxCols }
}

function extractRows(table?: TableValue | TableRow[]) {
  if (Array.isArray(table)) return table
  return table?.rows ?? []
}

function decodeEscapedText(value: string) {
  const escapedBackslashToken = '__TABLE_ESCAPED_BACKSLASH__'

  return value
    .replace(/\\\\/g, escapedBackslashToken)
    .replace(/\\n/g, '\n')
    .replaceAll(escapedBackslashToken, '\\')
}

function normalizeCellLines(value: string) {
  return decodeEscapedText(value).split('\n')
}

function getListItemValue(line: string) {
  const trimmed = line.trim()

  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return trimmed.slice(2).trim()
  }

  if (trimmed.startsWith('• ')) {
    return trimmed.slice(2).trim()
  }

  return null
}

function parseCellContent(value: string) {
  const lines = normalizeCellLines(value)
  const blocks: ParsedCellBlock[] = []
  let paragraphLines: string[] = []
  let listItems: string[] = []

  function flushParagraph() {
    const cleaned = paragraphLines.map((line) => line.trim()).filter(Boolean)
    if (cleaned.length > 0) {
      blocks.push({ type: 'paragraph', lines: cleaned })
    }
    paragraphLines = []
  }

  function flushList() {
    const cleaned = listItems.map((item) => item.trim()).filter(Boolean)
    if (cleaned.length > 0) {
      blocks.push({ type: 'list', items: cleaned })
    }
    listItems = []
  }

  for (const line of lines) {
    const listValue = getListItemValue(line)

    if (!line.trim()) {
      flushParagraph()
      flushList()
      continue
    }

    if (listValue !== null) {
      flushParagraph()
      listItems.push(listValue)
      continue
    }

    flushList()
    paragraphLines.push(line)
  }

  flushParagraph()
  flushList()

  return {
    decoded: decodeEscapedText(value),
    blocks,
    hasList: blocks.some((block) => block.type === 'list'),
  }
}

function renderCellContent(value: string | undefined, context: 'header' | 'body') {
  const rawValue = value ?? ''

  if (!rawValue.trim()) {
    return '-'
  }

  if (context === 'header') {
    const lines = normalizeCellLines(rawValue)
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length <= 1) {
      return lines[0] ?? '-'
    }

    return (
      <div className="flex flex-col items-center justify-center gap-1 whitespace-normal">
        {lines.map((line, index) => (
          <span key={`${line}-${index}`} className="block">
            {line}
          </span>
        ))}
      </div>
    )
  }

  const parsed = parseCellContent(rawValue)

  if (parsed.blocks.length === 0) {
    return parsed.decoded || '-'
  }

  if (parsed.blocks.length === 1 && parsed.blocks[0]?.type === 'paragraph' && parsed.blocks[0].lines.length === 1) {
    return parsed.blocks[0].lines[0]
  }

  const bodyAlignClass = parsed.hasList ? 'items-start text-left' : 'items-center text-center'

  return (
    <div className={`flex flex-col gap-2 ${bodyAlignClass}`}>
      {parsed.blocks.map((block, blockIndex) => {
        if (block.type === 'list') {
          return (
            <ul
              key={`list-${blockIndex}`}
              className="ml-4 list-disc space-y-1 text-left"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          )
        }

        return (
          <div key={`paragraph-${blockIndex}`} className="flex flex-col gap-1">
            {block.lines.map((line, lineIndex) => (
              <span key={`${line}-${lineIndex}`} className="block">
                {line}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default function TableBlock({ block }: { block: TableBlockData }) {
  const variant = block.backgroundVariant ?? 'lightGray'
  const theme = getSharedBackgroundTheme(variant)
  const sourceRows = extractRows(block.table).filter((row) => (row.cells?.length ?? 0) > 0)
  const { rows } = normalizeRows(sourceRows)
  const hasHeader = Boolean(block.hasHeaderRow) && rows.length > 0
  const headerCells = hasHeader ? rows[0] : []
  const bodyRows = hasHeader ? rows.slice(1) : rows
  const sectionBorderClass = theme.sectionBorder
  const subtitleClass = theme.body
  const isBlueVariant = variant === 'blueGradientSoft' || variant === 'blueGradientAir'
  const columnDividerClass = 'border-slate-200/80'
  const rowDividerClass = isBlueVariant ? 'border-slate-200/70' : 'border-slate-100'
  const rowHoverClass = isBlueVariant ? 'hover:bg-white/75' : 'hover:bg-slate-50/80'

  if (!block.title && !block.description && rows.length === 0 && !block.note) return null

  return (
    <SectionShell sectionClassName={`${theme.section} ${sectionBorderClass}`}>
      {(block.title || block.description) && (
        <SectionHeader
          title={block.title}
          subtitle={block.description}
          tone="light"
          className="mb-10 md:mb-12"
          titleClassName={theme.heading}
          subtitleClassName={`${subtitleClass} ${sectionSubtitleClass} mx-auto max-w-3xl`}
        />
      )}

      <div className={`overflow-hidden rounded-lg ${theme.surfaceElevated}`}>
          {rows.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No table data.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                {hasHeader && (
                  <thead className="bg-sky-300 text-black">
                    <tr>
                      {headerCells.map((cell, idx) => (
                        <th
                          key={idx}
                          className={`px-5 py-4 text-center text-xs font-black tracking-[0.16em] align-middle md:text-sm ${
                            idx < headerCells.length - 1 ? `border-r ${columnDividerClass}` : ''
                          }`}
                        >
                          {renderCellContent(cell, 'header')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}

                <tbody>
                  {bodyRows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={`border-t ${rowDividerClass} ${rowHoverClass} transition-colors`}
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={`${rowIdx}-${cellIdx}`}
                          className={`px-5 py-4 text-sm text-slate-600 text-center align-middle leading-relaxed ${
                            cellIdx < row.length - 1 ? `border-r ${columnDividerClass}` : ''
                          }`}
                        >
                          {renderCellContent(cell, 'body')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {block.note && (
        <p className={`mt-4 whitespace-pre-line text-xs leading-relaxed ${subtitleClass}`}>{block.note}</p>
      )}
    </SectionShell>
  )
}

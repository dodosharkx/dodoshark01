import Link from 'next/link'

export type TagCloudItem = {
  key: string
  href: string
  label: string
  active: boolean
}

type TagCloudPanelProps = {
  title: string
  description?: string
  allLabel: string
  allHref: string
  allActive: boolean
  items: TagCloudItem[]
}

function toSentenceCase(value: string) {
  const normalized = value.trim().replace(/\s+/g, ' ').toLowerCase()
  if (!normalized) return ''

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

export default function TagCloudPanel({
  title,
  description,
  allLabel,
  allHref,
  allActive,
  items,
}: TagCloudPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-6 shadow-sm sm:p-7">
      <div className="mb-5 text-center">
        <h2 className="text-[1.65rem] font-display font-black tracking-tight text-slate-900 sm:text-[1.85rem]">
          {toSentenceCase(title)}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        <Link
          href={allHref}
          className={`whitespace-nowrap rounded-lg border px-4 py-1.5 text-[11px] font-medium transition-all sm:px-[18px] sm:text-xs ${
            allActive
              ? 'border-slate-900 bg-slate-800 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
          }`}
        >
          {toSentenceCase(allLabel)}
        </Link>

        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`whitespace-nowrap rounded-lg border px-4 py-1.5 text-[11px] font-medium transition-all sm:px-[18px] sm:text-xs ${
              item.active
                ? 'border-slate-900 bg-slate-800 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
            }`}
          >
            {toSentenceCase(item.label)}
          </Link>
        ))}
      </div>
    </div>
  )
}

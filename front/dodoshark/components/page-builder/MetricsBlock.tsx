import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { cleanText, renderText, sanitizeAltText } from '@/lib/sanity-utils'
import {
  getSharedBackgroundTheme,
  type SharedBackgroundVariant,
} from './backgroundTheme'
import SectionShell from './SectionShell'
import SectionHeader from './SectionHeader'
import Icon from '@/components/ui/Icon'
import { bodyTextClass } from './sectionStyles'

type MetricItem = {
  _key?: string
  value?: string
  unit?: string
  label?: string
  image?: {
    alt?: string
    asset?: {
      _ref?: string
      _id?: string
      url?: string
    }
  }
  icon?: string
}

export type MetricsBlockData = {
  _type: 'metricsBlock'
  _key?: string
  title?: string
  backgroundVariant?: SharedBackgroundVariant
  items?: MetricItem[]
}

export default function MetricsBlock({ block }: { block: MetricsBlockData }) {
  const variant = block.backgroundVariant ?? 'white'
  const theme = getSharedBackgroundTheme(variant)
  const items = (block.items ?? []).filter((item) => renderText(item.value) || renderText(item.label))
  const sectionBorderClass = theme.sectionBorder

  if (!block.title && items.length === 0) return null

  return (
    <SectionShell spacing="compact" sectionClassName={`${theme.section} ${sectionBorderClass}`}>
      {block.title && (
        <SectionHeader
          title={block.title}
          tone="light"
          className="mb-10 md:mb-12"
          titleClassName={theme.heading}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {items.map((item, idx) => {
            const iconClass = cleanText(item.icon) || 'chart-line'

            return (
              <article
                key={item._key ?? `${item.label}-${idx}`}
                className={`group relative flex flex-col items-center p-6 transition-all duration-300 hover:shadow-lg ${theme.surfaceElevated} rounded-xl border border-slate-100 overflow-hidden shadow-xs`}
              >
                <div className="relative w-36 h-36 mb-4 transition-transform duration-500 ease-out group-hover:scale-105">
                  <div className="relative w-full h-full overflow-hidden rounded-lg flex items-center justify-center">
                    {item.image?.asset ? (
                      <Image
                        src={urlFor(item.image).width(600).height(600).url()}
    alt={sanitizeAltText(item.image.alt, renderText(item.label)) || ''}
                        width={144}
                        height={144}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-orange-500 bg-orange-50/50 w-full h-full flex items-center justify-center rounded-lg border border-orange-100/30">
                        <Icon icon={iconClass} className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center w-full">
                  <div className="mb-0.5 flex items-baseline justify-center font-display font-black tracking-tight">
                    <span className="text-xl text-slate-900 md:text-2xl transition-colors duration-300 group-hover:text-orange-600">
                      {item.value}
                    </span>
                      {renderText(item.unit) && (
                        <span className="ml-0.5 text-[10px] text-slate-400 font-medium">
                        {renderText(item.unit)}
                        </span>
                      )}
                  </div>

                  {renderText(item.label) && (
                    <p className={`text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-500 transition-colors duration-300 leading-tight ${bodyTextClass}`}>
                      {renderText(item.label)}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
      </div>
    </SectionShell>
  )
}

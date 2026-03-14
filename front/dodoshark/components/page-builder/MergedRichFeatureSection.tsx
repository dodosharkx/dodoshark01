import { FeatureListBlockContent, type FeatureListBlockData } from './FeatureListBlock'
import { getSharedBackgroundTheme } from './backgroundTheme'
import {
  RichSectionBlockContent,
  type RichSectionBlockData,
} from './RichSectionBlock'
import SectionShell from './SectionShell'

type MergedRichFeatureSectionProps = {
  richBlock: RichSectionBlockData
  featureBlock: FeatureListBlockData
}

export default function MergedRichFeatureSection({
  richBlock,
  featureBlock,
}: MergedRichFeatureSectionProps) {
  const variant = richBlock.backgroundVariant ?? 'white'
  const theme = getSharedBackgroundTheme(variant)
  const anchorId = richBlock.anchorId?.trim() || undefined

  return (
    <SectionShell id={anchorId} sectionClassName={theme.section}>
      <RichSectionBlockContent block={richBlock} trimTrailingContentSpacing />
      <div className="mt-12 md:mt-16">
        <FeatureListBlockContent
          block={featureBlock}
          showHeader={false}
          renderMode="mergedCards"
        />
      </div>
    </SectionShell>
  )
}

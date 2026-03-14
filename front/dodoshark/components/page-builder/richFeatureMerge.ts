import { mapFeatureBackgroundStyleToVariant } from './backgroundTheme'
import {
  hasFeatureListContent,
  type FeatureListBlockData,
} from './FeatureListBlock'
import {
  hasRichSectionContent,
  type RichSectionBlockData,
} from './RichSectionBlock'

export type PageBuilderBlockBase = {
  _type?: string
  _key?: string
}

export type PageBuilderRenderGroup<T extends PageBuilderBlockBase> =
  | {
      kind: 'single'
      key: string | number
      block: T
    }
  | {
      kind: 'mergedRichFeature'
      key: string | number
      richBlock: RichSectionBlockData
      featureBlock: FeatureListBlockData
    }

function isRichSectionBlock(block?: PageBuilderBlockBase): block is RichSectionBlockData {
  return block?._type === 'richSectionBlock'
}

function isFeatureListBlock(block?: PageBuilderBlockBase): block is FeatureListBlockData {
  return block?._type === 'featureListBlock'
}

export function shouldMergeRichAndFeature(
  richBlock?: PageBuilderBlockBase,
  featureBlock?: PageBuilderBlockBase,
) {
  if (!isRichSectionBlock(richBlock) || !isFeatureListBlock(featureBlock)) {
    return false
  }

  if (!featureBlock.mergeWithPreviousRichSection) {
    return false
  }

  if (!hasRichSectionContent(richBlock) || !hasFeatureListContent(featureBlock, false)) {
    return false
  }

  const richVariant = richBlock.backgroundVariant ?? 'white'
  const featureVariant = mapFeatureBackgroundStyleToVariant(
    featureBlock.backgroundStyle ?? 'white',
  )

  return richVariant === featureVariant
}

export function groupPageBuilderBlocks<T extends PageBuilderBlockBase>(
  blocks: T[],
): PageBuilderRenderGroup<T>[] {
  const groups: PageBuilderRenderGroup<T>[] = []

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    const nextBlock = blocks[index + 1]

    if (shouldMergeRichAndFeature(block, nextBlock)) {
      groups.push({
        kind: 'mergedRichFeature',
        key: `${block._key ?? index}-merged-${nextBlock?._key ?? index + 1}`,
        richBlock: block as RichSectionBlockData,
        featureBlock: nextBlock as FeatureListBlockData,
      })
      index += 1
      continue
    }

    groups.push({
      kind: 'single',
      key: block._key ?? index,
      block,
    })
  }

  return groups
}

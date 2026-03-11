import { defineField, defineType } from 'sanity'

function isYouTubeUrl(value: unknown) {
  if (typeof value !== 'string') return false

  const raw = value.trim()
  if (!raw) return false

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return false
  }

  const host = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname

  if (host === 'youtu.be') {
    return pathname.split('/').filter(Boolean).length > 0
  }

  if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
    if (pathname === '/watch') return Boolean(parsed.searchParams.get('v'))

    const segments = pathname.split('/').filter(Boolean)
    if (!segments.length) return false

    return ['embed', 'shorts', 'live'].includes(segments[0]) && Boolean(segments[1])
  }

  return false
}

export default defineType({
  name: 'machineSelectorBlock',
  title: 'Machine Selector (机型筛选器)',
  type: 'object',
  icon: () => '🧭',
  fields: [
    defineField({
      name: 'title',
      title: '区块标题',
      type: 'string',
      initialValue: 'Model Reference',
    }),
    defineField({
      name: 'subtitle',
      title: '区块副标题',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'backgroundVariant',
      title: '背景样式',
      type: 'string',
      options: {
        list: [
          { title: '默认白底', value: 'default' },
          { title: '浅灰底', value: 'muted' },
          { title: '深色底', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'muted',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'groups',
      title: '筛选分组',
      description: '前端将根据点击分组标签，自动显示该分组下对应型号。',
      type: 'array',
      of: [
        defineField({
          name: 'group',
          title: '分组',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: '分组名称',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: '分组说明',
              type: 'string',
              description: '可选，显示在分组下方的简要说明。',
            }),
            defineField({
              name: 'cta',
              title: '分组 CTA',
              type: 'object',
              fields: [
                defineField({
                  name: 'enabled',
                  title: '显示跳转按钮',
                  type: 'boolean',
                  initialValue: false,
                }),
                defineField({
                  name: 'label',
                  title: '按钮文案',
                  type: 'string',
                  hidden: ({ parent }) => parent?.enabled !== true,
                  validation: (rule) =>
                    rule.custom((value, context) => {
                      const enabled = context.parent?.enabled === true
                      if (!enabled) return true
                      return typeof value === 'string' && value.trim()
                        ? true
                        : '开启 CTA 后必须填写按钮文案。'
                    }),
                }),
                defineField({
                  name: 'targetType',
                  title: '跳转类型',
                  type: 'string',
                  options: {
                    list: [
                      { title: '普通链接', value: 'link' },
                      { title: 'YouTube 视频', value: 'youtube' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: 'link',
                  hidden: ({ parent }) => parent?.enabled !== true,
                  validation: (rule) =>
                    rule.custom((value, context) => {
                      const enabled = context.parent?.enabled === true
                      if (!enabled) return true
                      return value === 'link' || value === 'youtube'
                        ? true
                        : '开启 CTA 后必须选择跳转类型。'
                    }),
                }),
                defineField({
                  name: 'href',
                  title: '跳转链接',
                  type: 'url',
                  description: '支持站内相对路径、http/https、mailto、tel。',
                  hidden: ({ parent }) => parent?.enabled !== true || parent?.targetType !== 'link',
                  validation: (rule) =>
                    rule
                      .uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] })
                      .custom((value, context) => {
                        const enabled = context.parent?.enabled === true
                        const targetType = context.parent?.targetType
                        if (!enabled || targetType !== 'link') return true
                        return typeof value === 'string' && value.trim()
                          ? true
                          : '选择普通链接时必须填写跳转链接。'
                      }),
                }),
                defineField({
                  name: 'youtubeUrl',
                  title: 'YouTube 视频链接',
                  type: 'url',
                  description: '支持 youtube.com、youtu.be 或 youtube-nocookie.com 链接。',
                  hidden: ({ parent }) => parent?.enabled !== true || parent?.targetType !== 'youtube',
                  validation: (rule) =>
                    rule.uri({ scheme: ['http', 'https'] }).custom((value, context) => {
                      const enabled = context.parent?.enabled === true
                      const targetType = context.parent?.targetType
                      if (!enabled || targetType !== 'youtube') return true
                      if (typeof value !== 'string' || !value.trim()) {
                        return '选择 YouTube 视频时必须填写视频链接。'
                      }
                      return isYouTubeUrl(value) ? true : '请输入有效的 YouTube 视频链接。'
                    }),
                }),
              ],
            }),
            defineField({
              name: 'items',
              title: '型号列表',
              type: 'array',
              of: [
                defineField({
                  name: 'machineItem',
                  title: '型号项',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'productVariant',
                      title: '关联产品型号',
                      type: 'reference',
                      to: [{ type: 'productVariant' }],
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'modelLabel',
                      title: '型号名称覆盖',
                      type: 'string',
                      description: '留空则使用关联产品型号名称。',
                    }),
                    defineField({
                      name: 'isFeatured',
                      title: '高亮显示',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'modelLabel',
                      fallbackTitle: 'productVariant.modelName',
                      mediaVariant: 'productVariant.image',
                    },
                    prepare({ title, fallbackTitle, mediaVariant }) {
                      return {
                        title: title || fallbackTitle || '未命名型号',
                        subtitle: '型号项',
                        media: mediaVariant,
                      }
                    },
                  },
                }),
              ],
              validation: (rule) => rule.required().min(1).max(24),
            }),
          ],
          preview: {
            select: { title: 'label', itemCount: 'items', ctaEnabled: 'cta.enabled' },
            prepare({ title, itemCount, ctaEnabled }) {
              const count = Array.isArray(itemCount) ? itemCount.length : 0
              return {
                title: title || '未命名分组',
                subtitle: `${count} 个型号${ctaEnabled ? ' · 含 CTA' : ''}`,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'defaultGroupIndex',
      title: '默认选中分组序号',
      type: 'number',
      description: '从 0 开始计数。留空时默认选中第 1 个分组。',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'maxItemsPerRow',
      title: '每行最大展示数量',
      type: 'number',
      options: {
        list: [1, 2, 3, 4, 5],
      },
      initialValue: 4,
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'showModelDescription',
      title: '显示型号简述',
      type: 'boolean',
      description: '开启后在卡片中显示产品型号的 shortDescription。',
      initialValue: true,
    }),
    defineField({
      name: 'footerText',
      title: '底部补充文案',
      type: 'string',
      description: '例如：可根据需求定制更大型号。',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      groups: 'groups',
    },
    prepare({ title, groups }) {
      const groupCount = Array.isArray(groups) ? groups.length : 0
      return {
        title: title || '机型筛选器',
        subtitle: `分组数：${groupCount}`,
      }
    },
  },
})

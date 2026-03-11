import { defineField, defineType } from 'sanity'

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
            select: { title: 'label', itemCount: 'items' },
            prepare({ title, itemCount }) {
              const count = Array.isArray(itemCount) ? itemCount.length : 0
              return {
                title: title || '未命名分组',
                subtitle: `${count} 个型号`,
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
      title: '桌面端每屏最大展示数量',
      type: 'number',
      description: 'Desktop 端 slider 每屏最多展示 1-4 个型号；移动端始终只展示 1 个。',
      options: {
        list: [1, 2, 3, 4],
      },
      initialValue: 4,
      validation: (rule) => rule.required().min(1).max(4),
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

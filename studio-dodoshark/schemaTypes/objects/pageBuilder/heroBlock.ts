import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'heroBlock',
    title: 'Hero Block',
    type: 'object',
    icon: () => '🎖️',
    fields: [
        defineField({
            name: 'variant',
            title: '展示样式',
            type: 'string',
            options: {
                list: [
                    { title: '全屏背景轮播（旧版）', value: 'legacyBackgroundSlider' },
                    { title: '分栏产品展示（新版）', value: 'splitProductShowcase' },
                ],
                layout: 'radio'
            },
            initialValue: 'legacyBackgroundSlider'
        }),
        defineField({
            name: 'title',
            title: '标题',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: '副标题',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: '描述',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'images',
            title: 'Hero 图片组',
            description: '旧版样式用于整屏背景轮播；新版分栏样式用于透明产品图轮播。',
            type: 'array',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: '替代文字',
                            validation: (Rule) => Rule.required(),
                        }
                    ]
                }
            ],
            validation: (rule) => rule.min(1)
        }),
        defineField({
            name: 'backgroundImage',
            title: '背景图片',
            description: '新版分栏样式使用的整块背景图，建议上传纯色或浅纹理背景。',
            type: 'image',
            options: { hotspot: true },
            hidden: ({ parent }) => parent?.variant !== 'splitProductShowcase',
            validation: (rule) =>
                rule.custom((value, context) => {
                    if (context.parent?.variant === 'splitProductShowcase' && !value) {
                        return '分栏产品展示模式下必须设置背景图片'
                    }
                    return true
                }),
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: '替代文字',
                    validation: (Rule) => Rule.required(),
                }
            ]
        }),
        defineField({
            name: 'ctaButtons',
            title: '操作按钮',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'label', title: '按钮文字', type: 'string' },
                        {
                            name: 'href',
                            title: '链接地址',
                            type: 'url',
                            validation: (rule) =>
                                rule.uri({allowRelative: true,scheme: ['http','https','mailto','tel']}),
                        },
                        { name: 'primary', title: '是否为主按钮', type: 'boolean', initialValue: false }
                    ]
                }
            ]
        }),
        defineField({
            name: 'alignment',
            title: '对齐方式',
            type: 'string',
            hidden: ({ parent }) => parent?.variant === 'splitProductShowcase',
            options: {
                list: [
                    { title: '居左', value: 'left' },
                    { title: '居右', value: 'right' },
                ],
                layout: 'radio'
            },
            initialValue: 'left'
        }),
        defineField({
            name: 'mediaLayout',
            title: '图文排布',
            type: 'string',
            hidden: ({ parent }) => parent?.variant !== 'splitProductShowcase',
            options: {
                list: [
                    { title: '文字在左，图片在右', value: 'textLeftImageRight' },
                    { title: '图片在左，文字在右', value: 'imageLeftTextRight' },
                ],
                layout: 'radio'
            },
            initialValue: 'textLeftImageRight'
        })
    ],
    preview: {
        select: { title: 'title', subtitle: 'subtitle', media: 'images.0', variant: 'variant' },
        prepare({ title, subtitle, media, variant }) {
            return {
                title: title || 'Hero Block (首屏)',
                subtitle:
                    subtitle ||
                    (variant === 'splitProductShowcase'
                        ? 'Hero Block (Split Product Showcase)'
                        : 'Hero Block (Slider)'),
                media
            }
        }
    }
})

import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
    name: 'richSectionBlock',
    title: 'Rich Section (图文排版)',
    type: 'object',
    icon: () => '📰',
    fields: [
        defineField({
            name: 'heading',
            title: '版块标题',
            type: 'string',
        }),
        defineField({
            name: 'subtitle',
            title: '副标题',
            type: 'string',
        }),
        defineField({
            name: 'body',
            title: '主体内容 (短图文关联描述)',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: '正文', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                    ]
                }
            ]
        }),
        defineField({
            name: 'mediaItems',
            title: '媒体文件',
            type: 'array',
            of: [
                defineArrayMember({
                    title: '媒体项',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'image',
                            title: '图片',
                            type: 'image',
                            options: { hotspot: true },
                        }),
                        defineField({
                            name: 'alt',
                            type: 'string',
                            title: '替代文字 (Alt Text)',
                        }),
                        defineField({
                            name: 'caption',
                            type: 'string',
                            title: '说明文字',
                        })
                    ],
                    preview: {
                        select: {
                            image: 'image',
                            title: 'caption',
                            alt: 'alt',
                        },
                        prepare({ image, title, alt }) {
                            return {
                                title: title || alt || '媒体项',
                                media: image,
                            }
                        }
                    }
                })
            ]
        }),
        defineField({
            name: 'layout',
            title: '排版布局',
            type: 'string',
            options: {
                list: [
                    { title: '文字在左，图片在右', value: 'textLeftMediaRight' },
                    { title: '媒体在左，文字在右', value: 'mediaLeftTextRight' },
                ],
            },
            initialValue: 'textLeftMediaRight',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'disableMediaFrameEffect',
            title: '取消图片边框与效果',
            type: 'boolean',
            description: '开启后将不显示图片圆角、阴影等装饰效果',
            initialValue: false
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
                ]
            },
            initialValue: 'default'
        }),
        defineField({
            name: 'anchorId',
            title: '锚点 ID (可选)',
            type: 'string',
            description: '用于设置本节的锚点以便跳转，如 "features"',
        })
    ],
    preview: {
        select: { title: 'heading', layout: 'layout', media: 'mediaItems.0.image', mediaItems: 'mediaItems' },
        prepare({ title, layout, media, mediaItems }) {
            const mediaCount = Array.isArray(mediaItems) ? mediaItems.length : 0
            return {
                title: title || '图文排版 (Rich Section)',
                subtitle: `布局: ${layout || 'textLeftMediaRight'} · 媒体数: ${mediaCount}`,
                media
            }
        }
    }
})

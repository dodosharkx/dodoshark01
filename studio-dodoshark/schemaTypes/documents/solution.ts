import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'solution',
    title: '解决方案',
    type: 'document',
    icon: () => '💡',
    groups: [
        { name: 'basic', title: '基本信息', default: true },
        { name: 'content', title: '页面内容' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        // --- SEO ---
        defineField({
            name: 'seo',
            title: 'SEO 设置',
            type: 'seoMeta',
            group: 'seo',
        }),
        // --- 基本信息 ---
        defineField({
            name: 'title',
            title: '方案标题',
            type: 'string',
            group: 'basic',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'URL 路径',
            type: 'slug',
            group: 'basic',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'category',
            title: '方案分类',
            type: 'reference',
            to: [{ type: 'category' }],
            group: 'basic',
        }),
        defineField({
            name: 'heroImage',
            title: '头图',
            type: 'image',
            group: 'basic',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: '替代文字 (Alt Text)',
                    validation: (Rule) => Rule.required(),
                },
            ],
        }),
        defineField({
            name: 'summary',
            title: '方案概述',
            type: 'text',
            rows: 4,
            group: 'basic',
        }),
        // --- 页面内容：构建器 ---
        defineField({
            name: 'contentBlocks',
            title: '页面构建器',
            type: 'array',
            group: 'content',
            of: [
                { type: 'heroBlock' },
                { type: 'richSectionBlock' },
                { type: 'featureListBlock' },
                { type: 'mediaGalleryBlock' },
                { type: 'cardGridBlock' },
                { type: 'tableBlock' },
                { type: 'metricsBlock' },
                { type: 'ctaBlock' },
                { type: 'portableTextBlock' },
                { type: 'collectionReferenceBlock' },
                { type: 'machineSelectorBlock' },
                { type: 'showcaseBlock' },
            ],
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'category.title', media: 'heroImage' },
    },
})

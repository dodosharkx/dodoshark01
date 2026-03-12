import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'product',
    title: '产品',
    type: 'document',
    icon: () => '🔧',
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
            title: '产品名称',
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
            title: '产品分类',
            type: 'reference',
            to: [{ type: 'category' }],
            group: 'basic',
            description: '用于产品聚合页筛选，如 Agri Processing / Food Processing',
        }),
        defineField({
            name: 'seriesTag',
            title: '系列标签',
            type: 'string',
            group: 'basic',
            description: '如 Industrial Crushing Series',
        }),
        defineField({
            name: 'shortDescription',
            title: '简短介绍',
            type: 'text',
            rows: 3,
            group: 'basic',
        }),
        defineField({
            name: 'mainImage',
            title: '产品主图',
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
            validation: (rule) => rule.required(),
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
        select: { title: 'title', subtitle: 'seriesTag', media: 'mainImage' },
    },
})



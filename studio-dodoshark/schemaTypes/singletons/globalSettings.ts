import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {itemCount, pickText} from '../shared/studio'

const linkFields = [
  defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
  defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
]

export default defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'branding', title: 'Branding', default: true},
    {name: 'header', title: 'Header'},
    {name: 'contact', title: 'Contact'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'branding',
      description: 'Brand or website name.',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      group: 'branding',
      description:
        'Square PNG used for browser tabs, shortcuts, and Apple touch icon. Recommended size: 512x512 or larger.',
      validation: (rule) => rule.assetRequired().warning('Upload a square PNG for the site favicon.'),
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      group: 'branding',
      description: 'Used in shared header/footer areas.',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'header',
      title: 'Header',
      type: 'object',
      group: 'header',
      fields: [
        defineField({
          name: 'topBar',
          title: 'Top Bar Styles',
          type: 'object',
          fields: [
            defineField({name: 'backgroundColor', title: 'Background Color', type: 'string', description: 'Hex or CSS color (e.g. #f5f5f0).'}),
            defineField({name: 'borderColor', title: 'Border Color', type: 'string', description: 'Hex or CSS color (e.g. #e8e7de).'}),
            defineField({name: 'sloganIcon', title: 'Slogan Icon', type: 'image'}),
            defineField({name: 'workingHoursIcon', title: 'Working Hours Icon', type: 'image'}),
          ],
        }),
        defineField({name: 'sloganLabel', title: 'Slogan Label', type: 'string'}),
        defineField({name: 'sloganText', title: 'Slogan Text', type: 'string'}),
        defineField({name: 'workingHoursLabel', title: 'Working Hours Label', type: 'string'}),
        defineField({name: 'workingHoursText', title: 'Working Hours Text', type: 'string'}),
        defineField({
          name: 'navBackground',
          title: 'Navigation Background Image',
          type: 'image',
          description: 'Background used for navigation area (e.g. footer-background.png texture).',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
          ],
        }),
        defineField({name: 'desktopCtaLabel', title: 'Desktop CTA Label', type: 'string'}),
        defineField({name: 'desktopCtaHref', title: 'Desktop CTA Link', type: 'string'}),
        defineField({name: 'mobileCtaLabel', title: 'Mobile CTA Label', type: 'string'}),
        defineField({name: 'mobileCtaHref', title: 'Mobile CTA Link', type: 'string'}),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Details',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description: 'Public phone number.',
        }),
        defineField({
          name: 'email',
          title: 'Primary Email',
          type: 'string',
          description: 'Public email address.',
          validation: (rule) => rule.email().warning('Invalid email format'),
        }),
        defineField({
          name: 'supportEmail',
          title: 'Support Email',
          type: 'string',
          validation: (rule) => rule.email().warning('Invalid email format'),
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
          description: 'Optional messaging number.',
        }),
        defineField({name: 'websiteLabel', title: 'Website Label', type: 'string'}),
        defineField({name: 'websiteUrl', title: 'Website URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({name: 'headquartersKicker', title: 'Headquarters Kicker', type: 'string'}),
        defineField({
          name: 'headquartersTitle',
          title: 'Headquarters Title',
          type: 'string',
          description: 'Override site name in footer.',
        }),
        defineField({name: 'headquartersBody', title: 'Headquarters Body', type: 'text', rows: 4}),
        defineField({name: 'phoneLabel', title: 'Phone Label', type: 'string'}),
        defineField({name: 'websiteLabelTitle', title: 'Website Label Title', type: 'string', description: 'Label for the website field in footer (Default: Website)'}),
        defineField({name: 'emailLabel', title: 'Email Label', type: 'string'}),
        defineField({name: 'networkKicker', title: 'Network Kicker', type: 'string'}),
        defineField({name: 'networkTitle', title: 'Network Title', type: 'string'}),
        defineField({
          name: 'networkItems',
          title: 'Network Items',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
        }),
        defineField({name: 'socialKicker', title: 'Social Kicker', type: 'string'}),
        defineField({name: 'socialTitle', title: 'Social Title', type: 'string'}),
        defineField({
          name: 'footerMap',
          title: 'Footer Map',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              type: 'image',
              title: 'Map Image',
              fields: [
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                }),
              ],
            }),
            defineField({
              name: 'ariaLabel',
              type: 'string',
              title: 'Aria Label',
              description: 'Accessibility label for the map container.',
            }),
          ],
        }),
        defineField({
          name: 'socialLinks',
          title: 'Social Links',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Facebook', value: 'facebook'},
                      {title: 'X', value: 'x'},
                      {title: 'TikTok', value: 'tiktok'},
                      {title: 'YouTube', value: 'youtube'},
                    ],
                  },
                }),
                defineField({name: 'href', title: 'Link', type: 'string', validation: (rule) => rule.required()}),
              ],
              preview: {
                select: {title: 'label', subtitle: 'href'},
              },
            }),
          ],
        }),
        defineField({
          name: 'footerLinks',
          title: 'Footer Links',
          type: 'array',
          description: 'Ordered links shown in the footer bottom legal area.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: linkFields,
              preview: {select: {title: 'label', subtitle: 'href'}},
            }),
          ],
        }),
        defineField({name: 'copyrightText', title: 'Copyright Text', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo',
      footerLinks: 'footer.footerLinks',
      email: 'contact.email',
      navigation: 'header.navigation',
    },
    prepare({title, media, footerLinks, email, navigation}) {
      const navCount = itemCount(navigation)
      const footerLinkCount = itemCount(footerLinks)

      return {
        title: title || 'Global Settings',
        subtitle:
          pickText(
            email,
            navCount ? `${navCount} nav items` : undefined,
            footerLinkCount ? `${footerLinkCount} footer links` : undefined,
          ) || 'Global settings singleton',
        media,
      }
    },
  },
})

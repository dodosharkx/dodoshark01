import {
  BulbOutlineIcon,
  CaseIcon,
  CogIcon,
  ControlsIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  PackageIcon,
  PlugIcon,
  TagIcon,
  UserIcon,
  VideoIcon,
  WrenchIcon,
} from '@sanity/icons'
import {StructureResolver} from 'sanity/structure'

const sitePageSingletons = [
  {type: 'homePage', title: 'Home Page', icon: HomeIcon},
  {type: 'aboutPage', title: 'About Page', icon: UserIcon},
  {type: 'contactPage', title: 'Contact Page', icon: EnvelopeIcon},
  {type: 'supportPage', title: 'Support Page', icon: BulbOutlineIcon},
  {type: 'recruitAgentsPage', title: 'Recruit Agents Page', icon: UserIcon},
  {type: 'blogPage', title: 'Vlog Listing Page', icon: VideoIcon},
  {type: 'solutionsPage', title: 'Solutions Listing Page', icon: BulbOutlineIcon},
  {type: 'casesPage', title: 'Case Studies Listing Page', icon: CaseIcon},
  {type: 'productPage', title: 'Products Listing Page', icon: PackageIcon},
] as const

export const structure: StructureResolver = (S) =>
  S.list()
    .id('doDoSharkCms')
    .title('DoDoShark CMS')
    .items([
      S.listItem()
        .id('contentManagement')
        .title('Site Pages')
        .icon(HomeIcon)
        .child(
          S.list()
            .id('contentManagementList')
            .title('Site Pages')
            .items(
              sitePageSingletons.map((item) =>
                S.listItem()
                  .id(item.type)
                  .title(item.title)
                  .icon(item.icon)
                  .schemaType(item.type)
                  .child(
                    S.document()
                      .schemaType(item.type)
                      .documentId(item.type),
                  ),
              ),
            ),
        ),
      S.listItem()
        .id('dynamicContent')
        .title('Collections')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .id('dynamicContentList')
            .title('Collections')
            .items([
              S.documentTypeListItem('vlogItem').title('Vlog Videos').icon(VideoIcon),
              S.documentTypeListItem('post').title('Legacy Blog Posts').icon(DocumentTextIcon),
              S.documentTypeListItem('solution').title('Solutions').icon(BulbOutlineIcon),
              S.documentTypeListItem('caseStudy').title('Case Studies').icon(CaseIcon),
              S.documentTypeListItem('product').title('Products').icon(WrenchIcon),
            ]),
        ),
      S.listItem()
        .id('database')
        .title('Reference Library')
        .icon(TagIcon)
        .child(
          S.list()
            .id('databaseList')
            .title('Reference Library')
            .items([
              S.documentTypeListItem('category').title('Categories').icon(TagIcon),
              S.documentTypeListItem('contentTag').title('Shared Tags').icon(TagIcon),
              S.documentTypeListItem('productVariant').title('Product Variants').icon(ControlsIcon),
              S.documentTypeListItem('accessory').title('Accessories').icon(PlugIcon),
              S.documentTypeListItem('author').title('Authors').icon(UserIcon),
              S.documentTypeListItem('globalSettings').title('Global Settings').icon(CogIcon),
            ]),
        ),
    ])

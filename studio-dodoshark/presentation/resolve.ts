import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

type SlugDocument = {
  title?: string
  slug?: {current?: string}
}

function singletonLocation(title: string, href: string) {
  return defineLocations({
    select: {},
    resolve: () => ({
      locations: [{title, href}],
    }),
  })
}

function documentWithSlug(basePath: string, listTitle: string) {
  return defineLocations({
    select: {
      title: 'title',
      slug: 'slug',
    },
    resolve: (doc: SlugDocument | null) => {
      const slug = doc?.slug?.current?.trim()
      const title = doc?.title?.trim() || 'Untitled'
      const locations = [{title: listTitle, href: basePath}]

      if (slug) {
        locations.unshift({
          title,
          href: `${basePath}/${slug}`,
        })
      }

      return {locations}
    },
  })
}

export const presentationResolve: PresentationPluginOptions['resolve'] = {
  locations: {
    globalSettings: singletonLocation('Homepage', '/'),
    homePage: singletonLocation('Home Page', '/'),
    aboutPage: singletonLocation('About Page', '/about'),
    contactPage: singletonLocation('Contact Page', '/contact'),
    supportPage: singletonLocation('Support Page', '/support'),
    recruitAgentsPage: singletonLocation('Recruit Agents Page', '/recruit-agents'),
    privacyPage: singletonLocation('Privacy Page', '/privacy'),
    termsPage: singletonLocation('Terms Page', '/terms'),
    blogPage: singletonLocation('Vlog Listing Page', '/vlog'),
    solutionsPage: singletonLocation('Solutions Listing Page', '/solutions'),
    casesPage: singletonLocation('Case Studies Listing Page', '/cases'),
    productPage: singletonLocation('Products Listing Page', '/products'),
    solution: documentWithSlug('/solutions', 'Solutions Listing Page'),
    caseStudy: documentWithSlug('/cases', 'Case Studies Listing Page'),
    product: documentWithSlug('/products', 'Products Listing Page'),
    vlogItem: singletonLocation('Vlog Listing Page', '/vlog'),
  },
}

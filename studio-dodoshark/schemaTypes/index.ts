// Objects
import seoMeta from './objects/seoMeta'
import solutionHtmlTemplate from './objects/solutionHtmlTemplate'
import portableTextContent from './objects/portableTextBlock'
import caseStudyBlock from './objects/caseStudyBlock'
import challengeBlock from './objects/challengeBlock'
import featureGridBlock from './objects/featureGridBlock'
import productRecommendationBlock from './objects/productRecommendationBlock'
import videoGalleryBlock from './objects/videoGalleryBlock'

// Page Builder Blocks
import heroBlock from './objects/pageBuilder/heroBlock'
import richSectionBlock from './objects/pageBuilder/richSectionBlock'
import featureListBlock from './objects/pageBuilder/featureListBlock'
import mediaGalleryBlock from './objects/pageBuilder/mediaGalleryBlock'
import cardGridBlock from './objects/pageBuilder/cardGridBlock'
import tableBlock from './objects/pageBuilder/tableBlock'
import metricsBlock from './objects/pageBuilder/metricsBlock'
import ctaBlock from './objects/pageBuilder/ctaBlock'
import pageBuilderPortableTextBlock from './objects/pageBuilder/portableTextBlock'
import collectionReferenceBlock from './objects/pageBuilder/collectionReferenceBlock'
import machineSelectorBlock from './objects/pageBuilder/machineSelectorBlock'
import showcaseBlock from './objects/pageBuilder/showcaseBlock'

// Documents - Reference Libraries
import category from './documents/category'
import contentTag from './documents/contentTag'
import productVariant from './documents/productVariant'
import accessory from './documents/accessory'
import author from './documents/author'

// Documents - Dynamic Collections
import product from './documents/product'
import solution from './documents/solution'
import caseStudy from './documents/caseStudy'
import post from './documents/post'
import vlogItem from './documents/vlogItem'

// Singletons
import homePage from './singletons/homePage'
import aboutPage from './singletons/aboutPage'
import contactPage from './singletons/contactPage'
import globalSettings from './singletons/globalSettings'
import blogPage from './singletons/blogPage'
import solutionsPage from './singletons/solutionsPage'
import casesPage from './singletons/casesPage'
import productPage from './singletons/productPage'
import supportPage from './singletons/supportPage'
import recruitAgentsPage from './singletons/recruitAgentsPage'

export const schemaTypes = [
    // Objects
    seoMeta,
    solutionHtmlTemplate,
    portableTextContent,
    caseStudyBlock,
    challengeBlock,
    featureGridBlock,
    productRecommendationBlock,
    videoGalleryBlock,

    // Page Builder Blocks
    heroBlock,
    richSectionBlock,
    featureListBlock,
    mediaGalleryBlock,
    cardGridBlock,
    tableBlock,
    metricsBlock,
    ctaBlock,
    pageBuilderPortableTextBlock,
    collectionReferenceBlock,
    machineSelectorBlock,
    showcaseBlock,

    // Reference Libraries
    category,
    contentTag,
    productVariant,
    accessory,
    author,

    // Dynamic Collections
    product,
    solution,
    caseStudy,
    post,
    vlogItem,

    // Singletons
    homePage,
    aboutPage,
    contactPage,
    globalSettings,
    blogPage,
    solutionsPage,
    casesPage,
    productPage,
    supportPage,
    recruitAgentsPage,
]

// Singleton type names used by structure.ts and sanity.config.ts
export const singletonTypes = new Set([
    'homePage',
    'aboutPage',
    'contactPage',
    'globalSettings',
    'blogPage',
    'solutionsPage',
    'casesPage',
    'productPage',
    'supportPage',
    'recruitAgentsPage',
])

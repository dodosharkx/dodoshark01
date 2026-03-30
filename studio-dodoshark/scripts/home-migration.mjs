import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'

// Manual parsing for reliability
const envStr = fs.readFileSync('front/dodoshark/.env.local', 'utf8')
const projectId = envStr.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=["']?([^"'\s]+)/)?.[1]
const token = envStr.match(/SANITY_API_EDITOR_TOKEN=["']?([^"'\s]+)/)?.[1]

if (!projectId || !token) {
  console.error('Missing Project ID or Token')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset: 'production',
  token,
  useCdn: false,
  apiVersion: '2025-09-25'
})

const BASE_PATH = path.resolve(process.cwd(), 'front/dodoshark')

async function uploadImage(localPath, alt) {
  const fullPath = path.join(BASE_PATH, localPath)
  if (!fs.existsSync(fullPath)) {
    console.warn(`[WARN] File not found: ${fullPath}`)
    return null
  }
  const asset = await client.assets.upload('image', fs.createReadStream(fullPath), {
    filename: path.basename(fullPath)
  })
  return {
    _type: 'image',
    alt,
    asset: {
      _type: 'reference',
      _ref: asset._id
    }
  }
}

async function run() {
  console.log('Starting homepage content migration...')

  // Hardcoded Data from app/page.tsx
  const stats = [
    { value: '55', suffix: 'Years', label: 'Industry History' },
    { value: '10,000', suffix: 'sqm', label: 'Factory Area' },
    { value: '1,000', suffix: '+', label: 'Export Regions' },
    { value: '10,000', suffix: '+', label: 'Annual Yield' },
  ]

  const aboutFeaturesLocal = [
    {
      title: 'Est. 1970',
      description: 'Formerly a state-owned mill factory, DoDoShark was established in 2019 after restructuring. Anchored by the mission of "Empowering Productivity," we began a new brand journey.',
      image: 'public/assets/images/icon-since-1970.png',
      alt: 'Established 1970'
    },
    {
      title: 'Three Production Bases',
      description: 'A modern production network delivers stable output, standardized manufacturing, and the flexibility required for custom industrial projects.',
      image: 'public/assets/images/icon-three-production-bases.png',
      alt: 'Three Production Bases'
    },
    {
      title: 'Two Product Lines',
      description: 'Agri-processing and food-processing machinery operate as dual growth engines, covering crushing, grinding, mixing, and integrated line solutions.',
      image: 'public/assets/images/icon-two-product-lines.png',
      alt: 'Two Product Lines'
    }
  ]

  const confidenceCardsLocal = [
    {
      title: 'Technical Lead',
      subtitle: 'Continuous Innovation as Industry Model',
      points: ['Grain grinding fineness up to 150 mesh', 'Uniform mixing of dozens of powders in 15 min', 'Dust suppression ratio up to 99.99%'],
      image: 'public/assets/images/technology-leadership.png',
      alt: 'Technical Leadership'
    },
    {
      title: 'Rigorous Delivery',
      subtitle: 'Factory Inspection on Every Critical Detail',
      points: ['Strict process inspection before shipment', 'Stable structure for long-cycle operation', 'Delivery quality controlled by full-line checks'],
      image: 'public/assets/images/rigorous-factory-inspection.png',
      alt: 'Rigorous Inspection'
    },
    {
      title: 'Beyond Single Products',
      subtitle: 'Integrated Equipment for Complete Workflows',
      points: ['Single-machine and line integration available', 'Flexible matching for powders and granules', 'One supplier for equipment and process support'],
      image: 'public/assets/images/beyond-single-products.png',
      alt: 'Solutions Integration'
    }
  ]

  const advantagesLocal = [
    {
      title: 'Smart Mfg. Strength',
      description: 'Scale efficiency balanced with bespoke innovation.',
      image: 'public/assets/images/icon-professional-technology.png',
      alt: 'Smart Mfg. Strength'
    },
    {
      title: 'Total Range Strategy',
      description: 'One-stop solutions reducing costs and boosting speed.',
      image: 'public/assets/images/icon-craftsmanship.png',
      alt: 'Total Range Strategy'
    },
    {
      title: 'Full-Life Service',
      description: 'From process design to training, we navigate with you.',
      image: 'public/assets/images/icon-custom-solutions.png',
      alt: 'Full-Life Service'
    },
    {
      title: 'Extended Warranty',
      description: '10-year core component warranty for total peace of mind.',
      image: 'public/assets/images/icon-one-choice.png',
      alt: 'Extended Warranty'
    }
  ]

  // Step 1: Upload singleton images
  console.log('Uploading singleton images...')
  const heroBg = await uploadImage('public/assets/images/factory.jpg', 'DoDoShark Factory Hub')
  const videoCover = await uploadImage('public/assets/images/brand/DoDoShark-Brand-cover.jpg', 'Brand Story')
  const prodBanner = await uploadImage('public/assets/images/banner.png', 'Products Banner')
  const solBg = await uploadImage('public/assets/images/factory.jpg', 'Solutions Background')
  const logoWhite = await uploadImage('public/assets/images/dodoshark-logo-04.png', 'Logo White')

  // Step 2: Upload section images and prepare objects
  console.log('Preparing section items...')
  const aboutFeatures = await Promise.all(aboutFeaturesLocal.map(async item => ({
    _key: `key-${Math.random().toString(36).substr(2, 9)}`,
    title: item.title,
    description: item.description,
    image: await uploadImage(item.image, item.alt)
  })))

  const confidenceCards = await Promise.all(confidenceCardsLocal.map(async item => ({
    _key: `key-${Math.random().toString(36).substr(2, 9)}`,
    title: item.title,
    subtitle: item.subtitle,
    points: item.points,
    image: await uploadImage(item.image, item.alt)
  })))

  const advantageItems = await Promise.all(advantagesLocal.map(async item => ({
    _key: `key-${Math.random().toString(36).substr(2, 9)}`,
    title: item.title,
    description: item.description,
    image: await uploadImage(item.image, item.alt)
  })))

  // Step 3: Build the homePage document
  console.log('Updating homePage document...')
  const homePageData = {
    _type: 'homePage',
    _id: 'homePage',
    heroEyebrow: '20 Years of Focus in Crushing & Grinding',
    heroTitle: 'Dual-Engine Business Model',
    heroSubtitle: 'Agri-Processing + Food Processing',
    heroDescription: 'DoDoShark is dedicated to providing professional crushing, grinding, and mixing solutions, boosting efficiency and product quality for enterprises.',
    heroBackgrounds: heroBg ? [{ _key: 'initial-bg', _type: 'heroBackgroundItem', alt: 'DoDoShark Factory Hub', asset: heroBg.asset }] : [],
    stats: stats.map((s, i) => ({ _key: `stat-${i}`, ...s })),
    aboutFeatures,
    confidenceSection: {
      titleLineOne: 'Choose DodoShark',
      titleLineTwo: 'Choose Confidence',
      description: 'Quality is not only in the machine, but in the trust we build with every client through rigorous testing and technical leadership.',
      cards: confidenceCards
    },
    advantagesSection: {
      title: 'Our Advantages',
      items: advantageItems
    },
    whyChooseUsVideoUrl: 'https://www.youtube.com/watch?v=Nn_r-Esh-oQ',
    whyChooseUsVideoCoverImage: videoCover,
    productsBannerImage: prodBanner,
    solutionsBackgroundImage: solBg,
    aboutUsLogoImage: logoWhite
  }

  await client.createOrReplace(homePageData)
  console.log('[SUCCESS] Homepage content migrated successfully.')
}

run().catch(err => {
  console.error('[ERROR] Migration failed:', err)
  process.exit(1)
})

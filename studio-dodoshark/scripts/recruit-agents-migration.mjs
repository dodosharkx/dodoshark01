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
  console.log('Starting Recruit Agents page content migration...')

  // Step 1: Upload images
  console.log('Uploading page images...')
  const heroBg = await uploadImage('public/assets/images/about/join-us.jpg', 'DoDoShark Global Partnership')
  const scopeImg = await uploadImage('public/assets/images/about/global-layout.jpg', 'DoDoShark Global Layout')

  // Step 2: Build the recruitAgentsPage document
  console.log('Updating recruitAgentsPage document...')
  const pageData = {
    _type: 'recruitAgentsPage',
    _id: 'recruitAgentsPage',
    seo: {
      title: 'Recruit Agents | DoDoShark Machinery',
      description: 'Join the DoDoShark global network. We are looking for high-quality partners to share global industrial dividends and set new brand benchmarks.',
    },
    hero: {
      eyebrow: 'Overseas Partner (Agent) Recruitment Plan',
      title: 'Partner with DoDoShark Explore Global Blue Oceans',
      subtitle: 'In the wave of global manufacturing upgrades, premium mechanical equipment is the core competitiveness. DoDoShark invites you to seize regional market dividends and embark on a new journey of growth together.',
      primaryCtaLabel: 'Apply Now',
      primaryCtaHref: '/contact'
    },
    whyChooseUs: [
      {
        _key: 'wcu-1',
        title: 'Continuous Innovation',
        description: 'Our professional R&D team focuses on "differentiated product value," establishing unique competitive advantages in regional markets beyond low-price competition.'
      },
      {
        _key: 'wcu-2',
        title: 'Superior Quality',
        description: 'Combined cutting-edge technology with precision manufacturing. High satisfaction, low failure rates, and long service life across all processing scenarios.'
      },
      {
        _key: 'wcu-3',
        title: 'Diverse Portfolio',
        description: 'Full-category matrix from small crushers to large-scale equipment, covering agriculture, food, and chemicals with precise configuration coverage.'
      },
      {
        _key: 'wcu-4',
        title: 'Stable Supply',
        description: 'Independent control from R&D to assembly. No chain-break risks, fast order response, and timely global delivery guaranteed.'
      }
    ],
    scope: {
      title: 'Strategic Layout, Precise Recruitment',
      description: 'We are actively expanding our global presence, focusing on regions with high agricultural and industrial potential.'
    },
    scopeRegions: [
      {
        _key: 'reg-1',
        region: 'Africa',
        countries: ['Nigeria', 'Ghana', 'Benin', 'Kenya', 'Ethiopia', 'Senegal']
      },
      {
        _key: 'reg-2',
        region: 'Southeast Asia',
        countries: ['Philippines', 'Indonesia', 'Thailand', 'Vietnam', 'Laos', 'Cambodia']
      },
      {
        _key: 'reg-3',
        region: 'South America',
        countries: ['Brazil', 'Mexico', 'Argentina']
      },
      {
        _key: 'reg-4',
        region: 'Central Asia',
        countries: ['Kazakhstan', 'Pakistan', 'Uzbekistan']
      }
    ],
    requirements: [
      {
        _key: 'req-1',
        title: 'Qualifications',
        items: ['Legal operating status & qualifications', 'Familiarity with local market & laws', 'Strong local customer resources']
      },
      {
        _key: 'req-2',
        title: 'Capabilities',
        items: ['3+ years mechanical sales experience', 'Professional tech & sales team', 'Full lifecycle service capability']
      },
      {
        _key: 'req-3',
        title: 'Compliance',
        items: ['Adherence to market rules & integrity', 'Solid financial & credit standing', 'Adequate capital for operations']
      }
    ],
    supportSections: [
      {
        _key: 'sup-1',
        title: 'Product & Supply Chain',
        items: [
          'Competitive pricing & flex ordering',
          'Intelligent inventory management',
          'Customized SKU for regional needs'
        ]
      },
      {
        _key: 'sup-2',
        title: 'Brand & Marketing',
        items: ['Unified VI & multi-lang materials', 'Global promotion resources', 'Localized marketing guidance']
      },
      {
        _key: 'sup-3',
        title: 'Training & After-Sales',
        items: ['24/7 dedicated technical support', 'Remote troubleshooting & spare parts', 'Master product selling points & setup']
      },
      {
        _key: 'sup-4',
        title: 'Cooperation Model',
        items: ['Exclusive & regional agency options', 'Transparent commission & incentives', 'Standardized sustainable agreements']
      }
    ],
    cta: {
      title: 'Act Now and Share the Dividends',
      description: "We believe that combining DoDoShark's excellent products with your localized advantages will create miracles. If you are ready to start a new chapter, contact us today.",
      buttonLabel: 'Contact Us To Apply',
      buttonHref: '/contact'
    },
    images: {
      heroBackground: heroBg,
      recruitmentScopeImage: scopeImg
    }
  }

  await client.createOrReplace(pageData)
  console.log('[SUCCESS] Recruit Agents page content migrated successfully.')
}

run().catch(err => {
  console.error('[ERROR] Migration failed:', err)
  process.exit(1)
})

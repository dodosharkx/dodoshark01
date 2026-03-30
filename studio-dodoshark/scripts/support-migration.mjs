import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'

// Robust environment loading
const envPath = path.resolve(process.cwd(), 'front/dodoshark/.env.local')
const envStr = fs.readFileSync(envPath, 'utf8')
const projectId = envStr.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=["']?([^"'\s]+)/)?.[1]
const token = envStr.match(/SANITY_API_EDITOR_TOKEN=["']?([^"'\s]+)/)?.[1]

if (!projectId || !token) {
  console.error('Missing Project ID or Token in', envPath)
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
  console.log('Starting support page content migration...')

  // Step 1: Upload singleton images
  console.log('Uploading page-level images...')
  const heroBg = await uploadImage('public/assets/images/about/support-hero.jpg', 'DoDoShark Global Service')
  const supportTeam = await uploadImage('public/assets/images/about/team.jpg', 'DoDoShark Global Support Team')

  // Step 2: Upload stage images
  console.log('Uploading stage images...')
  const preSalesImage = await uploadImage('public/assets/images/about/support-hero.jpg', 'Solution Co-creation')
  const midSalesImage = await uploadImage('public/assets/images/about/dust-control.png', 'Precise Implementation')
  const afterSalesImage = await uploadImage('public/assets/images/about/join-us.jpg', 'Lifelong Service')

  // Step 3: Build the supportPage document
  console.log('Updating supportPage document...')
  const supportPageData = {
    _type: 'supportPage',
    _id: 'supportPage',
    hero: {
      eyebrow: 'World-Class Service Network',
      title: 'Service That Powers Results',
      description: 'We are not just an equipment supplier, but your lifelong partner in value co-creation. We deliver measurable, continuously optimized production results.'
    },
    stats: [
      { _key: 'stat-warranty', label: 'Core Component Warranty', value: '3 Years' },
      { _key: 'stat-response', label: 'Technical Response Time', value: '24/7' },
      { _key: 'stat-countries', label: 'Countries Served', value: '100+' },
      { _key: 'stat-availability', label: 'Spare Parts Availability', value: '99%' }
    ],
    serviceIntro: {
      eyebrow: 'Value Co-Creation',
      title: 'Full-Lifecycle Efficiency Empowerment'
    },
    serviceStages: [
      {
        _key: 'stage-01',
        id: '01',
        phase: 'Pre-Sales',
        title: 'Solution Co-creation & Professional Selection',
        description: 'Beyond selling equipment, we guarantee results. Through deep research into material properties, capacity requirements, and site conditions, we output precision analysis reports to anchor your efficiency targets.',
        features: [
          'Full-Dimensional Deep Research',
          'Customized Process Solutions',
          'Free Trial Production & Optimization',
          'Transparent Efficiency Modeling'
        ],
        image: preSalesImage
      },
      {
        _key: 'stage-02',
        id: '02',
        phase: 'Mid-Sales',
        title: 'Precise Implementation & Efficiency Delivery',
        description: 'A seamless transfer of knowledge and technology. All equipment undergoes 12-hour factory stress tests of core components and full-system assembly trails to ensure stability before arrival.',
        features: [
          '12h Factory Performance Test',
          'Professional Export Packaging',
          'Technical Documentation Transfer',
          '30-Day Priority Response Support'
        ],
        image: midSalesImage
      },
      {
        _key: 'stage-03',
        id: '03',
        phase: 'After-Sales',
        title: 'Lifelong Service & Continuous Optimization',
        description: 'Beyond standard maintenance, we safeguard your full lifecycle efficiency. This includes remote guidance for technical challenges, 3-year core warranty, and annual reviews to identify upgrade potential.',
        features: [
          '3-Year Core Component Warranty',
          'Annual Efficiency Review & Upgrade',
          'Ongoing Technical Empowerment',
          'Rapid Maintenance Support'
        ],
        image: afterSalesImage
      }
    ],
    urgentAssistance: {
      title: 'Need Urgent Assistance?',
      description: 'Our global technical response team is on standby to help you resolve equipment issues, order spare parts, or schedule an efficiency audit.',
      hotlineLabel: '24/7 Hotline',
      hotlineValue: '+86 19941519694',
      salesLabel: 'Sales',
      salesEmail: 'sales@dodoshark.com',
      supportLabel: 'Technical Support',
      supportEmail: 'support@dodoshark.com',
      teamCaptionTitle: 'Experts You Can Trust',
      teamCaptionDescription: 'Direct connection to senior engineers.'
    },
    cta: {
      title: 'Ready to Optimize Your Value Partnership?',
      description: 'Experience the DoDoShark difference with a partner that accompanies your growth from equipment service to full-lifecycle empowerment.',
      buttonLabel: 'Request Efficiency Audit',
      buttonHref: '/contact'
    },
    images: {
      heroBackground: heroBg,
      supportTeamImage: supportTeam
    }
  }

  await client.createOrReplace(supportPageData)
  await client.createOrReplace({ ...supportPageData, _id: 'drafts.supportPage' })
  console.log('[SUCCESS] Support page content migrated (with keys and draft) successfully.')
}

run().catch(err => {
  console.error('[ERROR] Migration failed:', err)
  process.exit(1)
})

import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables from frontend directory
const envPath = path.resolve(process.cwd(), 'front/dodoshark/.env.local')
dotenv.config({ path: envPath })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_EDITOR_TOKEN

if (!projectId || !token) {
  console.error('Missing Sanity Project ID or Editor Token in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2025-09-25'
})

const BASE_PATH = path.resolve(process.cwd(), 'front/dodoshark')

const MAPPING = [
  // Home Page
  { docId: 'homePage', field: 'heroBackgrounds', isArray: true, itemIndex: 0, local: 'public/assets/images/factory.jpg', alt: 'DoDoShark Factory Hub' },
  { docId: 'homePage', field: 'aboutFeatures', isArray: true, itemIndex: 0, local: 'public/assets/images/icon-since-1970.png', alt: 'Established 1970' },
  { docId: 'homePage', field: 'aboutFeatures', isArray: true, itemIndex: 1, local: 'public/assets/images/icon-three-production-bases.png', alt: 'Three Production Bases' },
  { docId: 'homePage', field: 'aboutFeatures', isArray: true, itemIndex: 2, local: 'public/assets/images/icon-two-product-lines.png', alt: 'Two Product Lines' },
  { docId: 'homePage', field: 'confidenceSection.cards', isArray: true, itemIndex: 0, local: 'public/assets/images/technology-leadership.png', alt: 'Technical Leadership' },
  { docId: 'homePage', field: 'confidenceSection.cards', isArray: true, itemIndex: 1, local: 'public/assets/images/rigorous-factory-inspection.png', alt: 'Rigorous Inspection' },
  { docId: 'homePage', field: 'confidenceSection.cards', isArray: true, itemIndex: 2, local: 'public/assets/images/beyond-single-products.png', alt: 'Solutions Integration' },
  { docId: 'homePage', field: 'advantagesSection.items', isArray: true, itemIndex: 0, local: 'public/assets/images/icon-professional-technology.png', alt: 'Smart Mfg. Strength' },
  { docId: 'homePage', field: 'advantagesSection.items', isArray: true, itemIndex: 1, local: 'public/assets/images/icon-craftsmanship.png', alt: 'Total Range Strategy' },
  { docId: 'homePage', field: 'advantagesSection.items', isArray: true, itemIndex: 2, local: 'public/assets/images/icon-custom-solutions.png', alt: 'Full-Life Service' },
  { docId: 'homePage', field: 'advantagesSection.items', isArray: true, itemIndex: 3, local: 'public/assets/images/icon-one-choice.png', alt: 'Extended Warranty' },
  { docId: 'homePage', field: 'productsBannerImage', local: 'public/assets/images/banner.png', alt: 'Products Banner' },
  { docId: 'homePage', field: 'solutionsBackgroundImage', local: 'public/assets/images/factory.jpg', alt: 'Solutions Background' },
  { docId: 'homePage', field: 'aboutUsLogoImage', local: 'public/assets/images/dodoshark-logo-04.png', alt: 'DoDoShark Logo' },

  // Listing Pages
  { docId: 'productPage', field: 'hero.image', local: 'public/assets/images/factory.jpg', alt: 'Products Hero' },
  { docId: 'solutionsPage', field: 'hero.image', local: 'public/assets/images/factory.jpg', alt: 'Solutions Hero' },
  { docId: 'casesPage', field: 'hero.image', local: 'public/assets/images/factory.jpg', alt: 'Cases Hero' },
  { docId: 'blogPage', field: 'hero.image', local: 'public/assets/images/factory.jpg', alt: 'Vlog Hero' },

  // About Page
  { docId: 'aboutPage', field: 'hero.image', local: 'public/assets/images/factory.jpg', alt: 'About Hero' },
  { docId: 'aboutPage', field: 'images.brandStoryThumbnail', local: 'public/assets/images/brand/DoDoShark-Brand-cover.jpg', alt: 'Brand Story' },
  { docId: 'aboutPage', field: 'images.globalLayoutBackgroundImage', local: 'public/assets/images/about/global-layout.jpg', alt: 'Global Layout' },
  { docId: 'aboutPage', field: 'images.teamImage', local: 'public/assets/images/about/team.jpg', alt: 'Our Team' },
  { docId: 'aboutPage', field: 'images.valuePropositionBackgroundImage', local: 'public/assets/images/about/value-proposition.jpg', alt: 'Value Proposition' },
  { docId: 'aboutPage', field: 'images.joinUsImage', local: 'public/assets/images/about/join-us.jpg', alt: 'Join Us' },
  { docId: 'aboutPage', field: 'images.productSystemAgricultureImage', local: 'public/assets/images/about/dual-track-agri.jpg', alt: 'Agri Machinery' },
  { docId: 'aboutPage', field: 'images.productSystemFoodImage', local: 'public/assets/images/about/dual-track-food.jpg', alt: 'Food Machinery' },
  { docId: 'aboutPage', field: 'timeline', isArray: true, itemIndex: 0, local: 'public/assets/images/about/history-1.jpg', alt: 'Timeline 1' },
  { docId: 'aboutPage', field: 'timeline', isArray: true, itemIndex: 1, local: 'public/assets/images/about/history-2.jpg', alt: 'Timeline 2' },
  { docId: 'aboutPage', field: 'timeline', isArray: true, itemIndex: 2, local: 'public/assets/images/about/history-3.jpg', alt: 'Timeline 3' },
  { docId: 'aboutPage', field: 'timeline', isArray: true, itemIndex: 3, local: 'public/assets/images/about/history-4.jpg', alt: 'Timeline 4' },
  { docId: 'aboutPage', field: 'timeline', isArray: true, itemIndex: 4, local: 'public/assets/images/about/history-5.jpg', alt: 'Timeline 5' },
  { docId: 'aboutPage', field: 'timeline', isArray: true, itemIndex: 5, local: 'public/assets/images/about/history-6.jpg', alt: 'Timeline 6' },

  // Contact Page
  { docId: 'contactPage', field: 'hero.backgroundImage', local: 'public/assets/images/about/contact-hero.jpg', alt: 'Contact Hero' },
  { docId: 'contactPage', field: 'showroom.image', local: 'public/assets/images/showroom-1.jpg', alt: 'Showroom' },

  // Global Settings
  { docId: 'globalSettings', field: 'header.headerBackground', local: 'public/assets/images/background/footer-background.png', alt: 'Header Background' },
  { docId: 'globalSettings', field: 'footer.footerMapImage', local: 'public/assets/images/background/footer-map-image.png', alt: 'Global Presence Map' },

  // Support Page
  { docId: 'supportPage', field: 'images.heroBackground', local: 'public/assets/images/about/support-hero.jpg', alt: 'Support Hero' },
  { docId: 'supportPage', field: 'images.supportTeamImage', local: 'public/assets/images/about/team.jpg', alt: 'Support Team' },
  { docId: 'supportPage', field: 'serviceStages', isArray: true, itemIndex: 0, local: 'public/assets/images/about/support-hero.jpg', alt: 'Pre-Sales Stage' },
  { docId: 'supportPage', field: 'serviceStages', isArray: true, itemIndex: 1, local: 'public/assets/images/about/dust-control.png', alt: 'Mid-Sales Stage' },
  { docId: 'supportPage', field: 'serviceStages', isArray: true, itemIndex: 2, local: 'public/assets/images/about/join-us.jpg', alt: 'After-Sales Stage' },

  // Recruit Agents Page
  { docId: 'recruitAgentsPage', field: 'images.heroBackground', local: 'public/assets/images/about/join-us.jpg', alt: 'Recruitment Hero' },
  { docId: 'recruitAgentsPage', field: 'images.recruitmentScopeImage', local: 'public/assets/images/about/global-layout.jpg', alt: 'Global Layout' },
]

async function run() {
  console.log('Starting asset migration...')

  for (const item of MAPPING) {
    const fullLocalPath = path.join(BASE_PATH, item.local)
    if (!fs.existsSync(fullLocalPath)) {
      console.warn(`[WARN] File not found: ${fullLocalPath}`)
      continue
    }

    try {
      console.log(`[PROCESS] Uploading ${item.local} for ${item.docId}:${item.field}...`)
      const asset = await client.assets.upload('image', fs.createReadStream(fullLocalPath), {
        filename: path.basename(fullLocalPath)
      })

      const imageObject = {
        _type: 'image',
        alt: item.alt,
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }

      if (item.isArray) {
        // Special handling for heroBackgrounds as it uses a specific name for items
        const isHeroBg = item.field === 'heroBackgrounds';
        const nestedItem = isHeroBg 
            ? { ...imageObject, _key: `key-${item.itemIndex}`, _type: 'heroBackgroundItem' }
            : { image: imageObject, _key: `key-${item.itemIndex}` };

        // For arrays, we use patch to update or append
        // This is a simplified approach: we assume items exist or we replace them
        await client.patch(item.docId)
          .setIfMissing({ [item.field]: [] })
          .insert('replace', `${item.field}[${item.itemIndex}]`, [nestedItem])
          .commit()
      } else {
        await client.patch(item.docId).set({ [item.field]: imageObject }).commit()
      }

      console.log(`[SUCCESS] ${item.local} -> ${item.docId}:${item.field}`)
    } catch (err) {
      console.error(`[ERROR] Failed to process ${item.local}:`, err.message)
    }
  }

  console.log('Migration complete.')
}

run()

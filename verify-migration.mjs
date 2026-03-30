import { createClient } from '@sanity/client'
import fs from 'fs'

const envStr = fs.readFileSync('front/dodoshark/.env.local', 'utf8')
const projectId = envStr.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=["']?([^"'\s]+)/)?.[1]
const token = envStr.match(/SANITY_API_EDITOR_TOKEN=["']?([^"'\s]+)/)?.[1]

const client = createClient({
  projectId,
  dataset: 'production',
  token,
  useCdn: false,
  apiVersion: '2025-09-25'
})

async function verify() {
  const data = await client.fetch('*[_id == "homePage"][0]')
  if (data && data.heroTitle === 'Dual-Engine Business Model') {
    console.log('[VERIFIED] Homepage singleton exists with correct title.')
    console.log('Stats length:', data.stats?.length)
    console.log('About features length:', data.aboutFeatures?.length)
  } else {
    console.error('[FAIL] Homepage data not found or incorrect.')
  }
}

verify().catch(console.error)

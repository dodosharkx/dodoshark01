import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

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

async function checkDocs() {
  const docs = await client.fetch('*[_type in ["homePage", "product", "solution", "caseStudy"]] { _id, _type, title }')
  process.stdout.write(JSON.stringify(docs, null, 2))
}

checkDocs().catch(err => {
  console.error(err)
  process.exit(1)
})

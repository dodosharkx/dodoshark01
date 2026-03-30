import fs from 'fs'
import fsPromises from 'fs/promises'
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

function toPortableText(sections) {
  const blocks = []
  sections.forEach((section, index) => {
    // Add Title as H2
    blocks.push({
      _key: `title-${index}`,
      _type: 'block',
      children: [{ _key: `title-child-${index}`, _type: 'span', text: section.title, marks: [] }],
      markDefs: [],
      style: 'h2'
    })

    // Add Paragraphs
    section.body.forEach((para, pIndex) => {
      blocks.push({
        _key: `para-${index}-${pIndex}`,
        _type: 'block',
        children: [{ _key: `para-child-${index}-${pIndex}`, _type: 'span', text: para, marks: [] }],
        markDefs: [],
        style: 'normal'
      })
    })
  })
  return blocks
}

const PRIVACY_SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'We may collect business contact data such as name, company, email, phone number, country, and inquiry details when you submit forms or communicate with us.',
      'We may also collect device and usage information for analytics, website security, and service improvement.',
    ],
  },
  {
    title: '2. How We Use Information',
    body: [
      'We use collected information to provide quotations, respond to inquiries, prepare technical proposals, fulfill contracts, and improve our products and services.',
      'We do not sell personal data to third parties.',
    ],
  },
  {
    title: '3. Legal Basis and International Transfers',
    body: [
      'Where required by applicable law, we process information based on consent, contract performance, legitimate interests, or legal obligations.',
      'Your data may be processed in regions where DoDoShark or its service providers operate, with reasonable safeguards in place.',
    ],
  },
  {
    title: '4. Data Sharing',
    body: [
      'We may share information with logistics partners, payment providers, technical service providers, and legal advisors when necessary to deliver products and services.',
      'All service providers are expected to handle data securely and only for authorized purposes.',
    ],
  },
  {
    title: '5. Cookies and Tracking',
    body: [
      'We use cookies and similar technologies to remember preferences, measure traffic, and optimize website performance.',
      'You can control cookies through your browser settings, but some website functions may be affected.',
    ],
  },
  {
    title: '6. Data Retention and Security',
    body: [
      'We retain data only as long as needed for the purposes described in this policy or as required by law.',
      'We apply reasonable technical and organizational measures to protect data against unauthorized access, disclosure, or loss.',
    ],
  },
  {
    title: '7. Your Rights',
    body: [
      'Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, or object to certain processing activities.',
      'To exercise your rights, contact us through the details below.',
    ],
  },
  {
    title: '8. Contact',
    body: ['For privacy questions or data requests, email privacy@dodoshark.com.'],
  },
]

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By accessing or using DoDoShark websites, documents, quotations, products, or technical services, you agree to these Terms of Service.',
      'If you are acting on behalf of a company, you confirm that you have authority to bind that company to this agreement.',
    ],
  },
  {
    title: '2. Product and Technical Information',
    body: [
      'All product descriptions, capacities, dimensions, and performance values are provided for reference and may vary by model, raw material, and operation environment.',
      'Final technical scope is defined by the signed quotation, contract, and confirmed technical annexes.',
    ],
  },
  {
    title: '3. Quotations, Orders, and Payment',
    body: [
      'Quotations are valid only within the stated validity period and are subject to confirmation of stock, production schedule, and engineering requirements.',
      'Prices, payment milestones, and delivery terms follow the executed contract or proforma invoice.',
    ],
  },
  {
    title: '4. Delivery, Installation, and Risk',
    body: [
      'Delivery terms are interpreted according to the latest Incoterms edition unless otherwise specified in writing.',
      'Customer is responsible for site readiness, utilities, local permits, and operator safety training before commissioning.',
    ],
  },
  {
    title: '5. Warranty and Limitation of Liability',
    body: [
      'Warranty scope and period follow the signed sales agreement. Wear parts, misuse, unauthorized modifications, and force majeure are excluded unless agreed otherwise.',
      'To the extent permitted by law, DoDoShark is not liable for indirect, incidental, or consequential damages, including production downtime or profit loss.',
    ],
  },
  {
    title: '6. Intellectual Property',
    body: [
      'All technical drawings, manuals, media assets, and website content are owned by DoDoShark or its licensors and may not be copied or redistributed without written consent.',
    ],
  },
  {
    title: '7. Governing Law and Dispute Resolution',
    body: [
      'Unless a contract states otherwise, disputes shall first be resolved through friendly negotiation. If unresolved, disputes may be submitted to competent arbitration or court under the governing law specified in the relevant agreement.',
    ],
  },
  {
    title: '8. Contact',
    body: ['For contract, legal, or compliance questions, contact our team at legal@dodoshark.com.'],
  },
]

async function run() {
  console.log('Starting Legal pages migration...')

  // Step 1: Privacy Page
  console.log('Updating privacyPage document...')
  await client.createOrReplace({
    _type: 'privacyPage',
    _id: 'privacyPage',
    seo: {
      title: 'Privacy Policy | DoDoShark Machinery',
      description: 'How DoDoShark collects, uses, and protects business and website data.',
    },
    lastUpdated: 'March 4, 2026',
    heroTitle: 'Privacy Policy',
    heroDescription: 'How we protect your data across industrial sales, technical support, and website operations.',
    content: toPortableText(PRIVACY_SECTIONS),
    bottomCta: {
      title: 'Need Data Compliance Support?',
      description: 'For NDA workflows, procurement compliance, or customer data handling requests, our team will respond within 2 business days.',
      buttonLabel: 'Contact Privacy Team',
      buttonHref: '/contact'
    }
  })

  // Step 2: Terms Page
  console.log('Updating termsPage document...')
  await client.createOrReplace({
    _type: 'termsPage',
    _id: 'termsPage',
    seo: {
      title: 'Terms of Service | DoDoShark Machinery',
      description: 'Terms and conditions for using DoDoShark industrial equipment and website services.',
    },
    lastUpdated: 'March 4, 2026',
    heroTitle: 'Terms of Service',
    heroDescription: 'Legal terms for accessing and using DoDoShark products, website, and related services.',
    content: toPortableText(TERMS_SECTIONS),
    bottomCta: {
      title: 'Need Contract Clarification?',
      description: 'Our engineering and compliance teams can align legal terms with your procurement process and local project requirements.',
      buttonLabel: 'Contact DoDoShark',
      buttonHref: '/contact'
    }
  })

  console.log('[SUCCESS] Legal pages content migrated successfully.')
}

run().catch(err => {
  console.error('[ERROR] Migration failed:', err)
  process.exit(1)
})

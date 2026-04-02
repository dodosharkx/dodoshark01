import type { Metadata } from 'next'
import Image from 'next/image'

import { getGlobalContact } from '@/lib/global-contact'
import { fetchSanityData } from '@/lib/sanity.live'
import { buildPageMetadata } from '@/lib/seo'
import { renderText, sanitizeAltText, toImageSrc } from '@/lib/sanity-utils'
import type { SanityImage, SeoMeta } from '@/lib/types/sanity'
import LeadInquiryForm from '@/components/forms/LeadInquiryForm'
import HeroTitle from '@/components/ui/HeroTitle'
import CMSImage from '@/components/ui/CMSImage'

type ContactPageData = {
  seo?: SeoMeta
  hero?: {
    title?: string
    subtitle?: string
    backgroundImage?: SanityImage
  }
  showroom?: {
    title?: string
    description?: string
    image?: SanityImage
  }
  headquarters?: {
    title?: string
    description?: string
    note?: string
  }
  productionBases?: {
    title?: string
    description?: string
    cities?: string[]
  }
  directContact?: {
    title?: string
    phone?: string
    email?: string
    websiteLabel?: string
    websiteUrl?: string
  }
  inquiryPanel?: {
    title?: string
    description?: string
  }
}

const CONTACT_PAGE_QUERY = `coalesce(
  *[_id == "contactPage"][0],
  *[_type == "contactPage"][0]
){
  seo,
  hero{
    title,
    subtitle,
    backgroundImage{
      alt,
      asset
    }
  },
  showroom{
    title,
    description,
    image{
      alt,
      asset
    }
  },
  headquarters{
    title,
    description,
    note
  },
  productionBases{
    title,
    description,
    cities
  },
  directContact{
    title,
    phone,
    email,
    websiteLabel,
    websiteUrl
  },
  inquiryPanel{
    title,
    description
  }
}`

async function getContactPageData(stega?: boolean) {
  return fetchSanityData<ContactPageData | null>({
    query: CONTACT_PAGE_QUERY,
    stega,
  })
}

export default async function ContactPage() {
  const [contact, pageData] = await Promise.all([getGlobalContact(), getContactPageData(true)])

  const heroTitle = pageData?.hero?.title
  const heroSubtitle = renderText(pageData?.hero?.subtitle) || 'Reach out to our expert team for recommendations, quotations, and global technical support.'
  const heroImageSrc = toImageSrc(pageData?.hero?.backgroundImage, 1800) || '/assets/images/about/contact-hero.jpg'
  const heroImageAlt = sanitizeAltText(pageData?.hero?.backgroundImage?.alt) || 'DoDoShark Contact Center'

  const hqTitle = renderText(pageData?.headquarters?.title) || 'Headquarters'
  const hqDesc = renderText(pageData?.headquarters?.description) || 'Located in Nanjing, Jiangsu Province, China.'
  const hqNote = renderText(pageData?.headquarters?.note) || 'DoDoShark is proudly a brand of Nanjing Heici Machinery Co., Ltd.'

  const pbTitle = renderText(pageData?.productionBases?.title) || 'Production Bases'
  const pbDesc = renderText(pageData?.productionBases?.description) || 'Three major manufacturing facilities located in Shandong Province.'
  const pbCities = (pageData?.productionBases?.cities && pageData.productionBases.cities.length > 0)
    ? pageData.productionBases.cities
    : ['Jinan', 'Liaocheng', 'Weifang']

  const dcTitle = renderText(pageData?.directContact?.title) || 'Direct Contact'
  const dcPhone = renderText(pageData?.directContact?.phone) || contact.phone || '+86 18251999196'
  const dcEmail = renderText(pageData?.directContact?.email) || contact.email || 'sales@dodoshark.com'
  const dcWebLabel = renderText(pageData?.directContact?.websiteLabel) || contact.websiteLabel || 'www.dodoshark.com'
  const dcWebUrl = renderText(pageData?.directContact?.websiteUrl) || contact.websiteUrl || 'https://www.dodoshark.com'

  const showroomTitle = renderText(pageData?.showroom?.title) || 'Our Showroom'
  const showroomDescription = renderText(pageData?.showroom?.description) || 'Visit our facility in Nanjing to see our high-precision machinery in action and discuss your production needs with our experts.'
  const showroomImage = pageData?.showroom?.image

  const inquiryTitle = renderText(pageData?.inquiryPanel?.title) || 'Send Inquiry'
  const inquiryDescription = renderText(pageData?.inquiryPanel?.description) || 'Leave your contact details and city. Our team will respond shortly.'

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-slate-800">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={heroImageSrc}
            alt={heroImageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/40 to-slate-800" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white mb-6 leading-[1.1] tracking-[-0.02em]">
            <HeroTitle
              title={heroTitle}
              fallback={
                <>
                  Get In <span className="accent-gradient-text">Touch</span>
                </>
              }
            />
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Global Presence & Info Grid */}
      <section className="py-24 bg-slate-50 relative z-20 -mt-16 rounded-none md:rounded-t-[1rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-3 gap-8">
            {/* HQ Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-10 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">{hqTitle}</h2>
              <p className="text-slate-600 font-light leading-relaxed mb-4">
                {hqDesc}
              </p>
              <p className="text-sm text-slate-500 font-medium">
                {hqNote}
              </p>
            </div>

            {/* Production Bases */}
            <div className="bg-white border border-slate-200 rounded-xl p-10 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">{pbTitle}</h2>
              <p className="text-slate-600 font-light leading-relaxed mb-4">
                {pbDesc}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-auto">
                {pbCities.map((city) => (
                  <span key={city} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Contact */}
            <div className="bg-white border border-slate-200 rounded-xl p-10 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">{dcTitle}</h2>
              <ul className="space-y-4 text-slate-600 font-light text-left">
                <li className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">Phone:</span>
                  <a href={`tel:${dcPhone}`} className="hover:text-orange-500 transition-colors">{dcPhone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">Email:</span>
                  <a href={`mailto:${dcEmail}`} className="hover:text-orange-500 transition-colors">{dcEmail}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">Web:</span>
                  <a href={dcWebUrl} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">{dcWebLabel}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Socials & Inquiry Form */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[1rem] p-8 md:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />

            <div className="grid lg:grid-cols-5 gap-16 relative z-10">

              {/* Left Column: Image */}
              <div className="lg:col-span-2 relative h-full min-h-[450px] md:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
                <CMSImage
                  image={showroomImage}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  fallbackAlt={showroomTitle}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
                {/* <div className="absolute bottom-8 left-8 right-8">
                  <h2 className="text-2xl lg:text-3xl font-display font-extrabold text-white tracking-tight mb-3">
                    {showroomTitle}
                  </h2>
                  <p className="text-slate-200 text-sm font-light leading-relaxed">
                    {showroomDescription}
                  </p>
                </div> */}
              </div>

              {/* Right Column: The Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl p-8 md:p-10 shadow-2xl text-slate-900">
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 mb-2 tracking-tight">{inquiryTitle}</h3>
                  <p className="text-slate-500 text-sm mb-8">
                    {inquiryDescription}
                  </p>

                  <LeadInquiryForm
                    inquiryType="quote"
                    variant="contact"
                    className="space-y-5"
                    submitLabel="Send Contact Request"
                    introText=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getContactPageData(false)
  return buildPageMetadata({
    seo: pageData?.seo,
    fallbackTitle: 'Contact Us | DoDoShark Machinery',
    fallbackDescription:
      'Contact DoDoShark for machine recommendations, quotations, and technical support. Headquartered in Nanjing, China with production bases in Shandong.',
  })
}

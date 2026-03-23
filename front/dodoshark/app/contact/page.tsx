import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { getGlobalContact } from '@/app/lib/global-contact'
import LeadInquiryForm from '@/components/forms/LeadInquiryForm'

export const metadata: Metadata = {
  title: 'Contact Us | DoDoShark Machinery',
  description: 'Contact DoDoShark for machine recommendations, quotations, and technical support. Headquartered in Nanjing, China with production bases in Shandong.',
}

export default async function ContactPage() {
  // We can still fetch global contact in case we want to merge dynamic data in the future
  const contact = await getGlobalContact()

  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80"
            alt="DoDoShark Factory"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Get In <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Reach out to our expert team for recommendations, quotations, and global technical support.
          </p>
        </div>
      </section>

      {/* Global Presence & Info Grid */}
      <section className="py-24 bg-slate-50 relative z-20 -mt-16 rounded-none md:rounded-t-[1rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-3 gap-8">
            {/* HQ Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-10 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Headquarters</h2>
              <p className="text-slate-600 font-light leading-relaxed mb-4">
                Located in Nanjing, Jiangsu Province, China.
              </p>
              <p className="text-sm text-slate-500 font-medium">
                DoDoShark is proudly a brand of Nanjing Heici Machinery Co., Ltd.
              </p>
            </div>

            {/* Production Bases */}
            <div className="bg-white border border-slate-200 rounded-xl p-10 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Production Bases</h2>
              <p className="text-slate-600 font-light leading-relaxed mb-4">
                Three major manufacturing facilities located in Shandong Province.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['Jinan', 'Liaocheng', 'Weifang'].map((city) => (
                  <span key={city} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Contact */}
            <div className="bg-white border border-slate-200 rounded-xl p-10 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group">
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-orange-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Direct Contact</h2>
              <ul className="space-y-4 text-slate-600 font-light">
                <li className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">Phone:</span>
                  <a href={`tel:${contact.phone || '+86 18251999196'}`} className="hover:text-orange-500 transition-colors">{contact.phone || '+86 18251999196'}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">Email:</span>
                  <a href={`mailto:${contact.email || 'sales@dodoshark.com'}`} className="hover:text-orange-500 transition-colors">{contact.email || 'sales@dodoshark.com'}</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">Web:</span>
                  <a href="https://www.dodoshark.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">www.dodoshark.com</a>
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

              {/* Left Column: Socials & Intro */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black mb-6 uppercase tracking-tight text-white">
                    Let's Build <br /><span className="text-orange-500">Together</span>
                  </h2>
                  <p className="text-slate-300 font-light leading-relaxed text-lg">
                    Whether you need a custom quotation, technical support, or want to schedule a factory video test across time zones, our engineering team is ready to assist you. Responses guaranteed within 24 hours.
                  </p>
                </div>
              </div>

              {/* Right Column: The Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl p-8 md:p-10 shadow-2xl text-slate-900">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Send Inquiry</h3>
                  <p className="text-slate-500 text-sm mb-8">
                    Leave your contact details and city. Our team will respond shortly.
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

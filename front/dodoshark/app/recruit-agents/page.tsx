import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recruit Agents | DoDoShark Machinery',
  description: 'Join the DoDoShark global network. We are looking for passionate agents to help us empower agricultural and food processing productivity worldwide.',
}

const BENEFITS = [
  {
    title: 'Brand Heritage',
    description: 'Backed by 50 years of engineering excellence and a strong state-owned factory foundation transformed into a modern global brand.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /></svg>
    )
  },
  {
    title: 'Technical Edge',
    description: 'Industry-leading machinery with high efficiency, 10-year core component warranties, and continuous R&D innovation.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.06 15.633l.126-1.495m1.448-11.83l.126-1.495m-5.31 12.975l-1.15-.964m11.49-9.642l-1.15-.964m-4.004 9.177l-1.41-.513M5.554 6.423l-1.41-.513" /></svg>
    )
  },
  {
    title: 'Global Support',
    description: 'Comprehensive marketing, technical training, and after-sales support to help you scale your business locally.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 010 18" /></svg>
    )
  }
]

export default function RecruitAgentsPage() {
  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80"
            alt="DoDoShark Global Partnership"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Grow with <br /> <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">DoDoShark Machinery</span>
          </h1>
          <p className="text-xl font-bold italic text-orange-300 mb-6 font-serif">
            "Join the Global Network of Excellence"
          </p>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            We are looking for strategic partners and agents worldwide. Leverage our 50 years of technical expertise and premium machinery to build a successful business in your region.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-colors shadow-lg shadow-orange-500/30">
              Apply to be an Agent
            </Link>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-24 bg-white relative z-20 -mt-16 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Why Partner <br /><span className="text-orange-500">With Us?</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 hover:border-orange-500 transition-colors shadow-xl group">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-slate-900">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Details */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Our Recruitment <span className="text-orange-500">Criteria</span></h2>
              <ul className="space-y-4">
                {[
                  'In-depth knowledge of local agricultural/food processing markets.',
                  'Established network or capability to build one in your region.',
                  'Commitment to high-quality service and customer satisfaction.',
                  'Willingness to grow alongside a premium engineering brand.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-slate-300 font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-slate-800">
               <Image 
                src="https://images.unsplash.com/photo-1454165833767-027ffea9e67a?w=800&q=80" 
                alt="Business Meeting" 
                fill 
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-2xl font-black uppercase mb-2">Build a Future</p>
                  <p className="text-orange-400 font-bold italic">"Empowering Productivity, Together"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-white text-center shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
            
            <h2 className="text-3xl font-black text-orange-500 mb-4 uppercase tracking-widest text-xs">Ready to Start?</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight">Become a DoDoShark Agent</h3>
            <p className="text-slate-300 mb-10 text-lg max-w-3xl mx-auto font-light leading-relaxed">
              If you share our passion for excellence and engineering depth, we want to hear from you. Contact our global partnership team today.
            </p>
            <Link href="/contact" className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
              Submit Inquiry
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import AboutVideoCard from '@/components/about/AboutVideoCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | DoDoShark Machinery',
  description: 'Rooted in China, Empowering the World. Discover DoDoShark\'s 50-year engineering heritage and our commitment to high-performance agricultural and food processing machinery.',
}

const PRODUCT_SYSTEMS = [
  {
    title: 'Agricultural Processing Machinery',
    description: 'Designed for durability and precision in large-scale agricultural scenarios. Covering cast iron crushers, roller crushers, rice millers, and wheat flour mills.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
    ),
    tags: ['Cast Iron Crushers', 'Roller Crushers', 'Rice Millers', 'Wheat Mills'],
    image: 'https://images.unsplash.com/photo-1595914041725-b1e6cbcc29a5?w=800&q=80',
  },
  {
    title: 'Food Processing Machinery',
    description: 'Meeting rigorous food production standards with premium materials and precision craftsmanship. Solutions for high-end processing and commercial kitchens.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.5V2.25M14.25 10.5c0 1.243-1.007 2.25-2.25 2.25s-2.25-1.007-2.25-2.25V2.25M14.25 10.5c1.243 0 2.25 1.007 2.25 2.25A2.25 2.25 0 0112 15a2.25 2.25 0 01-2.25-2.25A2.25 2.25 0 0112 12.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5v-15m15 15v-15" /></svg>
    ),
    tags: ['Stainless Crushers', 'Industrial Mixers', 'Dough Mixers', 'Juicers'],
    image: 'https://images.unsplash.com/photo-1574347576572-c51ae7afadad?w=800&q=80',
  }
]

const TIMELINE = [
  {
    year: '1970 - 2019',
    phase: 'State-Owned Heritage',
    title: 'A Foundation of Engineering',
    desc: 'Our predecessor was founded in 1970. Half a century of deep technical accumulation established a solid engineering foundation and robust manufacturing capabilities.',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80',
  },
  {
    year: '2019',
    phase: 'Brand Foundation',
    title: 'The DoDoShark Era Begins',
    desc: 'DoDoShark Machinery was officially established in the historical capital of Nanjing, locking its focus on empowering agricultural and food processing productivity.',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
  },
  {
    year: '2020 - 2021',
    phase: 'Market Roots & Reputation',
    title: 'Iterative Excellence',
    desc: 'Leveraged deep technical strength to resolve dozens of common industry crusher issues. Gained a firm market foothold with new models featuring high crushing rates and extreme durability.',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
  },
  {
    year: '2022 - 2023',
    phase: 'Track Expansion',
    title: 'Dual-Track Business Model',
    desc: 'Extended beyond agricultural machinery into stainless steel food crushers and mixers, successfully forming the "Agriculture + Food" dual-track processing layout.',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
  },
  {
    year: '2024 - 2025',
    phase: 'Innovation & Lean Manufacturing',
    title: 'Smart Automation Upgrades',
    desc: 'Core products received hardcore upgrades: Intelligent Control + Energy Saving designs. Introduced lean production systems for dual upgrades in quality and efficiency.',
    img: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&q=80',
  },
  {
    year: '2026+',
    phase: 'Brand Elevation & Future Outlook',
    title: 'Industry Solution Provider',
    desc: 'Evolving from an equipment supplier to a comprehensive industry solutions provider. Opening a new global chapter driven by technological depth and effect-based sales.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-[#fcfdfd] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/assets/images/factory.jpg"
            alt="DoDoShark Factory Assembly"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-8">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            <span>DoDoShark Enterprise</span>
          </div> */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Rooted in China <br /> <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">Empowering the World</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            We provide stable, efficient, and worry-free DoDoShark machinery.
          </p>

        </div>
      </section>

      {/* Video & Technical Strength */}
      <section className="py-24 bg-slate-50 relative z-20 -mt-16 rounded-none md:rounded-t-[1rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Left Column: Sticky Video */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-32">
              <AboutVideoCard
                youtubeUrl="https://www.youtube.com/shorts/C_JWSMn42eA"
                title="DoDoShark Brand Story"
                thumbnailUrl="/assets/images/brand/DoDoShark-Brand-cover.jpg"
                aspectRatio="aspect-[9/16]"
              />
            </div>

            {/* Right Column: Text Cards */}
            <div className="w-full lg:w-7/12 space-y-8">
              <div className="bg-white border border-slate-200 rounded-xl p-10 md:p-12 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group">
                <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight group-hover:text-orange-500 transition-colors">Our slogan</h2>
                <p className="text-xl md:text-2xl font-bold italic text-orange-600 mb-6 font-serif leading-relaxed">
                  "Work with Confidence, Reap in Joy"
                </p>
                <p className="text-slate-600 leading-relaxed font-light text-lg">
                  We aim to build partnerships that transcend equipment, serving every workshop globally with the philosophy of "Work with Confidence, Reap in Joy".
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-10 md:p-12 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group">
                <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight group-hover:text-orange-500 transition-colors">Corporate <span className="text-orange-500">DNA</span></h2>
                <p className="text-slate-600 leading-relaxed mb-6 font-light text-lg">
                  With a heritage stemming from a state-owned factory founded in 1970, we carry half a century of engineering depth. DoDoShark Machinery was established in Nanjing in 2019, anchoring our core mission as <strong>"Empowering Productivity."</strong>
                </p>
                <p className="text-slate-600 leading-relaxed font-light text-lg">
                  We prioritize a "Technology-led Development" model, rejecting homogenization to build a three-dimensional ecosystem: <strong>R&D as the core, Manufacturing as the base, and Service as the wings.</strong>
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-10 md:p-12 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-2xl group">
                <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight group-hover:text-orange-500 transition-colors">Technical <span className="text-orange-500">Strength</span></h2>
                <p className="text-slate-600 leading-relaxed mb-6 font-light text-lg">
                  Our products significantly outperform peers. For instance, our stainless steel crushers were the first to achieve <strong>150-mesh fineness at 1 ton/hour</strong>, supporting 12 hours continuous operation—multiplying standard industry efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product System: Dual-Track */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Dual-Track <br /><span className="text-orange-500">Product System</span></h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto font-light">
              Exceeding industry standards to meet diverse production needs with full-process customized solutions. Seamlessly connecting production segments for maximum efficiency.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-colors shadow-lg shadow-orange-500/30">
                View Product Matrices
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PRODUCT_SYSTEMS.map((sys) => (
              <div key={sys.title} className="bg-slate-900 text-white rounded-[2.5rem] overflow-hidden group">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image src={sys.image} alt={sys.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(min-width: 768px) 50vw, 100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 flex flex-col justify-end p-8">
                    <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                      {sys.icon}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{sys.title}</h3>
                  </div>
                </div>
                <div className="p-8 pt-4">
                  <p className="text-slate-300 font-light leading-relaxed mb-6">{sys.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {sys.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-slate-300">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Assets & Team (Stats) */}
      <section className="py-24 bg-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="0,100 100,0 100,100" /></svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">High-End Talent & <br /> Global Layout</h2>
              <p className="text-orange-100 font-light leading-relaxed mb-6">
                Integrating foundational physics, mechanical automation, and IT technology to produce intellectual property. We operate 3 major production bases in Shandong (Jinan, Liaocheng, Weifang) with advanced laser cutting and static pressure casting technologies.
              </p>
              <p className="text-orange-100 font-light leading-relaxed">
                From serving every major city in China to expanding into over a dozen countries globally. DoDoShark stands as a new name card for <strong>Intelligent Manufacturing in China</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-[2rem] text-center">
                <div className="text-4xl font-black mb-2">10+</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Senior Engineers</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-[2rem] text-center">
                <div className="text-4xl font-black mb-2">3</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Production Bases</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-[2rem] text-center">
                <div className="text-4xl font-black mb-2">60+</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Skilled Technicians</div>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-[2rem] text-center">
                <div className="text-4xl font-black mb-2">10+</div>
                <div className="text-xs uppercase tracking-widest text-orange-200">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development History Timeline */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">The Journey of <span className="text-orange-500">DoDoShark</span></h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto font-light text-lg">
              From our state-owned origins to a modern global enterprise. Constantly evolving in reliability and innovation.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto space-y-24 before:absolute before:inset-y-0 before:w-0.5 before:bg-slate-200 before:left-[24px] md:before:left-1/2 md:before:-translate-x-1/2">

            {TIMELINE.map((item, idx) => (
              <div key={item.year} className="relative flex flex-col md:flex-row items-center group">
                {/* Visual Center Dot */}
                <div className="absolute w-5 h-5 bg-orange-500 border-4 box-content border-white shadow-[0_0_0_4px_rgba(249,115,22,0.2)] rounded-full left-[10px] md:left-1/2 md:-translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-125 group-hover:bg-orange-600" />

                {/* Alternating Content Layout */}
                {idx % 2 === 0 ? (
                  <>
                    <div className="w-full md:w-1/2 pr-0 md:pr-16 pl-14 md:pl-0 text-left md:text-right">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-900 font-bold tracking-widest text-sm mb-4">
                        {item.year}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
                      <h4 className="text-md font-bold text-orange-500 mb-4">{item.phase}</h4>
                      <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
                    </div>
                    <div className="w-full md:w-1/2 pl-14 md:pl-16 mt-8 md:mt-0">
                      <div className="aspect-[16/9] bg-white rounded-3xl p-2 border border-slate-200 shadow-xl overflow-hidden group-hover:border-orange-500 transition-colors">
                        <Image src={item.img} alt={item.title} width={600} height={400} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full md:w-1/2 md:pr-16 pl-14 md:pl-0 mt-8 md:mt-0 order-2 md:order-1 flex md:justify-end">
                      <div className="aspect-[16/9] w-full bg-white rounded-3xl p-2 border border-slate-200 shadow-xl overflow-hidden group-hover:border-orange-500 transition-colors">
                        <Image src={item.img} alt={item.title} width={600} height={400} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 pr-0 md:pl-16 pl-14 md:pl-0 text-left order-1 md:order-2">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-900 font-bold tracking-widest text-sm mb-4">
                        {item.year}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
                      <h4 className="text-md font-bold text-orange-500 mb-4">{item.phase}</h4>
                      <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}

          </div>

          <div className="mt-24 max-w-3xl mx-auto text-center border-t border-slate-200 pt-16">
            <p className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Settling in Reliability, Innovating in Evolution.</p>
            <p className="text-slate-500 font-light">From a single machine to a diverse ecosystem. We invite you to co-create the future of intelligent manufacturing.</p>
          </div>

        </div>
      </section>

      {/* Value Proposition / CTA */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-white text-center shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />

            <h2 className="text-3xl font-black text-orange-500 mb-4 uppercase tracking-tight tracking-widest text-xs">Value Proposition</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight relative z-10 text-white">Partnerships Beyond Equipment</h3>
            <p className="text-slate-300 mb-10 relative z-10 text-lg max-w-3xl mx-auto font-light leading-relaxed">
              We have moved beyond simple equipment sales to an "Effect-based Sales" model, providing full life-cycle solutions from process planning to technical implementation. With an industry-leading <strong>10-year warranty on core components</strong>, we upgrade short-term cooperation into long-term strategic partnerships.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <Link href="/contact" className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
                Connect With Us Today
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

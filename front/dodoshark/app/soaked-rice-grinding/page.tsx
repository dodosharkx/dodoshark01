import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Soaked Rice High-efficiency Grinding Solution | DoDoShark',
  description: 'Specialized wet milling for soaked rice products. 304 SS construction, air-cooling, and non-clogging technology.',
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 text-center md:mb-16">
      <h2 className="text-3xl font-display font-black leading-tight text-slate-900 md:text-5xl mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-slate-500 max-w-3xl mx-auto font-light">{subtitle}</p>}
    </div>
  )
}

export default function SoakedRiceSolutionPage() {
  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      {/* 1. Hero / Overview Section */}
      <section className="relative overflow-hidden bg-slate-800 pb-24 pt-32 lg:pt-40 lg:pb-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              <i className="fas fa-water" />
              <span>Wet Milling Specialist</span>
            </div>
            <h1 className="mb-6 text-4xl font-display font-black leading-tight tracking-tight text-white md:text-6xl uppercase italic">
              Dodoshark <span className="text-blue-400 not-italic">Soaked Rice</span> Solution
            </h1>
            <p className="mb-8 text-xl font-light leading-relaxed text-slate-400">
              Specifically tailored for the high-efficiency milling of soaked rice (wet rice). Addressing clogging, screen fouling, and low throughput while ensuring food-grade hygiene standards.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#products" className="rounded-md border-2 border-blue-500 bg-blue-500 px-8 py-4 text-sm font-black tracking-widest text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-white hover:text-blue-500 hover:border-white">
                EXPLORE WET MILLS
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
              <Image src="/assets/images/solutions/temp/soaked-rice.jpg" alt="Soaked Rice Grinding Solution" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-8 left-8">
                 <div className="text-6xl font-black text-blue-400 italic">3.0 <span className="text-xl not-italic text-white underline decoration-blue-500">T/h</span></div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-white mt-1 opacity-60">Peak Production Capacity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Advantages */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Core Advantages"
            subtitle="Engineered for stability, hygiene, and high-volume wet processing."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdvantageCard 
              icon="tint-slash" 
              title="Anti-Clogging Design" 
              desc="Widened chamber structure prevents wet powder sticking and screen fouling for continuous production." 
              img="/assets/images/solutions/temp/high-efficiency-stable-durable.png"
            />
            <AdvantageCard 
              icon="snowflake" 
              title="Advanced Cooling" 
              desc="High-volume air-cooling system maintains low temperatures to prevent starch gelatinization." 
              img="/assets/images/solutions/temp/clean-workshop.png"
            />
            <AdvantageCard 
              icon="gem" 
              title="Rice Flour Quality" 
              desc="Selectable mesh sizes (0.4–0.8 mm) produce delicate 80–120 mesh flour for premium rice products." 
              img="/assets/images/solutions/temp/rice-flour-excellent-quality.png"
            />
            <AdvantageCard 
              icon="bolt" 
              title="Efficiency Boost" 
              desc="Hourly output exceeding 3 tonnes per unit, delivering a 300% increase in processing efficiency." 
              img="/assets/images/solutions/temp/low-cost-high-roi.png"
            />
            <AdvantageCard 
              icon="robot" 
              title="Intelligent & Worry-Free" 
              desc="Food-grade fully dust-free design covering the entire process from feeding to collection." 
              img="/assets/images/solutions/temp/intelligent-worry-free.png"
            />
            <AdvantageCard 
              icon="shield-check" 
              title="Long-Term Guarantee" 
              desc="Stainless steel construction ensures hygiene compliance and long-term durability in wet environments." 
              img="/assets/images/solutions/temp/long-term-guarantee.png"
            />
          </div>
        </div>
      </section>

      {/* 3. Materials Information */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-display font-black leading-tight mb-8">Soaked Rice Characteristics</h2>
              <p className="text-slate-600 mb-8 font-light leading-relaxed">
                Soaked rice presents unique challenges due to its high moisture content. Conventional mills often fail due to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <CharacteristicItem title="Wet Stickiness" desc="Moist powder tends to adhere to internal walls and screen surfaces." />
                 <CharacteristicItem title="Heat Sensitivity" desc="Friction heat can cause starch gelatinization, ruining the texture." />
                 <CharacteristicItem title="Hygiene Risks" desc="Wet environments promote bacterial growth if not properly cleaned." />
                 <CharacteristicItem title="Throughput Drop" desc="Clogging causes frequent downtime and low effective capacity." />
              </div>
            </div>
            <div className="lg:w-1/2">
               <h2 className="text-3xl font-display font-black leading-tight mb-8">Application Scenarios</h2>
               <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <div className="space-y-6">
                     <AppTag title="Rice Cakes & Noodles" desc="Requires high-moisture milling with ultra-fine mesh." />
                     <AppTag title="Tangyuan Flour" desc="Fine particles ranging from 100 to 120 mesh." />
                     <AppTag title="Vermicelli Production" desc="Industrial-scale output with consistent particle size." />
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4">
                     <div className="text-blue-500 text-3xl font-black italic">60-80 <span className="text-sm not-italic uppercase text-slate-400 tracking-widest">Mesh</span></div>
                     <div className="text-slate-400 text-xs leading-snug">Consistent high-efficiency processing for wet powder.</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pain Points Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-12">
          <SectionHeader title="Industry Pain Points" subtitle="How Dodoshark solves the challenges of wet processing." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <PainPointCard 
              title="产能低下 (Low Capacity)" 
              desc="Frequent clogging leading to low throughput and high labor costs." 
              solution="Widened chamber + High-pressure air-cooling."
              img="/assets/images/solutions/temp/low-production-capacity.jpg"
            />
            <PainPointCard 
              title="筛网易堵塞 (Screen Clogging)" 
              desc="Wet rice powder sticks to the mesh, blocking discharge." 
              solution="Self-cleaning vortex airflow design."
              img="/assets/images/solutions/temp/screen-clogging.jpg"
            />
            <PainPointCard 
              title="淀粉糊化 (Gelatinization)" 
              desc="Overheating during milling ruins the rice flour quality." 
              solution="Active cooling modules keep temp < 40°C."
              img="/assets/images/solutions/temp/starch-gelatinization.jpg"
            />
            <PainPointCard 
              title="Serious Dust Pollution" 
              desc="Workshop hygiene issues due to leaking steam and powder." 
              solution="Fully enclosed dust-free collection system."
              img="/assets/images/solutions/temp/serious-dust-pollution.jpg"
            />
          </div>
        </div>
      </section>

      {/* 5. Product Portfolio */}
      <section id="products" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Wet Milling Portfolio" subtitle="Select the best configuration for your production needs." />
          <div className="space-y-16">
            <ProductDisplay 
              num="01"
              title="Stainless Steel Soaked Rice Mill (304 SS)"
              desc="The standard for food-grade wet processing with full anti-clogging technology."
              img="/assets/images/solutions/temp/dodoshark-304-ss-claw-mill-with-fan.png"
              specs={{ "Fineness": "0.4 - 0.8 mm (80-120 Mesh)", "Capacity": "800 kg - 3 t/h", "Power": "18.5 - 75 kW", "Hygiene": "Food Grade 304" }}
            />
            <ProductDisplay 
              num="02"
              title="High-Pressure Centrifugal Air-Cooled Mill"
              desc="Optimized for large-scale rice noodle factories needing continuous 12-hour cooling."
              img="/assets/images/solutions/temp/dodoshark-304-ss-claw-mill-no-fan.png"
              specs={{ "Fineness": "Adjustable Mesh", "Cooling": "High-Volume Fan", "Material": "Stainless Steel", "Feeding": "Self-priming" }}
              reverse
            />
          </div>
        </div>
      </section>

      {/* 6. Success Case */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Success Story" />
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 flex flex-col md:flex-row">
            <div className="md:w-1/2 p-12 text-white">
               <div className="text-blue-400 font-black uppercase tracking-widest text-xs mb-4">Anhui Province Project</div>
               <h3 className="text-3xl font-display font-black mb-6">Anhui Gongting Food Factory</h3>
               <div className="space-y-6 text-slate-400 text-sm font-light">
                  <p><strong>Requirement:</strong> Grinding of soaked glutinous rice, 0.6–0.8 mm screen mesh, needing 800 kg/hour for stable production.</p>
                  <p><strong>Solution:</strong> DoDoShark 304 Stainless Steel Grinder (60 Wide) + 18.5 kW motor + High-pressure centrifugal fan + Self-priming feed.</p>
               </div>
            </div>
            <div className="md:w-1/2 bg-blue-500 p-12 flex flex-col items-center justify-center text-center">
               <div className="text-7xl font-black text-white italic">3X</div>
               <div className="text-white font-bold text-lg mt-2 leading-tight uppercase">Efficiency Increase</div>
               <p className="text-blue-100 text-xs mt-6 max-w-[240px]">Achieved consistent grinding without sticking, ensuring food-grade hygiene and threefold productivity improvement.</p>
               <div className="mt-8 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">Successful Handover</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function AdvantageCard({ icon, title, desc, img }: any) {
  return (
    <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-blue-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-colors text-center">
          <i className={`fas fa-${icon}`} />
        </div>
        <h3 className="text-xl font-display font-bold">{title}</h3>
      </div>
      <p className="text-slate-500 font-light leading-relaxed mb-6 h-16 overflow-hidden">{desc}</p>
      <div className="relative h-32 w-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
        <Image src={img} alt={title} fill className="object-contain" />
      </div>
    </div>
  )
}

function CharacteristicItem({ title, desc }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
       <h5 className="font-bold text-slate-900 text-sm mb-1">{title}</h5>
       <p className="text-slate-500 text-xs font-light">{desc}</p>
    </div>
  )
}

function AppTag({ title, desc }: any) {
  return (
    <div className="flex items-start gap-4">
       <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0" />
       <div>
          <h5 className="font-bold text-slate-800 text-sm">{title}</h5>
          <p className="text-slate-500 text-xs font-light">{desc}</p>
       </div>
    </div>
  )
}

function PainPointCard({ title, desc, solution, img }: any) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6 flex flex-col group overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-32 -mx-6 -mt-6 mb-6 overflow-hidden border-b border-red-100 bg-white">
         <Image src={img} alt={title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform" />
      </div>
      <h4 className="font-bold text-slate-900 mb-2 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{desc}</p>
      <div className="pt-3 border-t border-red-200 mt-auto">
        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest"><i className="fas fa-check mr-1" /> Solving Tech</span>
        <p className="text-xs mt-1 text-slate-800 font-black">{solution}</p>
      </div>
    </div>
  )
}

function ProductDisplay({ num, title, desc, specs, img, reverse = false }: any) {
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-12 bg-white p-8 lg:p-12 rounded-3xl border border-slate-100 shadow-sm ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className="lg:w-2/5 relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 group border border-slate-100">
        <Image src={img} alt={title} fill className="object-contain p-8 group-hover:rotate-3 transition-transform duration-500" />
      </div>
      <div className="lg:w-3/5">
        <div className="bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-[0.2em]">{num} / Solution</div>
        <h3 className="text-3xl font-display font-black mb-4 text-slate-900 leading-tight">{title}</h3>
        <p className="text-slate-500 font-light mb-8 leading-relaxed italic text-sm">"{desc}"</p>
        <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10 pt-8 border-t border-slate-50">
          {Object.entries(specs).map(([k, v]: any) => (
            <div key={k}>
              <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{k}</span>
              <span className="text-lg font-bold text-slate-800">{v}</span>
            </div>
          ))}
        </div>
        <Link href="/products" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-lg text-xs font-black tracking-widest hover:bg-blue-600 transition-colors shadow-lg">
          VIEW SPECIFICATIONS <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </div>
  )
}

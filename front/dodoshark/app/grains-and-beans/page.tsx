import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Grain & Beans High-efficiency Grinding Solutions | DoDoShark',
  description: 'Professional dust-free milling for cereals and pulses. High-efficiency 100-150 mesh processing with intelligent control.',
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

export default function GrainsBeansSolutionPage() {
  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      {/* 1. Hero / Overview Section */}
      <section className="relative overflow-hidden bg-slate-900 pb-24 pt-32 lg:pt-40 lg:pb-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
              <i className="fas fa-seedling" />
              <span>Grains & Legumes Expert</span>
            </div>
            <h1 className="mb-6 text-4xl font-display font-black leading-tight tracking-tight text-white md:text-6xl uppercase italic">
              Dodoshark <span className="text-orange-500 not-italic">Grains & Beans</span> Solution
            </h1>
            <p className="mb-8 text-xl font-light leading-relaxed text-slate-400">
              This solution provides a comprehensive, high-efficiency, precision and dust-free milling solution for enterprises processing grains, cereals and pulses. Adjustable 60 to 150 mesh with professional construction.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#products" className="rounded-md border-2 border-orange-500 bg-orange-500 px-8 py-4 text-sm font-black tracking-widest text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-white hover:text-orange-500 hover:border-white">
                VIEW GRINDING RANGE
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <Image src="/assets/images/solutions/temp/grains-and-beans.jpg" alt="Grain & Beans Grinding Solution" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Advantages */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Core Advantages"
            subtitle="Leading the industry in grain processing with high stability and precision."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdvantageCard 
              icon="piggy-bank" 
              title="Cost Optimization" 
              desc="Provides high-performance milling machines to meet grains milling needs with superior value and ROI." 
              img="/assets/images/solutions/temp/low-cost-high-roi.png"
            />
            <AdvantageCard 
              icon="shield-virus" 
              title="Dust-Free Production" 
              desc="Dust suppression ratio of dust removal equipment reaching up to 99.99% for food-grade hygiene." 
              img="/assets/images/solutions/temp/clean-workshop.png"
            />
            <AdvantageCard 
              icon="award" 
              title="Superior Fine Flour" 
              desc="Consistently produces 100-150 mesh high-quality powder with industry-leading stability." 
              img="/assets/images/solutions/temp/excellent-quality.png"
            />
            <AdvantageCard 
              icon="bolt" 
              title="Throughput Boost" 
              desc="Lowers power consumption per ton by up to 50% while maintaining very high output." 
              img="/assets/images/solutions/temp/efficiency-improvement.png"
            />
            <AdvantageCard 
              icon="microchip" 
              title="Intelligent Grinding" 
              desc="Integrated PLC control systems from raw cleaning to fine collection for worry-free operation." 
              img="/assets/images/solutions/temp/intelligent-worry-free.png"
            />
            <AdvantageCard 
              icon="handshake" 
              title="Lifetime Commitment" 
              desc="12-month warranty and lifetime technical support to ensure your long-term success." 
              img="/assets/images/solutions/temp/long-term-guarantee.png"
            />
          </div>
        </div>
      </section>

      {/* 3. Materials Analysis */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-display font-black leading-tight mb-8">Raw Material Challenges</h2>
              <div className="space-y-4">
                 <ChallengeItem title="Oil-rich Legumes" desc="Heat and oil release leading to screen clogging." />
                 <ChallengeItem title="Fibre Toughness" desc="Hard-to-grind husks requiring high-torque systems." />
                 <ChallengeItem title="High Fineness" desc="Applications requiring 100+ mesh delicate powders." />
                 <ChallengeItem title="Hygiene Standards" desc="The food industry require stainless steel contact parts." />
              </div>
            </div>
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-display font-black leading-tight mb-8">Performance Commitment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 text-6xl text-white/5 font-black group-hover:scale-110 transition-transform">150</div>
                   <h4 className="text-orange-500 font-black text-xs uppercase tracking-widest mb-2">Max Fineness</h4>
                   <div className="text-5xl font-black italic">150 <span className="text-xl not-italic">Mesh</span></div>
                   <p className="mt-4 text-slate-400 text-sm font-light leading-relaxed">Consistently produce fine powders of 100–150 mesh with industry-leading capacity.</p>
                </div>
                <div className="bg-orange-500 rounded-3xl p-8 text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 text-6xl text-white/10 font-black group-hover:scale-110 transition-transform">ROI</div>
                   <h4 className="text-white/80 font-black text-xs uppercase tracking-widest mb-2">Efficiency</h4>
                   <div className="text-5xl font-black italic">-50<span className="text-xl not-italic">%</span></div>
                   <p className="mt-4 text-white/80 text-sm font-light leading-relaxed">Lower power consumption per ton while increasing overall output significantly.</p>
                </div>
              </div>
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-6">
                 <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-orange-500">
                    <i className="fas fa-certificate" />
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-900">Food-Grade Standard</h5>
                    <p className="text-slate-500 text-sm font-light">Available in full 304 stainless steel construction to meet international hygiene standards.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Problems vs Solutions */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Industry Pain Points vs Dodoshark Solutions" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PainPointCard
              icon="exclamation-triangle"
              title="Serious Dust Pollution"
              desc="Open environments causing safety hazards and material waste."
              solution="Integrated dust removal system (99.9% rate)."
              img="/assets/images/solutions/temp/serious-dust-pollution.jpg"
            />
            <PainPointCard
              icon="oil-can"
              title="Oil Material Clogging"
              desc="Heat generated by legumes causing oil release and machine blockage."
              solution="Widened chamber and high-volume cooling."
              img="/assets/images/solutions/temp/oily-material-clogging.jpg"
            />
            <PainPointCard
              icon="thermometer-half"
              title="Excessive Temperature"
              desc="Nutrient loss and powder caking due to friction heat."
              solution="Active air-cooling and water-cool jackets."
              img="/assets/images/solutions/temp/high-temp-rise.jpg"
            />
            <PainPointCard
              icon="times-circle"
              title="Fineness Not Standard"
              desc="Inconsistent particle size affecting final product quality."
              solution="Precision mesh-control technology."
              img="/assets/images/solutions/temp/sub-standard-fineness.jpg"
            />
          </div>
        </div>
      </section>

      {/* 5. Product Showcase */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Recommended Equipment" subtitle="From individual workshops to global industrial lines." />
          <div className="space-y-16">
            <ProductCard 
              num="01"
              category="Premium Grinding"
              title="Stainless Steel Claw Mill (304 SS)"
              desc="Fully dust-free collection system with food-grade 304 construction for grains/pulses."
              img="/assets/images/solutions/temp/dodoshark-304-ss-claw-mill-with-fan.png"
              specs={{ "Fineness": "40-150 Mesh", "Capacity": "Up to 3 t/h", "Material": "304 Stainless Steel", "Control": "PLC Smart" }}
              principle="Shear, impact, and friction between moving and fixed teeth."
            />
            <ProductCard 
              num="02"
              category="Industrial Standard"
              title="Cast Iron Claw Mill (High-Fan Version)"
              desc="Equipped with high-pressure fan for efficient cooling and high throughput."
              img="/assets/images/solutions/temp/dodoshark-cast-iron-claw-mill-with-fan.png"
              specs={{ "Fineness": "10-120 Mesh", "Capacity": "0.4 - 8 t/h", "Material": "Cast Iron", "Drive": "V-Belt / Direct" }}
              principle="Impact energy from rotating teeth combined with air-vortex classification."
              reverse
            />
            <ProductCard 
              num="03"
              category="Ultrafine Solution"
              title="Precision Grinding Ultrafine Mill"
              desc="The flagship for super-fine grain powder processing (150+ mesh)."
              img="/assets/images/solutions/temp/dodoshark-grinding-ultrafine-mill.png"
              specs={{ "Fineness": "100-300 Mesh", "Capacity": "50-1500 kg/h", "Technology": "Built-in Classifier", "Material": "SS304/Iron" }}
              principle="Grinding-style milling with air-flow feedback loops."
            />
          </div>
        </div>
      </section>

      {/* 6. Success Stories */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Customer Success Stories" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <CaseStudyItem 
              logo="/assets/images/solutions/temp/efficiency-improvement.png"
              title="Sichuan Jinliang Food"
              req="Grinding of roasted soya beans, 0.6–0.8 mm mesh, requiring high oil handling."
              sol="DoDoShark 304 Stainless Steel Model 37 + High-pressure fan + 4-bag dust collector."
              result="Hourly output of 300 kg with excellent dust removal and zero clogging."
            />
            <CaseStudyItem 
              logo="/assets/images/solutions/temp/excellent-quality.png"
              title="Busan Food Factory (South Korea)"
              req="Production of 100-mesh mixed grain powder with high precision and energy saving."
              sol="Stainless Steel Model 37 + WEG variable-frequency motor + 5-bag dust collector."
              result="Stable fine grinding at 150 kg/h, energy-efficient operation trusted internationally."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function AdvantageCard({ icon, title, desc, img }: any) {
  return (
    <div className="premium-card p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white transition-all shadow-sm hover:shadow-xl group">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
          <i className={`fas fa-${icon}`} />
        </div>
        <h3 className="text-xl font-display font-bold">{title}</h3>
      </div>
      <p className="text-slate-500 font-light leading-relaxed mb-6 h-20 overflow-hidden">{desc}</p>
      <div className="relative h-32 w-full rounded-lg overflow-hidden flex items-center justify-center bg-white/50 border border-slate-100/50">
        <Image src={img} alt={title} fill className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all" />
      </div>
    </div>
  )
}

function ChallengeItem({ title, desc }: any) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-orange-50 transition-colors bg-white">
      <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
      <div>
        <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{title}</h5>
        <p className="text-slate-500 text-xs font-light mt-1">{desc}</p>
      </div>
    </div>
  )
}

function PainPointCard({ title, desc, solution, icon, img }: any) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6 flex flex-col group overflow-hidden">
      <div className="relative h-32 -mx-6 -mt-6 mb-6 overflow-hidden">
         <Image src={img} alt={title} fill className="object-cover opacity-80 group-hover:scale-110 transition-transform grayscale hover:grayscale-0" />
         <div className="absolute inset-0 bg-red-500/10" />
         <div className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-lg shadow-lg">
            <i className={`fas fa-${icon}`} />
         </div>
      </div>
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 mb-4 font-light leading-snug">{desc}</p>
      <div className="pt-3 border-t border-red-200 mt-auto">
        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest"><i className="fas fa-check mr-1" /> Dodoshark Solution</span>
        <p className="text-sm mt-1 text-slate-900 font-bold">{solution}</p>
      </div>
    </div>
  )
}

function ProductCard({ num, category, title, desc, specs, img, principle, reverse = false }: any) {
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-12 bg-white p-8 lg:p-12 rounded-3xl border border-slate-100 shadow-sm ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className="lg:w-2/5 relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
        <Image src={img} alt={title} fill className="object-contain p-8 group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="lg:w-3/5">
        <div className="text-orange-500 font-black mb-2 uppercase tracking-[0.3em] text-[10px]">{num} / Equipment</div>
        <h3 className="text-3xl font-display font-bold mb-4 text-slate-900 leading-tight">{title}</h3>
        <p className="text-slate-500 font-light mb-6 leading-relaxed italic text-sm">"{desc}"</p>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 border-t border-slate-50 pt-8">
          {Object.entries(specs).map(([k, v]: any) => (
            <div key={k}>
              <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{k}</span>
              <span className="text-lg font-bold text-slate-800">{v}</span>
            </div>
          ))}
        </div>
        <div className="mb-8 p-4 bg-slate-50 rounded-lg border-l-4 border-orange-500">
           <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Milling Principle</span>
           <p className="text-sm text-slate-600 font-light">{principle}</p>
        </div>
        <Link href="/products" className="inline-flex items-center gap-4 text-xs font-black tracking-widest text-slate-900 border-b-2 border-orange-500 pb-1 hover:text-orange-500 transition-colors uppercase">
          EXPLORE TECH SPECS <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </div>
  )
}

function CaseStudyItem({ logo, title, req, sol, result }: any) {
  return (
    <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative group overflow-hidden">
       <div className="absolute top-0 right-0 p-8 h-24 w-24 opacity-10 group-hover:scale-125 transition-transform">
          <Image src={logo} alt="Project Icon" fill className="object-contain grayscale" />
       </div>
       <h4 className="text-2xl font-display font-black text-slate-900 mb-6">{title}</h4>
       <div className="space-y-6">
          <div>
            <span className="block text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Requirement</span>
            <p className="text-slate-600 font-light text-sm">{req}</p>
          </div>
          <div>
            <span className="block text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Solution</span>
            <p className="text-slate-600 font-light text-sm">{sol}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <span className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Resulting Success</span>
            <p className="text-sm font-bold text-slate-800">{result}</p>
          </div>
       </div>
    </div>
  )
}

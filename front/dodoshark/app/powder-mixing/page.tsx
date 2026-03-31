import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'High-Efficiency Powder Blending Solutions | DoDoShark',
  description: 'Industrial mixing for powders, granules, and solid-liquids. Uniformity (CV) < 5%, 50% faster cycles. Double cone, drum, and ribbon mixers.',
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

export default function PowderMixingSolutionPage() {
  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      {/* 1. Hero / Overview Section */}
      <section className="relative overflow-hidden bg-slate-900 pb-24 pt-32 lg:pt-40 lg:pb-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
              <i className="fas fa-blender" />
              <span>Blending Innovation</span>
            </div>
            <h1 className="mb-6 text-4xl font-display font-black leading-tight tracking-tight md:text-7xl italic">
              Dodoshark <span className="text-orange-500 not-italic uppercase">Powder</span> Blending
            </h1>
            <p className="mb-8 text-xl font-light leading-relaxed text-slate-400 max-w-xl">
              This solution provides a systematic, high-efficiency, uniform and dust-free solution for the mixing of powders, granules and solid-liquid mixtures. Achieving CV &lt; 5% with up to 50% faster cycles.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#products" className="rounded-md border-2 border-orange-500 bg-orange-500 px-8 py-4 text-sm font-black tracking-widest text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-white hover:text-orange-500 hover:border-white">
                VIEW MIXER RANGE
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-black">
              <Image src="/assets/images/solutions/temp/powder.jpg" alt="Powder Mixing Solution" fill className="object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <div className="p-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl text-center">
                    <div className="text-5xl font-black text-orange-500 mb-2 italic">CV &lt; 5%</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Uniformity standard</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Advantages */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Blending Advantages" subtitle="Ensuring product consistency and cost optimization through design." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdvantageCard 
              title="High Efficiency & Saving" 
              icon="bolt" 
              desc="30-50% faster mixing time with 20-40% lower energy consumption per batch, making it widely applicable across industries." 
              img="/assets/images/solutions/temp/high-efficiency-energy-saving.png"
            />
            <AdvantageCard 
              title="Dust-Free Sealing" 
              icon="shield-virus" 
              desc="Zero dust leakage throughout the entire process with modular design and customized configurations for clean production." 
              img="/assets/images/solutions/temp/dust-free-sealing.png"
            />
            <AdvantageCard 
              title="Leading Uniformity" 
              icon="check-circle" 
              desc="A mixing uniformity (CV) of <5% achieved even for small-batch laboratory applications to large-scale industrial production." 
              img="/assets/images/solutions/temp/leading-uniformity.png"
            />
            <AdvantageCard 
              title="No-Dead-Angle Design" 
              icon="broom" 
              desc="Complete discharge design eliminates cross-contamination and reduces the frequency of downtime for cleaning." 
              img="/assets/images/solutions/temp/no-dead-angle-design.png"
            />
            <AdvantageCard 
              title="Strong Adaptability" 
              icon="sliders-h" 
              desc="Handles powder-liquid, granule-granule, and solid-liquid mixtures with high precision and flexibility." 
              img="/assets/images/solutions/temp/strong-adaptability.png"
            />
            <AdvantageCard 
              title="Intelligent Control" 
              icon="microchip" 
              desc="PLC touch screen smart control ensures stable processing and reduces operational costs for all mixing requirements." 
              img="/assets/images/solutions/temp/intelligent-control.png"
            />
          </div>
        </div>
      </section>

      {/* 3. Materials Information */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-display font-black leading-tight mb-6">Powder Characterisation</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-orange-600 mb-2 tracking-widest uppercase text-xs">Classified by Density</h4>
                  <p className="text-slate-600 text-sm font-light">
                    Light powder (Density &lt; 0.5g/cm³), Medium powder (0.5-1.5g/cm³), and Heavy powder (Density &gt; 1.5g/cm³).
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-orange-600 mb-2 tracking-widest uppercase text-xs">Classified by Flowability</h4>
                  <p className="text-slate-600 text-sm font-light">
                    Excellent flowability (Free-flowing), average flowability (Requires agitation), and poor flowability (Caking or cohesive).
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
               <h2 className="text-3xl font-display font-black leading-tight mb-6">Technical Commitment</h2>
               <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="text-4xl font-black text-slate-900 mb-4 tracking-tight italic">CV &lt; <span className="text-orange-500">5%</span></div>
                  <p className="text-slate-500 font-light leading-relaxed mb-6 italic">
                    "DoDoShark leverages its three main machine types to cover all mixing requirements, from small-batch laboratory applications to large-scale industrial production."
                  </p>
                  <ul className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500" /> Speed: 30-50% faster</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500" /> Energy: 20-40% lower</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500" /> Design: Modular</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500" /> Control: PLC Smart</li>
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Section (Pain Points) */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Industry Challenges & Solutions" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PainPointCard
              title="Serious Dust Pollution"
              desc="Open mixing environments causing health hazards and material loss."
              solution="Hermetically sealed modular design."
              icon="mask"
            />
            <PainPointCard
              title="High Discharge Residue"
              desc="Material sticking to walls or dead corners causing wastage."
              solution="No-dead-angle bottom discharge."
              icon="dumpster"
              img="/assets/images/solutions/temp/high-residue.jpg"
            />
            <PainPointCard
              title="Poor Mixing Uniformity"
              desc="Inconsistent distribution of trace ingredients."
              solution="Optimized blade/vessel geometry (CV < 5%)."
              icon="random"
              img="/assets/images/solutions/temp/poor-mixing-uniformity.jpg"
            />
            <PainPointCard
              title="Excessive Temperature Rise"
              desc="Heat generated by high-speed friction damaging sensitive ingredients."
              solution="Variable speed control & cooling jackets."
              icon="thermometer-high"
              img="/assets/images/solutions/temp/high-temp-rise.jpg"
            />
          </div>
        </div>
      </section>

      {/* 5. Product Range */}
      <section id="products" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Mixer Portfolio" subtitle="The perfect machine for every specific gravity and viscosity challenge." />
          <div className="space-y-16">
            <ProductCard 
              num="01"
              category="Industrial Scale"
              title="Double Cone Drum Mixer (Large)"
              img="/assets/images/solutions/temp/dodoshark-double-cone-drum-mixer-large.png"
              specs={{ "Homogeneity": "CV < 1%", "Capacity": "500kg - 5t / batch", "Principle": "Gravity Diffusion", "Material": "Stainless Steel" }}
              desc="Handles light and heavy powders with minimal shear, ideal for sensitive granules."
            />
            <ProductCard 
              num="02"
              category="Precision & Lab"
              title="Double Cone Drum Mixer (Lab Edition)"
              img="/assets/images/solutions/temp/dodoshark-double-cone-drum-mixer-lab.png"
              specs={{ "Homogeneity": "CV < 0.5%", "Capacity": "1kg - 20kg / batch", "Principle": "High-speed Rotation", "Material": "Polish SS304" }}
              desc="Perfect for R&D, small-batch luxury food, or pharmaceutical experimentation."
              reverse
            />
            <ProductCard 
              num="03"
              category="Convective Mixing"
              title="Double Screw Ribbon Mixer"
              img="/assets/images/solutions/temp/dodoshark-double-ribbon-mixer-ss.png"
              specs={{ "Homogeneity": "CV < 3%", "Capacity": "100kg - 5t / batch", "Principle": "Outer/Inner Screw", "Material": "SS304 / SS316" }}
              desc="High-speed convective mixing for paste-like or damp powder applications."
            />
            <ProductCard 
              num="04"
              category="Versatile Blending"
              title="DoDoShark Drum Mixer"
              img="/assets/images/solutions/temp/dodoshark-drum-mixer-ss.png"
              specs={{ "Homogeneity": "CV < 2%", "Capacity": "50kg - 2t / batch", "Principle": "Tumbling Action", "Material": "Mirror Polish Stainless" }}
              desc="Simple, robust, and easy to clean for rapid product changeovers."
              reverse
            />
          </div>
        </div>
      </section>

      {/* 6. Success Stories */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Success Case Study" />
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-slate-900 p-12 text-white">
               <div className="inline-block bg-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Nutrition Enterprise</div>
               <h3 className="text-3xl font-display font-black mb-6">Bozhou Nutritional Meal Replacement Project</h3>
               <div className="space-y-6 text-slate-400 font-light">
                  <div>
                    <h5 className="text-white font-bold mb-2">The Challenge</h5>
                    <p className="text-sm">Production of blended nutritional meal replacement powder, requiring uniform mixing of whole grain and cereal powders with trace additives in 150kg batches.</p>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Our Solution</h5>
                    <p className="text-sm">DoDoShark High-Capacity Twin-Cone Drum Mixer (400L) with PLC timer and polished internals for zero residue.</p>
                  </div>
               </div>
            </div>
            <div className="md:w-1/2 bg-slate-50 p-12 flex flex-col justify-center">
               <div className="text-6xl font-black text-orange-500 mb-4">15 <span className="text-2xl text-slate-400 font-light">min</span></div>
               <p className="text-xl font-bold text-slate-900 mb-8 leading-tight">Batch cycle reached 15 minutes with perfect distribution.</p>
               <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl">
                        <i className="fas fa-check" />
                     </div>
                     <div>
                        <span className="block font-black text-xs uppercase text-slate-400 tracking-widest">Client Feedback</span>
                        <p className="text-sm text-slate-600">Subsequently purchased 5 more units for different formulations.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function AdvantageCard({ icon, title, desc, img }: { icon: string; title: string; desc: string; img: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="h-14 w-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-colors">
        <i className={`fas fa-${icon}`} />
      </div>
      <h3 className="text-xl font-display font-bold mb-4">{title}</h3>
      <p className="text-slate-500 text-sm font-light leading-relaxed mb-6 h-16 overflow-hidden">{desc}</p>
      <div className="relative h-32 w-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
        <Image src={img} alt={title} fill className="object-contain" />
      </div>
    </div>
  )
}

function PainPointCard({ title, desc, solution, icon, img }: { title: string; desc: string; solution: string; icon: string; img?: string }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6 flex flex-col group overflow-hidden">
      {img && (
        <div className="relative h-32 -mx-6 -mt-6 mb-6 overflow-hidden border-b border-red-100 bg-white">
          <Image src={img} alt={title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform" />
        </div>
      )}
      {!img && (
        <div className="text-red-500 mb-4"><i className={`fas fa-${icon} text-3xl`} /></div>
      )}
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 mb-4">{desc}</p>
      <div className="pt-3 border-t border-red-200 mt-auto">
        <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> Dodoshark solves:</span>
        <p className="text-sm mt-1 text-slate-800 font-medium">{solution}</p>
      </div>
    </div>
  )
}

function ProductCard({ num, category, title, img, specs, desc, reverse = false }: any) {
  return (
    <div className={`bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className="lg:w-2/5 relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
        <Image src={img} alt={title} fill className="object-contain p-8" />
      </div>
      <div className="lg:w-3/5">
        <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">{num} / {category}</div>
        <h3 className="text-3xl font-display font-bold mb-6">{title}</h3>
        <p className="text-slate-500 font-light leading-relaxed mb-8 italic">"{desc}"</p>
        <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8 border-t border-slate-100 pt-8">
          {Object.entries(specs).map(([k, v]: any) => (
            <div key={k}>
              <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{k}</span>
              <span className="text-lg font-bold text-slate-800 leading-none">{v}</span>
            </div>
          ))}
        </div>
        <Link href="/products" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2 uppercase tracking-widest text-xs">
          View Product Line < i className="fas fa-arrow-right" />
        </Link>
      </div>
    </div>
  )
}

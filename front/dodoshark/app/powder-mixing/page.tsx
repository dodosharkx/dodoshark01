import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DoDoShark High-Efficiency Powder Mixing Solution | DoDoShark',
  description: 'Systematic, high-efficiency, uniform and dust-free powder mixing solutions. CV <5%, 30-50% reduced mixing time, 20-40% lower energy consumption.',
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
      <section className="relative overflow-hidden bg-slate-800 pb-20 pt-16 lg:pt-24 lg:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
              <i className="fas fa-blender" aria-hidden />
              <span>Complete Mixing Solution</span>
            </div>
            <h1 className="mb-6 text-4xl font-display font-black leading-tight tracking-tight text-white md:text-6xl">
              DoDoShark <span className="text-orange-500">Powder Mixing</span> Solution
            </h1>
            <p className="mb-8 text-xl font-light leading-relaxed text-slate-400">
              Systematic, high-efficiency, uniform and dust-free solution for mixing powders, granules and solid-liquid mixtures. From laboratory to industrial scale.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#products" className="rounded-md border-2 border-orange-500 bg-orange-500 px-8 py-3.5 text-sm font-black tracking-widest text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:border-orange-600">
                View Equipment
              </a>
              <a href="#contact" className="rounded-md border-2 border-slate-600 bg-transparent px-8 py-3.5 text-sm font-black tracking-widest text-white transition-all hover:border-slate-400 hover:bg-slate-800">
                Contact Us
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="relative w-full max-w-3xl aspect-[4/3]">
              <Image 
                src="/assets/images/temp/powder.jpg" 
                alt="Powder Mixing Solution Banner" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Advantages */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Core Advantages"
            subtitle="Six reasons why DoDoShark is the preferred choice for modern powder mixing solutions."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Uniformity */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/excellent-quality.png" alt="Leading Uniformity" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Leading Uniformity</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Achieves mixing uniformity with CV &lt;5%, ensuring consistent product quality across every batch.
              </p>
            </div>
            {/* Efficiency */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/efficiency-improvement.png" alt="High Efficiency" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">High Efficiency</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Reduces mixing time by 30%-50% and energy consumption by 20%-40% compared to conventional methods.
              </p>
            </div>
            {/* Sealing */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/clean-workshop.png" alt="Dust-Free Sealing" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Dust-Free Sealing</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Fully enclosed design with dust-free operation, ensuring clean production and operator safety.
              </p>
            </div>
            {/* Intelligence */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/intelligent-worry-free.png" alt="Intelligent Control" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Intelligent Control</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                PLC-based intelligent control system for precise parameter management and one-touch operation.
              </p>
            </div>
            {/* Dead Angle */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/low-cost-high-roi.png" alt="No Dead Angle" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">No Dead Angle Design</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Optimized internal structure eliminates mixing dead zones, ensuring thorough blending.
              </p>
            </div>
            {/* Adaptability */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/long-term-guarantee.png" alt="Strong Adaptability" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Strong Adaptability</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Handles various materials including powders, granules, and solid-liquid mixtures with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Material Characterisation */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-display font-black leading-tight mb-6">Classified by Density</h2>
              <p className="text-slate-600 mb-8 font-light">
                Understanding powder density is crucial for selecting the right mixing intensity and equipment volume.
              </p>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-orange-600 mb-2 flex items-center gap-2">
                    <i className="fas fa-feather" /> Low Density
                  </h4>
                  <p className="text-sm text-slate-500 mb-2">Light powders that tend to float and require special mixing action.</p>
                  <p className="text-xs font-bold text-slate-700">Examples: Flour, starch, protein powder</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-orange-600 mb-2 flex items-center gap-2">
                    <i className="fas fa-balance-scale" /> Medium Density
                  </h4>
                  <p className="text-sm text-slate-500 mb-2">Standard powders with balanced flow characteristics.</p>
                  <p className="text-xs font-bold text-slate-700">Examples: Feed powder, chemical powder, spice mixes</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-orange-600 mb-2 flex items-center gap-2">
                    <i className="fas fa-dumbbell" /> High Density
                  </h4>
                  <p className="text-sm text-slate-500 mb-2">Heavy powders that tend to settle, requiring high-shear mixing.</p>
                  <p className="text-xs font-bold text-slate-700">Examples: Mineral powder, metal powder, ceramic powder</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-display font-black leading-tight mb-6">Classified by Flowability</h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Flow Type</th>
                      <th className="p-4">Characteristics</th>
                      <th className="p-4">Example Samples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Good Flow</td>
                      <td className="p-4">Free-flowing, mixes easily, discharges quickly</td>
                      <td className="p-4">Granules, crystalline materials</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Poor Flow</td>
                      <td className="p-4">Cohesive, tends to clump, requires high-shear</td>
                      <td className="p-4">Fine powders, sticky materials</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Special Flow</td>
                      <td className="p-4">Unique character requiring customization</td>
                      <td className="p-4">Fibrous materials, abrasive powders</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 rounded-lg bg-orange-50 border border-orange-100 p-6 flex gap-4 items-start text-orange-800">
                <i className="fas fa-info-circle text-2xl text-orange-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">DoDoShark Optimization</h4>
                  <p className="text-sm">Our mixers are programmed with specific rotation cycles adapted to each material flow type to prevent clumping and ensure 100% uniformity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problems Comparison */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Industry Pain Points vs DoDoShark Solutions" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/temp/serious-dust-pollution.jpg" alt="Dust Pollution" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Dust Pollution</h4>
              <p className="text-sm text-slate-600 mb-3">Open design causes leakage, leading to material waste (0.5%-2%) and safety hazards.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">99.9% Dust containment</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/temp/poor-mixing-uniformity.jpg" alt="Poor Uniformity" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Poor Uniformity</h4>
              <p className="text-sm text-slate-600 mb-3">Inadequate mixing action results in uneven distribution with CV &gt;10%.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">3D motion CV &lt;5% uniformity</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/temp/excessive-temperature-rise-mixing.jpg" alt="Temperature Rise" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Temperature Rise</h4>
              <p className="text-sm text-slate-600 mb-3">Friction heat can damage temperature-sensitive nutrient materials.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">Low-friction cool mixing</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/temp/high-discharge-residue.jpg" alt="High Residue" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">High Residue</h4>
              <p className="text-sm text-slate-600 mb-3">Dead angles leave 3%-5% material residue after discharge causing contamination.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">No dead angle discharge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recommended Products */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Recommended Product Selection" subtitle="A variety of mixing principles to perfectly match your material type and batch size." />

          <div className="space-y-16">
            {/* Product 1 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/temp/dodoshark-double-cone-drum-mixer-lab.png" alt="Lab Drum Mixer" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">01 / Lab & Small Batch</div>
                <h3 className="text-3xl font-display font-bold mb-6">Double-Cone Drum Mixer (Lab)</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Capacity</strong> 5L ~ 50L</div>
                  <div><strong className="text-slate-900 block">Uniformity</strong> CV &lt;3%</div>
                  <div><strong className="text-slate-900 block">Power</strong> 0.75kw ~ 1.5kw</div>
                  <div><strong className="text-slate-900 block">Material</strong> 304 Stainless Steel</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> The double-cone drum rotates, creating a complex three-dimensional motion that ensures thorough mixing with minimal material damage.<br/><br/>
                  <strong>Application:</strong> Ideal for laboratory testing, small-batch production, and R&D samples.
                </p>
                <Link href="/products/lab-drum-mixer" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/temp/dodoshark-double-cone-drum-mixer-large.png" alt="Large Drum Mixer" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">02 / Industrial Scale</div>
                <h3 className="text-3xl font-display font-bold mb-6">Double-Cone Drum Mixer (Large)</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Capacity</strong> 100L ~ 5000L</div>
                  <div><strong className="text-slate-900 block">Uniformity</strong> CV &lt;5%</div>
                  <div><strong className="text-slate-900 block">Power</strong> 2.2kw ~ 15kw</div>
                  <div><strong className="text-slate-900 block">Control</strong> PLC Smart System</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Large-capacity double-cone design with optimized rotation speed ensures uniform mixing for bulk production while maintaining gentle handling.<br/><br/>
                  <strong>Application:</strong> Widely used in food, pharmaceutical, and chemical bulk production.
                </p>
                <Link href="/products/large-drum-mixer" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/temp/dodoshark-drum-mixer-ss.png" alt="Drum Agitator" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">03 / High-Shear Mixing</div>
                <h3 className="text-3xl font-display font-bold mb-6">DoDoShark Drum Agitator</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Capacity</strong> 50L ~ 3000L</div>
                  <div><strong className="text-slate-900 block">Power</strong> 3kw ~ 22kw</div>
                  <div><strong className="text-slate-900 block">Material</strong> Stainless / Carbon Steel</div>
                  <div><strong className="text-slate-900 block">Speed</strong> VFD Speed Control</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Rotating drum with internal agitator blades provides high-shear mixing action, ideal for materials requiring intensive blending.<br/><br/>
                  <strong>Application:</strong> Perfect for solid-liquid mixing and materials requiring high dispersion.
                </p>
                <Link href="/products/drum-agitator" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/temp/dodoshark-double-ribbon-mixer-ss.png" alt="Ribbon Mixer" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">04 / Rapid Blending</div>
                <h3 className="text-3xl font-display font-bold mb-6">Double-Screw Ribbon Mixer</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Capacity</strong> 100L ~ 10000L</div>
                  <div><strong className="text-slate-900 block">Mixing Time</strong> 5 ~ 15 Minutes</div>
                  <div><strong className="text-slate-900 block">Power</strong> 4kw ~ 45kw</div>
                  <div><strong className="text-slate-900 block">Discharge</strong> Complete Discharge</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Double helical ribbons create axial and radial material movement, achieving rapid and uniform mixing.<br/><br/>
                  <strong>Application:</strong> Suitable for powder-powder and powder-granule mixing.
                </p>
                <Link href="/products/ribbon-mixer" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Technical Advantages */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-display font-black leading-tight md:text-5xl mb-4">Mixing System Technology</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-bullseye" /></div>
              <h4 className="text-xl font-bold mb-3">Uniformity Precision</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                DoDoShark's three-dimensional mixing action ensures CV &lt;5% uniformity regardless of material density differences.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-shield-virus" /></div>
              <h4 className="text-xl font-bold mb-3">Clean Environment</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Fully sealed design with optional dust collection system achieves 99.9% dust containment for a green workshop.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-leaf" /></div>
              <h4 className="text-xl font-bold mb-3">Energy Efficiency</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Optimized mixing geometry reduces mixing time by 30%-50% and energy consumption by 20%-40%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 & 9. Choose Us & Cases */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <SectionHeader 
            title="Comprehensive Solutions & Beyond" 
            subtitle="Expertise and full-link support to ensure your long-term mixing success." 
          />
          <div className="mb-24 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/complete-products.png" alt="Complete Products" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">Complete Selection</h4>
              <p className="text-sm text-slate-500">Models from 5L to 10000L for any scale.</p>
            </div>
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/high-roi.png" alt="High Return" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">High Stability</h4>
              <p className="text-sm text-slate-500">Durable structure for continuous operation.</p>
            </div>
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/full-link-delivery.png" alt="Full-Link Delivery" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">Modular Design</h4>
              <p className="text-sm text-slate-500">Easy to integrate and upgrade systems.</p>
            </div>
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/sustainable-upgrade.png" alt="Sustainable Upgrade" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">Smart Control</h4>
              <p className="text-sm text-slate-500">PLC touch screen for one-key operation.</p>
            </div>
          </div>

          <SectionHeader title="Success Cases" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="bg-slate-50 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200 mb-4">Bozhou, Anhui</div>
                  <h3 className="text-xl font-display font-bold mb-4">Nutritional Meal Replacement Powder</h3>
                  <div className="space-y-3 text-sm text-slate-600 mb-6">
                    <p><strong>Requirement:</strong> Uniform mixing of various whole grain powders with additives, 150kg batch.</p>
                    <p><strong>Solution:</strong> 400L Twin-Cone Drum Mixer.</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <span className="block text-green-700 font-bold mb-1">Result</span>
                  <p className="text-xs text-green-600">Uniform mixing within 15 minutes, food safety standards met. Client purchased 5 more units.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="bg-slate-50 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200 mb-4">Chemical Plant</div>
                  <h3 className="text-xl font-display font-bold mb-4">Pigment Dispersion Upgrade</h3>
                  <div className="space-y-3 text-sm text-slate-600 mb-6">
                    <p><strong>Requirement:</strong> Batching of pigments and chemical additives, high dispersion.</p>
                    <p><strong>Solution:</strong> High-Shear Drum Agitator with VFD.</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <span className="block text-green-700 font-bold mb-1">Result</span>
                  <p className="text-xs text-green-600">Dispersion time reduced by 40%, particle size distribution significantly improved.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/cases" className="inline-flex items-center gap-2 rounded-md border-2 border-slate-200 px-6 py-3 text-sm font-bold tracking-widest text-slate-700 hover:border-slate-800 hover:bg-slate-800 hover:text-white transition-all">
              View All Cases
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

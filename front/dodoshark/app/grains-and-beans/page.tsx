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
      <section className="relative overflow-hidden bg-slate-800 pb-20 pt-16 lg:pt-24 lg:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
              <i className="fas fa-seedling" />
              <span>Grains & Legumes Expert</span>
            </div>
            <h1 className="mb-6 text-4xl font-display font-black leading-tight tracking-tight text-white md:text-6xl">
              DoDoShark <span className="text-orange-500">Grains & Beans</span> Solution
            </h1>
            <p className="mb-8 text-xl font-light leading-relaxed text-slate-400">
              This solution provides a comprehensive, high-efficiency, precision and dust-free milling solution for enterprises processing grains, cereals and pulses. Adjustable 60 to 150 mesh with professional construction.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#products" className="rounded-md border-2 border-orange-500 bg-orange-500 px-8 py-3.5 text-sm font-black tracking-widest text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:border-orange-600">
                View Grinding Range
              </a>
              <a href="#contact" className="rounded-md border-2 border-slate-600 bg-transparent px-8 py-3.5 text-sm font-black tracking-widest text-white transition-all hover:border-slate-400 hover:bg-slate-800">
                Contact Us
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="relative w-full max-w-3xl aspect-[4/3]">
              <Image 
                src="/assets/images/solutions/temp/grains-and-beans.jpg" 
                alt="Grains & Beans Solution Banner" 
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
            subtitle="Leading the industry in grain processing with high stability and precision."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cost */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/low-cost-high-roi.png" alt="Cost Optimization" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Cost Optimization</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Provides high-performance milling machines to meet grains milling needs with superior value and ROI.
              </p>
            </div>
            {/* Dust Free */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/clean-workshop.png" alt="Dust-Free Production" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Dust-Free Production</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Dust suppression ratio of dust removal equipment reaching up to 99.99% for food-grade hygiene.
              </p>
            </div>
            {/* Quality */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/excellent-quality.png" alt="Superior Fine Flour" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Superior Fine Flour</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Consistently produces 100-150 mesh high-quality powder with industry-leading stability.
              </p>
            </div>
            {/* Efficiency */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/efficiency-improvement.png" alt="Throughput Boost" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Throughput Boost</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Lowers power consumption per ton by up to 50% while maintaining very high output.
              </p>
            </div>
            {/* Intelligence */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/intelligent-worry-free.png" alt="Intelligent Grinding" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Intelligent Grinding</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Integrated PLC control systems from raw cleaning to fine collection for worry-free operation.
              </p>
            </div>
            {/* Guarantee */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/long-term-guarantee.png" alt="Lifetime Commitment" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Lifetime Commitment</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                12-month warranty and lifetime technical support to ensure your long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Material Analysis */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-display font-black leading-tight mb-8">Raw Material Challenges</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-orange-50 transition-colors bg-white">
                  <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Oil-rich Legumes</h5>
                    <p className="text-slate-500 text-xs font-light mt-1">Heat and oil release leading to screen clogging.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-orange-50 transition-colors bg-white">
                  <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Fibre Toughness</h5>
                    <p className="text-slate-500 text-xs font-light mt-1">Hard-to-grind husks requiring high-torque systems.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-orange-50 transition-colors bg-white">
                  <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider">High Fineness</h5>
                    <p className="text-slate-500 text-xs font-light mt-1">Applications requiring 100+ mesh delicate powders.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-orange-50 transition-colors bg-white">
                  <div className="mt-1 h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Hygiene Standards</h5>
                    <p className="text-slate-500 text-xs font-light mt-1">Contact parts meet food-grade stainless steel requirements.</p>
                  </div>
                </div>
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
              <div className="mt-6 rounded-lg bg-orange-50 border border-orange-100 p-6 flex gap-4 items-start text-orange-800 shadow-sm">
                <i className="fas fa-certificate text-2xl text-orange-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Food-Grade Standard Commitment</h4>
                  <p className="text-sm">Available in full 304/316L stainless steel construction to meet international hygiene standards for export-grade flour production.</p>
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
                <Image src="/assets/images/solutions/temp/serious-dust-pollution.jpg" alt="Serious Dust Pollution" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Serious Dust Pollution</h4>
              <p className="text-sm text-slate-600 mb-3">Open environments causing safety hazards and raw material waste.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">99.9% Dust removal system</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/solutions/temp/oily-material-clogging.jpg" alt="Oil Material Clogging" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Oil Material Clogging</h4>
              <p className="text-sm text-slate-600 mb-3">Heat generated by legumes causing oil release and machine blockage.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">Widened chamber & cooling</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/solutions/temp/high-temp-rise.jpg" alt="Excessive Temperature" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Excessive Temperature</h4>
              <p className="text-sm text-slate-600 mb-3">Nutrient loss and powder caking due to friction heat.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">Active water/air cooling</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/solutions/temp/sub-standard-fineness.jpg" alt="Fineness Not Standard" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Fineness Not Standard</h4>
              <p className="text-sm text-slate-600 mb-3">Inconsistent particle size affecting final product texture and quality.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">Precision mesh-control tech</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recommended Products */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Recommended Product Selection" subtitle="High-performance equipment designed for industrial grains and legumes processing." />

          <div className="space-y-16">
            {/* Product 1 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/solutions/temp/dodoshark-304-ss-claw-mill-with-fan.png" alt="Stainless Steel Claw Mill" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">01 / Premium Grinding</div>
                <h3 className="text-3xl font-display font-bold mb-6">Stainless Steel Claw Mill (304 SS)</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 40 ~ 150 Mesh</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> Up to 3.0 tons/hour</div>
                  <div><strong className="text-slate-900 block">Material</strong> 304 Stainless Steel</div>
                  <div><strong className="text-slate-900 block">Control</strong> PLC Smart Integration</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Shear, impact, and friction between moving and fixed teeth, with integrated centrifugal fan for cooling.<br/><br/>
                  <strong>Application:</strong> Fully dust-free food-grade collection system for processing delicate grain flours.
                </p>
                <Link href="/products/ss-claw-mill" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/solutions/temp/dodoshark-cast-iron-claw-mill-with-fan.png" alt="Cast Iron Claw Mill" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">02 / Industrial Standard</div>
                <h3 className="text-3xl font-display font-bold mb-6">Cast Iron Claw Mill (High-Fan)</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 10 ~ 120 Mesh</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> 0.4 ~ 8.0 tons/hour</div>
                  <div><strong className="text-slate-900 block">Material</strong> Cast Iron Construction</div>
                  <div><strong className="text-slate-900 block">Drive</strong> V-Belt / Direct Coupling</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> High-speed rotating teeth impact the material combined with a high-pressure airvortex for efficient heat dissipation.<br/><br/>
                  <strong>Application:</strong> Robust standard for high-volume grain crushing and agricultural pulse processing.
                </p>
                <Link href="/products/iron-claw-mill" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/solutions/temp/dodoshark-grinding-ultrafine-mill.png" alt="Ultrafine Mill" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">03 / Ultrafine Solution</div>
                <h3 className="text-3xl font-display font-bold mb-6">Precision Grinding Ultrafine Mill</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 100 ~ 300 Mesh</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> 50 ~ 1500 kg/hour</div>
                  <div><strong className="text-slate-900 block">Technology</strong> Built-in Air Classifier</div>
                  <div><strong className="text-slate-900 block">Suitability</strong> Ultra-fine Grain Powder</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Grinding-style milling with built-in air classification feedback loops to ensure particles reach the target micron range.<br/><br/>
                  <strong>Application:</strong> The flagship for super-fine mixed grain powder and high-end nutritional flour.
                </p>
                <Link href="/products/grinding-ultrafine-mill" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
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
            <h2 className="text-3xl font-display font-black leading-tight md:text-5xl mb-4">Grains Milling Technology</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-wind" /></div>
              <h4 className="text-xl font-bold mb-3">Air-Vortex Cooling</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Proprietary air-vortex design combined with water-cooling jackets ensures temperature stays below 40°C even during peak production.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-filter" /></div>
              <h4 className="text-xl font-bold mb-3">Anti-Clog Technology</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Widened milling chambers and specially treated internal surfaces prevent the sticking of oil-rich Legumes and fibre-tough cereals.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-check-double" /></div>
              <h4 className="text-xl font-bold mb-3">Mesh Consistency</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                High-precision mechanical screening combined with air classification for the most uniform particle distribution in the industry.
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
            subtitle="Expertise and full-link support to ensure your long-term milling success." 
          />
          <div className="mb-24 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/complete-products.png" alt="Complete Products" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">Complete Products</h4>
              <p className="text-sm text-slate-500">Match suitable models for optimal efficiency.</p>
            </div>
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/high-roi.png" alt="High Return" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">High Return</h4>
              <p className="text-sm text-slate-500">Self-production ensures low costs and better price.</p>
            </div>
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/full-link-delivery.png" alt="Full-Link Delivery" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">Full-Link Delivery</h4>
              <p className="text-sm text-slate-500">Design to installation handled seamlessly.</p>
            </div>
            <div className="p-8 group border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              <div className="h-16 w-16 mx-auto mb-4 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                <Image src="/assets/images/solutions/temp/sustainable-upgrade.png" alt="Sustainable Upgrade" fill className="object-contain" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-slate-900">Sustainable Upgrade</h4>
              <p className="text-sm text-slate-500">Modular design expands with your business.</p>
            </div>
          </div>

          <SectionHeader title="Success Cases" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="bg-slate-50 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200 mb-4">Sichuan Jinliang Food</div>
                  <h3 className="text-xl font-display font-bold mb-4">Roasted Soya Bean Grinding Solution</h3>
                  <div className="space-y-3 text-sm text-slate-600 mb-6">
                    <p><strong>Requirement:</strong> Grinding of roasted soya beans (0.6–0.8 mm), high oil content handling.</p>
                    <p><strong>Solution:</strong> SS Model 37 + High-pressure fan + 4-bag dust collector.</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <span className="block text-green-700 font-bold mb-1">Result</span>
                  <p className="text-xs text-green-600">Hourly output of 300 kg with excellent dust removal and zero machine clogging.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="bg-slate-50 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200 mb-4">Busan Food Factory</div>
                  <h3 className="text-xl font-display font-bold mb-4">100-Mesh Mixed Grain Powder Project</h3>
                  <div className="space-y-3 text-sm text-slate-600 mb-6">
                    <p><strong>Requirement:</strong> High precision 100-mesh grinding with energy export standard.</p>
                    <p><strong>Solution:</strong> SS Model 37 + Variable-frequency motor + 5-bag collector.</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <span className="block text-green-700 font-bold mb-1">Result</span>
                  <p className="text-xs text-green-600">Stable fine grinding at 150 kg/h, energy-efficient operation trusted in South Korea.</p>
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

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
      <section className="relative overflow-hidden bg-slate-800 pb-20 pt-16 lg:pt-24 lg:pb-24">
        {/* Subtle Blue Glow for Hero to match the "Wet" theme while keeping AK47 benchmark bg */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[100px] rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              <i className="fas fa-water" />
              <span>Wet Milling Specialist</span>
            </div>
            <h1 className="mb-6 text-4xl font-display font-black leading-tight tracking-tight text-white md:text-6xl">
              DoDoShark <span className="text-blue-500">Soaked Rice</span> Solution
            </h1>
            <p className="mb-8 text-xl font-light leading-relaxed text-slate-400">
              Specifically tailored for the high-efficiency milling of soaked rice (wet rice). Addressing clogging, screen fouling, and low throughput while ensuring food-grade hygiene standards.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <a href="#products" className="rounded-md border-2 border-blue-500 bg-blue-500 px-8 py-3.5 text-sm font-black tracking-widest text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 hover:border-blue-600">
                Explore Wet Mills
              </a>
              <a href="#contact" className="rounded-md border-2 border-slate-600 bg-transparent px-8 py-3.5 text-sm font-black tracking-widest text-white transition-all hover:border-slate-400 hover:bg-slate-800">
                Contact Us
              </a>
            </div>

            {/* Floating Stats Badge for Soaked Rice */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 border-t border-white/5 pt-8">
               <div>
                  <div className="text-3xl font-black text-white leading-none">3.0 <span className="text-sm font-bold text-blue-400">T/h</span></div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Peak Capacity</div>
               </div>
               <div className="h-10 w-px bg-white/10" />
               <div>
                  <div className="text-lg font-bold text-white leading-none">Non-Clogging</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Tech Standard</div>
               </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex justify-center">
            <div className="relative w-full max-w-3xl aspect-[4/3]">
              <Image 
                src="/assets/images/solutions/temp/soaked-rice.jpg" 
                alt="Soaked Rice Grinding Solution Banner" 
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
            subtitle="Engineered for stability, hygiene, and high-volume wet processing. Our technology sets the benchmark for soaked rice milling."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Anti-Clogging */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-blue-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/high-efficiency-stable.png" alt="Anti-Clogging" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Anti-Clogging Design</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Widened chamber structure prevents wet powder sticking and screen fouling for continuous production.
              </p>
            </div>
            {/* Cooling */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-blue-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/clean-workshop.png" alt="Advanced Cooling" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Advanced Cooling</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                High-volume air-cooling system maintains low temperatures to prevent starch gelatinization.
              </p>
            </div>
            {/* Quality */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-blue-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/rice-flour-excellent-quality.png" alt="Rice Flour Quality" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Rice Flour Quality</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Selectable mesh sizes (0.4–0.8 mm) produce delicate 80–120 mesh flour for premium rice products.
              </p>
            </div>
            {/* Efficiency */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-blue-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/low-cost-high-roi.png" alt="Efficiency Boost" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Efficiency Boost</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Hourly output exceeding 3 tonnes per unit, delivering a 300% increase in processing efficiency.
              </p>
            </div>
            {/* Intelligent */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-blue-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/intelligent-worry-free.png" alt="Intelligent Control" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Intelligent & Worry-Free</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Food-grade fully dust-free design covering the entire process from feeding to collection.
              </p>
            </div>
            {/* Guarantee */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-blue-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/5 text-center">
              <div className="h-16 w-16 mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-500 mx-auto">
                <Image src="/assets/images/solutions/temp/long-term-guarantee.png" alt="Long-Term Guarantee" fill className="object-contain" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Long-Term Guarantee</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Stainless steel construction ensures hygiene compliance and long-term durability in wet environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Material Info */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-display font-black leading-tight mb-8 text-slate-900">Soaked Rice Characteristics</h2>
              <p className="text-slate-500 mb-8 font-light leading-relaxed">
                Soaked rice presents unique challenges due to its high moisture content, which can cause conventional mills to fail.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                    <h5 className="font-bold text-blue-600 text-sm mb-2 uppercase tracking-widest"><i className="fas fa-faucet-drip mr-2" /> Wet Stickiness</h5>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">Moist powder tends to adhere to internal walls and screen surfaces.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                    <h5 className="font-bold text-blue-600 text-sm mb-2 uppercase tracking-widest"><i className="fas fa-temperature-high mr-2" /> Heat Sensitivity</h5>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">Friction heat can cause starch gelatinization, ruining the texture.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                    <h5 className="font-bold text-blue-600 text-sm mb-2 uppercase tracking-widest"><i className="fas fa-hand-sparkles mr-2" /> Hygiene Risks</h5>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">Wet environments promote bacterial growth if not properly cleaned.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                    <h5 className="font-bold text-blue-600 text-sm mb-2 uppercase tracking-widest"><i className="fas fa-chart-line-down mr-2" /> Throughput Drop</h5>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">Clogging causes frequent downtime and low effective capacity.</p>
                 </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-display font-black leading-tight mb-8">Application Scenarios</h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Application</th>
                      <th className="p-4">Mesh Standard</th>
                      <th className="p-4">Process Characteristic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Rice Cakes & Noodles</td>
                      <td className="p-4">60~80 Mesh</td>
                      <td className="p-4">High-moisture milling, non-clogging</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Tangyuan Flour</td>
                      <td className="p-4">100~120 Mesh</td>
                      <td className="p-4">Ultra-fine particles, delicate texture</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">Vermicelli Production</td>
                      <td className="p-4">80~100 Mesh</td>
                      <td className="p-4">Continuous industrial-scale output</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 rounded-2xl bg-slate-900 p-8 text-white relative overflow-hidden shadow-xl">
                 <div className="relative z-10 flex items-center gap-8">
                    <div className="shrink-0">
                       <div className="text-5xl font-black text-blue-400 italic">60-80</div>
                       <div className="text-[10px] uppercase font-black tracking-widest text-white/50 mt-2">Mesh Standard</div>
                    </div>
                    <p className="text-slate-400 text-sm font-light leading-relaxed italic border-l border-white/10 pl-8">
                      "Consistent high-efficiency processing for wet powder across all major rice products."
                    </p>
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
                <Image src="/assets/images/solutions/temp/low-capacity.jpg" alt="Low Capacity" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Low Capacity</h4>
              <p className="text-sm text-slate-600 mb-3">Frequent clogging leading to low throughput and high labor costs.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">High-pressure air-cooling</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/solutions/temp/screen-clogging.jpg" alt="Screen Clogging" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Screen Clogging</h4>
              <p className="text-sm text-slate-600 mb-3">Wet rice powder sticks to the mesh, blocking discharge.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">Vortex self-cleaning airflow</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/solutions/temp/starch-gelatinization.jpg" alt="Gelatinization" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Gelatinization</h4>
              <p className="text-sm text-slate-600 mb-3">Overheating during milling ruins the rice flour quality and texture.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">Active cooling keeps temp &lt; 40°C</p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-6 flex flex-col">
              <div className="mb-4 h-40 relative overflow-hidden">
                <Image src="/assets/images/solutions/temp/serious-dust-pollution.jpg" alt="Dust Pollution" fill className="object-cover rounded-lg" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Dust & Steam</h4>
              <p className="text-sm text-slate-600 mb-3">Workshop hygiene issues due to leaking steam and wet powder residue.</p>
              <div className="pt-3 border-t border-slate-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> DoDoShark solves:</span>
                <p className="text-sm mt-1">Enclosed dust-free system</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recommended Products */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Wet Milling Portfolio" subtitle="Precision-engineered configurations designed to match your specific production scale and hygiene requirements." />

          <div className="space-y-16">
            {/* Product 1 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/solutions/temp/dodoshark-304-ss-claw-mill-with-fan.png" alt="Stainless Steel Soaked Rice Mill" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-blue-500 mb-2 tracking-widest uppercase">01 / Industrial Grade</div>
                <h3 className="text-3xl font-display font-bold mb-6">Stainless Steel Soaked Rice Mill (304 SS)</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 0.4 - 0.8 mm (80-120 Mesh)</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> 800 kg - 3.0 tons/hour</div>
                  <div><strong className="text-slate-900 block">Power</strong> 18.5 kW - 75 kW</div>
                  <div><strong className="text-slate-900 block">Hygiene</strong> Food Grade SS304</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Shear and impact in a widened chamber designed to prevent wet rice sticking, ensuring continuous high-volume output.<br/><br/>
                  <strong>Application:</strong> The benchmark for professional rice noodle and rice cake factories worldwide.
                </p>
                <Link href="/products/soaked-rice-mill" className="text-blue-500 font-bold hover:text-blue-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="lg:w-2/5 flex justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <Image src="/assets/images/solutions/temp/dodoshark-304-ss-claw-mill-no-fan.png" alt="Centrifugal Air-Cooled Mill" fill className="object-contain" />
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-blue-500 mb-2 tracking-widest uppercase">02 / Large-Scale High Efficiency</div>
                <h3 className="text-3xl font-display font-bold mb-6">High-Pressure Centrifugal Mill</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Cooling</strong> High-Volume Air Fan</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> Multi-line Scaling</div>
                  <div><strong className="text-slate-900 block">Feeding</strong> Self-priming Wet Feed</div>
                  <div><strong className="text-slate-900 block">Operation</strong> Continuous 12H+</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Integrated high-pressure centrifugal fan provides relentless cooling to the milling chamber, critical for preventing flour degradation.<br/><br/>
                  <strong>Application:</strong> Optimized for industrial-scale noodle production requiring 24/7 reliability.
                </p>
                <Link href="/products/centrifugal-mill" className="text-blue-500 font-bold hover:text-blue-600 inline-flex items-center gap-2">
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
            <h2 className="text-3xl font-display font-black leading-tight md:text-5xl mb-4">Wet Milling Technology</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
               <div className="text-3xl text-blue-500 mb-4"><i className="fas fa-wind" /></div>
               <h4 className="text-xl font-bold mb-3">Turbo-Cool System</h4>
               <p className="text-slate-400 font-light text-sm leading-relaxed">
                 Active airvortex cooling keeps processing temperatures consistently below 40°C, preserving starch structure and flavor.
               </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
               <div className="text-3xl text-blue-500 mb-4"><i className="fas fa-maximize" /></div>
               <h4 className="text-xl font-bold mb-3">Widened Bypass Chamber</h4>
               <p className="text-slate-400 font-light text-sm leading-relaxed">
                 Internal geometry widened by 20% compared to standard dry mills to accommodate extra moisture and prevent clogging.
               </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
               <div className="text-3xl text-blue-500 mb-4"><i className="fas fa-microchip" /></div>
               <h4 className="text-xl font-bold mb-3">Self-Priming Smart Feed</h4>
               <p className="text-slate-400 font-light text-sm leading-relaxed">
                 Automated wet feed control system that adjusts flow rate based on motor load to ensure optimal throughput.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 & 9. Success Story */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Success Case" subtitle="Real-world results demonstrating the effectiveness of DoDoShark wet milling solutions." />
          
          <div className="group relative max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 flex flex-col md:flex-row">
            {/* Case Content */}
            <div className="md:w-[60%] p-10 lg:p-16 text-white">
               <div className="flex items-center gap-4 mb-10">
                  <div className="h-12 w-12 rounded-full border border-blue-500/30 flex items-center justify-center text-blue-400">
                     <i className="fas fa-location-dot" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Anhui Province Project</div>
                     <div className="text-xl font-bold">Gongting Food Factory</div>
                  </div>
               </div>
               
               <h3 className="text-3xl font-display font-black mb-8 leading-tight lg:text-4xl">Glutinous Rice Efficiency Upgrade</h3>
               
               <div className="space-y-6">
                  <div>
                    <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Requirement</span>
                    <p className="text-slate-400 font-light text-sm">Efficient grinding of soaked glutinous rice (0.6–0.8 mm), targeting 800 kg/hour for stable production.</p>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Solution</span>
                    <p className="text-slate-400 font-light text-sm">DoDoShark 304 Stainless Steel Grinder (Model 60) + 18.5 kW motor + High-pressure fan system.</p>
                  </div>
               </div>
            </div>
            
            {/* Case Result Sidebar */}
            <div className="md:w-[40%] bg-blue-600 p-10 lg:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="relative z-10">
                  <div className="text-8xl font-black text-white italic leading-none opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">3X</div>
                  <div className="text-7xl font-black text-white italic leading-none drop-shadow-lg">3X</div>
                  <div className="text-white font-black text-xl mt-4 leading-tight uppercase tracking-widest font-display">Efficiency Increase</div>
                  <p className="text-blue-100 text-sm mt-8 max-w-[280px] font-light leading-relaxed">
                    Successfully achieved consistent non-stop grinding without screen clogging, ensuring 100% hygiene compliance.
                  </p>
                  <div className="mt-10 bg-white text-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Project Delivered</div>
               </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/cases" className="inline-flex items-center gap-2 rounded-md border-2 border-slate-200 px-6 py-3 text-sm font-bold tracking-widest text-slate-700 hover:border-slate-800 hover:bg-slate-800 hover:text-white transition-all">
              View All Cases
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

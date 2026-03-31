import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dodoshark Corn Milling Solution | DoDoShark',
  description: 'Clean, high-efficiency, and intelligent corn milling production lines. From 2 to 150 mesh corn flour processing solutions.',
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

function PlaceholderImage({ text, className = "" }: { text?: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
      <div className="text-center">
        <i className="fas fa-image text-4xl mb-2 opacity-50" aria-hidden />
        {text && <p className="text-sm font-medium">{text}</p>}
      </div>
    </div>
  )
}

export default function CornMillingSolutionPage() {
  return (
    <main className="bg-[#fcfdfd] text-slate-900">
      {/* 1. Hero / Overview Section */}
      <section className="relative overflow-hidden bg-slate-800 pb-24 pt-32 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
              <i className="fas fa-industry" aria-hidden />
              <span>Complete Production Line</span>
            </div>
            <h1 className="mb-6 text-4xl font-display font-black leading-tight tracking-tight text-white md:text-6xl">
              Dodoshark <span className="text-orange-500">Corn Milling</span> Solution
            </h1>
            <p className="mb-8 text-xl font-light leading-relaxed text-slate-400">
              This solution provides you with a corn milling selection system. Whether you are an individual user, a small-scale farmer, or a large-scale processing enterprise, you can find the suitable corn milling machine or complete production line that matches your needs.
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
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
              <PlaceholderImage text="Corn Production Line Banner" className="w-full h-full bg-slate-900" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Advantages */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Core Advantages"
            subtitle="Six reasons why Dodoshark is the preferred choice for modern corn milling solutions."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Low Cost */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
              <div className="h-14 w-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 text-2xl shadow-inner">
                <i className="fas fa-piggy-bank" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Low Cost & High ROI</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Provides various high-performance milling machines to meet the corn milling needs of individuals and small businesses with superior cost-effectiveness.
              </p>
            </div>
            {/* Clean Workshop */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
              <div className="h-14 w-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 text-2xl shadow-inner">
                <i className="fas fa-leaf" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Clean Workshop</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Establishes a dust-free production line, with dust suppression ratio of dust removal equipment reaching up to 99.99%.
              </p>
            </div>
            {/* Quality */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
              <div className="h-14 w-14 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mb-6 text-2xl shadow-inner">
                <i className="fas fa-award" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Excellent Flour Quality</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Stably produces 20-120 mesh adjustable high-quality corn flour with uniform fineness, meeting various customer requirements.
              </p>
            </div>
            {/* Efficiency */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
              <div className="h-14 w-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6 text-2xl shadow-inner">
                <i className="fas fa-tachometer-alt" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Efficiency Improvement</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Power consumption per ton reduced by up to 50%, single-line capacity up to 12 tons/hour or more, supporting 12 hours continuous operation.
              </p>
            </div>
            {/* Intelligent */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
              <div className="h-14 w-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 text-2xl shadow-inner">
                <i className="fas fa-microchip" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Intelligent & Worry-Free</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Integrated intelligent control covering the whole process from cleaning to fine milling, increasing added value and reducing costs.
              </p>
            </div>
            {/* Guarantee */}
            <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
              <div className="h-14 w-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6 text-2xl shadow-inner">
                <i className="fas fa-shield-alt" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Long-Term Guarantee</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Choosing Dodoshark means choosing a long-term guarantee of "peaceful production, comfortable harvest".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Raw Material & Application */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-display font-black leading-tight mb-6">Wide Applications of Raw Corn</h2>
              <PlaceholderImage text="Corn Raw Material Image" className="w-full aspect-square rounded-2xl mb-6 shadow-md" />
              <p className="text-slate-600 mb-6 font-light">
                Corn is widely planted around the world. As an important grain raw material, it is widely used in:
              </p>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-orange-500 mt-1" />
                  <div><strong>Food Industry:</strong> Corn flour, corn starch, puffed food, baking ingredients.</div>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-orange-500 mt-1" />
                  <div><strong>Feed Industry:</strong> Main energy feed for poultry and livestock farming.</div>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-orange-500 mt-1" />
                  <div><strong>Industrial Uses:</strong> Brewing, bio-based materials, chemical raw materials.</div>
                </li>
              </ul>
            </div>
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-display font-black leading-tight mb-6">Milling Fineness & Scenarios</h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Fineness Range (Mesh)</th>
                      <th className="p-4">Application Scenarios</th>
                      <th className="p-4">Finished Product Characteristics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-4">2~8 Coarse (3~5mm)</td>
                      <td className="p-4">Feed for chickens, cattle, sheep</td>
                      <td className="p-4">Improves starch digestion, promotes gastrointestinal health</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4">20-60 Mesh</td>
                      <td className="p-4">Feed processing, brewing, coarse food</td>
                      <td className="p-4">Retains graininess, high nutrition</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4">60-100 Mesh</td>
                      <td className="p-4">Ordinary corn flour, mass food base</td>
                      <td className="p-4">Delicate taste, strong versatility</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4">100-150 Mesh</td>
                      <td className="p-4">High-end flour, infant food, special diet</td>
                      <td className="p-4">Smooth taste, good solubility, high value</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4">Above 150 Mesh</td>
                      <td className="p-4">Cosmetics, special industrial apps</td>
                      <td className="p-4">Ultrafine powder, wide profit margin</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 rounded-lg bg-orange-50 border border-orange-100 p-6 flex gap-4 items-start text-orange-800">
                <i className="fas fa-info-circle text-2xl text-orange-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold mb-1">Dodoshark Technical Commitment</h4>
                  <p className="text-sm">Our equipment covers all fineness ranges, with industry-leading capacity and stability even for 100~150 mesh fine milling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problems Comparison */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Industry Pain Points vs Dodoshark Solutions" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-red-100 bg-red-50 p-6">
              <div className="text-red-500 mb-4"><i className="fas fa-times-circle text-3xl" /></div>
              <h4 className="font-bold text-slate-900 mb-2">Serious Dust Pollution</h4>
              <p className="text-sm text-slate-600 mb-3">Open design causing safety hazards and raw material waste (0.5%-2%).</p>
              <div className="pt-3 border-t border-red-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> Dodoshark solves:</span>
                <p className="text-sm mt-1">99.9% dust collection system</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-6">
              <div className="text-red-500 mb-4"><i className="fas fa-exclamation-triangle text-3xl" /></div>
              <h4 className="font-bold text-slate-900 mb-2">Unstable Performance</h4>
              <p className="text-sm text-slate-600 mb-3">Low efficiency, uncontrollable fineness, high temperature causing nutrient loss.</p>
              <div className="pt-3 border-t border-red-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> Dodoshark solves:</span>
                <p className="text-sm mt-1">Precise mesh control & cooling</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-6">
              <div className="text-red-500 mb-4"><i className="fas fa-cogs text-3xl" /></div>
              <h4 className="font-bold text-slate-900 mb-2">Mismatched Systems</h4>
              <p className="text-sm text-slate-600 mb-3">Piecing together different brands leads to bottlenecks and high maintenance.</p>
              <div className="pt-3 border-t border-red-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> Dodoshark solves:</span>
                <p className="text-sm mt-1">Integrated full-link design</p>
              </div>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-6">
              <div className="text-red-500 mb-4"><i className="fas fa-user-times text-3xl" /></div>
              <h4 className="font-bold text-slate-900 mb-2">Low Intelligence Level</h4>
              <p className="text-sm text-slate-600 mb-3">Relies purely on manual experience causing quality fluctuations.</p>
              <div className="pt-3 border-t border-red-200 mt-auto">
                <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> Dodoshark solves:</span>
                <p className="text-sm mt-1">PLC touch screen smart control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recommended Products */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Recommended Product Selection" subtitle="A variety of milling principles to perfectly match your target fineness and output." />

          <div className="space-y-16">
            {/* Product 1 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/5">
                <PlaceholderImage text="Roller Crusher Image" className="w-full aspect-square rounded-2xl" />
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">01 / Coarse Crushing</div>
                <h3 className="text-3xl font-display font-bold mb-6">Dodoshark Roller Crusher</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 2~8 coarse particles (3~5mm)</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> 1 ~ 25 tons/hour</div>
                  <div><strong className="text-slate-900 block">Power</strong> 2.2kw ~ 15kw</div>
                  <div><strong className="text-slate-900 block">Material</strong> Iron Material</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Two pressure rollers with toothed surfaces rotate relative to each other, using shear, extrusion, and tearing force.<br/><br/>
                  <strong>Application:</strong> Mainly used for coarse crushing of corn as feed for livestock, improving starch digestion efficiency.
                </p>
                <Link href="/products/roller-crusher" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="lg:w-2/5">
                <PlaceholderImage text="Hammer Mill Image" className="w-full aspect-square rounded-2xl" />
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">02 / Standard Milling</div>
                <h3 className="text-3xl font-display font-bold mb-6">Dodoshark Hammer Mill</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 10~40 Mesh (0.4~2mm)</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> 0.4 ~ 8 tons/hour</div>
                  <div><strong className="text-slate-900 block">Power</strong> 3kw ~ 75kw</div>
                  <div><strong className="text-slate-900 block">Material</strong> Iron / 304 Stainless Steel</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Uses kinetic energy from high-speed rotating hammer pieces to impact, shear, and friction the material.<br/><br/>
                  <strong>Application:</strong> Most widely used high-efficiency impact equipment in feed and grain processing.
                </p>
                <Link href="/products/hammer-mill" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/5">
                <PlaceholderImage text="Claw Mill Image" className="w-full aspect-square rounded-2xl" />
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">03 / Fine Milling</div>
                <h3 className="text-3xl font-display font-bold mb-6">Dodoshark Claw Mill</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 10~150 Mesh (0.1~2mm)</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> 0.2 ~ 12 tons/hour</div>
                  <div><strong className="text-slate-900 block">Power</strong> 1.5kw ~ 75kw</div>
                  <div><strong className="text-slate-900 block">Material</strong> Cast Iron / 304 Stainless Steel</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Strong impact, shear, and grinding between rotating moving teeth and fixed teeth, discharged via screen mesh.<br/><br/>
                  <strong>Application:</strong> Wider application range and higher efficiency for processing fine powder than hammer mills.
                </p>
                <Link href="/products/claw-mill" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
                  View Product Details <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row-reverse gap-12 items-center">
              <div className="lg:w-2/5">
                <PlaceholderImage text="Ultrafine Mill Image" className="w-full aspect-square rounded-2xl" />
              </div>
              <div className="lg:w-3/5">
                <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">04 / Ultrafine Milling</div>
                <h3 className="text-3xl font-display font-bold mb-6">Dodoshark Ultrafine Mill</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
                  <div><strong className="text-slate-900 block">Fineness</strong> 100~300 Mesh</div>
                  <div><strong className="text-slate-900 block">Capacity</strong> 50 kg ~ 1.5 tons/hour</div>
                  <div><strong className="text-slate-900 block">Power</strong> 15kw ~ 150kw</div>
                  <div><strong className="text-slate-900 block">Material</strong> Cast Iron / 304 Stainless Steel</div>
                </div>
                <p className="text-slate-500 font-light leading-relaxed mb-6">
                  <strong>Principle:</strong> Built-in air classification system. Unqualified fine powder returns to the milling chamber for re-milling.<br/><br/>
                  <strong>Application:</strong> High added-value ultrafine milling for chemical, pharmaceutical, food, and non-metallic minerals.
                </p>
                <Link href="/products/ultrafine-mill" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2">
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
            <h2 className="text-3xl font-display font-black leading-tight md:text-5xl mb-4">Technical System Overview</h2>
          </div>

          <div className="mb-16">
            <PlaceholderImage text="Corn Dust-Free Milling Process Flow Diagram" className="w-full h-96 rounded-2xl bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-cogs" /></div>
              <h4 className="text-xl font-bold mb-3">A. High-Efficiency Milling</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Adopts 4 major milling structures (Roller, Hammer, Claw, Ultrafine) ensuring high capacity at various fineness levels (e.g., 150 mesh capacity ≥1.5 t/h).
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-fan" /></div>
              <h4 className="text-xl font-bold mb-3">B. Patented Dust-Free Collection</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Various configurations including pulse bag dust collectors and cyclone separation. Dust removal efficiency ≥99.9%, recovering powder directly into production.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-3xl text-orange-500 mb-4"><i className="fas fa-desktop" /></div>
              <h4 className="text-xl font-bold mb-3">C. Integrated Intelligent Control</h4>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                Equipped with PLC touch screens for 1-key start/stop, digital parameters, and fault warnings, drastically reducing operator skill demands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 & 9. Choose Us & Cases */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-24 grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-4">
              <i className="fas fa-boxes text-4xl text-orange-500 mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">Complete Products</h4>
              <p className="text-sm text-slate-500">Match suitable models for optimal efficiency.</p>
            </div>
            <div className="p-4">
              <i className="fas fa-hand-holding-usd text-4xl text-orange-500 mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">High Return</h4>
              <p className="text-sm text-slate-500">Self-production ensures low costs and better price.</p>
            </div>
            <div className="p-4">
              <i className="fas fa-truck-loading text-4xl text-orange-500 mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">Full-Link Delivery</h4>
              <p className="text-sm text-slate-500">Design to installation handled seamlessly.</p>
            </div>
            <div className="p-4">
              <i className="fas fa-layer-group text-4xl text-orange-500 mb-4" />
              <h4 className="font-bold text-lg mb-2 text-slate-900">Sustainable Upgrade</h4>
              <p className="text-sm text-slate-500">Modular design expands with your business.</p>
            </div>
          </div>

          <SectionHeader title="Success Cases" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="bg-slate-50 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200 mb-4">New Hope Group</div>
                  <h3 className="text-xl font-display font-bold mb-4">Annual 10,000-Ton Export Solution</h3>
                  <div className="space-y-3 text-sm text-slate-600 mb-6">
                    <p><strong>Requirement:</strong> Dust-free, food export standards, 100 mesh.</p>
                    <p><strong>Solution:</strong> Fully automatic dust-free production line.</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <span className="block text-green-700 font-bold mb-1">Result</span>
                  <p className="text-xs text-green-600">Workshop dust &lt;1mg/m³, successfully helped export to Europe and America.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
              <div className="bg-slate-50 p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200 mb-4">North China Feed Additive</div>
                  <h3 className="text-xl font-display font-bold mb-4">Ultrafine Mod Upgrade Project</h3>
                  <div className="space-y-3 text-sm text-slate-600 mb-6">
                    <p><strong>Requirement:</strong> Upgrade to high-value micro-powder.</p>
                    <p><strong>Solution:</strong> Ultrafine milling dust-free modification.</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <span className="block text-green-700 font-bold mb-1">Result</span>
                  <p className="text-xs text-green-600">Stable production &gt;120 mesh, selling price +20%, ROI &lt;18 months.</p>
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

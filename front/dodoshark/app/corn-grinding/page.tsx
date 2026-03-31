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
              This solution aims to provide you with a comprehensive corn grinding system selection guide. Whether you are an individual user, a small-scale farmer, or a large-scale processing enterprise, you can find the right corn grinder or complete production line to suit your needs.
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
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900">
              <Image 
                src="/assets/images/solutions/temp/corn-production-line-diagram.png" 
                alt="Corn Production Line Diagram" 
                fill 
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Advantages */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Core Advantages"
            subtitle="Six reasons why Dodoshark is the preferred choice for modern corn milling solutions."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdvantageCard 
              icon="piggy-bank" 
              title="Low Cost & High ROI" 
              desc="Provides various high-performance milling machines to meet the corn milling needs of individuals and small businesses with superior cost-effectiveness." 
              img="/assets/images/solutions/temp/low-cost-high-roi.png"
            />
            <AdvantageCard 
              icon="leaf" 
              title="Clean Workshop" 
              desc="Establishes a dust-free production line, with dust suppression ratio of dust removal equipment reaching up to 99.99%." 
              img="/assets/images/solutions/temp/clean-workshop.png"
            />
            <AdvantageCard 
              icon="award" 
              title="Excellent Flour Quality" 
              desc="Stably produces 20-120 mesh adjustable high-quality corn flour with uniform fineness, meeting various customer requirements." 
              img="/assets/images/solutions/temp/excellent-quality.png"
            />
            <AdvantageCard 
              icon="tachometer-alt" 
              title="Efficiency Improvement" 
              desc="Power consumption per ton reduced by up to 50%, single-line capacity up to 12 tons/hour or more, supporting 12 hours continuous operation." 
              img="/assets/images/solutions/temp/efficiency-improvement.png"
            />
            <AdvantageCard 
              icon="microchip" 
              title="Intelligent & Worry-Free" 
              desc="Integrated intelligent control covering the whole process from cleaning to fine milling, increasing added value and reducing costs." 
              img="/assets/images/solutions/temp/intelligent-worry-free.png"
            />
            <AdvantageCard 
              icon="shield-alt" 
              title="Long-Term Guarantee" 
              desc="Choosing Dodoshark means choosing a long-term guarantee of 'peaceful production, comfortable harvest'." 
              img="/assets/images/solutions/temp/long-term-guarantee.png"
            />
          </div>
        </div>
      </section>

      {/* 3 & 4. Raw Material & Application */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-display font-black leading-tight mb-6">Wide Applications of Raw Corn</h2>
              <div className="relative w-full aspect-square rounded-2xl mb-6 shadow-md overflow-hidden bg-white">
                <Image 
                  src="/assets/images/solutions/temp/corn.jpg" 
                  alt="Corn Raw Material" 
                  fill 
                  className="object-cover"
                />
              </div>
              <p className="text-slate-600 mb-6 font-light">
                Corn is widely cultivated across the globe. As a key cereal ingredient, it is extensively used in:
              </p>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-orange-500 mt-1" />
                  <div><strong>Food Sector:</strong> corn flour, corn starch, puffed foods, baking ingredients, health meal replacements, etc.</div>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-orange-500 mt-1" />
                  <div><strong>Feed Sector:</strong> A primary energy source for poultry and livestock farming.</div>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-orange-500 mt-1" />
                  <div><strong>Industrial Sector:</strong> Brewing, bio-based materials and chemical feedstocks.</div>
                </li>
              </ul>
            </div>
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-display font-black leading-tight mb-6">Grinding Fineness & Scenarios</h2>
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
                  <p className="text-sm">Our core grinding equipment covers the entire fineness range mentioned above, offering exceptionally high throughput and excellent value for money when grinding to 100–150 mesh. We maintain industry-leading production capacity and stability even at 150 mesh.</p>
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
            <PainPointCard 
              title="Serious Dust Pollution" 
              desc="Open design causing safety hazards and raw material waste (0.5%-2%)." 
              solution="99.9% dust collection system"
            />
            <PainPointCard 
              title="Unstable Performance" 
              desc="Low efficiency, uncontrollable fineness, high temperature causing nutrient loss." 
              solution="Precise mesh control & cooling"
            />
            <PainPointCard 
              title="Mismatched Systems" 
              desc="Piecing together different brands leads to bottlenecks and high maintenance." 
              solution="Integrated full-link design"
            />
            <PainPointCard 
              title="Low Intelligence Level" 
              desc="Relies purely on manual experience causing quality fluctuations." 
              solution="PLC touch screen smart control"
            />
          </div>
        </div>
      </section>

      {/* 6. Recommended Products */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Recommended Product Selection" subtitle="A variety of milling principles to perfectly match your target fineness and output." />

          <div className="space-y-16">
            <ProductCard 
              num="01"
              category="Coarse Crushing"
              title="Dodoshark Roller Crusher"
              img="/assets/images/solutions/temp/dodoshark-roller-crusher.png"
              specs={{ "Fineness": "2~8 coarse particles (3~5mm)", "Capacity": "1 ~ 25 tons/hour", "Power": "2.2kw ~ 15kw", "Material": "Iron Material" }}
              principle="Two pressure rollers with toothed surfaces rotate relative to each other, using shear, extrusion, and tearing force."
              application="Mainly used for coarse crushing of corn as feed for livestock, improving starch digestion efficiency."
            />
            <ProductCard 
              num="02"
              category="Standard Milling"
              title="Dodoshark Hammer Mill"
              img="/assets/images/solutions/temp/dodoshark-hammer-mill.png"
              specs={{ "Fineness": "10~40 Mesh (0.4~2mm)", "Capacity": "0.4 ~ 8 tons/hour", "Power": "3kw ~ 75kw", "Material": "Iron / 304 Stainless Steel" }}
              principle="Uses kinetic energy from high-speed rotating hammer pieces to impact, shear, and friction the material."
              application="Most widely used high-efficiency impact equipment in feed and grain processing."
              reverse
            />
            <ProductCard 
              num="03"
              category="Fine Milling"
              title="Dodoshark Claw Mill"
              img="/assets/images/solutions/temp/dodoshark-claw-mill.png"
              specs={{ "Fineness": "10~150 Mesh (0.1~2mm)", "Capacity": "0.2 ~ 12 tons/hour", "Power": "1.5kw ~ 75kw", "Material": "Cast Iron / 304 Stainless Steel" }}
              principle="Strong impact, shear, and grinding between rotating moving teeth and fixed teeth, discharged via screen mesh."
              application="Wider application range and higher efficiency for processing fine powder than hammer mills."
            />
            <ProductCard 
              num="04"
              category="Ultrafine Milling"
              title="Dodoshark Ultrafine Mill"
              img="/assets/images/solutions/temp/dodoshark-ultrafine-mill.png"
              specs={{ "Fineness": "100~300 Mesh", "Capacity": "50 kg ~ 1.5 tons/hour", "Power": "15kw ~ 150kw", "Material": "Cast Iron / 304 Stainless Steel" }}
              principle="Built-in air classification system. Unqualified fine powder returns to the milling chamber for re-milling."
              application="High added-value ultrafine milling for chemical, pharmaceutical, food, and non-metallic minerals."
              reverse
            />
          </div>
        </div>
      </section>

      {/* 7. Technical Advantages */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-display font-black leading-tight md:text-5xl mb-4">Technical System Overview</h2>
            <p className="text-slate-400">Reference Flowchart for Dust-Free corn Milling Process (DoDoShark Design)</p>
          </div>

          <div className="mb-16 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Image 
              src="/assets/images/solutions/temp/corn-grinding-process-flow.png" 
              alt="Corn Dust-Free Milling Process Flow Chart" 
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AdvantageDetail 
              title="A. High-Efficiency Milling" 
              desc="Adopts 4 major milling structures (Roller, Hammer, Claw, Ultrafine) ensuring high capacity at various fineness levels (e.g., 150 mesh capacity ≥1.5 t/h)." 
            />
            <AdvantageDetail 
              title="B. Patented Dust-Free Collection" 
              desc="Various configurations including pulse bag dust collectors and cyclone separation. Dust removal efficiency ≥99.9%, recovering powder directly into production." 
            />
            <AdvantageDetail 
              title="C. Integrated Intelligent Control" 
              desc="Equipped with PLC touch screens for 1-key start/stop, digital parameters, and fault warnings, drastically reducing operator skill demands." 
            />
          </div>
        </div>
      </section>

      {/* 8 & 9. Choose Us & Cases */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-24 grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <IconFeature icon="boxes" title="Complete Products" desc="Match suitable models for optimal efficiency." />
            <IconFeature icon="hand-holding-usd" title="High Return" desc="Self-production ensures low costs and better price." />
            <IconFeature icon="truck-loading" title="Full-Link Delivery" desc="Design to installation handled seamlessly." />
            <IconFeature icon="layer-group" title="Sustainable Upgrade" desc="Modular design expands with your business." />
          </div>

          <SectionHeader title="Success Stories" subtitle="Proven results in global corn processing projects." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <CaseCard 
              client="New Hope Group"
              title="Annual 10,000-Ton Export Solution"
              req="Construction of a new corn flour production line, requiring a dust-free environment, compliance with food export standards, and a fineness of 100 mesh."
              sol="Provision of a fully automated, dust-free production line with an annual capacity of 10,000 tonnes."
              result="Dust concentration in the workshop was below 1 mg/m³, product fineness was consistent, and the project successfully facilitated the export of their products to European and American markets."
            />
            <CaseCard 
              client="Feed Additive Upgrading Project"
              title="Ultrafine Mod Upgrade in North China"
              req="To upgrade standard corn flour into high-value-added micro-powder to enhance product competitiveness."
              sol="Provision of a dust-free retrofit solution utilising ultra-fine grinding technology."
              result="Achieved stable production of 120 mesh and above; product selling price increased by 20%; payback period was less than 18 months."
            />
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

function AdvantageCard({ icon, title, desc, img }: { icon: string; title: string; desc: string; img: string }) {
  return (
    <div className="premium-card p-8 rounded-2xl group border border-slate-100 hover:border-orange-100 transition-all bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-colors">
          <i className={`fas fa-${icon}`} />
        </div>
        <h3 className="text-xl font-display font-bold">{title}</h3>
      </div>
      <p className="text-slate-500 font-light leading-relaxed mb-6">{desc}</p>
      <div className="relative h-32 w-full opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
        <Image src={img} alt={title} fill className="object-contain" />
      </div>
    </div>
  )
}

function PainPointCard({ title, desc, solution }: { title: string; desc: string; solution: string }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6 flex flex-col">
      <div className="text-red-500 mb-4"><i className="fas fa-exclamation-circle text-3xl" /></div>
      <h4 className="font-bold text-slate-900 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 mb-4">{desc}</p>
      <div className="pt-3 border-t border-red-200 mt-auto">
        <span className="text-xs font-black text-green-600 uppercase tracking-wider"><i className="fas fa-check mr-1" /> Dodoshark solves:</span>
        <p className="text-sm mt-1 text-slate-800 font-medium">{solution}</p>
      </div>
    </div>
  )
}

function ProductCard({ num, category, title, img, specs, principle, application, reverse = false }: any) {
  return (
    <div className={`bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      <div className="lg:w-2/5 relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
        <Image src={img} alt={title} fill className="object-contain p-8" />
      </div>
      <div className="lg:w-3/5">
        <div className="text-sm font-bold text-orange-500 mb-2 tracking-widest uppercase">{num} / {category}</div>
        <h3 className="text-3xl font-display font-bold mb-6">{title}</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm text-slate-600">
          {Object.entries(specs).map(([k, v]: any) => (
            <div key={k}><strong className="text-slate-900 block">{k}</strong> {v}</div>
          ))}
        </div>
        <div className="space-y-4 text-slate-500 font-light leading-relaxed mb-8">
          <p><strong>Principle:</strong> {principle}</p>
          <p><strong>Application:</strong> {application}</p>
        </div>
        <Link href="/products" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-2 uppercase tracking-widest text-xs">
          View Product Details <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </div>
  )
}

function AdvantageDetail({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
      <div className="text-3xl text-orange-500 mb-4 font-black">{title.split('.')[0]}</div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-400 font-light text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function IconFeature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-4">
      <i className={`fas fa-${icon} text-4xl text-orange-500 mb-4`} />
      <h4 className="font-bold text-lg mb-2 text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  )
}

function CaseCard({ client, title, req, sol, result }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
      <div className="bg-slate-50 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200 mb-4">{client}</div>
          <h3 className="text-xl font-display font-bold mb-4">{title}</h3>
          <div className="space-y-3 text-sm text-slate-600 mb-6">
            <p><strong>Requirement:</strong> {req}</p>
            <p><strong>Solution:</strong> {sol}</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <span className="block text-green-700 font-bold mb-1">Result</span>
          <p className="text-xs text-green-600">{result}</p>
        </div>
      </div>
    </div>
  )
}

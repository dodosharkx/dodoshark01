'use client'

import dynamic from 'next/dynamic'

type ProjectCaseItem = {
  title: string
  description: string
  image: string
  logo: string
  href: string
}

type DeferredProjectCasesCarouselProps = {
  items: ProjectCaseItem[]
}

const ProjectCasesCarousel = dynamic(() => import('@/components/home/ProjectCasesCarousel'), {
  ssr: false,
  loading: () => (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1rem] bg-white shadow-sm">
          <div className="aspect-[4/3] bg-slate-200" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  ),
})

export default function DeferredProjectCasesCarousel(props: DeferredProjectCasesCarouselProps) {
  return <ProjectCasesCarousel {...props} />
}

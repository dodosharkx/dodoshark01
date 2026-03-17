'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useEffectEvent, useState } from 'react'
import { usePathname } from 'next/navigation'

import MobileNavToggle from '@/components/header/MobileNavToggle'
import { isNavItemActive, type NavItem } from '@/components/header/nav-utils'

const desktopNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Cases', href: '/cases' },
  { label: 'Vlog', href: '/blogs' },
  { label: 'Support', href: '#' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '#' },
]

const mobileNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Cases', href: '/cases' },
  { label: 'Vlog', href: '/blogs' },
  { label: 'Support', href: '#' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '#' },
]

const cta = { label: 'Request Quote', href: '/contact' }

function PromiseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [isScrolled, setIsScrolled] = useState(() => pathname !== '/')
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)

  const syncScrolled = useEffectEvent(() => {
    setIsScrolled(window.scrollY > 18)
  })

  const syncDesktopViewport = useEffectEvent(() => {
    setIsDesktopViewport(window.matchMedia('(min-width: 1280px)').matches)
  })

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true)
      return
    }

    syncScrolled()
    window.addEventListener('scroll', syncScrolled, { passive: true })
    return () => window.removeEventListener('scroll', syncScrolled)
  }, [isHome, syncScrolled])

  useEffect(() => {
    syncDesktopViewport()

    const mediaQuery = window.matchMedia('(min-width: 1280px)')
    mediaQuery.addEventListener('change', syncDesktopViewport)
    return () => mediaQuery.removeEventListener('change', syncDesktopViewport)
  }, [syncDesktopViewport])

  const desktopFloating = isHome && !isScrolled
  const desktopHeaderBackgroundStyle =
    !desktopFloating && isDesktopViewport
      ? {
          backgroundColor: '#17346e',
          backgroundImage:
            "linear-gradient(90deg, rgba(7, 26, 58, 0.72) 0%, rgba(7, 26, 58, 0.18) 42%, rgba(7, 26, 58, 0.28) 64%, rgba(7, 26, 58, 0.76) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(5, 18, 44, 0.08) 38%, rgba(5, 18, 44, 0.3) 100%), url('/assets/images/background/footer-background.png')",
          backgroundPosition: 'center, center, 66% 24%',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover, cover, 138% auto',
        }
      : undefined
  const desktopHeaderClass = desktopFloating
    ? 'xl:border-white/10 xl:shadow-none'
    : 'shadow-[0_10px_30px_-24px_rgba(15,23,42,0.92)] backdrop-blur-xl xl:border-white/16 xl:shadow-[0_10px_30px_-24px_rgba(15,23,42,0.92)] xl:backdrop-blur-0'

  return (
    <>
      <div className="hidden border-b border-[#e8e7de] bg-[#f5f5f0]/96 xl:block">
        <div className="mx-auto flex min-h-[76px] max-w-[1280px] items-center justify-between px-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/assets/images/brand/dodoshark-logo.png"
              alt="DoDoShark"
              width={198}
              height={48}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1e3a5f]">
                <PromiseIcon />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-slate-500">Our Promise</p>
                <p className="text-[13px] font-bold text-[#1e3a5f]">Safe Production, Satisfying Harvest</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1e3a5f]">
                <ClockIcon />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-slate-500">Working Hours (Beijing Time)</p>
                <p className="text-[13px] font-bold text-[#1e3a5f]">Mon - Sun: 9:00 - 22:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b border-[#e8e7de] bg-[#f5f5f0] transition-[border-color,box-shadow,backdrop-filter] duration-300 xl:bg-transparent ${desktopHeaderClass}`}
        style={desktopHeaderBackgroundStyle}
      >
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="flex h-14 items-center justify-between gap-3 xl:h-[72px]">
            <div className="xl:hidden">
              <Link href="/" className="inline-flex items-center py-1">
                <Image
                  src="/assets/images/brand/dodoshark-logo.png"
                  alt="DoDoShark"
                  width={156}
                  height={38}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            <nav className="hidden h-full items-center gap-3 overflow-x-auto [scrollbar-width:none] xl:flex">
              {desktopNavItems.map((item) => {
                const isActive = isNavItemActive(pathname, item.href)
                const itemClass = desktopFloating
                  ? isActive
                    ? 'text-white [text-shadow:0_1px_12px_rgba(15,23,42,0.42)]'
                    : 'text-white/88 [text-shadow:0_1px_12px_rgba(15,23,42,0.42)]'
                  : isActive
                    ? 'text-white'
                    : 'text-white/82'

                return (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative inline-flex h-full shrink-0 items-center px-3 text-[16px] font-semibold tracking-[0.08em] transition-[color,filter,background-color] duration-300 ${itemClass} hover:bg-white/8 hover:text-[#f6a43c] hover:brightness-125`}
                  >
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-[calc(100%+0.35rem)] h-[2px] rounded-full bg-[#f97316] transition-transform duration-300 ${
                          isActive ? 'w-full scale-x-100' : 'w-full scale-x-0'
                        }`}
                      />
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div className="hidden xl:flex xl:flex-1" />

            <div className="flex items-center gap-3">
              <div className="xl:hidden">
                <Link
                  href={cta.href}
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#f0c54a] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#1e3a5f] shadow-[0_10px_24px_-18px_rgba(240,197,74,0.7)] transition hover:bg-[#e7bb3a]"
                >
                  Quote
                </Link>
              </div>

              <div className="hidden xl:block">
                <Link
                  href={cta.href}
                  className={`inline-flex min-h-10 items-center justify-center rounded-full border px-5 py-[10px] text-[11px] font-bold uppercase tracking-[0.1em] transition ${
                    desktopFloating
                      ? 'border-white/42 bg-slate-950/18 text-white shadow-[0_12px_28px_-20px_rgba(15,23,42,0.7)] backdrop-blur-md hover:border-white/60 hover:bg-slate-950/28'
                      : 'border-[#fbbf24]/75 bg-[#fbbf24]/12 text-[#fff6d4] hover:border-[#fbbf24] hover:bg-[#fbbf24]/18'
                  }`}
                >
                  {cta.label}
                </Link>
              </div>

              <MobileNavToggle navItems={mobileNavItems} ctaHref={cta.href} ctaLabel="Get Solution" />
            </div>

            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 hidden xl:block ${
                desktopFloating ? 'border-b border-white/14' : 'border-b border-white/10'
              }`}
            />
          </div>
        </div>
      </header>
    </>
  )
}

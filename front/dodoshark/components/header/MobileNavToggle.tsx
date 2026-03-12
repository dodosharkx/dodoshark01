'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { isNavItemActive, type NavItem } from '@/components/header/nav-utils'

type MobileNavToggleProps = {
  navItems: NavItem[]
  ctaHref: string
  ctaLabel: string
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function MobileNavToggle({ navItems, ctaHref, ctaLabel }: MobileNavToggleProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  return (
    <div className="xl:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#cfc7b7] bg-[#f5f5f0] text-[#1e3a5f] shadow-[0_10px_24px_-18px_rgba(15,23,42,0.3)] transition hover:border-[#bfb5a2] hover:bg-[#efede6]"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 px-2">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 rounded-[1.25rem] border border-[#d9d3c7] bg-[#f7f5ee]/98 p-3 shadow-2xl backdrop-blur">
              {navItems.map((item) => {
                const isActive = isNavItemActive(pathname, item.href)

                return (
                  <Link
                    key={`mobile-${item.label}-${item.href}`}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold tracking-[0.05em] transition-[color,filter,background-color] duration-300 hover:bg-[#ece7dc] hover:text-[#f97316] hover:brightness-110 ${
                      isActive ? 'bg-[#efe4d2] text-[#b85b16]' : 'text-[#1e3a5f]'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="relative inline-flex">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-[calc(100%+0.25rem)] h-[2px] w-full rounded-full bg-[#f97316] transition-transform duration-300 ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </span>
                  </Link>
                )
              })}
              <Link
                href={ctaHref}
                className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#f0c54a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-[#1e3a5f] transition hover:bg-[#e7bb3a]"
                onClick={() => setMobileOpen(false)}
              >
                {ctaLabel}
              </Link>
            </div>
          </nav>
        </>
      ) : null}
    </div>
  )
}

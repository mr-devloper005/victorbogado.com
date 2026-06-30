'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, LogOut, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Public navigation centers on collections/resources. Profile and any raw
// per-task routes are intentionally never surfaced here.
function usePublicNav() {
  return useMemo(() => {
    const taskLinks = SITE_CONFIG.tasks
      .filter((task) => task.enabled && task.key !== 'profile')
      .map((task) => ({ label: task.key === 'sbm' ? 'Collections' : task.label, href: task.route }))
    return [{ label: 'Home', href: '/' }, ...taskLinks, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }]
  }, [])
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = usePublicNav()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))
  const firstName = session?.name?.trim().split(/\s+/)[0] || 'Account'

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? 'border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/90 shadow-[var(--editable-shadow-sm)] backdrop-blur-xl'
          : 'border-b border-transparent bg-[var(--editable-nav-bg)]'
      }`}
    >
      <nav className="mx-auto flex h-[72px] w-full max-w-[var(--editable-container)] items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10" />
          <span className="editable-display max-w-[180px] truncate text-[1.35rem] font-extrabold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
        </Link>

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
                <span
                  className={`pointer-events-none absolute inset-x-4 -bottom-0.5 h-[2px] origin-left rounded-full bg-[var(--slot4-accent)] transition-transform duration-300 ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(211,35,35,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <span className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] py-1.5 pl-2 pr-3 sm:inline-flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[11px] font-bold text-[var(--slot4-accent)]">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[110px] truncate text-sm font-semibold text-[var(--slot4-page-text)]">{firstName}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(211,35,35,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 py-5 sm:px-6">
          <form action="/search" className="mb-4 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4 py-2.5">
            <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input name="q" type="search" placeholder="Search collections…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
          </form>
          <div className="grid gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]'
                  }`}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </Link>
              )
            })}
          </div>
          <div className="mt-5 grid gap-2.5 border-t border-[var(--editable-border)] pt-5">
            {session ? (
              <>
                <span className="px-1 text-sm font-medium text-[var(--slot4-muted-text)]">Signed in as <span className="font-bold text-[var(--slot4-page-text)]">{session.name}</span></span>
                <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-semibold text-white">
                  <PlusCircle className="h-4 w-4" /> Submit a resource
                </Link>
                <button type="button" onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)]">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)]">
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-semibold text-white">
                  <UserPlus className="h-4 w-4" /> Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

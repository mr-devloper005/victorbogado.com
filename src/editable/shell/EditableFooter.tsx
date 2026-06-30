'use client'

import Link from 'next/link'
import { ArrowUpRight, Bookmark, Mail, Send } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const { session, logout } = useEditableLocalAuthSession()
  const year = new Date().getFullYear()

  // Collections route stays dynamic; profile + raw task routes are never shown.
  const collections = SITE_CONFIG.tasks.find((task) => task.enabled && task.key === 'sbm')
  const exploreLinks = [
    { label: 'Home', href: '/' },
    ...(collections ? [{ label: 'Collections', href: collections.route }] : []),
    { label: 'Search', href: '/search' },
  ]
  const companyLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8">
        {/* CTA band */}
        <div className="grid gap-8 rounded-[var(--editable-radius-xl)] bg-[linear-gradient(135deg,var(--slot4-accent)_0%,var(--slot4-accent-strong)_100%)] px-7 py-10 shadow-[var(--editable-shadow-lg)] sm:px-12 sm:py-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/75">{globalContent.footer.tagline}</p>
            <h2 className="editable-display mt-3 text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-4xl">
              Found a link worth keeping? <span className="editable-emphasis text-white/90">Share it.</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link
              href={session ? '/create' : '/signup'}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--slot4-accent)] transition hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4" /> {session ? 'Submit a resource' : 'Start curating'}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
             
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9" />
             
              <span className="editable-display text-xl font-extrabold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/65">{globalContent.footer.description}</p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
            >
              <Mail className="h-4 w-4" /> {SITE_CONFIG.domain}
            </a>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Company" links={companyLinks} />

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">Account</h3>
            <div className="mt-5 grid gap-3">
              {session ? (
                <>
                  <Link href="/create" className="text-sm font-medium text-white/70 transition hover:text-white">Submit a resource</Link>
                  <button type="button" onClick={logout} className="text-left text-sm font-medium text-white/70 transition hover:text-white">Log out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-white/70 transition hover:text-white">Sign in</Link>
                  <Link href="/signup" className="text-sm font-medium text-white/70 transition hover:text-white">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-xs text-white/50 sm:flex-row">
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>{globalContent.footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">{title}</h3>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white">
            {link.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  )
}

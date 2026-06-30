import type { Metadata } from 'next'
import Link from 'next/link'
import { Bookmark, CheckCircle2, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

const perks = ['Save resources to your own shelf', 'Submit links for the community', 'Pick up exactly where you left off']

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-cream)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Brand / value panel */}
          <div className="relative hidden overflow-hidden rounded-[var(--editable-radius-xl)] bg-[var(--slot4-ink)] p-10 text-white shadow-[var(--editable-shadow-lg)] lg:block lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.4),transparent)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                <Sparkles className="h-3.5 w-3.5" /> {copy.badge}
              </span>
              <h2 className="editable-display mt-7 text-4xl font-extrabold leading-[1.08] tracking-[-0.02em]">{copy.title}</h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">{copy.description}</p>
              <ul className="mt-8 space-y-4">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-sm font-medium text-white/85">
                    <CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent)]" /> {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-10 inline-flex items-center gap-2.5 border-t border-white/10 pt-6 text-sm text-white/60">
                <Bookmark className="h-4 w-4" /> {SITE_CONFIG.name}
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="mx-auto w-full max-w-md rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[var(--editable-shadow)] sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent)] lg:hidden">{copy.badge}</span>
            <h1 className="editable-display mt-4 text-2xl font-extrabold tracking-[-0.01em] lg:mt-0">{copy.formTitle}</h1>
            <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Welcome back — sign in to continue.</p>
            <EditableLocalLoginForm />
            <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
              New here? <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{copy.createCta}</Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

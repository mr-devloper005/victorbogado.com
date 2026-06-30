'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, MessageSquare, Phone, Sparkles, Bookmark, Star } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { SITE_CONFIG } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/components/EditableReveal'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
      { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Suggest a resource', body: 'Spotted a link, tool, or reference worth adding? Send it our way for review.' },
    { icon: Sparkles, title: 'Collection partnerships', body: 'Coordinate curated boards, reference pages, and co-branded link programs.' },
    { icon: MessageSquare, title: 'Curator support', body: 'Need help organising shelves, collections, or fixing a broken link? We’re here.' },
  ]
}

const faqs = [
  { q: 'Is it free to browse?', a: 'Yes — the entire library is free to explore. Create an account only if you want to submit resources.' },
  { q: 'How do I suggest a link?', a: 'Use the form on this page, or sign up to submit resources directly from your account.' },
  { q: 'How fast will I hear back?', a: 'Most messages are reviewed within a couple of business days. Resource suggestions are queued for curation.' },
]

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--slot4-cream)]">
          <div className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.09),transparent)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)] backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-[var(--slot4-accent)]" /> {pagesContent.contact.eyebrow}
            </span>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {pagesContent.contact.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              {lanes.map((lane, index) => (
                <EditableReveal key={lane.title} delay={index * 80}>
                  <div className="group flex items-start gap-4 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[var(--editable-shadow)]">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <lane.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="editable-display text-lg font-bold tracking-[-0.01em]">{lane.title}</h2>
                      <p className="mt-1.5 text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
              <div className="flex items-center gap-3 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6">
                <Mail className="h-5 w-5 text-[var(--slot4-accent)]" />
                <p className="text-sm font-medium text-[var(--slot4-muted-text)]">Reach us anytime at <span className="font-semibold text-[var(--slot4-page-text)]">{SITE_CONFIG.domain}</span></p>
              </div>
            </div>

            <div className="rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[var(--editable-shadow)] sm:p-9">
              <h2 className="editable-display text-2xl font-bold tracking-[-0.01em]">{pagesContent.contact.formTitle}</h2>
              <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">We read every message. Tell us what you need and we’ll route it to the right place.</p>
              <EditableContactLeadForm />
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Good to know</span>
              <h2 className="editable-display mt-4 text-3xl font-extrabold tracking-[-0.025em] sm:text-[2.2rem]">Frequently asked</h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {faqs.map((faq, index) => (
                <EditableReveal key={faq.q} delay={index * 80}>
                  <div className="h-full rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                    <h3 className="editable-display text-base font-bold tracking-[-0.01em]">{faq.q}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-[var(--slot4-muted-text)]">{faq.a}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

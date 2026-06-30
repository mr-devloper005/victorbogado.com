import Link from 'next/link'
import { ArrowRight, Compass, Heart, Layers, Sparkles, Star, Target, Zap } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/components/EditableReveal'

const valueIcons = [Compass, Layers, Heart]
const highlights = [
  { icon: Sparkles, value: 'Hand-picked', label: 'Every link is reviewed before it joins a collection.' },
  { icon: Target, value: 'Organised', label: 'Resources are filed into clean, themed collections.' },
  { icon: Zap, value: 'Maintained', label: 'Dead links are pruned; fresh finds are added daily.' },
]

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--slot4-cream)]">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.10),transparent)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent)] backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-[var(--slot4-accent)]" /> {about.badge}
            </span>
            <h1 className="editable-display mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              {about.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--slot4-muted-text)]">{about.description}</p>
          </div>
        </section>

        {/* Story + highlights */}
        <section className="bg-[var(--slot4-page-bg)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <EditableReveal>
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Our story</span>
              <h2 className="editable-display mt-4 text-3xl font-extrabold tracking-[-0.025em] sm:text-[2.4rem] sm:leading-[1.1]">
                Built for people who <span className="editable-emphasis text-[var(--slot4-accent)]">save things.</span>
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-[var(--slot4-muted-text)]">
                {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </EditableReveal>

            <EditableReveal delay={120} className="grid content-start gap-4">
              {highlights.map((item) => (
                <div key={item.value} className="flex items-start gap-4 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[var(--editable-shadow-sm)]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="editable-display text-lg font-bold tracking-[-0.01em]">{item.value}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{item.label}</p>
                  </div>
                </div>
              ))}
            </EditableReveal>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[var(--slot4-warm)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">What we value</span>
              <h2 className="editable-display mt-4 text-3xl font-extrabold tracking-[-0.025em] sm:text-[2.4rem]">The principles behind the library</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {about.values.map((value, index) => {
                const Icon = valueIcons[index] || Compass
                return (
                  <EditableReveal key={value.title} delay={index * 90}>
                    <article className="group h-full rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 transition duration-500 hover:-translate-y-1.5 hover:shadow-[var(--editable-shadow)]">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition group-hover:scale-105">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="editable-display mt-5 text-xl font-bold tracking-[-0.01em]">{value.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                    </article>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--slot4-page-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 pb-20 pt-4 sm:px-6 sm:pb-28 lg:px-8">
            <div className="relative overflow-hidden rounded-[var(--editable-radius-xl)] bg-[var(--slot4-ink)] px-7 py-14 text-center text-white shadow-[var(--editable-shadow-lg)] sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.3),transparent)]" />
              <div className="relative mx-auto max-w-xl">
                <h2 className="editable-display text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">Start exploring the collection</h2>
                <p className="mt-4 text-base leading-relaxed text-white/70">Thousands of useful links, organised and waiting. No account required to browse.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)]">
                    Browse collections <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                    Get in touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

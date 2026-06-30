import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Bookmark, CheckCircle2, Compass, Globe, Layers,
  Search, Sparkles, Star, TrendingUp, Zap,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/components/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

function getContentObj(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = getContentObj(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = getContentObj(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function getDomain(post?: SitePost | null) {
  const content = getContentObj(post)
  const raw =
    (typeof content.website === 'string' && content.website) ||
    (typeof content.url === 'string' && content.url) ||
    (typeof content.link === 'string' && content.link) ||
    ''
  if (!raw) return ''
  return raw.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
}

function hasRealImage(post?: SitePost | null) {
  const img = getEditablePostImage(post)
  return Boolean(img) && !img.includes('placeholder')
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function SectionHead({
  eyebrow,
  title,
  emphasis,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  emphasis?: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <span className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)] ${align === 'center' ? 'justify-center' : ''}`}>
        <Star className="h-3.5 w-3.5 fill-[var(--slot4-accent)]" /> {eyebrow}
      </span>
      <h2 className="editable-display mt-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[2.5rem]">
        {title} {emphasis ? <span className="editable-emphasis text-[var(--slot4-accent)]">{emphasis}</span> : null}
      </h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-[var(--slot4-muted-text)]">{description}</p> : null}
    </div>
  )
}

/* ------------------------------- Hero ---------------------------------- */
export function EditableHomeHero({ primaryRoute, posts }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const preview = dedupePosts(posts).slice(0, 4)
  const total = posts.length

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-cream)]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.10),transparent)]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(20,22,27,0.05),transparent)]" />

      <div className={`relative grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28 ${container}`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-1.5 text-xs font-semibold text-[var(--slot4-muted-text)] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {hero.badge}
          </span>
          <h1 className="editable-display mt-6 text-[2.6rem] font-extrabold leading-[1.03] tracking-[-0.035em] sm:text-6xl lg:text-[4.1rem]">
            {hero.title[0]} <span className="editable-emphasis text-[var(--slot4-accent)]">{hero.title[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--slot4-muted-text)]">{hero.description}</p>

          <form action="/search" className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white p-2 shadow-[var(--editable-shadow)]">
            <div className="flex flex-1 items-center gap-2.5 pl-4">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
              <input
                name="q"
                placeholder={hero.searchPlaceholder}
                className="w-full bg-transparent py-2.5 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
            </div>
            <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--slot4-accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--slot4-accent-strong)]">
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-ink)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--slot4-ink-soft)]">
              {hero.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-white px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              {hero.secondaryCta.label}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[var(--slot4-muted-text)]">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Hand-picked links</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Updated daily</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Free to explore</span>
          </div>
        </div>

        {/* Floating live collection preview built from real posts */}
        <EditableReveal className="relative" delay={120}>
          <div className="pointer-events-none absolute -left-6 -top-6 hidden h-24 w-24 rounded-2xl border border-[var(--editable-border)] bg-white/60 backdrop-blur sm:block" />
          <div className="relative rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-white p-6 shadow-[var(--editable-shadow-lg)] sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <Bookmark className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold leading-none">Featured collection</p>
                  <p className="mt-1 text-xs text-[var(--slot4-muted-text)]">Fresh from the library</p>
                </div>
              </div>
              <span className="rounded-full bg-[var(--slot4-panel-bg)] px-3 py-1 text-[11px] font-semibold text-[var(--slot4-muted-text)]">Live</span>
            </div>

            <div className="mt-5 grid gap-2.5">
              {preview.length ? (
                preview.map((post) => (
                  <Link
                    key={post.id || post.slug}
                    href={postHref('sbm', post, primaryRoute)}
                    className="group flex items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-cream)] p-3 transition hover:-translate-y-0.5 hover:border-[var(--slot4-accent)]/40 hover:shadow-[var(--editable-shadow-sm)]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--slot4-accent)] shadow-[var(--editable-shadow-sm)]">
                      <Globe className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[var(--slot4-page-text)]">{post.title}</span>
                      <span className="block truncate text-xs text-[var(--slot4-muted-text)]">{getDomain(post) || categoryOf(post) || 'Saved resource'}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
                  </Link>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-[var(--editable-border)] p-6 text-center text-sm text-[var(--slot4-muted-text)]">
                  New collections are on the way.
                </p>
              )}
            </div>

            <Link href={primaryRoute} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)]">
              Open the full library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>
      </div>

      {/* Trust / stats band */}
      <div className="border-y border-[var(--editable-border)] bg-white">
        <div className={`grid grid-cols-2 gap-y-8 py-9 lg:grid-cols-4 ${container}`}>
          <Stat value={total ? `${total}+` : '500+'} label="Resources curated" icon={Layers} />
          <Stat value="100%" label="Hand-reviewed links" icon={CheckCircle2} />
          <Stat value="Daily" label="New additions" icon={TrendingUp} />
          <Stat value="Free" label="To browse & save" icon={Star} />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label, icon: Icon }: { value: string; label: string; icon: typeof Layers }) {
  return (
    <div className="flex items-center gap-3 px-2 sm:justify-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="editable-display text-2xl font-extrabold tracking-[-0.02em]">{value}</p>
        <p className="text-xs font-medium text-[var(--slot4-muted-text)]">{label}</p>
      </div>
    </div>
  )
}

/* ----------------------------- Benefits -------------------------------- */
const benefits = [
  { icon: Compass, title: 'Discover, not search', body: 'Skip the endless scrolling. Every resource here is found, vetted, and filed by people who care about quality.' },
  { icon: Layers, title: 'Organised into collections', body: 'Links are grouped into clean, themed collections so you can go deep on a topic without losing the thread.' },
  { icon: Zap, title: 'Always current', body: 'Stale links get pruned and fresh finds get added daily, so the library stays genuinely useful.' },
  { icon: Bookmark, title: 'Save what matters', body: 'Build your own shelf of the tools, references, and reads you keep coming back to.' },
]

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-20 lg:py-24 ${container}`}>
        <SectionHead
          eyebrow="Why it works"
          title="A calmer way to keep the"
          emphasis="good stuff."
          description="Bookmarks pile up and get forgotten. This is the opposite — a maintained, browsable library built for finding things again."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <EditableReveal key={benefit.title} delay={index * 80}>
              <article className="group h-full rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-accent)]/30 hover:shadow-[var(--editable-shadow)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition group-hover:scale-105">
                  <benefit.icon className="h-6 w-6" />
                </span>
                <h3 className="editable-display mt-5 text-xl font-bold tracking-[-0.01em]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{benefit.body}</p>
              </article>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------ Featured + latest ---------------------------- */
function BookmarkCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const domain = getDomain(post)
  const image = hasRealImage(post) ? getEditablePostImage(post) : ''
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[var(--editable-shadow)]"
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
        </div>
      ) : (
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--slot4-accent-soft),var(--slot4-panel-bg))]">
          <Globe className="h-9 w-9 text-[var(--slot4-accent)]/70" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
          {category ? <span>{category}</span> : <span>Resource</span>}
        </div>
        <h3 className="editable-display mt-3 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em] transition group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 120)}</p>
        <div className="mt-5 flex items-center justify-between border-t border-[var(--editable-border)] pt-4">
          <span className="truncate text-xs font-medium text-[var(--slot4-muted-text)]">{domain || 'View resource'}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)] transition group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
        </div>
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  if (!pool.length) return null
  const [featured, ...rest] = pool
  const supporting = rest.slice(0, 3)
  const featuredImage = hasRealImage(featured) ? getEditablePostImage(featured) : ''

  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`py-16 sm:py-20 lg:py-24 ${container}`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead eyebrow="Editor's pick" title="Featured" emphasis="this week" description="The standout finds our curators think deserve your attention right now." />
          <Link href={primaryRoute} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border-strong)] bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <EditableReveal>
            <Link
              href={postHref(primaryTask, featured, primaryRoute)}
              className="group relative flex h-full min-h-[360px] flex-col justify-end overflow-hidden rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-ink)] p-8 text-white shadow-[var(--editable-shadow)] sm:p-10"
            >
              {featuredImage ? (
                <img src={featuredImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(211,35,35,0.45),transparent_55%)]" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,22,27,0.1),rgba(20,22,27,0.88))]" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] backdrop-blur">
                  <Star className="h-3.5 w-3.5 fill-white" /> {categoryOf(featured) || 'Featured'}
                </span>
                <h3 className="editable-display mt-5 max-w-xl text-3xl font-extrabold leading-[1.06] tracking-[-0.02em] sm:text-4xl">{featured.title}</h3>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">{getExcerpt(featured, 180)}</p>
                <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--slot4-ink)] transition group-hover:gap-3">
                  Explore resource <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </EditableReveal>

          <div className="grid gap-6">
            {supporting.map((post, index) => (
              <EditableReveal key={post.id || post.slug} delay={index * 80}>
                <Link
                  href={postHref(primaryTask, post, primaryRoute)}
                  className="group flex items-center gap-5 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 transition duration-500 hover:-translate-y-1 hover:shadow-[var(--editable-shadow)]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <Bookmark className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{categoryOf(post) || 'Resource'}</span>
                    <span className="editable-display mt-1 block truncate text-base font-bold tracking-[-0.01em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</span>
                    <span className="mt-1 block truncate text-xs text-[var(--slot4-muted-text)]">{getDomain(post) || getExcerpt(post, 60)}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--slot4-soft-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
                </Link>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Time-based discovery grids ---------------------- */
const sectionCopy: Record<string, { eyebrow: string; title: string; emphasis: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'Just', emphasis: 'added' },
  browse: { eyebrow: 'Trending now', title: 'Most', emphasis: 'saved' },
  index: { eyebrow: 'Evergreen', title: 'From the', emphasis: 'archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to', emphasis: 'explore' }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-warm)]'}>
            <div className={`py-16 sm:py-20 ${container}`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHead eyebrow={copy.eyebrow} title={copy.title} emphasis={copy.emphasis} />
                <Link href={section.href || primaryRoute} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)]">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, cardIndex) => (
                  <EditableReveal key={post.id || post.slug} delay={(cardIndex % 4) * 70}>
                    <BookmarkCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* -------------------------------- CTA ---------------------------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)]">
      <div className={`pb-20 pt-4 sm:pb-28 ${container}`}>
        <div className="relative overflow-hidden rounded-[var(--editable-radius-xl)] bg-[var(--slot4-ink)] px-7 py-14 text-center shadow-[var(--editable-shadow-lg)] sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.35),transparent)]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.22),transparent)]" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" /> {cta.badge}
            </span>
            <h2 className="editable-display mt-6 text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.75rem]">
              {cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">{cta.description}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href={cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)]">
                {cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                {cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Filter, Globe, Search, SearchX, Star } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
const domainOf = (post: SitePost) => {
  const content = getContent(post)
  const raw = compactRaw(content.website) || compactRaw(content.url) || compactRaw(content.link)
  return raw ? raw.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '') : ''
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const domain = domainOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[var(--editable-shadow-sm)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[var(--editable-shadow)]"
    >
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,var(--slot4-accent-soft),var(--slot4-panel-bg))]">
          <Globe className="h-9 w-9 text-[var(--slot4-accent)]/70" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{taskLabel}</span>
        <h2 className="editable-display mt-2.5 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        {summary ? <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{stripHtml(summary)}</p> : <span className="flex-1" />}
        <div className="mt-5 flex items-center justify-between border-t border-[var(--editable-border)] pt-4">
          <span className="truncate text-xs font-medium text-[var(--slot4-muted-text)]">{domain || 'View result'}</span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)] transition group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
        </div>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  // Never surface profiles in public search results (no profile cards/links).
  const results = posts.filter((post) => getPostTaskKey(post) !== 'profile' && matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && item.key !== 'profile')
  const browseRoute = enabledTasks[0]?.route || '/sbm'
  const hero = pagesContent.search.hero

  const inputClass = 'h-12 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Search hero */}
        <section className="relative overflow-hidden bg-[var(--slot4-cream)]">
          <div className="pointer-events-none absolute inset-x-0 -top-32 h-80 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(211,35,35,0.08),transparent_70%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)] backdrop-blur">
                  <Star className="h-3.5 w-3.5 fill-[var(--slot4-accent)]" /> {hero.badge}
                </span>
                <h1 className="editable-display mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-5xl">{hero.title}</h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--slot4-muted-text)]">{hero.description}</p>
              </div>
              <form action="/search" className="rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 shadow-[var(--editable-shadow)] sm:p-6">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4">
                  <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                  <input name="q" defaultValue={query} placeholder={hero.placeholder} className="min-w-0 flex-1 bg-transparent py-3.5 text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-4">
                    <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent py-3 text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                  </label>
                  <select name="task" defaultValue={task} className={`${inputClass} appearance-none`}>
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button type="submit" className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] text-sm font-semibold text-white shadow-[0_10px_28px_rgba(211,35,35,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)]">
                  <Search className="h-4 w-4" /> Search
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{results.length} {results.length === 1 ? 'result' : 'results'}</p>
              <h2 className="editable-display mt-2 text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href={browseRoute} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            <Ads slot="footer" showLabel className="mx-auto w-full" />
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post) => <SearchResultCard key={post.id || post.slug} post={post} />)}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-xl rounded-[var(--editable-radius-xl)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-8 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]"><SearchX className="h-6 w-6" /></div>
              <p className="editable-display mt-5 text-2xl font-bold tracking-[-0.02em]">No matching results</p>
              <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">Try a different keyword, category, or content type.</p>
              <Link href={browseRoute} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-2.5 text-sm font-semibold text-white">Browse the library <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}

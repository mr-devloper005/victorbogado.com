import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, Sparkles, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/components/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const hasImage = (post: SitePost) => getImages(post).length > 0
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 xl:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Shared premium surface: hairline border, soft radius, smooth lift on hover.
const cardBase = 'group block rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_1px_2px_rgba(20,22,27,0.04)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(20,22,27,0.13)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const chips = CATEGORY_OPTIONS.slice(0, 8)
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Header */}
        <header className="relative overflow-hidden border-b border-[var(--tk-line)] bg-[var(--slot4-cream)]">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(55%_55%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--tk-accent)]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{theme.kicker}</span>
            </div>
            <h1 className="editable-display mt-5 max-w-3xl text-balance text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {voice?.headline || `Browse ${label}`}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--tk-muted)]">{voice?.description || theme.note}</p>

            {/* Toolbar: search + category filter */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <form action="/search" className="flex flex-1 items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 shadow-[0_1px_2px_rgba(20,22,27,0.04)]">
                <Search className="h-4 w-4 shrink-0 text-[var(--tk-muted)]" />
                <input name="q" placeholder={`Search ${label.toLowerCase()}…`} className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-[var(--tk-muted)]" />
              </form>
              <form action={basePath} className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-4 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-accent)] px-5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:opacity-90">Apply</button>
              </form>
            </div>

            {/* Category chips (real filtering) */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={pageHref(basePath, 'all', 1)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${category === 'all' ? 'border-[var(--tk-accent)] bg-[var(--tk-accent)] text-[var(--tk-on-accent)]' : 'border-[var(--tk-line)] bg-[var(--tk-surface)] text-[var(--tk-muted)] hover:border-[var(--tk-accent)]'}`}
              >
                All
              </Link>
              {chips.map((chip) => {
                const active = category === chip.slug
                return (
                  <Link
                    key={chip.slug}
                    href={pageHref(basePath, chip.slug, 1)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${active ? 'border-[var(--tk-accent)] bg-[var(--tk-accent)] text-[var(--tk-on-accent)]' : 'border-[var(--tk-line)] bg-[var(--tk-surface)] text-[var(--tk-muted)] hover:border-[var(--tk-accent)]'}`}
                  >
                    {chip.name}
                  </Link>
                )
              })}
            </div>

            <p className="mt-8 text-sm text-[var(--tk-muted)]">
              <span className="font-semibold text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'result' : 'results'} · {categoryLabel}
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
          {posts.length ? (
            <>
              {/* Featured spotlight (first result) for sbm/article-style tasks */}
              {featured && (task === 'sbm' || task === 'article' || task === 'pdf') ? (
                <EditableReveal className="mb-8">
                  <FeaturedArchiveCard post={featured} task={task} basePath={basePath} />
                </EditableReveal>
              ) : null}

              <div className={taskGrid[task]}>
                {(featured && (task === 'sbm' || task === 'article' || task === 'pdf') ? rest : posts).map((post, index) => (
                  <EditableReveal key={post.id || post.slug} delay={(index % 4) * 60}>
                    <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                  </EditableReveal>
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Search className="h-6 w-6" /></div>
              <h2 className="editable-display mt-5 text-2xl font-bold tracking-[-0.02em]">Nothing here yet</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Try another category, or check back after new {label.toLowerCase()} are added.</p>
              <Link href={pageHref(basePath, 'all', 1)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)]">Reset filters</Link>
            </div>
          )}

          {posts.length ? (
            <div className="mt-14">
              <Ads slot="in-feed" showLabel className="mx-auto w-full" />
            </div>
          ) : null}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-semibold transition hover:border-[var(--tk-accent)]">Previous</Link> : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-semibold transition hover:border-[var(--tk-accent)]">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function FeaturedArchiveCard({ post, task, basePath }: { post: SitePost; task: TaskKey; basePath: string }) {
  const href = `${basePath}/${post.slug}`
  const image = hasImage(post) ? getImage(post) : ''
  const domain = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_1px_2px_rgba(20,22,27,0.04)] transition duration-500 hover:shadow-[0_24px_60px_rgba(20,22,27,0.13)] lg:grid-cols-2">
      <div className="relative min-h-[240px] overflow-hidden bg-[var(--tk-raised)]">
        {image ? (
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--tk-accent-soft),var(--tk-raised))]"><Globe className="h-12 w-12 text-[var(--tk-accent)]/60" /></div>
        )}
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">
          <Sparkles className="h-3.5 w-3.5" /> Featured · {getCategory(post, task === 'sbm' ? 'Resource' : 'Pick')}
        </span>
        <h2 className="editable-display mt-5 text-3xl font-extrabold leading-tight tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-base leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {domain ? <p className="mt-4 truncate text-sm font-medium text-[var(--tk-accent)]">{cleanDomain(domain)}</p> : null}
        <CardArrow label="Open resource" />
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const website = getField(post, ['website', 'url', 'link'])
  const category = getCategory(post, 'Resource')
  return (
    <Link href={href} className={`${cardBase} flex h-full flex-col p-6`}>
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <Globe className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-display mt-5 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em] transition group-hover:text-[var(--tk-accent)]">{post.title}</h2>
      <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[var(--tk-line)] pt-4">
        <span className="truncate text-xs font-medium text-[var(--tk-accent)]">{website ? cleanDomain(website) : 'View resource'}</span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--tk-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--tk-accent)]" />
      </div>
    </Link>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">
          <span>{category}</span>
          <span className="text-[var(--tk-muted)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.01em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Read article" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-xl font-bold tracking-[-0.01em]">{post.title}</h2>
        <p className="mt-2 line-clamp-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl font-extrabold tracking-[-0.02em] text-[var(--tk-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-accent)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.01em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(20,22,27,0.13)]">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.78))] opacity-80 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em] text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/70">View image <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-6 w-6" /></div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-display mt-6 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.01em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">Open document <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-lg font-bold tracking-[-0.01em]">{post.title}</h2>
      {role ? <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[var(--tk-accent)]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}

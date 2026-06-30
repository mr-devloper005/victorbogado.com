'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bookmark, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles, UserRound } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: UserRound,
  pdf: FileText,
  sbm: Bookmark,
}

const fieldClass = 'rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    const locked = pagesContent.create.locked
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-cream)] text-[var(--slot4-page-text)]">
          <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center px-5 py-16 sm:px-6 lg:px-8">
            <div className="grid w-full gap-10 rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[var(--editable-shadow)] md:grid-cols-[0.9fr_1.1fr] md:p-10">
              <div className="relative flex min-h-72 items-center justify-center overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--slot4-ink)] text-white">
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(211,35,35,0.4),transparent)]" />
                <Lock className="relative h-20 w-20 opacity-80" />
              </div>
              <div className="self-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{locked.badge}</span>
                <h1 className="editable-display mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-5xl">{locked.title}</h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--slot4-muted-text)]">{locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(211,35,35,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)]">Sign in <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">Sign up</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  const hero = pagesContent.create.hero
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-cream)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> {hero.badge}
              </span>
              <h1 className="editable-display mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-5xl">{hero.title}</h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--slot4-muted-text)]">{hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-[var(--editable-radius-lg)] border p-5 text-left transition duration-300 ${active ? 'border-[var(--slot4-accent)] bg-[var(--slot4-ink)] text-white shadow-[var(--editable-shadow)]' : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:-translate-y-0.5 hover:shadow-[var(--editable-shadow-sm)]'}`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-accent)]'}`} />
                      <span className="mt-3 block text-sm font-bold">{item.key === 'sbm' ? 'Resource' : item.label}</span>
                      <span className={`mt-1 block text-xs ${active ? 'text-white/65' : 'text-[var(--slot4-muted-text)]'}`}>{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[var(--editable-radius-xl)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[var(--editable-shadow)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--editable-border)] pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">New {activeTask?.key === 'sbm' ? 'resource' : activeTask?.label?.toLowerCase() || 'post'}</p>
                  <h2 className="editable-display mt-1 text-2xl font-extrabold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-panel-bg)] px-4 py-2 text-xs font-semibold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[10px] font-bold text-[var(--slot4-accent)]">{session.name.charAt(0).toUpperCase()}</span>
                  {session.name}
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL (optional)" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">{pagesContent.create.successTitle}</p>
                    <p className="mt-0.5 text-sm text-emerald-800/80">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(211,35,35,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

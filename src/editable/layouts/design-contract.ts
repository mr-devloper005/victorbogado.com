import type { CSSProperties } from 'react'

/*
  Premium light design system (Catalis-inspired).

  One source of truth for the whole site: clean white surfaces over a warm
  off-white canvas, a single brand accent (loaded from brand.config), hairline
  borders, soft layered shadows, generous rounded corners and a confident
  display/body type pairing. Change a value here and every page updates,
  because all editable surfaces consume these CSS variables.
*/
export const editableRootStyle = {
  // Canvas + ink
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#16181d',
  '--slot4-panel-bg': '#f6f5f2',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#585e68',
  '--slot4-soft-muted-text': '#8a909a',

  // Brand accent (signature red) + soft tint
  '--slot4-accent': '#d32323',
  '--slot4-accent-fill': '#d32323',
  '--slot4-accent-strong': '#b51d1d',
  '--slot4-accent-soft': '#fdecea',
  '--slot4-on-accent': '#ffffff',

  // Dark ink (premium contrast sections, footer, CTA)
  '--slot4-ink': '#14161b',
  '--slot4-ink-soft': '#1d2026',
  '--slot4-dark-bg': '#14161b',
  '--slot4-dark-text': '#ffffff',

  // Neutral surfaces (kept names for backward compatibility)
  '--slot4-media-bg': '#f0eeea',
  '--slot4-cream': '#faf9f6',
  '--slot4-warm': '#f6f5f2',
  '--slot4-lavender': '#ffffff',
  '--slot4-gray': '#f3f2ee',
  '--slot4-body-gradient': 'none',

  // Layout + chrome
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#16181d',
  '--editable-container': '1240px',
  '--editable-border': '#e8e6e0',
  '--editable-border-strong': '#d8d5cd',
  '--editable-nav-bg': '#ffffff',
  '--editable-nav-text': '#16181d',
  '--editable-nav-active': '#d32323',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#d32323',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#14161b',
  '--editable-footer-text': '#ffffff',

  // Radius scale
  '--editable-radius-sm': '0.625rem',
  '--editable-radius': '1rem',
  '--editable-radius-lg': '1.5rem',
  '--editable-radius-xl': '2rem',

  // Soft layered shadows
  '--editable-shadow-sm': '0 1px 2px rgba(20,22,27,0.04), 0 4px 14px rgba(20,22,27,0.05)',
  '--editable-shadow': '0 6px 18px rgba(20,22,27,0.06), 0 18px 48px rgba(20,22,27,0.08)',
  '--editable-shadow-lg': '0 24px 70px rgba(20,22,27,0.14)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-ink)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[var(--editable-shadow-sm)]',
  shadowStrong: 'shadow-[var(--editable-shadow)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-28',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[150px] shrink-0 snap-start sm:w-[170px]',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-[2.75rem] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]',
    sectionTitle: 'editable-display text-3xl font-extrabold tracking-[-0.025em] sm:text-[2.6rem] sm:leading-[1.08]',
    body: 'text-base leading-relaxed text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-[var(--editable-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg} shadow-[var(--editable-shadow-sm)]`,
    soft: `rounded-[var(--editable-radius-lg)] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[var(--editable-radius-lg)] ${editablePalette.darkBg} ${editablePalette.darkText} shadow-[var(--editable-shadow-lg)]`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] shadow-[0_10px_28px_rgba(211,35,35,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)] active:translate-y-0`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:translate-y-0`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.accentBg} px-6 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-strong)] active:translate-y-0`,
    dark: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-ink)] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-ink-soft)] active:translate-y-0`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[var(--editable-radius)] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[var(--editable-shadow)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; every section consumes those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the whole home experience can be redesigned in one file.',
  'Use spacious, contained max-width layouts; never stretch content edge-to-edge.',
  'Use generous rounded cards with soft layered shadows and a single accent.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const

import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Curated bookmarks & resources',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated bookmarks & resources',
    primaryLinks: [
      { label: 'Collections', href: '/sbm' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Browse collections', href: '/sbm' },
      secondary: { label: 'Suggest a resource', href: '/contact' },
    },
  },
  footer: {
    tagline: 'The web, organised',
    description:
      'A hand-curated library of the most useful links, tools, and references on the web — grouped into clean collections and kept fresh so you can always find them again.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Collections', href: '/sbm' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Curated with care — quality over quantity.',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Added',
  },
} as const

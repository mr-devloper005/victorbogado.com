import { slot4BrandConfig } from '@/editable/theme/brand.config'

const brand = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated bookmarks, collections & resources',
      description: `${brand} is a hand-curated library of the web’s most useful links, tools, and references — organised into clean collections and kept fresh.`,
      openGraphTitle: 'Curated bookmarks, collections & resources',
      openGraphDescription: 'Discover hand-picked links, tools, and references — organised into collections and updated daily.',
      keywords: ['bookmarks', 'curated links', 'resources', 'collections', 'social bookmarking', 'reference library'],
    },
    hero: {
      badge: 'Curated bookmarks & resources',
      title: ['Every link worth keeping,', 'beautifully organised.'],
      description:
        'Skip the endless tabs and forgotten favourites. Browse a hand-curated library of the web’s most useful tools, references, and reads — filed into clean collections.',
      searchPlaceholder: 'Search tools, references, topics…',
      primaryCta: { label: 'Browse the library', href: '/sbm' },
      secondaryCta: { label: 'How it works', href: '/about' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Your next favourite resource is one click away.',
      description: 'Dive into curated collections of tools, references, and reads — or create an account to build a shelf of your own.',
      primaryCta: { label: 'Browse collections', href: '/sbm' },
      secondaryCta: { label: 'Get in touch', href: '/contact' },
    },
    intro: {
      badge: 'About the library',
      title: 'Bookmarks, finally worth keeping.',
      paragraphs: [
        'Every link in the library is found, reviewed, and filed by hand — then grouped into clean collections so you can rediscover it later.',
        'No clutter, no spam, no dead ends. Just a maintained, browsable set of the web’s genuinely useful tools, references, and reads.',
      ],
    },
  },
  about: {
    badge: 'Our story',
    title: 'A calmer way to keep the good stuff.',
    description: `${brand} turns scattered bookmarks into a maintained, browsable library — so the links you love are always easy to find again.`,
    paragraphs: [
      'Bookmarks have a habit of piling up and disappearing. We started this library for the opposite reason: a single, well-kept place where genuinely useful links are found, vetted, and filed where you can rediscover them.',
      'Everything here is hand-picked and grouped into themed collections. Stale links get pruned, fresh finds get added, and the whole thing stays fast, clean, and free to browse.',
      'Whether you arrive looking for a specific tool or just want to explore, you can move from one great resource to the next without friction.',
    ],
    values: [
      {
        title: 'Quality over quantity',
        description: 'Every link is reviewed by a human before it earns a place. No filler, no spam — just resources worth your time.',
      },
      {
        title: 'Organised by design',
        description: 'Resources live in clear, themed collections so you can go deep on a topic without losing the thread.',
      },
      {
        title: 'Always maintained',
        description: 'We prune dead links and add fresh finds regularly, so the library stays trustworthy and genuinely useful.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${brand}`,
    title: 'Got a great link, or a question? Let’s talk.',
    description: 'Suggest a resource, propose a collection, or ask us anything. Tell us what you have in mind and we’ll point it in the right direction.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search the library',
      description: 'Search curated bookmarks, collections, and resources across the library.',
    },
    hero: {
      badge: 'Search the library',
      title: 'Find the exact resource you need.',
      description: 'Search by keyword, filter by category, and narrow by content type to surface the right link in seconds.',
      placeholder: 'Search by keyword, tool, topic, or title',
    },
    resultsTitle: 'Latest from the library',
  },
  create: {
    metadata: {
      title: 'Submit a resource',
      description: 'Submit a new bookmark or resource to the library.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to submit a resource.',
      description: 'Create a free account to suggest links, build collections, and contribute to the library.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Share a resource with the community.',
      description: 'Add a link, give it context, and file it under a collection. Quality submissions help the whole library get better.',
    },
    formTitle: 'Resource details',
    submitLabel: 'Submit resource',
    successTitle: 'Resource submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: `Sign in to ${brand}.`,
      badge: 'Member access',
      title: 'Welcome back to your library.',
      description: 'Sign in to save resources, build your own collections, and pick up right where you left off.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create your ${brand} account.`,
      badge: 'Join the library',
      title: 'Create an account and start curating.',
      description: 'Save the links you love, build collections, and submit resources for the whole community to enjoy.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reads',
      fallbackTitle: 'Resource details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'More from this curator',
      fallbackDescription: 'Curator details will appear here once available.',
      visitButton: 'Visit website',
    },
  },
} as const

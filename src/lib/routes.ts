import type { Lang } from './types';

export type PageKey = 'media' | 'presse' | 'archives' | 'credits' | 'legal' | 'privacy';

export const PAGE_SLUGS: Record<Lang, Record<PageKey, string>> = {
  fr: {
    media: 'media',
    presse: 'presse',
    archives: 'archives',
    credits: 'credits-photo',
    legal: 'mentions-legales',
    privacy: 'confidentialite',
  },
  en: {
    media: 'media',
    presse: 'press',
    archives: 'archives',
    credits: 'photo-credits',
    legal: 'legal-notice',
    privacy: 'privacy-policy',
  },
  de: {
    media: 'medien',
    presse: 'presse',
    archives: 'archiv',
    credits: 'bildnachweise',
    legal: 'impressum',
    privacy: 'datenschutzerklaerung',
  },
};

export const LEGACY_PAGE_SLUGS: Record<PageKey, string> = {
  media: 'media',
  presse: 'presse',
  archives: 'archives',
  credits: 'credits',
  legal: 'legal',
  privacy: 'privacy',
};

export function pagePath(lang: Lang, page: PageKey): string {
  return `/${lang}/${PAGE_SLUGS[lang][page]}`;
}

export function pageKeyFromSlug(lang: Lang, slug: string): PageKey | undefined {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  const localized = Object.entries(PAGE_SLUGS[lang]).find(([, value]) => value === cleanSlug);
  if (localized) return localized[0] as PageKey;

  const legacy = Object.entries(LEGACY_PAGE_SLUGS).find(([, value]) => value === cleanSlug);
  return legacy?.[0] as PageKey | undefined;
}

export function localizedPathFromPath(path: string, targetLang: Lang): string {
  const segments = path.split('/').filter(Boolean);
  const currentLang = segments[0] as Lang | undefined;
  const slug = segments[1];

  if (!slug) return `/${targetLang}`;
  if (!currentLang || !['fr', 'en', 'de'].includes(currentLang)) return `/${targetLang}`;

  const page = pageKeyFromSlug(currentLang, slug);
  return page ? pagePath(targetLang, page) : `/${targetLang}`;
}

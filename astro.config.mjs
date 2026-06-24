// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const CANONICAL_PAGE_SLUGS = {
  fr: ['media', 'presse', 'archives', 'credits-photo', 'mentions-legales', 'confidentialite'],
  en: ['media', 'press', 'archives', 'photo-credits', 'legal-notice', 'privacy-policy'],
  de: ['medien', 'presse', 'archiv', 'bildnachweise', 'impressum', 'datenschutzerklaerung'],
};

export default defineConfig({
  site: 'https://vincianevinckenbosch.com',
  // Site statique par défaut ; les routes serveur (ex: /api/contact)
  // déclarent `export const prerender = false` pour tourner en serverless.
  adapter: vercel(),
  integrations: [
    vue(),
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length <= 1) return true;
        const [lang, slug] = segments;
        return CANONICAL_PAGE_SLUGS[lang]?.includes(slug) ?? false;
      },
      serialize(item) {
        // Homepages : priorité maximale
        if (/\/(fr|en|de)\/$/.test(item.url)) {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        // Pages contenu
        if (item.url.includes('/presse') || item.url.includes('/press') || item.url.includes('/media') || item.url.includes('/medien')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        return { ...item, priority: 0.6, changefreq: 'monthly' };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vincianevinckenbosch.com',
  integrations: [
    vue(),
    sitemap({
      filter: (page) =>
        !page.includes('/legal') && !page.includes('/privacy'),
      serialize(item) {
        // Homepages : priorité maximale
        if (/\/(fr|en|de)\/$/.test(item.url)) {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        // Pages contenu
        if (item.url.includes('/presse') || item.url.includes('/media')) {
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

<template>
  <nav
    class="navbar"
    :class="{ 'navbar--hidden': isHidden }"
    aria-label="Navigation principale"
  >
    <div class="navbar__inner">
      <ul class="navbar__links" role="list">
        <li v-for="item in navItems" :key="item.key">
          <a
            :href="item.href"
            class="navbar__link"
            :class="{ 'navbar__link--active': activePath === item.href }"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <div class="navbar__right">
        <div class="navbar__langs">
          <a
            v-for="l in langs"
            :key="l"
            :href="localeLangPath(l)"
            class="navbar__lang"
            :class="{ 'navbar__lang--active': l === lang }"
          >
            {{ l.toUpperCase() }}
          </a>
        </div>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          class="navbar__insta"
          aria-label="Instagram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
          </svg>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  lang: 'fr' | 'en' | 'de';
  currentPath: string;
}>();

const langs = ['fr', 'en', 'de'] as const;
// Hidden at the top of the page for a clean hero; appears once the user scrolls.
const isHidden = ref(true);
const activePath = ref(props.currentPath);
const TOP_THRESHOLD = 80;
let lastScrollY = 0;

const labels: Record<string, Record<string, string>> = {
  fr: { agenda: 'agenda', contact: 'contact', media: 'media', presse: 'presse', archives: 'archives' },
  en: { agenda: 'agenda', contact: 'contact', media: 'media', presse: 'press',  archives: 'archives' },
  de: { agenda: 'agenda', contact: 'kontakt',  media: 'media', presse: 'presse',  archives: 'archiv'   },
};

const navItems = computed(() => {
  const l = labels[props.lang];
  return [
    { key: 'agenda',   label: l.agenda,   href: `/${props.lang}/#agenda` },
    { key: 'contact',  label: l.contact,  href: `/${props.lang}/#contact` },
    { key: 'media',    label: l.media,    href: `/${props.lang}/media` },
    { key: 'presse',   label: l.presse,   href: `/${props.lang}/presse` },
    { key: 'archives', label: l.archives, href: `/${props.lang}/archives` },
  ];
});

function localeLangPath(l: string): string {
  // Safe: only called on client after mount
  const segments = activePath.value.split('/').filter(Boolean);
  const withoutLang = segments.slice(1).join('/');
  return `/${l}${withoutLang ? '/' + withoutLang : ''}`;
}

function onScroll() {
  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;
  if (currentY <= TOP_THRESHOLD) {
    // At the very top: keep the hero clean.
    isHidden.value = true;
  } else if (delta > 3) {
    // Scrolling down: hide.
    isHidden.value = true;
  } else if (delta < -3) {
    // Scrolling up: show.
    isHidden.value = false;
  }
  lastScrollY = currentY;
}

onMounted(() => {
  activePath.value = window.location.pathname;
  lastScrollY = window.scrollY;
  isHidden.value = window.scrollY <= TOP_THRESHOLD;
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar--hidden {
  transform: translateY(100%);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 57px;
  background-color: rgba(35, 35, 35, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(247, 245, 243, 0.08);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 2.75rem;
  list-style: none;
}

.navbar__link {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 400;
  font-size: 0.875rem;
  color: #E6E3DB;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}

.navbar__link:hover,
.navbar__link--active {
  color: #DA7F52;
}

.navbar__right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar__langs {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar__lang {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 400;
  font-size: 0.75rem;
  color: #E6E3DB;
  text-decoration: none;
  letter-spacing: 0.1em;
  opacity: 0.45;
  transition: opacity 0.2s ease;
}

.navbar__lang:hover,
.navbar__lang--active {
  opacity: 1;
}

.navbar__insta {
  color: #E6E3DB;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.navbar__insta:hover {
  color: #DA7F52;
}

@media (max-width: 640px) {
  .navbar__links { gap: 1.25rem; }
  .navbar__link  { font-size: 0.75rem; }
}
</style>

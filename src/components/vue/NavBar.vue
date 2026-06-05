<template>
  <!-- ── Navbar (desktop + mobile) ─────────────────────────── -->
  <nav
    class="navbar"
    :class="{ 'navbar--hidden': isHidden }"
    aria-label="Navigation principale"
  >
    <div class="navbar__inner">

      <!-- GAUCHE : nom = lien retour accueil, flip lettre par lettre -->
      <a :href="`/${lang}`" class="navbar__brand" aria-label="Vinciane Vinckenbosch">
        <span class="flip-word" aria-hidden="true">
          <span
            v-for="(char, ci) in 'Vinciane Vinckenbosch'"
            :key="ci"
            class="flip-char"
            :style="{ '--i': ci }"
          >
            <span class="flip-char__a">{{ char }}</span>
            <span class="flip-char__b">{{ char }}</span>
          </span>
        </span>
        <span class="sr-only">Vinciane Vinckenbosch</span>
      </a>

      <!-- DROITE desktop : liens + langue + social -->
      <div class="navbar__right">
        <ul class="navbar__links" role="list">
          <li v-for="item in navItems" :key="item.key">
            <a
              :href="item.href"
              class="navbar__link"
              :class="{ 'navbar__link--active': isActive(item) }"
            >
              <!-- Flip lettre par lettre avec stagger -->
              <span class="flip-word" aria-hidden="true">
                <span
                  v-for="(char, ci) in item.label"
                  :key="ci"
                  class="flip-char"
                  :style="{ '--i': ci }"
                >
                  <span class="flip-char__a">{{ char }}</span>
                  <span class="flip-char__b">{{ char }}</span>
                </span>
              </span>
              <span class="sr-only">{{ item.label }}</span>
            </a>
          </li>
        </ul>

        <div class="navbar__langs">
          <a
            v-for="l in langs" :key="l"
            :href="localeLangPath(l)"
            class="navbar__lang"
            :class="{ 'navbar__lang--active': l === lang }"
          >{{ l.toUpperCase() }}</a>
        </div>

        <a
          href="https://www.youtube.com/@vincianevinckenbosch"
          target="_blank" rel="noopener noreferrer"
          class="navbar__social" aria-label="YouTube"
        >
          <svg width="20" height="14" viewBox="0 0 24 17" fill="none" aria-hidden="true">
            <path d="M23.495 2.656a3.016 3.016 0 0 0-2.122-2.134C19.505 0 12 0 12 0S4.495 0 2.627.522A3.016 3.016 0 0 0 .505 2.656 31.644 31.644 0 0 0 0 8.5a31.644 31.644 0 0 0 .505 5.844 3.016 3.016 0 0 0 2.122 2.134C4.495 17 12 17 12 17s7.505 0 9.373-.522a3.016 3.016 0 0 0 2.122-2.134A31.644 31.644 0 0 0 24 8.5a31.644 31.644 0 0 0-.505-5.844Z" fill="currentColor"/>
            <path d="M9.6 12.143 15.818 8.5 9.6 4.857v7.286Z" fill="#E6E3DB"/>
          </svg>
        </a>
      </div>

      <!-- DROITE mobile : hamburger 2 barres → croix -->
      <button
        class="hamburger"
        :class="{ 'hamburger--open': menuOpen }"
        @click="toggleMenu"
        :aria-expanded="menuOpen"
        aria-label="Ouvrir le menu"
      >
        <span class="hamburger__bar"></span>
        <span class="hamburger__bar"></span>
      </button>

    </div>
  </nav>

  <!-- ── Overlay mobile plein écran depuis le bas ────────────── -->
  <Transition name="overlay">
    <div
      v-if="menuOpen"
      class="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
    >
      <nav class="mobile-menu__nav">
        <ul role="list">
          <li v-for="item in navItems" :key="item.key">
            <a
              :href="item.href"
              class="mobile-menu__link"
              :class="{ 'mobile-menu__link--active': isActive(item) }"
              @click="closeMenu"
            >{{ item.label }}</a>
          </li>
        </ul>
      </nav>

      <div class="mobile-menu__footer">
        <div class="mobile-menu__langs">
          <a
            v-for="l in langs" :key="l"
            :href="localeLangPath(l)"
            class="mobile-menu__lang"
            :class="{ 'mobile-menu__lang--active': l === lang }"
            @click="closeMenu"
          >{{ l.toUpperCase() }}</a>
        </div>
        <a href="https://www.youtube.com/@vincianevinckenbosch" target="_blank" rel="noopener noreferrer" class="mobile-menu__social" aria-label="YouTube">
          <svg width="22" height="16" viewBox="0 0 24 17" fill="none" aria-hidden="true">
            <path d="M23.495 2.656a3.016 3.016 0 0 0-2.122-2.134C19.505 0 12 0 12 0S4.495 0 2.627.522A3.016 3.016 0 0 0 .505 2.656 31.644 31.644 0 0 0 0 8.5a31.644 31.644 0 0 0 .505 5.844 3.016 3.016 0 0 0 2.122 2.134C4.495 17 12 17 12 17s7.505 0 9.373-.522a3.016 3.016 0 0 0 2.122-2.134A31.644 31.644 0 0 0 24 8.5a31.644 31.644 0 0 0-.505-5.844Z" fill="#DA7F52"/>
            <path d="M9.6 12.143 15.818 8.5 9.6 4.857v7.286Z" fill="#E6E3DB"/>
          </svg>
        </a>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  lang: 'fr' | 'en' | 'de';
  currentPath: string;
}>();

const langs      = ['fr', 'en', 'de'] as const;
const menuOpen      = ref(false);
const activePath    = ref(props.currentPath);
// Section hash active détectée par IntersectionObserver
const activeSection = ref<string | null>(null);

const TOP_THRESHOLD = 80;

function isHomePage(path: string): boolean {
  return /^\/(fr|en|de)?\/?$/.test(path);
}

const isHidden = ref(isHomePage(props.currentPath));

const labels: Record<string, Record<string, string>> = {
  fr: { agenda: 'agenda', contact: 'contact', media: 'media', presse: 'presse', archives: 'archives' },
  en: { agenda: 'agenda', contact: 'contact', media: 'media', presse: 'press',  archives: 'archives' },
  de: { agenda: 'agenda', contact: 'kontakt',  media: 'media', presse: 'presse', archives: 'archiv'  },
};

const navItems = computed(() => {
  const l = labels[props.lang];
  return [
    { key: 'agenda',   label: l.agenda,   href: `/${props.lang}/#agenda`  },
    { key: 'contact',  label: l.contact,  href: `/${props.lang}/#contact` },
    { key: 'media',    label: l.media,    href: `/${props.lang}/media`    },
    { key: 'presse',   label: l.presse,   href: `/${props.lang}/presse`   },
    { key: 'archives', label: l.archives, href: `/${props.lang}/archives` },
  ];
});

function localeLangPath(l: string): string {
  const segments = activePath.value.split('/').filter(Boolean);
  const withoutLang = segments.slice(1).join('/');
  return `/${l}${withoutLang ? '/' + withoutLang : ''}`;
}

/**
 * Détermine si un lien de nav est actif :
 * - Lien ancre (#agenda, #contact) → vrai si la section est visible
 * - Lien de page (/media, /presse…) → vrai si pathname correspond
 */
function isActive(item: { href: string }): boolean {
  if (item.href.includes('#')) {
    const hash = item.href.split('#')[1];
    return activeSection.value === hash;
  }
  // Pour les pages, on compare le pathname sans query/hash
  const itemPath = item.href.split('?')[0].split('#')[0];
  return activePath.value === itemPath || activePath.value.startsWith(itemPath + '/');
}

function toggleMenu() { menuOpen.value = !menuOpen.value; }
function closeMenu()  { menuOpen.value = false; }

watch(menuOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : '';
  }
});

function onScroll() {
  if (!isHomePage(activePath.value)) return;
  const pastHero = window.scrollY > TOP_THRESHOLD;
  isHidden.value = !pastHero;
}

// IDs des sections à observer (correspondent aux ancres du menu)
const SECTION_IDS = ['agenda', 'contact'];
let sectionObserver: IntersectionObserver | null = null;

function initSectionObserver() {
  if (sectionObserver) sectionObserver.disconnect();

  sectionObserver = new IntersectionObserver(
    (entries) => {
      // On prend la section la plus haute dans le viewport
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        activeSection.value = visible[0].target.id;
      } else {
        // Si aucune section visible, vérifier si on est entre les sections
        const anyLeft = entries.some(e => !e.isIntersecting && e.boundingClientRect.top > 0);
        if (anyLeft) activeSection.value = null;
      }
    },
    {
      // La section est considérée active quand au moins 20% est visible
      threshold: 0.2,
      rootMargin: '0px 0px -20% 0px',
    }
  );

  SECTION_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver!.observe(el);
  });
}

onMounted(() => {
  activePath.value = window.location.pathname;
  if (isHomePage(activePath.value)) {
    isHidden.value = window.scrollY <= TOP_THRESHOLD;
  } else {
    isHidden.value = false;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  initSectionObserver();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  sectionObserver?.disconnect();
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* ════════════════════════════════════════════════════════
   NAVBAR — position EN HAUT
════════════════════════════════════════════════════════ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  /* Cache vers le haut */
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar--hidden {
  transform: translateY(-100%);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 57px;
  padding: 0 clamp(1.5rem, 3vw, 3rem);
  background-color: #E6E3DB;
  border-bottom: 1px solid rgba(35, 35, 35, 0.1);
}

/* ── Nom (gauche) ─────────────────────────────────────── */
.navbar__brand {
  font-family: "Coconat", Georgia, serif;
  font-weight: 400;
  font-size: 1.8rem;
  letter-spacing: 0.04em;
  color: #232323;
  text-decoration: none;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}
.navbar__brand:hover { opacity: 0.6; }

/* ── Droite : liens + langue + social ─────────────────── */
.navbar__right {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 2.5vw, 3rem);
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2vw, 2.5rem);
  list-style: none;
}

.navbar__link {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 400;
  font-size: clamp(0.875rem, 1.1vw, 1.125rem);
  color: #232323;
  text-decoration: none;
  letter-spacing: 0.02em;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}
.navbar__link:hover, .navbar__link--active { opacity: 1; }

.navbar__langs {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.navbar__lang {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 400;
  font-size: clamp(0.75rem, 0.9vw, 0.9375rem);
  color: #232323;
  text-decoration: none;
  letter-spacing: 0.08em;
  opacity: 0.45;
  transition: opacity 0.2s ease;
}
.navbar__lang:hover, .navbar__lang--active { opacity: 1; }

.navbar__social {
  color: #DA7F52;   /* orange — cohérent avec mobile */
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
.navbar__social:hover { opacity: 1; }

/* ════════════════════════════════════════════════════════
   HAMBURGER — mobile uniquement (2 barres → croix)
════════════════════════════════════════════════════════ */
.hamburger {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.hamburger__bar {
  display: block;
  width: 28px;
  height: 1.5px;
  background-color: #DA7F52; /* remplacé en noir via @media */
  border-radius: 2px;
  transform-origin: center;
  /* Transition légèrement plus longue pour bien voir l'effet */
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Barre 1 → branche diagonale / */
.hamburger--open .hamburger__bar:first-child {
  transform: translateY(5.25px) rotate(45deg);
}
/* Barre 2 → branche diagonale \ */
.hamburger--open .hamburger__bar:last-child {
  transform: translateY(-5.25px) rotate(-45deg);
}

/* ════════════════════════════════════════════════════════
   OVERLAY MOBILE — fond beige, texte orange, depuis le bas
════════════════════════════════════════════════════════ */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 49;           /* derrière la navbar (z:50) */
  background-color: #E6E3DB;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem clamp(1.5rem, 8vw, 3rem) 3rem;
  overflow-y: auto;
  will-change: transform;
}

.mobile-menu__nav ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 4vw, 1.75rem);
}

.mobile-menu__link {
  display: inline-block;
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(2rem, 8vw, 3rem);
  color: #232323;
  text-decoration: none;
  letter-spacing: 0.02em;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}
.mobile-menu__link:hover,
.mobile-menu__link--active { opacity: 1; }

.mobile-menu__footer {
  position: absolute;
  bottom: clamp(1.5rem, 5vw, 2.5rem);
  left: clamp(1.5rem, 8vw, 3rem);
  right: clamp(1.5rem, 8vw, 3rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-menu__langs {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.mobile-menu__lang {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 400;
  font-size: 0.9375rem;
  color: #232323;
  text-decoration: none;
  letter-spacing: 0.1em;
  opacity: 0.45;
  transition: opacity 0.2s ease;
}
.mobile-menu__lang:hover,
.mobile-menu__lang--active { opacity: 1; }

.mobile-menu__social {
  display: flex;
  align-items: center;
  opacity: 0.7;
}
.mobile-menu__social:hover { opacity: 1; }

/* ── Transition overlay : slide depuis le haut (menu en haut) ── */
.overlay-enter-active {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.overlay-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.overlay-enter-from,
.overlay-leave-to {
  transform: translateY(-100%);
}

/* ════════════════════════════════════════════════════════
   MOBILE
════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════
   FLIP LETTRE PAR LETTRE — stagger via --i
   Chaque caractère flip indépendamment avec un délai progressif
════════════════════════════════════════════════════════ */

/* Conteneur du mot : inline-flex pour que les chars se suivent */
.flip-word {
  display: inline-flex;
  align-items: baseline;
}

/* Chaque caractère : overflow hidden, hauteur fixe */
.flip-char {
  display: inline-block;
  overflow: hidden;
  position: relative;
  height: 1.15em;
  line-height: 1.15;
}

.flip-char__a,
.flip-char__b {
  display: block;
  transition:
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)
    calc(var(--i, 0) * 28ms);  /* délai progressif par lettre */
}

/* Couche B : cachée en dessous */
.flip-char__b {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(105%);
}

/* Hover / actif : A monte, B entre — liens ET brand */
.navbar__link:hover .flip-char__a,
.navbar__link--active .flip-char__a,
.navbar__brand:hover .flip-char__a {
  transform: translateY(-105%);
}

.navbar__link:hover .flip-char__b,
.navbar__link--active .flip-char__b,
.navbar__brand:hover .flip-char__b {
  transform: translateY(0);
}

/* Accessibilité : cache le texte dupliqué aux lecteurs d'écran */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 900px) {
  /* Cacher les liens desktop, afficher le hamburger */
  .navbar__right { display: none; }
  .hamburger     { display: flex; }

  /* Nom plus grand sur mobile */
  .navbar__brand {
    font-size: 1.5rem;
  }

  /* Barres hamburger en noir */
  .hamburger__bar {
    background-color: #232323;
  }
}
</style>

<template>
  <section class="agenda" id="agenda" aria-labelledby="agenda-title">
    <div class="agenda__container">
      <!-- Header -->
      <div class="agenda__header">
        <h2 id="agenda-title" class="section-title agenda__title">
          {{ titleLabel }}
        </h2>
        <label
          class="agenda__search-label"
          :class="{ 'agenda__search-label--active': query }"
        >
          <svg
            class="agenda__search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            v-model="query"
            type="search"
            class="agenda__search"
            :placeholder="searchPlaceholder"
            aria-label="Filtrer les concerts"
          />
          <button
            v-if="query"
            class="agenda__search-clear"
            @click="query = ''"
            aria-label="Effacer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </label>
      </div>

      <!-- List -->
      <p v-if="filteredEvents.length === 0" class="agenda__empty">
        {{ emptyLabel }}
      </p>

      <TransitionGroup
        v-else
        tag="div"
        name="event-reveal"
        class="agenda__list"
      >
        <div
          v-for="(event, idx) in visibleEvents"
          :key="`${event.date}-${event.city}`"
          class="event-wrap"
          :class="{ 'event-wrap--linked': !!event.ticketUrl && !hideLinks }"
          :style="{ '--stagger': `${Math.max(0, idx - MAX + 1) * 60}ms` }"
        >
          <component
            :is="event.ticketUrl && !hideLinks ? 'a' : 'div'"
            :href="event.ticketUrl && !hideLinks ? event.ticketUrl : undefined"
            :target="event.ticketUrl && !hideLinks ? '_blank' : undefined"
            :rel="
              event.ticketUrl && !hideLinks ? 'noopener noreferrer' : undefined
            "
            class="event"
          >
            <div class="event__date-col">
              <!-- Figma : Coconat Regular, minuscules, pas d'uppercase -->
              <time class="event__date">{{ event.date }}</time>
              <span v-if="event.time" class="event__time">{{
                event.time
              }}</span>
            </div>
            <div class="event__city">{{ event.city }}</div>
            <div class="event__venue">{{ event.venue }}</div>
            <div class="event__role">{{ event.role }}</div>
            <ul
              v-if="event.program && event.program.length"
              class="event__program"
              aria-label="Programme"
            >
              <li v-for="p in event.program" :key="p">{{ p }}</li>
            </ul>
          </component>

          <!-- Animated divider line -->
          <component
            :is="event.ticketUrl && !hideLinks ? 'a' : 'div'"
            :href="event.ticketUrl && !hideLinks ? event.ticketUrl : undefined"
            :target="event.ticketUrl && !hideLinks ? '_blank' : undefined"
            :rel="
              event.ticketUrl && !hideLinks ? 'noopener noreferrer' : undefined
            "
            class="event-line"
            :class="{ 'event-line--linked': !!event.ticketUrl && !hideLinks }"
            :aria-label="
              event.ticketUrl && !hideLinks
                ? `Info — ${event.city}, ${event.venue}`
                : undefined
            "
            :aria-hidden="event.ticketUrl && !hideLinks ? undefined : true"
          >
            <div class="event-line__sweep"></div>
            <span v-if="event.ticketUrl && !hideLinks" class="event-line__label"
              >INFO</span
            >
            <svg
              v-if="event.ticketUrl && !hideLinks"
              class="event-line__arrow"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 17L17 7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M9 7H17V15"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </component>
        </div>
      </TransitionGroup>

      <!-- Footer -->
      <div class="agenda__footer">
        <div class="agenda__footer-left">
          <Transition name="slide-left">
            <a
              v-if="!hideArchivesLink"
              :href="pagePath(lang, 'archives')"
              class="btn-pill"
              >{{ archivesLabel }}</a
            >
          </Transition>
        </div>
        <div class="agenda__footer-right">
          <Transition name="slide-right">
            <button
              v-if="!showAll && hasMore"
              class="btn-pill agenda__more-btn"
              @click="showAll = true"
            >
              {{ moreLabel }}
            </button>
          </Transition>
          <a v-if="backHref" :href="backHref" class="btn-pill">{{
            backLabel
          }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { pagePath } from "../../lib/routes";

interface Event {
  date: string;
  time?: string;
  city: string;
  venue: string;
  role: string;
  program?: string[];
  ticketUrl?: string;
}

const props = defineProps<{
  events: Event[];
  lang: "fr" | "en" | "de";
  /** true → affiche uniquement les dates passées (page archives) */
  showPastOnly?: boolean;
  /** true → tout affiché d'emblée, sans pagination */
  showAllByDefault?: boolean;
  /** true → masque le bouton « archives → » (déjà sur la page archives) */
  hideArchivesLink?: boolean;
  /** true → aucun lien ni effet hover (page archives) */
  hideLinks?: boolean;
  /** Lien retour vers l'agenda (affiché à droite du footer, page archives)   */
  backHref?: string;
}>();

const MAX = 6;
const query = ref("");
const showAll = ref(props.showAllByDefault ?? false);

const i18n = {
  fr: {
    titleAgenda: "agenda",
    titleArchives: "archives",
    more: "à venir",
    archives: "archives",
    backLabel: "voir l'agenda",
    search: "rechercher…",
    noResults: "Aucun résultat pour",
    noEvents: "Aucun concert à venir.",
    noArchive: "Aucune archive disponible.",
  },
  en: {
    titleAgenda: "agenda",
    titleArchives: "archives",
    more: "more dates",
    archives: "archives",
    backLabel: "back to agenda",
    search: "search…",
    noResults: "No results for",
    noEvents: "No upcoming concerts.",
    noArchive: "No archived concerts yet.",
  },
  de: {
    titleAgenda: "Termine",
    titleArchives: "Archiv",
    more: "mehr Termine",
    archives: "Archiv",
    backLabel: "zu Termine",
    search: "suchen…",
    noResults: "Keine Ergebnisse für",
    noEvents: "Keine bevorstehenden Konzerte.",
    noArchive: "Noch keine archivierten Konzerte.",
  },
} as const;

const t = computed(() => i18n[props.lang] ?? i18n.fr);
const titleLabel = computed(() =>
  props.showPastOnly ? t.value.titleArchives : t.value.titleAgenda,
);
const moreLabel = computed(() => t.value.more);
const archivesLabel = computed(() => t.value.archives);
const backLabel = computed(() => t.value.backLabel);
const searchPlaceholder = computed(() => t.value.search);
const emptyLabel = computed(() => {
  const trimmedQuery = query.value.trim();
  if (trimmedQuery) return `${t.value.noResults} « ${trimmedQuery} »`;
  return props.showPastOnly ? t.value.noArchive : t.value.noEvents;
});

// ── Helpers de date ──────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  fév: 1,
  février: 1,
  mar: 2,
  mars: 2,
  avr: 3,
  avril: 3,
  mai: 4,
  juin: 5,
  juil: 6,
  juillet: 6,
  août: 7,
  aoû: 7,
  sep: 8,
  sept: 8,
  septembre: 8,
  oct: 9,
  octobre: 9,
  nov: 10,
  novembre: 10,
  déc: 11,
  dec: 11,
  décembre: 11,
  fev: 1,
  aou: 7,
};

function parseEventDate(dateStr: string): Date {
  const parts = dateStr.toLowerCase().replace(/\./g, "").trim().split(/\s+/);
  const day = parseInt(parts[0] ?? "1");
  const month = MONTH_MAP[parts[1] ?? ""] ?? 0;
  const year = parseInt(parts[2] ?? String(new Date().getFullYear()));
  return new Date(year, month, day);
}

function startOfToday(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// ── Filtrage ─────────────────────────────────────────────────────────────────

function normalize(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const dateFilteredEvents = computed(() => {
  const today = startOfToday();
  const sorted = [...props.events];
  if (props.showPastOnly) {
    // Archives : dates < aujourd'hui, du plus récent au plus ancien
    return sorted
      .filter((e) => parseEventDate(e.date) < today)
      .sort(
        (a, b) =>
          parseEventDate(b.date).getTime() - parseEventDate(a.date).getTime(),
      );
  }
  // Agenda : dates >= aujourd'hui (y compris aujourd'hui), du plus proche au plus lointain
  return sorted
    .filter((e) => parseEventDate(e.date) >= today)
    .sort(
      (a, b) =>
        parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime(),
    );
});

const filteredEvents = computed(() => {
  if (!query.value.trim()) return dateFilteredEvents.value;
  const q = normalize(query.value.trim());
  return dateFilteredEvents.value.filter((event) => {
    const haystack = normalize(
      [
        event.date,
        event.time ?? "",
        event.city,
        event.venue,
        event.role,
        ...(event.program ?? []),
      ].join(" "),
    );
    return haystack.includes(q);
  });
});

const visibleEvents = computed(() =>
  showAll.value ? filteredEvents.value : filteredEvents.value.slice(0, MAX),
);

const hasMore = computed(() => filteredEvents.value.length > MAX);
</script>

<style scoped>
/* ─── Layout ────────────────────────────────────────────── */

/* CSS variable shared by grid + animation */
.agenda__container {
  /*
    Proportions Figma (1728px base, gap 128px) :
      date 15.1% | city 5.6% | venue 14.8% | role 7.9% | program 1fr
    On élargit la date pour que "21 mai 2026" tienne sur une ligne
    sans text-transform: uppercase
  */
  --date-col: clamp(14rem, 17vw, 20rem);
  --city-col: clamp(5rem, 5.5vw, 7rem);
  --venue-col: clamp(8rem, 14.8vw, 16rem);
  --role-col: clamp(6rem, 7.9vw, 9rem);
  max-width: 1728px;
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 8rem) clamp(1.5rem, 4vw, 4rem)
    clamp(2rem, 3vw, 3rem);
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 3vw, 3rem);
}

/* ─── Header ─────────────────────────────────────────────── */

.agenda__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
}

.agenda__title {
  font-size: clamp(2.5rem, 5.5vw, 5.375rem);
  line-height: 1.28;
  color: #ffffff;
}

/* ─── Search ─────────────────────────────────────────────── */

.agenda__search-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  padding: 0.55rem 1.1rem;
  background: transparent;
  cursor: text;
  min-width: 220px;
  transition: border-color 0.2s ease;
}

.agenda__search-label--active,
.agenda__search-label:focus-within {
  border-color: rgba(255, 255, 255, 0.5);
}

.agenda__search-icon {
  color: rgba(255, 255, 255, 0.45);
  flex-shrink: 0;
}

.agenda__search {
  background: none;
  border: none;
  outline: none;
  color: #f7f5f3;
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: 0.875rem;
  width: 100%;
  /* remove browser default search cancel button */
}
.agenda__search::-webkit-search-cancel-button {
  display: none;
}

.agenda__search::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.agenda__search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  transition: color 0.15s;
}
.agenda__search-clear:hover {
  color: #f7f5f3;
}

/* ─── List / table ───────────────────────────────────────── */

.agenda__list {
  display: flex;
  flex-direction: column;
}

.agenda__empty {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem 0;
}

/* ─── Event wrap ─────────────────────────────────────────── */

.event-wrap {
  display: flex;
  flex-direction: column;
}

/* ─── Event row ──────────────────────────────────────────── */

.event {
  display: grid;
  /* Distribution homogène : 5 colonnes égales sur toute la largeur */
  grid-template-columns: repeat(5, 1fr);
  column-gap: clamp(1rem, 3vw, 3rem);
  row-gap: 1rem;
  align-items: start;
  justify-items: start;
  min-height: 8rem;
  padding: 1.5rem 0 1.25rem;
  text-decoration: none;
  color: inherit;
  width: 100%;
}

.event__city,
.event__venue,
.event__role,
.event__program {
  text-align: left;
}

/* only <a> gets cursor pointer */
a.event {
  cursor: pointer;
}

.event__date-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 5rem;
}

.event__date {
  /* Figma : Coconat Regular, fontSize 40px, letterSpacing 10%, minuscules */
  font-family: "Coconat", Georgia, serif;
  font-weight: 400;
  font-size: clamp(1.25rem, 2.5vw, 2.375rem);
  letter-spacing: 0.1em;
  /* PAS de text-transform: uppercase — le Figma garde les minuscules */
  color: #ffffff;
  line-height: 1.1;
  display: block;
  white-space: nowrap;
}

.event__time {
  /* Figma : Coconat Regular, fontSize 29px, letterSpacing 10%, minuscules */
  font-family: "Coconat", Georgia, serif;
  font-weight: 400;
  font-size: clamp(1rem, 1.8vw, 1.625rem);
  letter-spacing: 0.1em;
  color: #ffffff;
  display: block;
  margin-top: auto;
}

.event__city,
.event__venue {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.875rem, 1.4vw, 1rem);
  color: #ffffff;
  padding-top: 0.3rem;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.event__role {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding-top: 0.3rem;
  justify-self: start;
  text-align: left;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.event__program {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 0.3rem;
  justify-self: start;
  text-align: left;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.event__program li {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.8125rem, 1.15vw, 0.9rem);
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.4;
}

/* ─── Hover effects on linked rows ───────────────────────── */

/* 1. Slide columns slightly right */
.event-wrap--linked:hover .event__city,
.event-wrap--linked:hover .event__venue,
.event-wrap--linked:hover .event__role,
.event-wrap--linked:hover .event__program {
  transform: translateX(10px);
}

/* 2. Date text stays white on hover */

/* 3. Fade out all other rows when one is hovered */
.agenda__list:has(.event-wrap--linked:hover) .event-wrap {
  opacity: 0.35;
  transition: opacity 0.3s ease;
}
.agenda__list:has(.event-wrap--linked:hover) .event-wrap:hover {
  opacity: 1;
}

/* ─── Animated divider ───────────────────────────────────── */

.event-line {
  position: relative;
  display: block;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  overflow: visible;
  color: inherit;
  text-decoration: none;
}

.event-line--linked {
  cursor: pointer;
}

.event-line--linked::after {
  content: "";
  position: absolute;
  top: -18px;
  right: -0.5rem;
  bottom: -18px;
  width: 7.5rem;
  z-index: 1;
}

.event-line__sweep {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.65);
  transition: width 0.45s cubic-bezier(0.25, 1, 0.5, 1);
}

.event-wrap--linked:hover .event-line__sweep {
  width: calc(100% - 104px);
}

.event-line__label {
  position: absolute;
  z-index: 2;
  right: 40px;
  top: 50%;
  transform: translateY(calc(-50% + 6px));
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.6875rem, 0.95vw, 0.8125rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #f7f5f3;
  white-space: nowrap;
  opacity: 0;
  transition:
    opacity 0.2s ease 0.3s,
    transform 0.25s ease 0.3s;
}

.event-wrap--linked:hover .event-line__label {
  opacity: 1;
  transform: translateY(-50%);
}

.event-line__arrow {
  position: absolute;
  z-index: 2;
  right: 0;
  top: 50%;
  transform: translateY(calc(-50% + 6px));
  width: 32px;
  height: 32px;
  color: #f7f5f3;
  opacity: 0;
  transition:
    opacity 0.2s ease 0.3s,
    transform 0.25s ease 0.3s;
}

.event-wrap--linked:hover .event-line__arrow {
  opacity: 1;
  transform: translateY(-50%);
}

/* ─── Footer ─────────────────────────────────────────────── */

.agenda__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3.5rem;
}

.agenda__footer-left,
.agenda__footer-right {
  display: flex;
  align-items: center;
}

/* reset <button> to match <a> for btn-pill */
.agenda__more-btn {
  cursor: pointer;
  background: none;
  border: 1px solid currentColor;
  font-family: inherit;
  color: #f7f5f3;
}

.agenda__more-btn:hover {
  background-color: #f7f5f3;
  color: #232323;
}

/* ─── TransitionGroup : dévoilement des dates supplémentaires ── */

.event-reveal-enter-active {
  transition:
    opacity 0.5s ease var(--stagger, 0ms),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--stagger, 0ms);
}

.event-reveal-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

/* ─── Footer button transitions ──────────────────────────── */

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

/* ─── Désactiver les effets hover sur écrans tactiles ──────── */
@media (hover: none) {
  /* Pas de slide des colonnes */
  .event-wrap--linked:hover .event__city,
  .event-wrap--linked:hover .event__venue,
  .event-wrap--linked:hover .event__role,
  .event-wrap--linked:hover .event__program {
    transform: none;
  }

  /* Pas de fade des autres lignes */
  .agenda__list:has(.event-wrap--linked:hover) .event-wrap {
    opacity: 1;
  }

  /* Pas de sweep animé, mais INFO + flèche toujours visibles (pas de hover) */
  .event-wrap--linked:hover .event-line__sweep {
    width: 0;
  }
  .event-line__arrow,
  .event-line__label {
    opacity: 1;
    transform: translateY(-50%);
  }

  /* Supprimer les transitions qui resteraient actives */
  .event__city,
  .event__venue,
  .event__role,
  .event__program {
    transition: none;
  }
}

/* ─── Responsive ─────────────────────────────────────────── */

@media (max-width: 1024px) {
  /* repeat(5, 1fr) déjà homogène, juste réduire le gap */
  .event {
    column-gap: 1rem;
  }
}

@media (max-width: 768px) {
  .agenda__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
  .agenda__search-label {
    min-width: 100%;
  }

  /*
    Figma iPhone agenda (layout_SNSWT9) :
      - colonne, gap 7px
      - Ligne 1 : date (gauche)  + city (droite)   → space-between
      - Ligne 2 : time (gauche)  + venue (droite)   → space-between
      - Ligne 3 : role (pleine largeur)
      - Ligne 4 : programme (pleine largeur)

    Technique : date-col → display:contents pour que date et time
    deviennent des cellules grid indépendantes.
  */
  .event {
    display: grid;
    grid-template-columns: 1fr auto; /* date/time à gauche, city/venue à droite */
    grid-template-rows: repeat(4, auto);
    column-gap: 1rem;
    row-gap: 0.4375rem; /* Figma : gap 7px */
    padding: 1rem 0 0.875rem;
    min-height: unset;
  }

  /* date-col transparent → date + time deviennent des cellules grid */
  .event__date-col {
    display: contents;
    min-height: unset;
  }

  /* Ligne 1 : date gauche */
  .event__date {
    grid-column: 1;
    grid-row: 1;
    align-self: baseline;
    font-size: clamp(1rem, 6.2vw, 1.5625rem); /* Figma : 25px */
  }

  /* Ligne 1 : city droite */
  .event__city {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
    text-align: right;
    align-self: baseline;
    font-size: 0.75rem; /* Figma : 12px */
  }

  /* Ligne 2 : time gauche */
  .event__time {
    grid-column: 1;
    grid-row: 2;
    align-self: baseline;
    margin-top: 0;
    font-size: 0.8125rem; /* Figma : 13px */
  }

  /* Ligne 2 : venue droite */
  .event__venue {
    grid-column: 2;
    grid-row: 2;
    justify-self: end;
    text-align: right;
    align-self: baseline;
    font-size: 0.75rem; /* Figma : 12px */
  }

  /* Ligne 3 : role pleine largeur */
  .event__role {
    grid-column: 1 / -1;
    grid-row: 3;
    justify-self: start;
    text-align: left;
    font-size: 0.75rem; /* Figma : 12px */
  }

  /* Ligne 4 : programme pleine largeur */
  .event__program {
    grid-column: 1 / -1;
    grid-row: 4;
    justify-self: start;
  }

  .event__program li {
    font-size: 0.75rem; /* Figma : 12px */
  }
}
</style>

<template>
  <div class="biodl" :class="{ 'biodl--open': open }">
    <!-- Bouton principal -->
    <button
      type="button"
      class="biodl__toggle"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      {{ label }} <span class="biodl__arrow">→</span>
    </button>

    <!-- Choix de langue -->
    <Transition name="biodl-list">
      <ul v-if="open" class="biodl__langs" role="list">
        <li v-for="opt in available" :key="opt.code">
          <a
            :href="opt.url"
            class="biodl__lang"
            target="_blank"
            rel="noopener noreferrer"
            download
            @click="open = false"
          >{{ opt.label }}</a>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  lang: 'fr' | 'en' | 'de';
  pdfs?: { fr?: string; en?: string; de?: string };
}>();

const open = ref(false);

const i18n = {
  fr: 'télécharger la biographie',
  en: 'download the biography',
  de: 'download Biografie',
} as const;

const langLabels = { fr: 'Français', en: 'English', de: 'Deutsch' } as const;

const label = computed(() => i18n[props.lang] ?? i18n.fr);

// Liste des langues qui ont réellement un PDF, langue courante en premier
const available = computed(() => {
  const order: Array<'fr' | 'en' | 'de'> = [
    props.lang,
    ...(['fr', 'en', 'de'] as const).filter((l) => l !== props.lang),
  ];
  return order
    .filter((code) => props.pdfs?.[code])
    .map((code) => ({ code, label: langLabels[code], url: props.pdfs![code]! }));
});

// Fermer au clic extérieur / Échap
function onDocClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.biodl')) open.value = false;
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}
onMounted(() => {
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKey);
});
onUnmounted(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onKey);
});
</script>

<style scoped>
.biodl {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Bouton — même style que l'ancien CTA (Ortica uppercase + soulignement) */
.biodl__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0 0 6px 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.875rem, 1.45vw, 1.5625rem);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #ffffff;
  border-bottom: 1px solid currentColor;
  transition: color 0.2s ease;
}

.biodl__toggle:hover {
  color: #DA7F52;
}

.biodl__arrow {
  display: inline-block;
  transition: transform 0.25s ease;
}

.biodl--open .biodl__arrow {
  transform: rotate(90deg);
}

/* Liste des langues */
.biodl__langs {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.9rem 0 0 0;
  padding: 0;
}

.biodl__lang {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.8125rem, 1.2vw, 1.125rem);
  letter-spacing: 0.03em;
  color: #BCB7A9;
  text-decoration: none;
  transition: color 0.2s ease;
}

.biodl__lang:hover {
  color: #DA7F52;
}

/* Transition d'ouverture */
.biodl-list-enter-active,
.biodl-list-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.biodl-list-enter-from,
.biodl-list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

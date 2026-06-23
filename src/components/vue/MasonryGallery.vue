<template>
  <div class="masonry-gallery" v-bind="$attrs">
    <!--
      Masonry en colonnes flex : les éléments sont répartis ligne par ligne
      (1·2·3 sur la 1re rangée, 4·5·6 sur la suivante…) pour respecter l'ordre
      de lecture défini par glisser-déposer dans Sanity.
    -->
    <div class="masonry">
      <div v-for="(col, c) in columnedItems" :key="c" class="masonry__col">
        <div
          v-for="entry in col"
          :key="entry.index"
          class="masonry__item"
        >
          <!-- Toujours un bouton : ouvre l'agrandissement (lightbox) -->
          <button
            type="button"
            class="masonry__link"
            :aria-label="`${entry.item.caption || `Image ${entry.index + 1}`} — ${t.enlarge}`"
            @click="openLightbox(entry.index)"
          >
            <div
              class="masonry__img-wrap"
              :class="{ 'masonry__img-wrap--video': isVideo(entry.item) }"
            >
              <img
                :src="entry.item.image"
                :srcset="entry.item.srcset"
                sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                :alt="entry.item.caption || ''"
                class="masonry__img"
                :loading="entry.index < 6 ? 'eager' : 'lazy'"
                :fetchpriority="entry.index < 3 ? 'high' : 'auto'"
                decoding="async"
              />
              <div class="masonry__overlay">
                <span v-if="entry.item.caption" class="masonry__caption">{{ entry.item.caption }}</span>
                <span class="masonry__hint">
                  <svg v-if="isVideo(entry.item)" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="lightboxIndex !== null"
      class="lightbox"
      @click.self="closeLightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="`Image ${lightboxIndex + 1} sur ${items.length}`"
    >
      <button class="lightbox__close" @click="closeLightbox" aria-label="Fermer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button v-if="lightboxIndex > 0" class="lightbox__prev" @click="lightboxIndex--" aria-label="Précédent">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div class="lightbox__stage" @click.self="closeLightbox">
        <div v-if="activeVideoEmbed" class="lightbox__video-wrap">
          <iframe
            :src="activeVideoEmbed"
            class="lightbox__video"
            title="Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
          />
        </div>
        <img
          v-else
          :src="items[lightboxIndex]?.image"
          :srcset="items[lightboxIndex]?.srcset"
          sizes="90vw"
          :alt="items[lightboxIndex]?.caption || ''"
          class="lightbox__img"
          decoding="async"
        />
        <!-- Légende + actions (téléchargement, lien source) -->
        <div class="lightbox__bar">
          <span v-if="items[lightboxIndex]?.caption" class="lightbox__caption">
            {{ items[lightboxIndex]?.caption }}
          </span>
          <div class="lightbox__actions">
            <button
              v-if="items[lightboxIndex]?.downloadUrl"
              type="button"
              class="lightbox__download"
              :disabled="downloading"
              :aria-label="`${t.download} — ${items[lightboxIndex]?.caption || 'photo'}`"
              @click="triggerDownload(
                items[lightboxIndex]!.downloadUrl!,
                downloadFilename(items[lightboxIndex]!.downloadUrl!, lightboxIndex ?? 0)
              )"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path d="M12 3v13M5 14l7 7 7-7"/><line x1="3" y1="21" x2="21" y2="21"/>
              </svg>
              {{ downloading ? t.downloading : t.download }}
            </button>
            <a
              v-if="items[lightboxIndex]?.href && !activeVideoEmbed"
              :href="items[lightboxIndex]?.href"
              target="_blank"
              rel="noopener noreferrer"
              class="lightbox__source"
            >
              {{ t.readArticle }} →
            </a>
          </div>
        </div>
      </div>

      <button v-if="lightboxIndex < items.length - 1" class="lightbox__next" @click="lightboxIndex++" aria-label="Suivant">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

defineOptions({
  inheritAttrs: false,
});

interface GalleryItem {
  type?: 'photo' | 'video';
  image: string;
  srcset?: string;
  downloadUrl?: string;
  caption?: string;
  href?: string;
}

const props = withDefaults(defineProps<{
  items: GalleryItem[];
  lang?: 'fr' | 'en' | 'de';
}>(), {
  lang: 'fr',
});

const i18n = {
  fr: { enlarge: 'agrandir', readArticle: "Lire l'article", download: 'Télécharger', downloading: '...' },
  en: { enlarge: 'enlarge',  readArticle: 'Read the article', download: 'Download', downloading: '...' },
  de: { enlarge: 'vergrößern', readArticle: 'Artikel lesen', download: 'Herunterladen', downloading: '...' },
} as const;

const t = computed(() => i18n[props.lang] ?? i18n.fr);

const lightboxIndex = ref<number | null>(null);
const windowWidth = ref(1200);
const downloading = ref(false);

const activeItem = computed(() => (
  lightboxIndex.value === null ? undefined : props.items[lightboxIndex.value]
));

const activeVideoEmbed = computed(() => (
  activeItem.value ? getVideoEmbedUrl(activeItem.value) : null
));

function isVideo(item?: GalleryItem) {
  return item?.type === 'video' && Boolean(getVideoEmbedUrl(item));
}

function getVideoEmbedUrl(item: GalleryItem) {
  if (item.type !== 'video' || !item.href) return null;

  try {
    const url = new URL(item.href);
    const hostname = url.hostname.replace(/^www\./, '');

    if (hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
    }

    if (hostname.endsWith('youtube.com')) {
      const id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
    }

    if (hostname.endsWith('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function downloadFilename(url: string, index: number) {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const ext = pathname.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
    return `vinciane-vinckenbosch-photo-${index + 1}.${ext}`;
  } catch {
    return `vinciane-vinckenbosch-photo-${index + 1}.jpg`;
  }
}

async function triggerDownload(url: string, filename: string) {
  if (downloading.value) return;
  downloading.value = true;
  try {
    const downloadUrl = new URL('/api/download-image', window.location.origin);
    downloadUrl.searchParams.set('url', url);
    downloadUrl.searchParams.set('filename', filename);

    const a = document.createElement('a');
    a.href = downloadUrl.toString();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    // Fallback : ouvre l'image dans un nouvel onglet
    window.open(url, '_blank');
  } finally {
    downloading.value = false;
  }
}

const columns = computed(() => {
  if (windowWidth.value < 640) return 1;
  if (windowWidth.value < 1024) return 2;
  return 3;
});

/**
 * Répartit les éléments dans N colonnes en round-robin (élément i → colonne i % N).
 * Résultat : remplissage ligne par ligne (1·2·3 puis 4·5·6…) tout en conservant
 * la vraie masonry (chaque colonne empile ses images à hauteur variable).
 * `index` = position d'origine → la lightbox navigue dans l'ordre Sanity.
 */
const columnedItems = computed(() => {
  const cols: Array<Array<{ item: GalleryItem; index: number }>> = Array.from(
    { length: columns.value },
    () => [],
  );
  props.items.forEach((item, index) => {
    cols[index % columns.value].push({ item, index });
  });
  return cols;
});

function openLightbox(i: number) {
  lightboxIndex.value = i;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxIndex.value = null;
  document.body.style.overflow = '';
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight' && lightboxIndex.value < props.items.length - 1) lightboxIndex.value++;
  if (e.key === 'ArrowLeft' && lightboxIndex.value > 0) lightboxIndex.value--;
}

function onResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.masonry-gallery {
  display: block;
}

.masonry {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.masonry__col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.masonry__item {
  /* gap géré par la colonne flex */
}

/* Bouton réinitialisé */
.masonry__link {
  display: block;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: left;
}

.masonry__img-wrap {
  position: relative;
  overflow: hidden;
}

.masonry__img-wrap--video {
  aspect-ratio: 16 / 9;
}

.masonry__img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
}

.masonry__img-wrap--video .masonry__img {
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.masonry__link:hover .masonry__img {
  transform: scale(1.03);
}

/* Overlay : légende (bas gauche) + icône agrandir (bas droite) */
.masonry__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(transparent 55%, rgba(35, 35, 35, 0.75));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.masonry__link:hover .masonry__overlay,
.masonry__link:focus-visible .masonry__overlay {
  opacity: 1;
}

.masonry__caption {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: 0.8125rem;
  color: #F7F5F3;
}

.masonry__hint {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(247, 245, 243, 0.6);
  color: #F7F5F3;
  backdrop-filter: blur(4px);
}

.masonry__hint svg {
  display: block;
}

/* Mobile / tactile : overlay toujours visible (pas de hover) */
@media (hover: none), (max-width: 768px) {
  .masonry__overlay { opacity: 1; }
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(35, 35, 35, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox__img {
  max-width: 90vw;
  /* laisse la place à la barre légende/source dessous */
  max-height: 80vh;
  object-fit: contain;
}

.lightbox__video-wrap {
  width: min(90vw, 1180px);
  aspect-ratio: 16 / 9;
  background: #000;
}

.lightbox__video {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}

/* Barre sous l'image : légende à gauche, actions à droite */
.lightbox__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  max-width: 90vw;
  width: 100%;
}

.lightbox__caption {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: 0.9375rem;
  color: #BCB7A9;
}

.lightbox__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.lightbox__download,
.lightbox__source {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.5em 1.2em;
  border: 1px solid rgba(247, 245, 243, 0.55);
  border-radius: 9999px;
  font-family: "Ortica Linear", Georgia, serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #F7F5F3;
  text-decoration: none;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.lightbox__download:hover,
.lightbox__source:hover {
  background-color: #F7F5F3;
  color: #232323;
  border-color: #F7F5F3;
}

.lightbox__download:disabled {
  opacity: 0.5;
  cursor: wait;
}

/* Reset bouton → même apparence que le lien */
.lightbox__download {
  background: none;
  cursor: pointer;
}

.lightbox__close,
.lightbox__prev,
.lightbox__next {
  position: absolute;
  background: none;
  border: none;
  color: #F7F5F3;
  cursor: pointer;
  padding: 0.75rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.lightbox__close:hover,
.lightbox__prev:hover,
.lightbox__next:hover {
  opacity: 1;
}

.lightbox__close { top: 1.5rem; right: 1.5rem; }
.lightbox__prev  { left: 1.5rem; top: 50%; transform: translateY(-50%); }
.lightbox__next  { right: 1.5rem; top: 50%; transform: translateY(-50%); }
</style>

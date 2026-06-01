<template>
  <div class="masonry-gallery" v-bind="$attrs">
    <div class="masonry" :style="{ columnCount: columns }">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="masonry__item"
      >
        <component
          :is="item.href ? 'a' : 'div'"
          :href="item.href"
          :target="item.href ? '_blank' : undefined"
          :rel="item.href ? 'noopener noreferrer' : undefined"
          class="masonry__link"
          :aria-label="item.caption || `Image ${i + 1}`"
          @click="!item.href && openLightbox(i)"
        >
          <div class="masonry__img-wrap">
            <img
              :src="item.image"
              :alt="item.caption || ''"
              class="masonry__img"
              loading="lazy"
              decoding="async"
            />
            <div v-if="item.caption" class="masonry__caption">{{ item.caption }}</div>
          </div>
        </component>
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
      <img
        :src="items[lightboxIndex]?.image"
        :alt="items[lightboxIndex]?.caption || ''"
        class="lightbox__img"
      />
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
  image: string;
  caption?: string;
  href?: string;
}

const props = withDefaults(defineProps<{
  items: GalleryItem[];
  enableLightbox?: boolean;
}>(), {
  enableLightbox: false,
});

const lightboxIndex = ref<number | null>(null);
const windowWidth = ref(1200);

const columns = computed(() => {
  if (windowWidth.value < 640) return 1;
  if (windowWidth.value < 1024) return 2;
  return 3;
});

function openLightbox(i: number) {
  if (!props.enableLightbox) return;
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
  column-gap: 1rem;
}

.masonry__item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

.masonry__link {
  display: block;
  cursor: pointer;
  text-decoration: none;
}

.masonry__img-wrap {
  position: relative;
  overflow: hidden;
}

.masonry__img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
}

.masonry__link:hover .masonry__img {
  transform: scale(1.03);
}

.masonry__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  background: linear-gradient(transparent, rgba(35, 35, 35, 0.7));
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: 0.8125rem;
  color: #F7F5F3;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.masonry__link:hover .masonry__caption {
  opacity: 1;
}

/* Mobile : pas de hover → captions toujours visibles */
@media (hover: none), (max-width: 768px) {
  .masonry__caption {
    opacity: 1;
  }
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

.lightbox__img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
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

import { createClient } from '@sanity/client';

const configuredProjectId = import.meta.env.SANITY_PROJECT_ID;
const projectId = /^[a-z0-9-]+$/.test(configuredProjectId ?? '')
  ? configuredProjectId
  : 'placeholder';
const dataset = import.meta.env.SANITY_DATASET ?? 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: import.meta.env.SANITY_API_VERSION ?? '2024-01-01',
  // false → le build récupère toujours le contenu le plus à jour (pas le cache CDN).
  // Important : le site est régénéré à chaque publication via webhook.
  useCdn: false,
});

export function createSanityPreviewClient() {
  const token = import.meta.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error('SANITY_API_TOKEN is required for draft preview.');
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: import.meta.env.SANITY_API_VERSION ?? '2024-01-01',
    useCdn: false,
    token,
    perspective: 'drafts',
  });
}

export function imageUrl(ref: string): string {
  // Parse Sanity image ref: image-{id}-{width}x{height}-{format}
  const [, id, dimensions, format] = ref.split('-');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
}

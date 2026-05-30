import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? 'placeholder',
  dataset: import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: import.meta.env.SANITY_API_VERSION ?? '2024-01-01',
  useCdn: true,
});

export function imageUrl(ref: string): string {
  const projectId = import.meta.env.SANITY_PROJECT_ID ?? 'placeholder';
  const dataset = import.meta.env.SANITY_DATASET ?? 'production';
  // Parse Sanity image ref: image-{id}-{width}x{height}-{format}
  const [, id, dimensions, format] = ref.split('-');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
}

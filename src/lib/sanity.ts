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
  useCdn: true,
});

export function imageUrl(ref: string): string {
  // Parse Sanity image ref: image-{id}-{width}x{height}-{format}
  const [, id, dimensions, format] = ref.split('-');
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
}

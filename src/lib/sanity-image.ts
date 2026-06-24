import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './sanity';

/**
 * Helpers pour les images Sanity CDN.
 *
 * Le CDN Sanity (cdn.sanity.io) supporte des transformations à la volée via
 * des query params — pas de package supplémentaire nécessaire.
 *
 * Deux cas d'usage :
 *
 * 1. AFFICHAGE WEB → sanityImageUrl / sanityImageSrcset
 *    Paramètres : auto=format (WebP/AVIF), w=N, q=95
 *    Usage : attributs src/srcset des <img> dans la page
 *
 * 2. TÉLÉCHARGEMENT PROFESSIONNEL → sanityDownloadUrl
 *    Aucun paramètre → Sanity sert le fichier ORIGINAL (JPEG pleine résolution,
 *    qualité 100%, sans recadrage).
 *    Usage : attribut href des liens <a download> dans les dossiers de presse.
 */

const DEFAULT_QUALITY = 95;
const SRCSET_WIDTHS = [640, 960, 1400, 1800, 2400, 3200, 3840] as const;

type SanityImageSource = string | {
  _type?: 'image';
  url?: string;
  asset?: {
    _ref?: string;
    url?: string;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
};

const builder = createImageUrlBuilder(sanityClient);

function isSanityImageObject(source: SanityImageSource): source is Exclude<SanityImageSource, string> {
  return typeof source === 'object' && Boolean(source?.asset?._ref);
}

function sourceUrl(source: SanityImageSource): string {
  return typeof source === 'string' ? source : (source.url || source.asset?.url || '');
}

/**
 * Ajoute les paramètres d'optimisation à une URL Sanity CDN pour l'affichage.
 * Laisse les URLs non-Sanity (public/, fallback) intactes.
 */
export function sanityImageUrl(
  source: SanityImageSource,
  width?: number,
  quality = DEFAULT_QUALITY,
): string {
  if (isSanityImageObject(source)) {
    let imageBuilder = builder.image(source).auto('format').quality(quality).fit('max');
    if (width) imageBuilder = imageBuilder.width(width);
    return imageBuilder.url();
  }

  const url = sourceUrl(source);
  if (!url || !url.includes('cdn.sanity.io')) return url;

  const optimizedUrl = new URL(url);
  const params = optimizedUrl.searchParams;
  params.set('auto', 'format');
  params.set('q', String(quality));
  params.set('fit', 'max');
  if (width) params.set('w', String(width));

  return optimizedUrl.toString();
}

export function sanityImageCropUrl(
  source: SanityImageSource,
  width: number,
  aspectRatio: number,
  quality = DEFAULT_QUALITY,
): string {
  const height = Math.round(width / aspectRatio);

  if (isSanityImageObject(source)) {
    return builder
      .image(source)
      .auto('format')
      .quality(quality)
      .fit('crop')
      .width(width)
      .height(height)
      .url();
  }

  const url = sourceUrl(source);
  if (!url || !url.includes('cdn.sanity.io')) return url;

  const optimizedUrl = new URL(url);
  const params = optimizedUrl.searchParams;
  params.set('auto', 'format');
  params.set('q', String(quality));
  params.set('fit', 'crop');
  params.set('w', String(width));
  params.set('h', String(height));

  return optimizedUrl.toString();
}

/**
 * Génère un attribut srcset responsive depuis une URL Sanity CDN.
 * Ex : "https://cdn.sanity.io/...jpg?auto=format&w=400 400w, ...2000w"
 */
export function sanityImageSrcset(
  source: SanityImageSource,
  widths: readonly number[] = SRCSET_WIDTHS,
): string {
  const url = sourceUrl(source);
  if (!url || !url.includes('cdn.sanity.io')) return '';
  return widths
    .map((w) => `${sanityImageUrl(source, w)} ${w}w`)
    .join(', ');
}

export function sanityImageCropSrcset(
  source: SanityImageSource,
  aspectRatio: number,
  widths: readonly number[] = SRCSET_WIDTHS,
): string {
  const url = sourceUrl(source);
  if (!url || !url.includes('cdn.sanity.io')) return '';
  return widths
    .map((w) => `${sanityImageCropUrl(source, w, aspectRatio)} ${w}w`)
    .join(', ');
}

export function sanityImageObjectPosition(source: SanityImageSource): string | undefined {
  if (!isSanityImageObject(source)) return undefined;
  const x = source.hotspot?.x;
  const y = source.hotspot?.y;
  if (typeof x !== 'number' || typeof y !== 'number') return undefined;
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}

/**
 * Retourne l'URL Sanity originale, sans aucun paramètre de transformation.
 * → JPEG (ou PNG) pleine résolution, qualité 100%, pour téléchargement professionnel.
 *
 * Utilisation dans un lien de téléchargement :
 *   <a href={sanityDownloadUrl(rawUrl)} download="photo-vinciane.jpg">
 *     Télécharger la photo (haute résolution)
 *   </a>
 *
 * Pour les images en public/ (déjà des fichiers locaux), retourne l'URL telle quelle.
 */
export function sanityDownloadUrl(url: string): string {
  if (!url) return url;
  // Supprimer tout paramètre éventuel, ne garder que le chemin Sanity CDN
  return url.split('?')[0];
}

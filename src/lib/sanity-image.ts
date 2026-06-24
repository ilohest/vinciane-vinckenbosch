/**
 * Helpers pour les images Sanity CDN.
 *
 * Le CDN Sanity (cdn.sanity.io) supporte des transformations à la volée via
 * des query params — pas de package supplémentaire nécessaire.
 *
 * Deux cas d'usage :
 *
 * 1. AFFICHAGE WEB → sanityImageUrl / sanityImageSrcset
 *    Paramètres : auto=format (WebP/AVIF), w=N (resize), q=92, fit=max
 *    Usage : attributs src/srcset des <img> dans la page
 *
 * 2. TÉLÉCHARGEMENT PROFESSIONNEL → sanityDownloadUrl
 *    Aucun paramètre → Sanity sert le fichier ORIGINAL (JPEG pleine résolution,
 *    qualité 100%, sans recadrage).
 *    Usage : attribut href des liens <a download> dans les dossiers de presse.
 */

const DEFAULT_QUALITY = 92;
const SRCSET_WIDTHS = [640, 960, 1400, 1800, 2400, 3200, 3840] as const;

/**
 * Ajoute les paramètres d'optimisation à une URL Sanity CDN pour l'affichage.
 * Laisse les URLs non-Sanity (public/, fallback) intactes.
 */
export function sanityImageUrl(
  url: string,
  width?: number,
  quality = DEFAULT_QUALITY,
): string {
  if (!url || !url.includes('cdn.sanity.io')) return url;

  const optimizedUrl = new URL(url);
  const params = optimizedUrl.searchParams;
  params.set('auto', 'format');
  params.set('q', String(quality));
  params.set('fit', 'max');
  if (width) params.set('w', String(width));

  return optimizedUrl.toString();
}

/**
 * Génère un attribut srcset responsive depuis une URL Sanity CDN.
 * Ex : "https://cdn.sanity.io/...jpg?auto=format&w=400 400w, ...2000w"
 */
export function sanityImageSrcset(
  url: string,
  widths: readonly number[] = SRCSET_WIDTHS,
): string {
  if (!url || !url.includes('cdn.sanity.io')) return '';
  return widths
    .map((w) => `${sanityImageUrl(url, w)} ${w}w`)
    .join(', ');
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

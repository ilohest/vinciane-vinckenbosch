import { sanityClient } from './sanity';
import type { Homepage, HeroEventTeaser, SiteSettings } from './types';
import { sanityImageUrl, sanityImageSrcset, sanityDownloadUrl } from './sanity-image';

type QueryClient = Pick<typeof sanityClient, 'fetch'>;

/** Crédits photo par défaut (utilisés tant que Sanity n'est pas rempli) */
export const DEFAULT_PHOTO_CREDITS: string[] = ['Andrej Grilc'];

/** Récupère les paramètres du site (crédits photo + texte intro) */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await sanityClient.fetch<SiteSettings | null>(
      `*[_type == "siteSettings"][0]{ creditsIntro, photoCredits }`
    );
    if (data) return data;
  } catch {
    // silencieux → fallback
  }
  return { photoCredits: DEFAULT_PHOTO_CREDITS };
}

export async function getHomepage(client: QueryClient = sanityClient): Promise<Homepage | null> {
  try {
    return await client.fetch(`*[_type == "homepage"][0]{
      "heroImage":           heroImage { "url": asset->url },
      "heroVideo":           heroVideo { "url": asset->url },
      "heroMobileImage":     heroMobileImage { "url": asset->url },
      "heroMobileVideo":     heroMobileVideo { "url": asset->url },
      heroQuote,
      heroQuoteAttribution,
      heroEvents[]->{ _id, date, city, country },
      quote2Text,
      quote2Attribution,
      "biographyPdfs": {
        "fr": biographyPdfs.fr.asset->url,
        "en": biographyPdfs.en.asset->url,
        "de": biographyPdfs.de.asset->url
      },
      "biographyIntroImage": biographyIntroImage { "url": asset->url },
      "bioImage2":           bioImage2           { "url": asset->url },
      "trioImageNarrow":     trioImageNarrow     { "url": asset->url },
      "trioImageWide":       trioImageWide       { "url": asset->url },
      "bioImage3":           bioImage3           { "url": asset->url },
      "bioFormationImage":   bioFormationImage   { "url": asset->url },
      "finalImage":          finalImage          { "url": asset->url },
      bioTrioText,
      trioLinks[]{ label, url, "pdf": pdf.asset->url, "pdfName": pdf.asset->originalFilename },
      bioParaOrchestre,
      bioParaPrix,
      bioParaFestivals,
      bioParaSoliste,
      bioParaTonkuenstler,
      bioParaBacri,
      bioParaFormationViolon,
      bioParaFormationAlto,
      bioParaMaitres,
      bioParaPedagogie,
      "contactGalleryImages": contactGalleryImages[]{ "url": asset->url },
      contactVideoUrl,
      "contactVideoThumbnail": contactVideoThumbnail { "url": asset->url },
      socialLinks
    }`);
  } catch {
    return null;
  }
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getHeroEvents(limit = 3, client: QueryClient = sanityClient): Promise<HeroEventTeaser[]> {
  try {
    const homepage = await client.fetch<Pick<Homepage, 'heroEvents'> | null>(
      `*[_type == "homepage"][0]{
        heroEvents[]->{
          _id,
          date,
          city,
          country
        }
      }`
    );

    const selectedEvents = homepage?.heroEvents?.filter((event) => event?.date && event?.city && event?.country) ?? [];
    if (selectedEvents.length > 0) {
      return selectedEvents.slice(0, limit);
    }

    // Sinon : concerts à venir cochés « Mettre en avant » (isFeatured)
    const featured = await client.fetch<HeroEventTeaser[]>(
      `*[_type == "event" && isFeatured == true && defined(date) && defined(city) && defined(country) && date >= $today]
        | order(date asc) [0...$limit]{ _id, date, city, country }`,
      { today: todayIsoDate(), limit }
    );
    if (featured.length > 0) {
      return featured;
    }

    // Sinon : prochains concerts automatiquement
    return await client.fetch<HeroEventTeaser[]>(
      `*[_type == "event" && defined(date) && defined(city) && defined(country) && date >= $today]
        | order(date asc) [0...$limit]{
          _id,
          date,
          city,
          country
        }`,
      { today: todayIsoDate(), limit }
    );
  } catch {
    return [];
  }
}

/** Événement formaté pour le composant Vue AgendaSection (champs plats) */
export interface AgendaEvent {
  date: string;        // "21 mai 2026" (français lisible)
  time?: string;       // "20h" / "19h30"
  city: string;        // "Lyon, FR"
  venue: string;
  role: string;
  program?: string[];  // ["Œuvre — Compositeur", …]
  ticketUrl?: string;
}

/** Mois FR compatibles avec le parseur de dates du composant Vue */
const FR_MONTHS = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];

/** "2026-05-21" → "21 mai 2026" */
function isoToReadable(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${FR_MONTHS[m - 1] ?? ''} ${y}`;
}

/** "20:00" → "20h" · "19:30" → "19h30" */
function formatTime(time?: string): string | undefined {
  if (!time) return undefined;
  const [h, min] = time.split(':');
  return min && min !== '00' ? `${Number(h)}h${min}` : `${Number(h)}h`;
}

function normalizeExternalUrl(url?: string): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;

  return /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
}

interface RawSanityEvent {
  date?: string;
  time?: string;
  city?: string;
  country?: string;
  venue?: { fr?: string; en?: string; de?: string };
  role?: { fr?: string; en?: string; de?: string };
  program?: Array<{ composer?: string; piece?: { fr?: string; en?: string; de?: string } | string }>;
  ticketUrl?: string;
}

/**
 * Récupère TOUS les concerts depuis Sanity, formatés pour le composant Vue.
 * Retourne [] si Sanity est vide → le composant affiche son état vide.
 */
export async function getAgendaEvents(
  lang: 'fr' | 'en' | 'de' = 'fr',
  client: QueryClient = sanityClient,
): Promise<AgendaEvent[]> {
  try {
    const raw = await client.fetch<RawSanityEvent[] | null>(
      `*[_type == "event" && defined(date)] | order(date asc){
        date, time, city, country, venue, role,
        program[]{ composer, piece },
        ticketUrl
      }`
    );

    if (!raw || raw.length === 0) return [];

    return raw.map((e) => ({
      date: isoToReadable(e.date),
      time: formatTime(e.time),
      city: e.country ? `${e.city}, ${e.country}` : (e.city ?? ''),
      venue: e.venue?.[lang] || e.venue?.fr || '',
      role: e.role?.[lang] || e.role?.fr || '',
      program: (e.program ?? [])
        .map((p) => {
          const piece = typeof p.piece === 'object' && p.piece !== null
            ? (p.piece[lang] || p.piece.fr || p.piece.en || p.piece.de || '')
            : (p.piece ?? '');
          return [piece, p.composer].filter(Boolean).join(' — ');
        })
        .filter(Boolean),
      ticketUrl: normalizeExternalUrl(e.ticketUrl),
    }));
  } catch {
    return [];
  }
}

/** Élément prêt à afficher dans la galerie media */
export interface MediaGalleryItem {
  type?: 'photo' | 'video';
  image?: string;
  srcset?: string;
  downloadUrl?: string;
  caption?: string;
  href?: string;
}

function getYouTubeThumbnail(videoUrl?: string): string | undefined {
  if (!videoUrl) return undefined;

  try {
    const url = new URL(videoUrl);
    const hostname = url.hostname.replace(/^www\./, '');

    if (hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
    }

    if (hostname.endsWith('youtube.com')) {
      const id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
      return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

/**
 * Récupère les médias depuis Sanity, formatés pour la galerie, dans l'ordre
 * défini par glisser-déposer (orderRank). Retourne [] si Sanity est vide.
 */
export async function getMediaGalleryItems(lang: 'fr' | 'en' | 'de' = 'fr'): Promise<MediaGalleryItem[]> {
  try {
    const items = await sanityClient.fetch<Array<{
      type?: 'photo' | 'video';
      image?: string;
      credit?: string;
      videoUrl?: string;
    }> | null>(
      `*[
        _type == "mediaItem"
        && !(_id in path("drafts.**"))
        && (defined(image) || (type == "video" && defined(videoUrl)))
      ] | order(coalesce(orderRank, "zzzzzz") asc, _createdAt asc){
        type,
        "image": image.asset->url,
        credit,
        videoUrl
      }`
    );

    if (!items || items.length === 0) return [];

    return items
      .map((i) => {
        const type = i.type === 'video' ? 'video' : 'photo';
        const rawUrl = i.image;
        const fallbackThumbnail = type === 'video' ? getYouTubeThumbnail(i.videoUrl) : undefined;
        const image = rawUrl ? sanityImageUrl(rawUrl, 1600) : fallbackThumbnail;

        if (!image && type !== 'video') return null;

        return {
          type,
          image,
          srcset:      rawUrl ? sanityImageSrcset(rawUrl) || undefined : undefined,
          downloadUrl: type === 'video' || !rawUrl ? undefined : sanityDownloadUrl(rawUrl),
          caption:     i.credit || undefined,
          href:        i.videoUrl || undefined,
        };
      })
      .filter((item): item is MediaGalleryItem => Boolean(item));
  } catch {
    return [];
  }
}

/** Élément prêt à afficher dans la galerie presse */
export interface PressGalleryItem {
  image: string;
  srcset?: string;
  caption: string;
  href?: string;
}

/**
 * Récupère les articles de presse depuis Sanity, formatés pour la galerie.
 * Retourne [] si Sanity est vide → la page utilise alors son fallback codé en dur.
 */
export async function getPressGalleryItems(): Promise<PressGalleryItem[]> {
  try {
    const items = await sanityClient.fetch<Array<{
      images?: string[];
      date?: string;
      headline?: string;
      articleUrl?: string;
    }> | null>(
      `*[_type == "pressItem" && count(images) > 0 && !(_id in path("drafts.**"))] | order(coalesce(orderRank, "zzzzzz") asc, _createdAt asc){
        "images": images[].asset->url,
        date,
        headline,
        articleUrl
      }`
    );

    if (!items || items.length === 0) return [];

    // Chaque article peut avoir plusieurs images → on les déplie en tuiles,
    // toutes partageant la même légende (titre — date) et le même lien.
    return items.flatMap((i) => {
      const caption = [i.headline, i.date].filter(Boolean).join(' — ');
      return (i.images ?? [])
        .filter(Boolean)
        .map((rawUrl) => ({
          image:  sanityImageUrl(rawUrl),
          srcset: sanityImageSrcset(rawUrl) || undefined,
          caption,
          href:   i.articleUrl || undefined,
        }));
    });
  } catch {
    return [];
  }
}

// ── Type minimal pour les blocs Portable Text ─────────────────────────────
export interface PTBlock {
  _type: string;
  style?: string;
  children?: Array<{ _type: string; text?: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
}

export interface LocalizedBlocks {
  fr?: PTBlock[];
  en?: PTBlock[];
  de?: PTBlock[];
}

export async function getLegalNotice(): Promise<{ content?: LocalizedBlocks } | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "legalNotice"][0]{ content }`
    );
  } catch {
    return null;
  }
}

export async function getPrivacyPolicy(): Promise<{ content?: LocalizedBlocks } | null> {
  try {
    return await sanityClient.fetch(
      `*[_type == "privacyPolicy"][0]{ content }`
    );
  } catch {
    return null;
  }
}

import { sanityClient } from './sanity';
import type { Homepage, Event, HeroEventTeaser, MediaItem, PressItem } from './types';

export async function getHomepage(): Promise<Homepage | null> {
  try {
    return await sanityClient.fetch(`*[_type == "homepage"][0]{
      heroImage { asset->{ url }, alt },
      heroQuote,
      heroQuoteAttribution,
      heroEvents[]->{
        _id,
        date,
        city,
        country
      },
      biographyIntroImage { asset->{ url }, alt },
      biographySections[] {
        image { asset->{ url }, alt },
        imagePosition,
        "textBlocks": textBlocks
      },
      biographyPDFUrl,
      quote2Text,
      quote2Attribution,
      contactEmail,
      contactVideoUrl,
      socialLinks
    }`);
  } catch {
    return null;
  }
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getHeroEvents(limit = 3): Promise<HeroEventTeaser[]> {
  try {
    const homepage = await sanityClient.fetch<Pick<Homepage, 'heroEvents'> | null>(
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

    return await sanityClient.fetch<HeroEventTeaser[]>(
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

export async function getFeaturedEvents(limit = 5): Promise<Event[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "event"] | order(date asc) [0...$limit]`,
      { limit }
    );
  } catch {
    return [];
  }
}

export async function getMediaItems(): Promise<MediaItem[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "mediaItem"] | order(order asc)`
    );
  } catch {
    return [];
  }
}

export async function getPressItems(): Promise<PressItem[]> {
  try {
    return await sanityClient.fetch(
      `*[_type == "pressItem"] | order(order asc)`
    );
  } catch {
    return [];
  }
}

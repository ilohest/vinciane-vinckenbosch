import { sanityClient } from './sanity';
import type { Homepage, Event, MediaItem, PressItem } from './types';

export async function getHomepage(): Promise<Homepage | null> {
  try {
    return await sanityClient.fetch(`*[_type == "homepage"][0]{
      heroImage { asset->{ url }, alt },
      heroQuote,
      heroQuoteAttribution,
      upcomingDatesTeaser,
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
      socialLinks
    }`);
  } catch {
    return null;
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

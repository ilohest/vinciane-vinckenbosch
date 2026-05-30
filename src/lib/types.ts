export type Lang = 'fr' | 'en' | 'de';

export interface LocalizedString {
  fr: string;
  en: string;
  de: string;
}

export interface LocalizedText {
  fr: string;
  en: string;
  de: string;
}

export interface SanityImageAsset {
  _type: 'image';
  asset: { _ref: string; url: string };
  alt?: LocalizedString;
}

export interface Event {
  _id: string;
  date: string;
  time: string;
  city: string;
  country: string;
  venue: LocalizedString;
  role: LocalizedString;
  program: Array<{ composer: string; piece: string }>;
  isFeatured: boolean;
}

export interface BiographyBlock {
  image: SanityImageAsset;
  imagePosition: 'left' | 'right';
  textBlocks: LocalizedText[];
}

export interface Homepage {
  heroImage: SanityImageAsset;
  heroQuote: LocalizedText;
  heroQuoteAttribution: string;
  upcomingDatesTeaser: string[];
  biographyIntroImage: SanityImageAsset;
  biographySections: BiographyBlock[];
  biographyPDFUrl: string;
  quote2Text: LocalizedText;
  quote2Attribution: string;
  contactEmail: string;
  socialLinks: {
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface MediaItem {
  _id: string;
  type: 'photo' | 'video';
  image: SanityImageAsset;
  videoUrl?: string;
  caption?: LocalizedString;
  credit?: string;
  order: number;
}

export interface PressItem {
  _id: string;
  screenshot: SanityImageAsset;
  articleUrl: string;
  publication: string;
  date?: string;
  headline?: string;
  order: number;
}

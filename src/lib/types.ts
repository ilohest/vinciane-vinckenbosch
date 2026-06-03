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

export interface HeroEventTeaser {
  _id: string;
  date: string;
  city: string;
  country: string;
}

export interface Homepage {
  heroImage?: SanityImageAsset;
  heroQuote?: LocalizedText;
  heroQuoteAttribution?: string;
  heroEvents?: HeroEventTeaser[];
  quote2Text?: LocalizedText;
  quote2Attribution?: string;
  biographyPdfs?: { fr?: string; en?: string; de?: string };

  // Images biographie (dans l'ordre d'apparition sur la page)
  biographyIntroImage?: SanityImageAsset; // ② à droite du titre BIOGRAPHIE
  bioImage2?: SanityImageAsset;           // ③ portrait gauche paragraphes 1-2
  trioImageNarrow?: SanityImageAsset;     // ④ Trio Linaris portrait étroit
  trioImageWide?: SanityImageAsset;       // ⑤ Trio Linaris panoramique
  bioImage3?: SanityImageAsset;           // ⑥ portrait gauche paragraphes formation
  bioFormationImage?: SanityImageAsset;   // ⑦ paysage colonne formation droite
  finalImage?: SanityImageAsset;          // ⑧ grande photo finale bas de page

  // Texte Trio Linaris
  bioTrioText?: LocalizedText;

  // Paragraphes biographie
  bioParaOrchestre?: LocalizedText;
  bioParaPrix?: LocalizedText;
  bioParaFestivals?: LocalizedText;
  bioParaSoliste?: LocalizedText;
  bioParaTonkuenstler?: LocalizedText;
  bioParaBacri?: LocalizedText;
  bioParaFormationViolon?: LocalizedText;
  bioParaFormationAlto?: LocalizedText;
  bioParaMaitres?: LocalizedText;
  bioParaPedagogie?: LocalizedText;

  // Contact
  contactGalleryImages?: SanityImageAsset[];
  contactVideoUrl?: string;
  contactVideoThumbnail?: SanityImageAsset;
  socialLinks?: { youtube?: string; facebook?: string; instagram?: string };
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
  images: SanityImageAsset[];
  articleUrl: string;
  date?: string;
  headline: string;
  order: number;
}

export interface SiteSettings {
  creditsIntro?: LocalizedString;
  photoCredits?: string[];
}

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
  url?: string;
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
  alt?: LocalizedString;
}

export interface SanityFileAsset {
  url: string;
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
}

export interface HeroEventTeaser {
  _id: string;
  date: string;
  city: string;
  country: string;
}

export interface Homepage {
  heroImage?: SanityImageAsset;
  heroVideo?: SanityFileAsset;
  heroMobileImage?: SanityImageAsset;
  heroMobileVideo?: SanityFileAsset;
  heroQuote?: LocalizedText;
  heroQuoteAttribution?: string;
  heroEvents?: HeroEventTeaser[];
  quote2Text?: LocalizedText;
  quote2Attribution?: LocalizedText | string;
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
  // Liens posés sur des noms de la phrase Trio Linaris (éditable dans Sanity).
  // Chaque entrée a un lien web (url) OU un PDF téléchargeable (pdf).
  trioLinks?: { label?: string; url?: string; pdf?: string; pdfName?: string }[];

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

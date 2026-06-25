import type { Lang, LocalizedString } from "./types";

export const LANGS: Lang[] = ["fr", "en", "de"];
export const DEFAULT_LANG: Lang = "fr";

export function t(obj: LocalizedString | undefined, lang: Lang): string {
  if (!obj) return "";
  return obj[lang] || obj[DEFAULT_LANG] || "";
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (LANGS.includes(lang as Lang)) return lang as Lang;
  return DEFAULT_LANG;
}

export function localePath(lang: Lang, path: string = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean === "/" ? "" : clean}`;
}

export const ui = {
  fr: {
    "nav.agenda": "agenda",
    "nav.contact": "contact",
    "nav.media": "media",
    "nav.presse": "presse",
    "nav.archives": "archives",
    "bio.title": "biographie",
    "bio.download": "télécharger la biographie →",
    "agenda.title": "agenda",
    "agenda.more": "à venir",
    "contact.title": "contact",
    "media.cta": "media",
    "media.video": "vidéo",
    "meta.description":
      "Vinciane Vinckenbosch, altiste belge. Soliste, chambriste, co-solo de la Niederbayerische Philharmonie.",
  },
  en: {
    "nav.agenda": "agenda",
    "nav.contact": "contact",
    "nav.media": "media",
    "nav.presse": "press",
    "nav.archives": "archives",
    "bio.title": "biography",
    "bio.download": "download biography →",
    "agenda.title": "agenda",
    "agenda.more": "upcoming",
    "contact.title": "contact",
    "media.cta": "media",
    "media.video": "video",
    "meta.description":
      "Vinciane Vinckenbosch, Belgian violist. Soloist, chamber musician, co-principal violist of the Niederbayerische Philharmonie.",
  },
  de: {
    "nav.agenda": "Termine",
    "nav.contact": "Kontakt",
    "nav.media": "Medien",
    "nav.presse": "Presse",
    "nav.archives": "Archiv",
    "bio.title": "Vita",
    "bio.download": "download Biografie →",
    "agenda.title": "Termine",
    "agenda.more": "mehr Termine",
    "contact.title": "Kontakt",
    "media.cta": "Medien",
    "media.video": "Video",
    "meta.description":
      "Vinciane Vinckenbosch, belgische Bratschistin. Solistin, Kammermusikerin, Co-Solobratschistin der Niederbayerischen Philharmonie.",
  },
} as const;

export type UIKey = keyof typeof ui.fr;

export function useTranslations(lang: Lang) {
  return function tr(key: UIKey): string {
    return (
      (ui[lang] as Record<string, string>)[key] ??
      (ui.fr as Record<string, string>)[key] ??
      key
    );
  };
}

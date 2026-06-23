import { defineType } from "sanity";

/**
 * Types de contenu localisés FR / EN / DE, partagés par tous les schémas.
 *
 * La forme stockée est toujours un objet `{ fr, en, de }` — identique à ce qui
 * existait avant ce refactor, donc compatible avec le contenu déjà saisi.
 *
 * - `localeString` → titres / textes courts (une ligne)
 * - `localeText`   → paragraphes (zone de texte multiligne)
 * - `localeBlock`  → texte riche (mentions légales, confidentialité…)
 *
 * Pour rendre une langue obligatoire, ajoutez la validation au niveau du champ :
 *   defineField({
 *     name: "venue", type: "localeString",
 *     validation: (R) => R.custom((v?: { fr?: string }) =>
 *       v?.fr?.trim() ? true : "Le français est obligatoire."),
 *   })
 */

export const localeString = defineType({
  name: "localeString",
  title: "Texte localisé (court)",
  type: "object",
  fields: [
    { name: "fr", title: "🇫🇷 Français", type: "string" },
    { name: "en", title: "🇬🇧 Anglais", type: "string" },
    { name: "de", title: "🇩🇪 Allemand", type: "string" },
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Texte localisé (long)",
  type: "object",
  fields: [
    { name: "fr", title: "🇫🇷 Français", type: "text", rows: 4 },
    { name: "en", title: "🇬🇧 Anglais", type: "text", rows: 4 },
    { name: "de", title: "🇩🇪 Allemand", type: "text", rows: 4 },
  ],
});

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Contenu localisé (texte riche)",
  type: "object",
  fields: [
    {
      name: "fr",
      title: "🇫🇷 Français",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titre", value: "h2" },
            { title: "Sous-titre", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Lien",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
    },
    {
      name: "en",
      title: "🇬🇧 Anglais",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Title", value: "h2" },
            { title: "Subtitle", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
    },
    {
      name: "de",
      title: "🇩🇪 Allemand",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titel", value: "h2" },
            { title: "Untertitel", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Fett", value: "strong" },
              { title: "Kursiv", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
    },
  ],
});

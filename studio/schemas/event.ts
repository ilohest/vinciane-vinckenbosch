import { defineField, defineType } from "sanity";
import { TimeInput } from "../components/TimeInput";
import { CountryInput } from "../components/CountryInput";
import { InfoNote } from "../components/InfoNote";

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "fr", title: "🇫🇷 Français", type: "string" },
      { name: "en", title: "🇬🇧 Anglais", type: "string" },
      { name: "de", title: "🇩🇪 Allemand", type: "string" },
    ],
  });

export const event = defineType({
  name: "event",
  title: "Concert / Événement",
  type: "document",
  fields: [
    defineField({
      name: "sortingNote",
      title: "💡 Tri automatique sur le site",
      type: "string",
      readOnly: true,
      description:
        "Pas besoin de respecter un ordre ici. Le site trie automatiquement : agenda → du plus proche au plus lointain, archives → du plus récent au plus ancien.",
      components: { field: InfoNote },
    }),

    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({
      name: "time",
      title: "Heure",
      type: "string",
      description: "Heure de début du concert.",
      components: { input: TimeInput },
    }),
    defineField({ name: "city", title: "Ville", type: "string" }),
    defineField({
      name: "country",
      title: "Pays",
      type: "string",
      description: "Tapez les premières lettres pour naviguer rapidement.",
      components: { input: CountryInput },
    }),
    localizedString("venue", "Salle / Lieu"),
    localizedString("role", "Rôle (Alto solo, Récital…)"),
    defineField({
      name: "program",
      title: "Programme",
      description:
        "Si l'œuvre est écrite dans une seule langue, elle apparaîtra sur les 3 langues du site. Remplissez les autres langues uniquement si le titre diffère.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "composer", title: "Compositeur", type: "string" },
            {
              name: "piece",
              title: "Œuvre",
              type: "object",
              fields: [
                { name: "fr", title: "🇫🇷 Français", type: "string" },
                { name: "en", title: "🇬🇧 Anglais", type: "string" },
                { name: "de", title: "🇩🇪 Allemand", type: "string" },
              ],
            },
          ],
          preview: {
            select: { title: "piece.fr", subtitle: "composer" },
            prepare: ({
              title,
              subtitle,
            }: {
              title?: string;
              subtitle?: string;
            }) => ({
              title: title ?? "(sans titre)",
              subtitle: subtitle ?? "",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "isFeatured",
      title: "Mettre en avant (page d'accueil)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "ticketUrl", title: "Lien billetterie", type: "url" }),
  ],
  orderings: [
    {
      title: "Date (croissant)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
    {
      title: "Date (décroissant)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "city", subtitle: "date", description: "venue.fr" },
    prepare: ({ title, subtitle, description }) => ({
      title: `${subtitle ?? "—"} — ${title ?? "—"}`,
      subtitle: description ?? "",
    }),
  },
});

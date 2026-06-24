import { defineField, defineType } from "sanity";
import { TimeInput } from "../components/TimeInput";
import { CountryInput } from "../components/CountryInput";
import { InfoNote } from "../components/InfoNote";

const localizedString = (
  name: string,
  title: string,
  description?: string,
  requiredFrMessage?: string,
) =>
  defineField({
    name,
    title,
    description,
    type: "localeString",
    validation: requiredFrMessage
      ? (R) =>
          R.custom((value?: { fr?: string }) =>
            value?.fr?.trim() ? true : requiredFrMessage,
          )
      : undefined,
  });

function isValidTicketUrl(value?: string) {
  if (!value?.trim()) return true;

  const trimmed = value.trim();
  const urlWithProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(urlWithProtocol);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

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

    defineField({
      name: "requiredNote",
      title: "💡 Champs obligatoires et informations à confirmer",
      type: "string",
      readOnly: true,
      description:
        "Date, ville, pays, salle/lieu en français et rôle en français sont nécessaires pour éviter un concert incomplet sur le site. Si une information n'est pas encore confirmée, écrivez simplement « À confirmer » dans le champ concerné.",
      components: { field: InfoNote },
    }),

    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (R) => R.required().error("Ajoutez la date du concert."),
    }),
    defineField({
      name: "time",
      title: "Heure",
      type: "string",
      description:
        "Heure de début du concert. Laissez vide si l'heure n'est pas encore confirmée.",
      components: { input: TimeInput },
    }),
    defineField({
      name: "city",
      title: "Ville",
      type: "string",
      validation: (R) => R.required().error("Ajoutez la ville du concert."),
    }),
    defineField({
      name: "country",
      title: "Pays",
      type: "string",
      description: "Tapez les premières lettres pour naviguer rapidement.",
      components: { input: CountryInput },
      validation: (R) => R.required().error("Sélectionnez le pays du concert."),
    }),
    localizedString(
      "venue",
      "Salle / Lieu",
      "Remplissez au minimum le français. Si le lieu n'est pas encore confirmé, écrivez « À confirmer ».",
      "Ajoutez la salle/le lieu en français, ou écrivez « À confirmer ».",
    ),
    localizedString(
      "role",
      "Rôle (Alto solo, Récital…)",
      "Remplissez au minimum le français. Si le rôle exact n'est pas encore confirmé, écrivez « À confirmer ».",
      "Ajoutez le rôle en français, ou écrivez « À confirmer ».",
    ),
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
            { name: "piece", title: "Œuvre", type: "localeString" },
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
    // Champ déprécié : la mise en avant dans le hero se gère désormais uniquement
    // via la liste « Concerts affichés dans le hero » de la page d'accueil.
    // Conservé masqué pour éviter un avertissement Sanity sur les concerts existants.
    defineField({
      name: "isFeatured",
      title: "Mettre en avant (ancien champ)",
      type: "boolean",
      hidden: true,
      readOnly: true,
      initialValue: false,
    }),
    defineField({
      name: "ticketUrl",
      title: "Lien billetterie",
      type: "string",
      description:
        "Exemples acceptés : https://exemple.com ou www.exemple.com.",
      validation: (R) =>
        R.custom((value?: string) =>
          isValidTicketUrl(value)
            ? true
            : "Ajoutez une URL valide, par exemple www.exemple.com.",
        ),
    }),
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

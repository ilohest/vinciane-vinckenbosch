import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

export const pressItem = defineType({
  name: "pressItem",
  title: "Article de presse",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Captures de l'article",
      description:
        "Vous pouvez ajouter plusieurs images pour un même article (glissez pour réordonner).",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (R) => R.min(1).error("Ajoutez au moins une image."),
    }),
    defineField({
      name: "date",
      title: "Date de publication",
      type: "date",
      options: { dateFormat: "DD MMM YYYY" },
    }),
    defineField({
      name: "headline",
      title: "Titre de l'article / source",
      type: "string",
      validation: (R) =>
        R.required().error("Ajoutez le titre de l'article / source."),
    }),
    defineField({
      name: "articleUrl",
      title: "Lien vers l'article (optionnel)",
      type: "url",
      description:
        "Laissez vide pour un article papier sans version en ligne. Si renseigné, un bouton « Lire l'article » apparaît dans l'agrandissement.",
    }),
    // Champ d'ordre géré par le drag & drop (caché de l'éditeur)
    orderRankField({ type: "pressItem" }),
  ],
  orderings: [
    {
      title: "Date (récent)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      media: "images.0",
      title: "headline",
      subtitle: "date",
      count: "images",
    },
    prepare: ({ media, title, subtitle, count }) => ({
      media,
      title: title ?? "Article de presse",
      subtitle:
        Array.isArray(count) && count.length > 1
          ? `${subtitle ? `${subtitle} · ` : ""}${count.length} images`
          : (subtitle ?? "1 image"),
    }),
  },
});

import { defineField, defineType } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

export const mediaItem = defineType({
  name: "mediaItem",
  title: "Média (photo / vidéo)",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      hidden: true,
      options: {
        list: [
          { title: "Photo", value: "photo" },
          { title: "Vidéo", value: "video" },
        ],
      },
      initialValue: "photo",
    }),
    defineField({
      name: "image",
      title: "Image / miniature",
      type: "image",
      description:
        "Pour une photo : obligatoire. Pour une vidéo : optionnel, le site utilise la miniature YouTube si aucune miniature n'est ajoutée.",
      options: { hotspot: true },
      validation: (R) =>
        R.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type !== "video" && !value) return "Ajoutez une image.";
          return true;
        }),
    }),
    defineField({
      name: "videoUrl",
      title: "URL vidéo (YouTube / Vimeo)",
      type: "url",
      hidden: ({ document }) => document?.type !== "video",
      validation: (R) =>
        R.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type === "video" && !value) return "Ajoutez le lien de la vidéo.";
          return true;
        }),
    }),
    defineField({ name: "credit", title: "Crédit photo", type: "string" }),
    // Champ d'ordre géré par le drag & drop (caché de l'éditeur)
    orderRankField({ type: "mediaItem" }),
  ],
  preview: {
    select: { media: "image", title: "credit", subtitle: "type" },
    prepare: ({ media, title, subtitle }) => ({
      media,
      title: title ?? "—",
      subtitle,
    }),
  },
});

import { defineField, defineType } from "sanity";
import { InfoNote } from "../components/InfoNote";

export const socialPreview = defineType({
  name: "socialPreview",
  title: "Aperçu de partage",
  type: "document",
  fields: [
    defineField({
      name: "help",
      title: "Aperçu de partage",
      type: "string",
      readOnly: true,
      description:
        "Ces champs contrôlent le texte et l'image qui apparaissent quand le lien du site est partagé dans un chat ou sur les réseaux sociaux.",
      components: { field: InfoNote },
    }),
    defineField({
      name: "description",
      title: "Texte de preview (FR / EN / DE)",
      description:
        "Texte court affiché sous le titre dans les aperçus de liens. Idéalement 120 à 200 caractères.",
      type: "localeText",
      validation: (R) =>
        R.custom((value?: { fr?: string; en?: string; de?: string }) => {
          if (!value?.fr?.trim()) return "Ajoutez le texte français.";
          if (!value?.en?.trim()) return "Ajoutez le texte anglais.";
          if (!value?.de?.trim()) return "Ajoutez le texte allemand.";
          return true;
        }),
    }),
    defineField({
      name: "image",
      title: "Image de preview",
      description:
        "Image utilisée par les chats et réseaux sociaux. Format conseillé: horizontal, proche de 1200 x 630 px. Le site la recadre automatiquement pour les cartes de partage.",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required().error("Ajoutez l'image de preview."),
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare({ media }) {
      return {
        title: "Aperçu de partage",
        subtitle: "Texte et image des cartes de lien",
        media,
      };
    },
  },
});

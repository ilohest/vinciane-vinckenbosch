import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Crédits photo',
  type: 'document',
  fields: [
    defineField({
      name: 'creditsIntro',
      title: 'Texte d\'introduction (page Crédits photo)',
      description: 'Affiché sous le titre « Crédits photo » en haut de la page.',
      type: 'localeText',
    }),
    defineField({
      name: 'photoCredits',
      title: 'Photographes',
      description: 'Un nom par ligne. Le symbole © est ajouté automatiquement.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Crédits photo' };
    },
  },
});

import { defineField, defineType } from 'sanity';

export const privacyPolicy = defineType({
  name: 'privacyPolicy',
  title: 'Politique de confidentialité',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Contenu de la politique de confidentialité',
      type: 'localeBlock',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Politique de confidentialité' }),
  },
});

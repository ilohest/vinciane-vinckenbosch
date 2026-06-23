import { defineField, defineType } from 'sanity';

export const legalNotice = defineType({
  name: 'legalNotice',
  title: 'Mentions légales',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Contenu des mentions légales',
      type: 'localeBlock',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Mentions légales' }),
  },
});

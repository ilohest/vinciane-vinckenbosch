import { defineField, defineType } from 'sanity';

export const pressItem = defineType({
  name: 'pressItem',
  title: 'Article de presse',
  type: 'document',
  fields: [
    defineField({
      name: 'screenshot',
      title: 'Screenshot de l\'article',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'articleUrl',
      title: 'URL de l\'article',
      type: 'url',
      validation: (R) => R.required(),
    }),
    defineField({ name: 'publication', title: 'Publication', type: 'string' }),
    defineField({ name: 'date', title: 'Date de publication', type: 'date' }),
    defineField({ name: 'headline', title: 'Titre / accroche', type: 'string' }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Date (récent)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { media: 'screenshot', title: 'publication', subtitle: 'headline' },
    prepare: ({ media, title, subtitle }) => ({ media, title: title ?? '—', subtitle }),
  },
});

import { defineField, defineType } from 'sanity';

export const mediaItem = defineType({
  name: 'mediaItem',
  title: 'Média (photo / vidéo)',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: [{ title: 'Photo', value: 'photo' }, { title: 'Vidéo', value: 'video' }] },
      initialValue: 'photo',
    }),
    defineField({
      name: 'image',
      title: 'Image (ou miniature vidéo)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL vidéo (YouTube / Vimeo)',
      type: 'url',
      hidden: ({ document }) => document?.type !== 'video',
    }),
    defineField({
      name: 'caption',
      title: 'Légende',
      type: 'object',
      fields: [
        { name: 'fr', title: 'Français', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
        { name: 'de', title: 'Deutsch', type: 'string' },
      ],
    }),
    defineField({ name: 'credit', title: 'Crédit photo', type: 'string' }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { media: 'image', title: 'caption.fr', subtitle: 'type' },
    prepare: ({ media, title, subtitle }) => ({ media, title: title ?? '—', subtitle }),
  },
});

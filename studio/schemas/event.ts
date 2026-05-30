import { defineField, defineType } from 'sanity';

const localizedString = (name: string, title: string) => defineField({
  name,
  title,
  type: 'object',
  fields: [
    { name: 'fr', title: 'Français', type: 'string' },
    { name: 'en', title: 'English', type: 'string' },
    { name: 'de', title: 'Deutsch', type: 'string' },
  ],
});

export const event = defineType({
  name: 'event',
  title: 'Concert / Événement',
  type: 'document',
  fields: [
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'time', title: 'Heure (ex: 20h)', type: 'string' }),
    defineField({ name: 'city', title: 'Ville', type: 'string' }),
    defineField({ name: 'country', title: 'Pays (code ISO)', type: 'string', description: 'Ex: FR, DE, BE' }),
    localizedString('venue', 'Salle / Lieu'),
    localizedString('role', 'Rôle (Alto solo, Récital…)'),
    defineField({
      name: 'program',
      title: 'Programme',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'composer', title: 'Compositeur', type: 'string' },
          { name: 'piece', title: 'Œuvre', type: 'string' },
        ],
        preview: {
          select: { title: 'piece', subtitle: 'composer' },
        },
      }],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Mettre en avant (page d\'accueil)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'ticketUrl', title: 'Lien billetterie', type: 'url' }),
    defineField({ name: 'notes', title: 'Notes internes', type: 'text', rows: 2 }),
  ],
  orderings: [
    { title: 'Date (croissant)', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] },
    { title: 'Date (décroissant)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'city', subtitle: 'date', description: 'venue.fr' },
    prepare: ({ title, subtitle, description }) => ({
      title: `${subtitle ?? '—'} — ${title ?? '—'}`,
      subtitle: description ?? '',
    }),
  },
});

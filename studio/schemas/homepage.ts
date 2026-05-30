import { defineField, defineType } from 'sanity';

const localizedText = (name: string, title: string) => defineField({
  name,
  title,
  type: 'object',
  fields: [
    { name: 'fr', title: 'Français', type: 'text', rows: 4 },
    { name: 'en', title: 'English', type: 'text', rows: 4 },
    { name: 'de', title: 'Deutsch', type: 'text', rows: 4 },
  ],
});

export const homepage = defineType({
  name: 'homepage',
  title: 'Page d\'accueil',
  type: 'document',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Image hero',
      type: 'image',
      options: { hotspot: true },
    }),
    localizedText('heroQuote', 'Citation d\'ouverture'),
    defineField({
      name: 'heroQuoteAttribution',
      title: 'Attribution citation',
      type: 'string',
    }),
    defineField({
      name: 'upcomingDatesTeaser',
      title: 'Prochaines dates (hero)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: "1 Mai | Vienne, AU"',
      validation: (R) => R.max(3),
    }),
    defineField({
      name: 'biographyIntroImage',
      title: 'Image intro biographie',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'biographySections',
      title: 'Sections biographie',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
          defineField({
            name: 'imagePosition',
            title: 'Position image',
            type: 'string',
            options: { list: ['left', 'right'] },
          }),
          defineField({
            name: 'textBlocks',
            title: 'Paragraphes',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'fr', title: 'Français', type: 'text', rows: 4 },
                { name: 'en', title: 'English', type: 'text', rows: 4 },
                { name: 'de', title: 'Deutsch', type: 'text', rows: 4 },
              ],
            }],
          }),
        ],
        preview: {
          select: { media: 'image', title: 'imagePosition' },
          prepare: ({ media, title }) => ({ media, title: `Section — image ${title}` }),
        },
      }],
    }),
    defineField({
      name: 'biographyPDFUrl',
      title: 'URL PDF biographie',
      type: 'url',
    }),
    localizedText('quote2Text', 'Citation 2 (Wilfried Strehle)'),
    defineField({
      name: 'quote2Attribution',
      title: 'Attribution citation 2',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contact',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'object',
      fields: [
        { name: 'youtube', title: 'YouTube URL', type: 'url' },
        { name: 'facebook', title: 'Facebook URL', type: 'url' },
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Page d\'accueil' }),
  },
});

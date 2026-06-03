import { defineField, defineType } from 'sanity';

const localizedRichText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      {
        name: 'fr',
        title: '🇫🇷 Français',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              { title: 'Normal', value: 'normal' },
              { title: 'Titre', value: 'h2' },
              { title: 'Sous-titre', value: 'h3' },
            ],
            marks: {
              decorators: [
                { title: 'Gras', value: 'strong' },
                { title: 'Italique', value: 'em' },
              ],
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'Lien',
                  fields: [{ name: 'href', type: 'url', title: 'URL' }],
                },
              ],
            },
          },
        ],
      },
      {
        name: 'en',
        title: '🇬🇧 Anglais',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              { title: 'Normal', value: 'normal' },
              { title: 'Title', value: 'h2' },
              { title: 'Subtitle', value: 'h3' },
            ],
            marks: {
              decorators: [
                { title: 'Bold', value: 'strong' },
                { title: 'Italic', value: 'em' },
              ],
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'Link',
                  fields: [{ name: 'href', type: 'url', title: 'URL' }],
                },
              ],
            },
          },
        ],
      },
      {
        name: 'de',
        title: '🇩🇪 Allemand',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              { title: 'Normal', value: 'normal' },
              { title: 'Titel', value: 'h2' },
              { title: 'Untertitel', value: 'h3' },
            ],
            marks: {
              decorators: [
                { title: 'Fett', value: 'strong' },
                { title: 'Kursiv', value: 'em' },
              ],
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'Link',
                  fields: [{ name: 'href', type: 'url', title: 'URL' }],
                },
              ],
            },
          },
        ],
      },
    ],
  });

export const privacyPolicy = defineType({
  name: 'privacyPolicy',
  title: 'Politique de confidentialité',
  type: 'document',
  fields: [
    localizedRichText('content', 'Contenu de la politique de confidentialité'),
  ],
  preview: {
    prepare: () => ({ title: 'Politique de confidentialité' }),
  },
});

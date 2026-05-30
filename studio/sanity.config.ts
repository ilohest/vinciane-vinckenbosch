import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'vinciane-vinckenbosch',
  title: 'Vinciane Vinckenbosch',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'REPLACE_ME',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            S.listItem()
              .title('Page d\'accueil')
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.divider(),
            S.documentTypeListItem('event').title('Concerts / Agenda'),
            S.documentTypeListItem('mediaItem').title('Médias'),
            S.documentTypeListItem('pressItem').title('Presse'),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
});

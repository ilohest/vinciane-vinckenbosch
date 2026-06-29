import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { frFRLocale } from "@sanity/locale-fr-fr";
import { schemaTypes } from "./schemas";
import { StudioDashboard } from "./components/StudioDashboard";
import { StudioLogo } from "./components/StudioLogo";
import { StudioHelp } from "./components/StudioHelp";
import { PreviewDraftAction } from "./components/PreviewDraftAction";

function HomeIcon() {
  return "VV";
}

export default defineConfig({
  name: "vinciane-vinckenbosch",
  title: "Vinciane Vinckenbosch",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "REPLACE_ME",
  dataset: "production",

  plugins: [
    frFRLocale(),
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Mon site")
          .items([
            // ── Contenu principal ──────────────────────────────────
            S.listItem()
              .id("pageDaccueil")
              .title("Page d'accueil")
              .icon(() => "🏠")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
                  .title("Page d'accueil"),
              ),

            S.listItem()
              .id("agenda")
              .title("Agenda")
              .icon(() => "🎵")
              .child(S.documentTypeList("event").title("Agenda")),

            S.listItem()
              .id("medias")
              .title("Médias")
              .icon(() => "🎬")
              .child(
                S.list()
                  .title("Médias")
                  .items([
                    orderableDocumentListDeskItem({
                      id: "medias-photos",
                      type: "mediaItem",
                      title: "Photos",
                      icon: () => "📷",
                      filter: 'type == "photo"',
                      createIntent: false,
                      menuItems: [
                        S.menuItem()
                          .title("Créer une photo")
                          .intent({
                            type: "create",
                            params: {
                              type: "mediaItem",
                              template: "mediaItem-photo",
                            },
                          })
                          .serialize(),
                      ],
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      id: "medias-videos",
                      type: "mediaItem",
                      title: "Vidéos",
                      icon: () => "🎬",
                      filter: 'type == "video"',
                      createIntent: false,
                      menuItems: [
                        S.menuItem()
                          .title("Créer une vidéo")
                          .intent({
                            type: "create",
                            params: {
                              type: "mediaItem",
                              template: "mediaItem-video",
                            },
                          })
                          .serialize(),
                      ],
                      S,
                      context,
                    }),
                  ]),
              ),

            // Presse — réordonnable par glisser-déposer
            orderableDocumentListDeskItem({
              id: "presse",
              type: "pressItem",
              title: "Presse",
              icon: () => "📰",
              S,
              context,
            }),

            S.divider(),

            S.listItem()
              .id("apercuPartage")
              .title("Aperçu de partage")
              .icon(() => "🔗")
              .child(
                S.document()
                  .schemaType("socialPreview")
                  .documentId("socialPreview")
                  .title("Aperçu de partage"),
              ),

            // ── Informations légales & crédits ─────────────────────
            S.listItem()
              .id("creditsPhoto")
              .title("Crédits photo")
              .icon(() => "📸")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Crédits photo"),
              ),

            S.listItem()
              .title("Mentions légales")
              .icon(() => "⚖️")
              .child(
                S.document()
                  .schemaType("legalNotice")
                  .documentId("legalNotice")
                  .title("Mentions légales"),
              ),

            S.listItem()
              .title("Politique de confidentialité")
              .icon(() => "🔒")
              .child(
                S.document()
                  .schemaType("privacyPolicy")
                  .documentId("privacyPolicy")
                  .title("Politique de confidentialité"),
              ),

            S.divider(),

            S.listItem()
              .id("aide")
              .title("Aide")
              .icon(() => "?")
              .child(S.component(StudioHelp).id("studio-help").title("Aide")),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: "mediaItem-photo",
        title: "Photo",
        schemaType: "mediaItem",
        value: { type: "photo" },
      },
      {
        id: "mediaItem-video",
        title: "Vidéo",
        schemaType: "mediaItem",
        value: { type: "video" },
      },
    ],
  },

  // Logo personnalisé en haut à gauche (remplace le titre par défaut)
  studio: {
    components: {
      logo: StudioLogo,
    },
  },

  tools: (prev) => [
    {
      name: "home",
      title: "Accueil",
      icon: HomeIcon,
      component: StudioDashboard,
    },
    ...prev,
  ],

  document: {
    // Masque UNIQUEMENT le bouton « + » global de la barre du haut.
    // Les boutons de création dans les listes (Agenda, Presse, Médias…) restent
    // disponibles (contexte 'structure').
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? [] : prev,

    actions: (prev, context) => {
      // L'aperçu brouillon n'existe que pour la page d'accueil, l'agenda et l'aperçu de partage
      // (la route /preview rend l'accueil + la section agenda). On masque donc
      // le bouton sur les autres types (Média, Presse, Crédits, pages légales).
      const PREVIEWABLE = ["homepage", "event", "socialPreview"];
      if (!PREVIEWABLE.includes(context.schemaType)) return prev;

      const publishIndex = prev.findIndex(
        (action) => action.action === "publish",
      );
      if (publishIndex === -1) return [...prev, PreviewDraftAction];

      return [
        ...prev.slice(0, publishIndex + 1),
        PreviewDraftAction,
        ...prev.slice(publishIndex + 1),
      ];
    },
  },
});

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

            // Médias — réordonnable par glisser-déposer
            orderableDocumentListDeskItem({
              id: "medias",
              type: "mediaItem",
              title: "Médias",
              icon: () => "🎬",
              S,
              context,
            }),

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

  schema: { types: schemaTypes },

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
    // Masque le bouton « + » (création libre de documents) en haut à gauche :
    // tout le contenu se gère via la liste « Mon site ».
    newDocumentOptions: () => [],

    actions: (prev, context) => {
      // L'aperçu brouillon n'existe que pour la page d'accueil et l'agenda
      // (la route /preview rend l'accueil + la section agenda). On masque donc
      // le bouton sur les autres types (Média, Presse, Crédits, pages légales).
      const PREVIEWABLE = ["homepage", "event"];
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

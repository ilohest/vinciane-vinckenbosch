import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { frFRLocale } from "@sanity/locale-fr-fr";
import { schemaTypes } from "./schemas";

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
              .title("Page d'accueil")
              .icon(() => "🏠")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
                  .title("Page d'accueil"),
              ),

            S.listItem()
              .title("Agenda")
              .icon(() => "🎵")
              .child(S.documentTypeList("event").title("Agenda")),

            // Médias — réordonnable par glisser-déposer
            orderableDocumentListDeskItem({
              type: "mediaItem",
              title: "Médias",
              icon: () => "🎬",
              S,
              context,
            }),

            // Presse — réordonnable par glisser-déposer
            orderableDocumentListDeskItem({
              type: "pressItem",
              title: "Presse",
              icon: () => "📰",
              S,
              context,
            }),

            S.divider(),

            // ── Informations légales & crédits ─────────────────────
            S.listItem()
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
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
});

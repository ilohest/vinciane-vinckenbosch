import { defineField, defineType } from "sanity";

/** Champ texte localisé FR / EN / DE */
const loc = (
  name: string,
  title: string,
  group: string,
  description?: string,
) =>
  defineField({
    name,
    title,
    group,
    description,
    type: "object",
    fields: [
      { name: "fr", title: "🇫🇷 Français", type: "text", rows: 4 },
      { name: "en", title: "🇬🇧 Anglais", type: "text", rows: 4 },
      { name: "de", title: "🇩🇪 Allemand", type: "text", rows: 4 },
    ],
  });

export const homepage = defineType({
  name: "homepage",
  title: "Page d'accueil",
  type: "document",

  // ── Onglets ──────────────────────────────────────────────────
  groups: [
    { name: "hero", title: "Hero & Citation", default: true },
    { name: "bio", title: "Biographie" },
    { name: "contact", title: "Contact & Réseaux" },
  ],

  fields: [
    // ════════════════════════════════════════════════════════════
    // ONGLET — HERO & CITATION
    // ════════════════════════════════════════════════════════════

    defineField({
      name: "heroImage",
      title: "① Photo hero — plein écran (arrière-plan principal)",
      group: "hero",
      type: "image",
      options: { hotspot: true },
      description:
        "Grande photo qui remplit tout l'écran en arrière-plan du titre.",
    }),

    defineField({
      name: "heroEvents",
      title: "Concerts affichés dans le hero",
      group: "hero",
      type: "array",
      of: [{ type: "reference", to: [{ type: "event" }] }],
      description:
        "Sélectionnez jusqu'à 3 concerts. Si rien n'est sélectionné, les 3 prochains concerts sont affichés automatiquement.",
      validation: (R) => R.max(3).unique(),
    }),

    loc(
      "heroQuote",
      "Citation d'ouverture (section biographie)",
      "hero",
      "Grande citation en orange qui ouvre la section biographie.",
    ),

    defineField({
      name: "heroQuoteAttribution",
      title: "Source de la citation d'ouverture",
      group: "hero",
      type: "string",
      description: "Ex : (Passauer Neue Presse)",
    }),

    // ════════════════════════════════════════════════════════════
    // ONGLET — BIOGRAPHIE
    // ════════════════════════════════════════════════════════════

    defineField({
      name: "biographyIntroImage",
      title: "② Photo intro biographie — à droite du titre « BIOGRAPHIE »",
      group: "bio",
      type: "image",
      options: { hotspot: true },
      description: "Photo panoramique affichée à droite du titre de section.",
    }),

    defineField({
      name: "bioImage2",
      title: "③ Photo portrait alto — à gauche des 2 premiers paragraphes",
      group: "bio",
      type: "image",
      options: { hotspot: true },
      description:
        "Portrait vertical, affiché à gauche des paragraphes 1 et 2.",
    }),

    loc(
      "bioParaOrchestre",
      "Paragraphe 1 — Orchestres & collaborations",
      "bio",
    ),
    loc("bioParaPrix", "Paragraphe 2 — Prix & soutiens", "bio"),

    loc(
      "bioTrioText",
      "Texte Trio Linaris (grande phrase animée)",
      "bio",
      "Grande phrase au défilement animé. Écrivez le texte complet en incluant « Trio Linaris » : ce nom sera automatiquement mis en valeur en orange.",
    ),

    defineField({
      name: "trioImageNarrow",
      title: "④ Photo Trio Linaris — portrait étroit (gauche des deux photos)",
      group: "bio",
      type: "image",
      options: { hotspot: true },
      description:
        "Photo en format portrait, affichée à gauche dans la double image du Trio.",
    }),

    defineField({
      name: "trioImageWide",
      title: "⑤ Photo Trio Linaris — panoramique (droite des deux photos)",
      group: "bio",
      type: "image",
      options: { hotspot: true },
      description:
        "Photo plus large, affichée à droite dans la double image du Trio.",
    }),

    defineField({
      name: "bioImage3",
      title: "⑥ Photo portrait concert — à gauche des paragraphes 3 à 6",
      group: "bio",
      type: "image",
      options: { hotspot: true },
      description: "Portrait vertical, affiché à gauche des paragraphes 3 à 6.",
    }),

    loc("bioParaFestivals", "Paragraphe 3 — Festivals & partenaires", "bio"),
    loc("bioParaSoliste", "Paragraphe 4 — Soliste avec orchestre", "bio"),
    loc("bioParaTonkuenstler", "Paragraphe 5 — Tonkünstler Live", "bio"),
    loc("bioParaBacri", "Paragraphe 6 — Création Bacri", "bio"),

    loc("bioParaFormationViolon", "Paragraphe 7 — Formation violon", "bio"),

    defineField({
      name: "bioFormationImage",
      title:
        "⑦ Photo formation — dans la colonne droite de la section formation",
      group: "bio",
      type: "image",
      options: { hotspot: true },
      description:
        "Photo paysage affichée au-dessus des paragraphes 8-10 (colonne droite).",
    }),

    loc("bioParaFormationAlto", "Paragraphe 8 — Formation alto", "bio"),
    loc("bioParaMaitres", "Paragraphe 9 — Maîtres & conseils", "bio"),
    loc("bioParaPedagogie", "Paragraphe 10 — Pédagogie & alto", "bio"),

    loc(
      "quote2Text",
      "Citation biographie",
      "bio",
      "Grande citation affichée au bas de la section biographie, en couleur.",
    ),

    defineField({
      name: "quote2Attribution",
      title: "Source de la citation biographie",
      group: "bio",
      type: "string",
      description:
        "Ex : (Wilfried Strehle, ancien alto solo du Berliner Philharmoniker)",
    }),

    defineField({
      name: "biographyPdfs",
      title: "PDF de la biographie (par langue)",
      group: "bio",
      description:
        "Téléversez le PDF dans chaque langue. L'utilisateur choisit la langue au téléchargement.",
      type: "object",
      options: { columns: 3 },
      fields: [
        {
          name: "fr",
          title: "🇫🇷 Français",
          type: "file",
          options: { accept: "application/pdf" },
        },
        {
          name: "en",
          title: "🇬🇧 Anglais",
          type: "file",
          options: { accept: "application/pdf" },
        },
        {
          name: "de",
          title: "🇩🇪 Allemand",
          type: "file",
          options: { accept: "application/pdf" },
        },
      ],
    }),

    // ════════════════════════════════════════════════════════════
    // ONGLET — CONTACT & RÉSEAUX
    // ════════════════════════════════════════════════════════════

    defineField({
      name: "socialLinks",
      title: "Liens réseaux sociaux",
      group: "contact",
      type: "object",
      fields: [
        { name: "youtube", title: "YouTube", type: "url" },
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "instagram", title: "Instagram", type: "url" },
      ],
    }),

    defineField({
      name: "contactGalleryImages",
      title: "Galerie de photos (4 vignettes sous le formulaire)",
      group: "contact",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (R) => R.max(4),
      description:
        "Jusqu'à 4 photos affichées en grille sous le formulaire de contact. Glissez-déposez pour réordonner.",
    }),

    defineField({
      name: "contactVideoUrl",
      title: "Vidéo YouTube (en dessous de la section contact)",
      group: "contact",
      type: "url",
      description:
        "Collez ici le lien YouTube complet. Ex : https://www.youtube.com/watch?v=…",
      validation: (R) =>
        R.uri({ scheme: ["http", "https"], allowRelative: false }),
    }),

    defineField({
      name: "contactVideoThumbnail",
      title: "Miniature vidéo YouTube (optionnelle)",
      group: "contact",
      type: "image",
      description:
        "Image affichée avant le lancement de la vidéo. Si ce champ est vide, la miniature YouTube est utilisée automatiquement.",
      options: { hotspot: true },
    }),

    defineField({
      name: "finalImage",
      title: "⑧ Photo finale — grande image en bas de page",
      group: "contact",
      type: "image",
      options: { hotspot: true },
      description:
        "Photo pleine largeur affichée en toute fin de page, juste au-dessus du footer.",
    }),
  ],

  preview: {
    prepare: () => ({ title: "Page d'accueil" }),
  },
});

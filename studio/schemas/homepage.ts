import { defineField, defineType } from "sanity";
import { InfoNote } from "../components/InfoNote";

const MAX_HERO_VIDEO_SIZE_MB = 25;
const MAX_HERO_VIDEO_SIZE_BYTES = MAX_HERO_VIDEO_SIZE_MB * 1024 * 1024;

/** Champ texte localisé FR / EN / DE (type partagé `localeText`) */
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
    type: "localeText",
  });

const helpNote = (
  name: string,
  title: string,
  group: string,
  description: string,
) =>
  defineField({
    name,
    title,
    group,
    type: "string",
    readOnly: true,
    description,
    components: { field: InfoNote },
  });

const heroVideoValidation = (label: string) => (R: any) =>
  R.custom(async (value?: { asset?: { _ref?: string } }, context: any) => {
    const assetId = value?.asset?._ref;
    if (!assetId) return true;

    const client = context.getClient({ apiVersion: "2024-01-01" });
    const asset = await client.fetch<{ size?: number } | null>(
      `*[_id == $assetId][0]{size}`,
      { assetId },
    );

    if (asset?.size && asset.size > MAX_HERO_VIDEO_SIZE_BYTES) {
      return `La vidéo ${label} est trop lourde. Maximum: ${MAX_HERO_VIDEO_SIZE_MB} Mo.`;
    }

    return true;
  });

export const homepage = defineType({
  name: "homepage",
  title: "Page d'accueil",
  type: "document",

  // ── Onglets ──────────────────────────────────────────────────
  groups: [
    // Pas de `default: true` → l'onglet « Tous les champs » est sélectionné par défaut
    { name: "hero", title: "Hero & Citation" },
    { name: "bio", title: "Biographie" },
    { name: "contact", title: "Contact, Réseaux et fin de page" },
  ],

  fields: [
    // ════════════════════════════════════════════════════════════
    // ONGLET — HERO & CITATION
    // ════════════════════════════════════════════════════════════

    helpNote(
      "heroHelp",
      "Hero & Citation",
      "hero",
      "Ici, vous pouvez changer le média d'accueil, sélectionner les concerts mis en avant et modifier la citation. Pour ordinateur, privilégiez un média horizontal, plus large que haut. Pour téléphone, privilégiez un média vertical, plus haut que large. Pour une belle qualité sur téléphone, ajoutez si possible un média téléphone dédié. Si la vidéo téléphone est vide, le site utilise la vidéo ordinateur; si tout est vide côté téléphone, il réutilise automatiquement le média ordinateur.",
    ),

    defineField({
      name: "heroMediaType",
      title: "Ancien choix du type de média hero",
      group: "hero",
      type: "string",
      hidden: true,
      readOnly: true,
      description:
        "Ancien champ conservé uniquement pour éviter un avertissement Sanity sur les contenus existants.",
    }),

    defineField({
      name: "heroImage",
      title: "① Photo hero ordinateur — plein écran",
      group: "hero",
      type: "image",
      options: { hotspot: true },
      description:
        "Grande photo affichée en haut de la page sur ordinateur. Choisissez idéalement une image horizontale, plus large que haute. Si une vidéo hero est ajoutée, cette photo sert aussi d'aperçu ou de secours pendant le chargement.",
      validation: (R) =>
        R.required().error(
          "Ajoutez une photo hero ordinateur. Elle sert aussi d'image de secours si la vidéo ou les médias téléphone ne sont pas disponibles.",
        ),
    }),

    defineField({
      name: "heroVideo",
      title: "Vidéo hero ordinateur — plein écran en boucle (optionnelle)",
      group: "hero",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description:
        "Si ce champ est rempli, la vidéo remplace la photo en haut de la page sur ordinateur. Choisissez idéalement une vidéo horizontale, plus large que haute. Elle sera lue automatiquement, sans son, en boucle. Laissez vide pour afficher seulement la photo. Idéalement: vidéo courte, sous 10-15 Mo. Maximum accepté: 25 Mo.",
      validation: heroVideoValidation("ordinateur"),
    }),

    defineField({
      name: "heroMobileImage",
      title: "Photo hero téléphone (optionnelle)",
      group: "hero",
      type: "image",
      options: { hotspot: true },
      description:
        "Photo utilisée seulement sur téléphone. Choisissez idéalement une image verticale, plus haute que large, en bonne résolution. Si une vidéo ordinateur existe et que la vidéo téléphone est vide, cette photo sert surtout d'aperçu pendant le chargement.",
    }),

    defineField({
      name: "heroMobileVideo",
      title: "Vidéo hero téléphone en boucle (optionnelle)",
      group: "hero",
      type: "file",
      options: { accept: "video/mp4,video/webm,video/quicktime" },
      description:
        "Vidéo utilisée seulement sur téléphone. Choisissez idéalement une vidéo verticale, plus haute que large, en bonne résolution mais légère. Si ce champ est vide, le site utilise la vidéo ordinateur si elle existe; sinon il utilise la photo téléphone. Maximum accepté: 25 Mo.",
      validation: heroVideoValidation("téléphone"),
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

    helpNote(
      "bioHelp",
      "Biographie",
      "bio",
      "Cet onglet contient les textes et photos de la section biographie. Les photos numérotées suivent leur ordre d'apparition sur la page: vous pouvez remplacer une image sans changer la mise en page.",
    ),

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
      name: "trioLinks",
      title: "Liens dans la phrase Trio Linaris",
      group: "bio",
      type: "array",
      description:
        "Ajoutez un lien sur un nom de la phrase ci-dessus (ex. « Alexandra Bidi », « Pierre Cornu-Deyme », « Trio Linaris »). Le « Nom » doit être écrit EXACTEMENT comme dans le texte. Le nom devient alors cliquable sur le site.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Nom dans le texte",
              type: "string",
              description:
                "Doit correspondre exactement au texte, accents compris (ex. Alexandra Bidi).",
              validation: (R) => R.required(),
            },
            {
              name: "url",
              title: "Lien vers un site web",
              type: "url",
              description: "Remplir le lien OU le PDF ci-dessous (pas les deux).",
              validation: (R) => R.uri({ scheme: ["http", "https"] }),
            },
            {
              name: "pdf",
              title: "Ou document PDF téléchargeable",
              type: "file",
              options: { accept: "application/pdf" },
              description:
                "Si un PDF est ajouté, le nom devient un lien de téléchargement (le lien web ci-dessus est ignoré).",
            },
          ],
          validation: (R) =>
            R.custom((value?: { url?: string; pdf?: unknown }) =>
              value?.url || value?.pdf
                ? true
                : "Ajoutez un lien web OU un document PDF.",
            ),
          preview: {
            select: { title: "label", subtitle: "url", media: "pdf" },
            prepare: ({ title, subtitle }: { title?: string; subtitle?: string }) => ({
              title: title ?? "(sans nom)",
              subtitle: subtitle || "PDF téléchargeable",
            }),
          },
        },
      ],
    }),

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
    // ONGLET — Contact, Réseaux et fin de page
    // ════════════════════════════════════════════════════════════

    helpNote(
      "contactHelp",
      "Contact, Réseaux et fin de page",
      "contact",
      "Ici, vous pouvez modifier les liens de réseaux sociaux, les 4 photos sous le formulaire, la vidéo YouTube et la grande photo finale.",
    ),

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

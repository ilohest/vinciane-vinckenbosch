import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100%",
  padding: "32px",
  background: "var(--card-bg-color, #fff)",
  color: "var(--card-fg-color, #1f1f1f)",
};

const shellStyle: CSSProperties = {
  maxWidth: 880,
  margin: "0 auto",
};

const introStyle: CSSProperties = {
  margin: "8px 0 28px",
  color: "var(--card-muted-fg-color, #5f5f5f)",
  fontSize: 16,
  lineHeight: 1.6,
};

const sectionStyle: CSSProperties = {
  border: "1px solid var(--card-border-color, #d9d9d9)",
  borderRadius: 6,
  padding: "18px 20px",
  marginBottom: 14,
};

const titleStyle: CSSProperties = {
  margin: "0 0 10px",
  fontSize: 18,
  lineHeight: 1.35,
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.6,
};

const noteStyle: CSSProperties = {
  marginTop: 26,
  marginBottom: 26,
  padding: "16px 18px",
  borderRadius: 6,
  background:
    "color-mix(in srgb, var(--card-bg-color, #fff) 84%, var(--card-focus-ring-color, #006fbd) 16%)",
  border:
    "1px solid color-mix(in srgb, var(--card-border-color, #d9d9d9) 60%, var(--card-focus-ring-color, #006fbd) 40%)",
  lineHeight: 1.6,
};

const previewBoxStyle: CSSProperties = {
  ...sectionStyle,
  background:
    "color-mix(in srgb, var(--card-bg-color, #fff) 92%, var(--card-focus-ring-color, #006fbd) 8%)",
};

const previewActionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 14,
};

const previewButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "0 14px",
  borderRadius: 4,
  background: "#232323",
  color: "#fff",
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
};

const previewBaseUrl =
  process.env.SANITY_STUDIO_PREVIEW_BASE_URL ??
  "https://vincianevinckenbosch.com";
const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET ?? "";
const previewLanguages = [
  { label: "Français", lang: "fr" },
  { label: "Anglais", lang: "en" },
  { label: "Allemand", lang: "de" },
];

function previewUrl(lang: string) {
  return `${previewBaseUrl.replace(/\/$/, "")}/preview/${lang}?secret=${encodeURIComponent(previewSecret)}`;
}

function PreviewButtons() {
  if (!previewSecret) {
    return (
      <p style={{ margin: "12px 0 0", opacity: 0.75 }}>
        L'aperçu brouillon doit encore être configuré par Isaure.
      </p>
    );
  }

  return (
    <div style={previewActionsStyle}>
      {previewLanguages.map((item) => (
        <a
          key={item.lang}
          href={previewUrl(item.lang)}
          target="_blank"
          rel="noreferrer"
          style={previewButtonStyle}
        >
          Aperçu {item.label}
        </a>
      ))}
    </div>
  );
}

const sections = [
  {
    title: "Modifier la page d'accueil",
    items: [
      "Ouvrir « Page d'accueil » dans le menu de gauche.",
      "Utiliser les onglets « Hero & Citation », « Biographie » et « Contact & Réseaux ».",
      "Pour le hero sur ordinateur, choisir si possible un média horizontal, plus large que haut. Pour le hero sur téléphone, choisir si possible un média vertical, plus haut que large.",
      "Les médias hero téléphone sont optionnels: si la vidéo téléphone est vide, le site utilise la vidéo ordinateur; si tout est vide côté téléphone, il réutilise automatiquement le média ordinateur.",
      "Les photos numérotées correspondent à leur ordre d'apparition sur la page.",
    ],
  },
  {
    title: "Ajouter un concert",
    items: [
      "Ouvrir « Agenda », puis cliquer sur « Créer un nouveau document » (bouton « + »).",
      "Remplir la date, l'heure, la ville, le pays, le lieu, le rôle et le programme.",
      "Le site classe les concerts automatiquement: à venir dans l'agenda, passés dans les archives.",
      "Pour afficher un concert en haut de la page d'accueil (hero), cocher « Mettre en avant » ou le sélectionner dans la page d'accueil.",
    ],
  },
  {
    title: "Ajouter une photo ou une vidéo dans la page Media",
    items: [
      "Ouvrir « Médias », puis cliquer sur « Créer un nouveau document » (bouton « + »).",
      "Choisir le type: photo ou vidéo.",
      "Pour une photo, ajouter l'image et le crédit photo.",
      "Pour une vidéo, coller le lien YouTube/Vimeo; une miniature peut être ajoutée si besoin.",
      "Une miniature est l'image d'aperçu affichée avant que la vidéo soit lancée.",
      "Glisser-déposer les médias dans la liste pour changer leur ordre sur le site.",
    ],
  },
  {
    title: "Ajouter un article de presse",
    items: [
      "Ouvrir « Presse », puis cliquer sur « Créer un nouveau document » (bouton « + »).",
      "Ajouter une ou plusieurs captures de l'article.",
      "Indiquer la date, le titre ou la source, et éventuellement le lien vers l'article en ligne.",
      "Glisser-déposer les articles dans la liste pour ajuster l'ordre d'affichage.",
    ],
  },
  {
    title: "Publier et vérifier sur le site",
    items: [
      "Sanity sauvegarde automatiquement les modifications pendant l'édition.",
      "Pour modifier une page déjà publiée, travailler dans la version « Brouillon ».",
      "La version « Publié » correspond à ce qui est visible sur le site; elle ne se modifie pas directement.",
      "Une sauvegarde automatique crée ou met à jour le brouillon, mais ne modifie pas encore le site public.",
      "Le site public change seulement après avoir cliqué sur « Publier ».",
      "Avant de publier, utilisez le bouton « Aperçu brouillon » dans les actions du document, près du bouton « Publier » ou dans les trois petits points selon la largeur de l'écran.",
      "Après publication, ouvrir le site dans un nouvel onglet et vérifier la page concernée.",
    ],
  },
];

export function StudioHelp() {
  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.2 }}>
          Comment modifier le site
        </h1>
        <p style={introStyle}>
          Ce guide sert de repère rapide. Vous pouvez modifier les contenus sans
          risque: tant que vous ne cliquez pas sur « Publier », les changements
          restent en brouillon et ne sont pas visibles sur le site public.
        </p>

        {sections.map((section) => (
          <section key={section.title} style={sectionStyle}>
            <h2 style={titleStyle}>{section.title}</h2>
            <ul style={listStyle}>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {section.title === "Publier et vérifier sur le site" && (
              <PreviewButtons />
            )}
          </section>
        ))}

        <aside style={noteStyle}>
          <h2 style={titleStyle}>Brouillon, publié, couleurs et sécurité</h2>
          <ul style={listStyle}>
            <li>
              « Brouillon » signifie que les changements sont sauvegardés, mais
              pas encore visibles publiquement.
            </li>
            <li>
              « Publié » signifie que cette version est visible sur le site et
              sert de version de référence.
            </li>
            <li>
              Pour changer un contenu publié, ouvrir la version « Brouillon »,
              faire les modifications, puis cliquer sur « Publier » quand tout
              est prêt.
            </li>
            <li>
              Les pastilles indiquent l'état du document: orange pour «
              Brouillon », vert pour « Publié ».
            </li>
            <li>
              En cas de doute, ne publiez pas tout de suite: les modifications
              seront quand même sauvegardées automatiquement.
            </li>
            <li>
              Pour une question ou une hésitation avant publication, vous pouvez
              écrire à Isaure: isaure.lohest@gmail.com.
            </li>
          </ul>
        </aside>

        <section style={previewBoxStyle}>
          <h2 style={titleStyle}>Aperçu brouillon</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Le bouton « Aperçu brouillon » se trouve dans les actions du
            document, près de « Publier » ou dans les trois petits points si
            l'écran est trop étroit. Il ouvre une version privée du site avec
            les changements sauvegardés en brouillon. Le site public ne change
            pas tant que vous ne cliquez pas sur « Publier ».
          </p>
          <PreviewButtons />
        </section>
      </div>
    </main>
  );
}

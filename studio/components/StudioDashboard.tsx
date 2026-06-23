import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100%",
  padding: "40px",
  background: "var(--card-bg-color, #fff)",
  color: "var(--card-fg-color, #1f1f1f)",
};

const shellStyle: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.75fr)",
  gap: 24,
  alignItems: "stretch",
  marginBottom: 24,
};

const panelStyle: CSSProperties = {
  border: "1px solid var(--card-border-color, #d9d9d9)",
  borderRadius: 8,
  padding: 24,
  background: "var(--card-bg-color, #fff)",
};

const darkPanelStyle: CSSProperties = {
  ...panelStyle,
  background: "#232323",
  color: "#f7f5f3",
  borderColor: "#232323",
};

const eyebrowStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: 13,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--card-muted-fg-color, #666)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 38,
  lineHeight: 1.1,
  fontWeight: 600,
};

const textStyle: CSSProperties = {
  margin: "16px 0 0",
  fontSize: 16,
  lineHeight: 1.6,
  color: "var(--card-muted-fg-color, #5f5f5f)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const cardStyle: CSSProperties = {
  position: "relative",
  display: "block",
  minHeight: 132,
  padding: 18,
  borderRadius: 8,
  border: "1px solid var(--card-border-color, #d9d9d9)",
  color: "inherit",
  textDecoration: "none",
  background: "var(--card-bg-color, #fff)",
};

const cardTitleStyle: CSSProperties = {
  margin: "0 42px 10px 0",
  fontSize: 17,
  lineHeight: 1.3,
  fontWeight: 600,
};

const cardMarkStyle: CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "color-mix(in srgb, var(--card-bg-color, #fff) 82%, #232323 18%)",
  color: "var(--card-muted-fg-color, #5f5f5f)",
  fontSize: 16,
  lineHeight: 1,
  fontWeight: 700,
  letterSpacing: "0.04em",
};

const cardTextStyle: CSSProperties = {
  margin: 0,
  color: "var(--card-muted-fg-color, #5f5f5f)",
  fontSize: 14,
  lineHeight: 1.5,
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 22,
};

const buttonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 4,
  background: "#f7f5f3",
  color: "#232323",
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "transparent",
  color: "#f7f5f3",
  border: "1px solid rgba(247, 245, 243, 0.45)",
};

const stepsStyle: CSSProperties = {
  margin: "16px 0 0",
  paddingLeft: 20,
  lineHeight: 1.65,
};

const quickLinks = [
  {
    title: "Page d'accueil",
    mark: "🏠",
    text: "Hero, biographie, citations, contact et réseaux.",
    href: "/structure/pageDaccueil",
  },
  {
    title: "Agenda",
    mark: "🎵",
    text: "Ajouter les concerts et choisir ceux à mettre en avant.",
    href: "/structure/agenda",
  },
  {
    title: "Médias",
    mark: "🎬",
    text: "Photos, vidéos, crédits et ordre d'affichage.",
    href: "/structure/medias",
  },
  {
    title: "Presse",
    mark: "📰",
    text: "Articles, captures et liens vers les publications.",
    href: "/structure/presse",
  },
  {
    title: "Crédits photo",
    mark: "📸",
    text: "Textes de crédits affichés sur le site.",
    href: "/structure/creditsPhoto",
  },
  {
    title: "Aide",
    mark: "?",
    text: "Guide rapide pour modifier, prévisualiser et publier.",
    href: "/structure/aide",
  },
];

export function StudioDashboard() {
  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroStyle}>
          <div style={darkPanelStyle}>
            <p style={{ ...eyebrowStyle, color: "#bcb7a9" }}>Studio Sanity</p>
            <h1 style={titleStyle}>Bienvenue dans le studio de Vinciane</h1>
            <p style={{ ...textStyle, color: "#d8d3c8" }}>
              Modifiez les contenus, vérifiez les brouillons, puis publiez quand
              tout est prêt. Le site public reste inchangé tant qu'un document
              n'est pas publié.
            </p>
            <div style={buttonRowStyle}>
              <a href="/structure/pageDaccueil" style={buttonStyle}>
                Modifier le site
              </a>
              <a
                href="https://dev-vinciane.vercel.app"
                target="_blank"
                rel="noreferrer"
                style={secondaryButtonStyle}
              >
                Voir le site
              </a>
            </div>
          </div>

          <aside style={panelStyle}>
            <p style={eyebrowStyle}>Avant de publier</p>
            <ol style={stepsStyle}>
              <li>Relire les textes et vérifier les images.</li>
              <li>Utiliser « Aperçu brouillon » dans le document.</li>
              <li>Publier seulement quand la page est prête.</li>
            </ol>
          </aside>
        </section>

        <section style={gridStyle} aria-label="Raccourcis de contenu">
          {quickLinks.map((link) => (
            <a key={link.href} href={link.href} style={cardStyle}>
              <span aria-hidden="true" style={cardMarkStyle}>
                {link.mark}
              </span>
              <h2 style={cardTitleStyle}>{link.title}</h2>
              <p style={cardTextStyle}>{link.text}</p>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}

import type { DocumentActionComponent } from "sanity";

const previewBaseUrl =
  process.env.SANITY_STUDIO_PREVIEW_BASE_URL ?? "http://localhost:4321";
const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET ?? "";

const editableTypes = new Set([
  "homepage",
  "event",
  "mediaItem",
  "pressItem",
  "siteSettings",
  "legalNotice",
  "privacyPolicy",
]);

function previewPathForType(schemaType: string) {
  if (schemaType === "event") return { path: "/preview/fr", hash: "#agenda" };
  if (schemaType === "siteSettings") return { path: "/preview/fr", hash: "" };
  return { path: "/preview/fr", hash: "" };
}

export const PreviewDraftAction: DocumentActionComponent = (props) => {
  if (!editableTypes.has(props.type)) return null;

  const hasDraft = Boolean(props.draft);
  const disabled = !previewSecret || !hasDraft;
  const target = previewPathForType(props.type);
  const url = `${previewBaseUrl.replace(/\/$/, "")}${target.path}?secret=${encodeURIComponent(
    previewSecret,
  )}${target.hash}`;

  return {
    label: "Aperçu brouillon",
    title: !previewSecret
      ? "L'aperçu brouillon doit encore être configuré."
      : !hasDraft
        ? "Aucun brouillon enregistré pour ce document."
      : "Ouvrir l'aperçu brouillon dans un nouvel onglet.",
    disabled,
    group: ["default", "paneActions"],
    onHandle: () => {
      window.open(url, "_blank", "noopener,noreferrer");
      props.onComplete();
    },
  };
};

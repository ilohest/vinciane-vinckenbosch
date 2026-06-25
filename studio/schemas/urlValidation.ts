/**
 * Validation souple d'URL pour les champs « lien » du studio.
 *
 * Accepte aussi bien « https://exemple.com » que « www.exemple.com » (ou
 * « exemple.com »). Le site préfixe automatiquement « https:// » à l'affichage
 * quand le protocole est absent (voir normalizeExternalUrl côté site).
 *
 * Utiliser avec : validation: (R) => R.custom(isLooseUrl)
 */
export function isLooseUrl(value?: string): true | string {
  if (!value?.trim()) return true; // champ optionnel : vide = OK

  const trimmed = value.trim();
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:"
      ? true
      : "Lien invalide.";
  } catch {
    return "Lien invalide (ex : https://exemple.com ou www.exemple.com).";
  }
}

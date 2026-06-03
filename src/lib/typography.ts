/**
 * Typographie française — espaces fines insécables autour des guillemets.
 *
 * Insère U+202F (espace fine insécable) :
 *   - après  «  (guillemet ouvrant)
 *   - avant  »  (guillemet fermant)
 *
 * Évite les retours à la ligne disgracieux comme :
 *   « Une instrumentiste
 *   remarquable »
 *
 * Usage :
 *   <p set:html={frenchTypo(text)} />
 */
export function frenchTypo(text: string): string {
  // U+202F = espace fine insécable (NARROW NO-BREAK SPACE)
  return text
    .replace(/«\s*/g, '« ')  // « suivi d'une espace fine insécable
    .replace(/\s*»/g, ' »'); // espace fine insécable avant »
}

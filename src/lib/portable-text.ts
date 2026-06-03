import type { PTBlock, LocalizedBlocks } from './queries';

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

/**
 * Convertit des blocs Portable Text en tableau de sections {title, paragraphs}.
 * Même structure que le contenu codé en dur → les pages utilisent un seul template.
 * Les blocs h2 ouvrent une nouvelle section ; les blocs normaux sont des paragraphes.
 */
export function blocksToSections(blocks: PTBlock[]): LegalSection[] {
  const sections: LegalSection[] = [];
  let current: LegalSection | null = null;

  for (const block of blocks) {
    if (block._type !== 'block') continue;
    const text = (block.children ?? []).map((c) => c.text ?? '').join('').trim();
    if (!text) continue;

    if (block.style === 'h2') {
      current = { title: text, paragraphs: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { title: '', paragraphs: [] };
        sections.push(current);
      }
      current.paragraphs.push(text);
    }
  }

  return sections.filter((s) => s.title || s.paragraphs.length > 0);
}

/**
 * Retourne les sections depuis Sanity dans la bonne langue (fallback FR→EN→DE).
 * Retourne null si Sanity est vide → la page utilise son fallback codé.
 */
export function localizedSections(
  content: LocalizedBlocks | undefined | null,
  lang: 'fr' | 'en' | 'de',
): LegalSection[] | null {
  if (!content) return null;
  const blocks = content[lang] || content.fr || content.en || content.de;
  if (!blocks || blocks.length === 0) return null;
  const sections = blocksToSections(blocks);
  return sections.length > 0 ? sections : null;
}

import type { FieldProps } from 'sanity';

/**
 * Champ informatif sans input — affiche juste une note dans le formulaire.
 * Usage dans le schéma :
 *   components: { field: InfoNote }
 */
export function InfoNote({ title, description }: FieldProps) {
  return (
    <div
      style={{
        padding: '10px 14px',
        marginBottom: 4,
        background: 'color-mix(in srgb, var(--card-bg-color) 85%, var(--card-focus-ring-color, #0070f3) 15%)',
        border: '1px solid color-mix(in srgb, var(--card-border-color) 60%, var(--card-focus-ring-color, #0070f3) 40%)',
        borderRadius: 4,
      }}
    >
      {title && (
        <p style={{ fontWeight: 600, fontSize: 13, margin: '0 0 4px 0' }}>
          {title}
        </p>
      )}
      {description && (
        <p style={{ fontSize: 12, margin: 0, opacity: 0.85, lineHeight: 1.5 }}>
          {description}
        </p>
      )}
    </div>
  );
}

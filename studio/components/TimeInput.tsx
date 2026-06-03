import { set, unset } from 'sanity';
import type { StringInputProps } from 'sanity';

/**
 * Input heure natif pour Sanity Studio.
 * Utilise <input type="time"> du navigateur → retourne HH:MM (ex: 20:00).
 */
export function TimeInput(props: StringInputProps) {
  const { value, onChange, readOnly, elementProps } = props;

  return (
    <input
      {...elementProps}
      type="time"
      value={value ?? ''}
      readOnly={readOnly}
      onChange={(e) =>
        onChange(e.target.value ? set(e.target.value) : unset())
      }
      style={{
        width: '100%',
        padding: '6px 10px',
        border: '1px solid var(--card-border-color, #ccc)',
        borderRadius: 3,
        background: 'var(--card-bg-color, #fff)',
        color: 'var(--card-fg-color, #000)',
        fontSize: 14,
        fontFamily: 'inherit',
      }}
    />
  );
}

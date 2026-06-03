import { set, unset } from 'sanity';
import type { StringInputProps } from 'sanity';

const COUNTRIES: { code: string; name: string }[] = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albanie' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'AO', name: 'Angola' },
  { code: 'SA', name: 'Arabie Saoudite' },
  { code: 'AR', name: 'Argentine' },
  { code: 'AM', name: 'Arménie' },
  { code: 'AU', name: 'Australie' },
  { code: 'AT', name: 'Autriche' },
  { code: 'AZ', name: 'Azerbaïdjan' },
  { code: 'BE', name: 'Belgique' },
  { code: 'BY', name: 'Biélorussie' },
  { code: 'BO', name: 'Bolivie' },
  { code: 'BA', name: 'Bosnie-Herzégovine' },
  { code: 'BR', name: 'Brésil' },
  { code: 'BG', name: 'Bulgarie' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chili' },
  { code: 'CN', name: 'Chine' },
  { code: 'CY', name: 'Chypre' },
  { code: 'CO', name: 'Colombie' },
  { code: 'KR', name: 'Corée du Sud' },
  { code: 'HR', name: 'Croatie' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DK', name: 'Danemark' },
  { code: 'EG', name: 'Égypte' },
  { code: 'AE', name: 'Émirats arabes unis' },
  { code: 'EC', name: 'Équateur' },
  { code: 'ES', name: 'Espagne' },
  { code: 'EE', name: 'Estonie' },
  { code: 'US', name: 'États-Unis' },
  { code: 'ET', name: 'Éthiopie' },
  { code: 'FI', name: 'Finlande' },
  { code: 'FR', name: 'France' },
  { code: 'GE', name: 'Géorgie' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Grèce' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HU', name: 'Hongrie' },
  { code: 'IN', name: 'Inde' },
  { code: 'ID', name: 'Indonésie' },
  { code: 'IQ', name: 'Irak' },
  { code: 'IR', name: 'Iran' },
  { code: 'IE', name: 'Irlande' },
  { code: 'IS', name: 'Islande' },
  { code: 'IL', name: 'Israël' },
  { code: 'IT', name: 'Italie' },
  { code: 'JP', name: 'Japon' },
  { code: 'JO', name: 'Jordanie' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LV', name: 'Lettonie' },
  { code: 'LB', name: 'Liban' },
  { code: 'LT', name: 'Lituanie' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MK', name: 'Macédoine du Nord' },
  { code: 'MY', name: 'Malaisie' },
  { code: 'MA', name: 'Maroc' },
  { code: 'MX', name: 'Mexique' },
  { code: 'MD', name: 'Moldavie' },
  { code: 'MN', name: 'Mongolie' },
  { code: 'ME', name: 'Monténégro' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibie' },
  { code: 'NO', name: 'Norvège' },
  { code: 'NZ', name: 'Nouvelle-Zélande' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Pologne' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Roumanie' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'RU', name: 'Russie' },
  { code: 'RS', name: 'Serbie' },
  { code: 'SG', name: 'Singapour' },
  { code: 'SK', name: 'Slovaquie' },
  { code: 'SI', name: 'Slovénie' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'SE', name: 'Suède' },
  { code: 'CH', name: 'Suisse' },
  { code: 'TW', name: 'Taïwan' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'TH', name: 'Thaïlande' },
  { code: 'CZ', name: 'Tchéquie' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'TR', name: 'Türkiye' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Viêt Nam' },
];

/**
 * Sélecteur de pays pour Sanity Studio.
 * Affiche les noms en français, stocke le code ISO 2 lettres (ex: FR, DE, BE).
 * Tapez les premières lettres du pays pour naviguer rapidement dans la liste.
 */
export function CountryInput(props: StringInputProps) {
  const { value, onChange, readOnly, elementProps } = props;

  return (
    <select
      {...elementProps}
      value={value ?? ''}
      disabled={readOnly}
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
        cursor: readOnly ? 'not-allowed' : 'default',
      }}
    >
      <option value="">— Sélectionner un pays —</option>
      {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name, 'fr')).map((c) => (
        <option key={c.code} value={c.code}>
          {c.name} ({c.code})
        </option>
      ))}
    </select>
  );
}

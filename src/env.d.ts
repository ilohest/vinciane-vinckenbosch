/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Hôte SMTP (ex: smtp.gmail.com, ssl0.ovh.net…) */
  readonly SMTP_HOST: string;
  /** Port SMTP (587 STARTTLS, ou 465 SSL) */
  readonly SMTP_PORT?: string;
  /** Identifiant SMTP (souvent l'adresse email) */
  readonly SMTP_USER: string;
  /** Mot de passe SMTP / mot de passe d'application */
  readonly SMTP_PASS: string;
  /** Adresse qui reçoit les notifications (boîte de Vinciane) */
  readonly OWNER_EMAIL: string;
  /** Optionnel : adresse d'expédition affichée (From) */
  readonly SMTP_FROM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

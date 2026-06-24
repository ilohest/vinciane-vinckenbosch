import type { Lang } from "./types";

/**
 * Templates d'email pour le formulaire de contact.
 * Style aligné sur le site : fond sombre #232323, accent terracotta #DA7F52,
 * texte crème, typographie serif élégante (fallback web-safe, les polices
 * custom n'étant pas fiables dans les clients mail).
 */

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  lang: Lang;
}

const COLORS = {
  dark: "#232323",
  cream: "#F7F5F3",
  accent: "#DA7F52",
  beige: "#E6E3DB",
};

// Échappe le HTML pour éviter toute injection dans les emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Convertit les retours à la ligne en <br>
function nl2br(str: string): string {
  return escapeHtml(str).replace(/\n/g, "<br>");
}

/* ────────────────────────────────────────────────────────────
   TEXTES TRADUITS
──────────────────────────────────────────────────────────── */
const i18n = {
  fr: {
    // Mail de confirmation (à l'expéditeur)
    confirmSubject: "Merci pour votre message",
    confirmGreeting: (name: string) => `Bonjour ${name},`,
    confirmIntro:
      "Merci d’avoir pris contact. Votre message a bien été reçu et je vous répondrai dans les meilleurs délais.",
    confirmRecap: "Récapitulatif de votre message :",
    confirmSignature: "Bien musicalement,",
    confirmName: "Vinciane Vinckenbosch",
    confirmRole: "Altiste",
    // Mail de notification (à Vinciane)
    notifySubject: (name: string) => `Nouveau message de ${name}`,
    notifyTitle: "Nouveau message reçu",
    labelName: "Nom",
    labelEmail: "Email",
    labelMessage: "Message",
    notifyReply: "Répondre directement à cette personne →",
  },
  en: {
    confirmSubject: "Thank you for your message",
    confirmGreeting: (name: string) => `Hello ${name},`,
    confirmIntro:
      "Thank you for getting in touch. Your message has been received and I will get back to you as soon as possible.",
    confirmRecap: "Summary of your message:",
    confirmSignature: "Warm regards,",
    confirmName: "Vinciane Vinckenbosch",
    confirmRole: "Violist",
    notifySubject: (name: string) => `New message from ${name}`,
    notifyTitle: "New message received",
    labelName: "Name",
    labelEmail: "Email",
    labelMessage: "Message",
    notifyReply: "Reply directly to this person →",
  },
  de: {
    confirmSubject: "Vielen Dank für Ihre Nachricht",
    confirmGreeting: (name: string) => `Hallo ${name},`,
    confirmIntro:
      "Vielen Dank für Ihre Kontaktaufnahme. Ihre Nachricht ist eingegangen und ich werde mich so bald wie möglich bei Ihnen melden.",
    confirmRecap: "Zusammenfassung Ihrer Nachricht:",
    confirmSignature: "Mit musikalischen Grüßen,",
    confirmName: "Vinciane Vinckenbosch",
    confirmRole: "Bratschistin",
    notifySubject: (name: string) => `Neue Nachricht von ${name}`,
    notifyTitle: "Neue Nachricht erhalten",
    labelName: "Name",
    labelEmail: "Email",
    labelMessage: "Nachricht",
    notifyReply: "Antworten Sie dieser Person direkt →",
  },
} as const;

/* ────────────────────────────────────────────────────────────
   SHELL HTML COMMUN (table-based pour compatibilité clients mail)
──────────────────────────────────────────────────────────── */
function emailShell(innerHtml: string): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:${COLORS.dark};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.dark};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${COLORS.dark};">
          <!-- Logo / Nom -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.08em;color:${COLORS.cream};">
                Vinciane Vinckenbosch
              </span>
              <div style="width:32px;height:1px;background-color:${COLORS.accent};margin:14px auto 0;"></div>
            </td>
          </tr>
          ${innerHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ────────────────────────────────────────────────────────────
   MAIL DE CONFIRMATION (à l'expéditeur, dans SA langue)
──────────────────────────────────────────────────────────── */
export function buildConfirmationEmail(payload: ContactPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const t = i18n[payload.lang] ?? i18n.fr;
  const safeName = escapeHtml(payload.name);

  const inner = `
    <tr>
      <td style="background-color:${COLORS.beige};border-radius:2px;padding:40px 36px;">
        <p style="margin:0 0 20px 0;font-family:Georgia,serif;font-size:18px;color:${COLORS.dark};">
          ${t.confirmGreeting(safeName)}
        </p>
        <p style="margin:0 0 28px 0;font-family:Georgia,serif;font-size:15px;line-height:1.7;color:#3a3a3a;">
          ${t.confirmIntro}
        </p>

        <!-- Récap message -->
        <p style="margin:0 0 10px 0;font-family:Georgia,serif;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:${COLORS.accent};">
          ${t.confirmRecap}
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:2px solid ${COLORS.accent};">
          <tr>
            <td style="padding:4px 0 4px 16px;font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#3a3a3a;font-style:italic;">
              ${nl2br(payload.message)}
            </td>
          </tr>
        </table>

        <!-- Signature -->
        <p style="margin:32px 0 4px 0;font-family:Georgia,serif;font-size:14px;color:#3a3a3a;">
          ${t.confirmSignature}
        </p>
        <p style="margin:0;font-family:Georgia,serif;font-size:16px;color:${COLORS.dark};">
          ${t.confirmName}
        </p>
        <p style="margin:2px 0 0 0;font-family:Georgia,serif;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:${COLORS.accent};">
          ${t.confirmRole}
        </p>
      </td>
    </tr>`;

  const text = `${t.confirmGreeting(payload.name)}\n\n${t.confirmIntro}\n\n${t.confirmRecap}\n${payload.message}\n\n${t.confirmSignature}\n${t.confirmName} — ${t.confirmRole}`;

  return { subject: t.confirmSubject, html: emailShell(inner), text };
}

/* ────────────────────────────────────────────────────────────
   MAIL DE NOTIFICATION (à Vinciane, en français)
──────────────────────────────────────────────────────────── */
export function buildNotificationEmail(payload: ContactPayload): {
  subject: string;
  html: string;
  text: string;
} {
  // La notification interne est toujours en français
  const t = i18n.fr;
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:14px 0 4px 0;font-family:Georgia,serif;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:${COLORS.accent};">
        ${label}
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 8px 0;font-family:Georgia,serif;font-size:15px;line-height:1.6;color:${COLORS.dark};border-bottom:1px solid rgba(35,35,35,0.1);">
        ${value}
      </td>
    </tr>`;

  const inner = `
    <tr>
      <td style="background-color:${COLORS.beige};border-radius:2px;padding:40px 36px;">
        <p style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:18px;color:${COLORS.dark};">
          ${t.notifyTitle}
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row(t.labelName, safeName)}
          ${row(t.labelEmail, `<a href="mailto:${safeEmail}" style="color:${COLORS.accent};text-decoration:none;">${safeEmail}</a>`)}
          ${row(t.labelMessage, nl2br(payload.message))}
        </table>

        <!-- Bouton répondre -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;">
          <tr>
            <td style="border:1px solid ${COLORS.dark};border-radius:9999px;">
              <a href="mailto:${safeEmail}" style="display:inline-block;padding:10px 24px;font-family:Georgia,serif;font-size:13px;text-transform:uppercase;letter-spacing:0.06em;color:${COLORS.dark};text-decoration:none;">
                ${t.notifyReply}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const text = `${t.notifyTitle}\n\n${t.labelName}: ${payload.name}\n${t.labelEmail}: ${payload.email}\n${t.labelMessage}:\n${payload.message}`;

  return {
    subject: t.notifySubject(payload.name),
    html: emailShell(inner),
    text,
  };
}

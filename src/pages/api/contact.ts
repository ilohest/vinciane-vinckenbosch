import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { buildConfirmationEmail, buildNotificationEmail } from '../../lib/email-templates';
import type { Lang } from '../../lib/types';

// Cette route tourne en serverless (pas de pré-rendu statique)
export const prerender = false;

const LANGS: Lang[] = ['fr', 'en', 'de'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Parse
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();
  const lang: Lang = LANGS.includes(body.lang as Lang) ? (body.lang as Lang) : 'fr';
  // Honeypot anti-spam : champ caché qui doit rester vide
  const honeypot = String(body.company ?? '').trim();

  // 2. Validation
  if (honeypot) {
    // Bot détecté → on répond OK sans rien envoyer
    return json({ ok: true });
  }
  if (!name || name.length > 100) return json({ ok: false, error: 'invalid_name' }, 400);
  if (!email || !EMAIL_RE.test(email) || email.length > 150)
    return json({ ok: false, error: 'invalid_email' }, 400);
  if (!message || message.length < 5 || message.length > 5000)
    return json({ ok: false, error: 'invalid_message' }, 400);

  // 3. Config SMTP (variables d'environnement)
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    OWNER_EMAIL,
    SMTP_FROM,
  } = import.meta.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !OWNER_EMAIL) {
    console.error('[contact] SMTP config manquante');
    return json({ ok: false, error: 'server_misconfigured' }, 500);
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465, // true pour 465, false pour 587
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  // Adresse d'expédition affichée (par défaut le compte SMTP)
  const from = SMTP_FROM || `Vinciane Vinckenbosch <${SMTP_USER}>`;

  const payload = { name, email, message, lang };

  try {
    // 4a. Notification à Vinciane (français, avec reply-to vers l'expéditeur)
    const notif = buildNotificationEmail(payload);
    await transporter.sendMail({
      from,
      to: OWNER_EMAIL,
      replyTo: `${name} <${email}>`,
      subject: notif.subject,
      text: notif.text,
      html: notif.html,
    });

    // 4b. Confirmation à l'expéditeur (dans sa langue)
    const confirm = buildConfirmationEmail(payload);
    await transporter.sendMail({
      from,
      to: `${name} <${email}>`,
      subject: confirm.subject,
      text: confirm.text,
      html: confirm.html,
    });

    return json({ ok: true });
  } catch (err) {
    console.error('[contact] envoi échoué', err);
    return json({ ok: false, error: 'send_failed' }, 502);
  }
};

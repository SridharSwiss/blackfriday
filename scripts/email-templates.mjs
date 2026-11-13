/* Builds the Supabase Auth email templates (table layout, inline styles, safe for Gmail/Outlook/Apple Mail).
   Run: npm run emails  ->  supabase/email-templates/*.html  (paste each into Authentication > Emails > Templates). */
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = new URL("../supabase/email-templates/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const RED = "#D52B1E", INK = "#151314", MUTED = "#6B6465", LINE = "#E8E3E0", BG = "#F6F4F2";
const F = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const layout = ({ pre, title, lead, body, cta, url, note }) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BG};">${pre}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};"><tr><td align="center" style="padding:32px 12px;">
 <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
  <tr><td style="padding:0 4px 16px;font-family:${F};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="32" height="32" align="center" valign="middle" bgcolor="${RED}" style="background:${RED};border-radius:6px;color:#ffffff;font:700 22px/32px ${F};">&#10010;</td>
      <td style="padding-left:10px;font:800 20px/32px ${F};letter-spacing:.5px;color:${INK};">AKTION<span style="color:${RED};">.CH</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td height="5" style="background:${RED};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:34px 34px 8px;font-family:${F};color:${INK};">
        <p style="margin:0 0 6px;font:700 12px/1 ${F};letter-spacing:1.6px;text-transform:uppercase;color:${RED};">${lead}</p>
        <h1 style="margin:0 0 14px;font:800 26px/1.2 ${F};color:${INK};">${title}</h1>
        <div style="font:400 15px/1.6 ${F};color:#3a3536;">${body}</div>
      </td></tr>
      <tr><td align="center" style="padding:20px 34px 8px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="${RED}" style="background:${RED};border-radius:10px;">
          <a href="${url}" target="_blank" style="display:inline-block;padding:15px 34px;font:700 16px/1 ${F};color:#ffffff;text-decoration:none;border-radius:10px;">${cta}</a>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding:14px 34px 30px;font:400 12.5px/1.6 ${F};color:${MUTED};">
        Button not working? Copy this address into your browser:<br>
        <a href="${url}" target="_blank" style="color:${MUTED};word-break:break-all;">${url}</a>
      </td></tr>
      <tr><td style="padding:0 34px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background:${LINE};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
      <tr><td style="padding:18px 34px 26px;font:400 12.5px/1.6 ${F};color:${MUTED};">${note}</td></tr>
    </table>
  </td></tr>
  <tr><td align="center" style="padding:20px 8px 0;font:400 12px/1.6 ${F};color:${MUTED};">
    AKTION.CH &middot; Swiss Black Friday deals, checked daily<br>
    Sent to {{ .Email }} &middot; <a href="{{ .SiteURL }}" style="color:${MUTED};">{{ .SiteURL }}</a>
  </td></tr>
 </table>
</td></tr></table></body></html>`;

const T = {
  "magic-link": { subject: "Your AKTION.CH sign-in link", pre: "Tap the button to sign in. The link works once and expires soon.", lead: "Sign in", title: "Your sign-in link",
    body: "<p style=\"margin:0 0 10px;\">Tap the button below to sign in to AKTION.CH. No password needed, and your saved deals follow you on every device.</p><p style=\"margin:0;\">The link works once and expires in 1 hour.</p>",
    cta: "Sign in to AKTION.CH", url: "{{ .ConfirmationURL }}", note: "Didn't ask for this? You can ignore this email. Nobody can sign in without the link, and nothing changes on your account." },
  "confirm-signup": { subject: "Welcome to AKTION.CH, confirm your email", pre: "One tap to confirm your email and start saving deals.", lead: "Welcome", title: "Confirm your email",
    body: "<p style=\"margin:0 0 10px;\">Thanks for joining AKTION.CH. Confirm your email to save deals, get your list on every device and follow price drops this Black Friday.</p><p style=\"margin:0;\">The link works once and expires in 1 hour.</p>",
    cta: "Confirm my email", url: "{{ .ConfirmationURL }}", note: "Didn't create an account? Ignore this email and nothing will be created. You can delete your account and data at any time from the account window." },
  "change-email": { subject: "Confirm your new AKTION.CH email address", pre: "Confirm the change of email address on your account.", lead: "Account", title: "Confirm your new email",
    body: "<p style=\"margin:0 0 10px;\">You asked to change the email address on your AKTION.CH account to <b>{{ .NewEmail }}</b>.</p><p style=\"margin:0;\">Confirm below to complete the change.</p>",
    cta: "Confirm new email", url: "{{ .ConfirmationURL }}", note: "Didn't request this? Ignore this email, your address stays as it is." },
  "reset-password": { subject: "Reset your AKTION.CH password", pre: "Tap the button to choose a new password.", lead: "Password", title: "Reset your password",
    body: "<p style=\"margin:0 0 10px;\">We received a request to reset the password for your AKTION.CH account.</p><p style=\"margin:0;\">Tap the button, then choose a new password in your account window. The link works once and expires in 1 hour.</p>",
    cta: "Choose a new password", url: "{{ .ConfirmationURL }}", note: "Didn't ask for this? Ignore this email, your password stays as it is." },
  "reauthentication": { subject: "Your AKTION.CH confirmation code", pre: "Your one-time code is {{ .Token }}.", lead: "Security check", title: "Your confirmation code",
    body: "<p style=\"margin:0 0 14px;\">Enter this code to confirm it's you:</p><p style=\"margin:0;font:800 34px/1 'Courier New',monospace;letter-spacing:8px;color:#151314;\">{{ .Token }}</p>",
    cta: "Open AKTION.CH", url: "{{ .SiteURL }}", note: "Never share this code. We will never ask for it by phone or chat." }
};
const index = [];
for (const [k, t] of Object.entries(T)) { writeFileSync(new URL(k + ".html", OUT), layout(t)); index.push(`- ${k}.html — subject: "${t.subject}"`); }
writeFileSync(new URL("README.md", OUT), `# Supabase email templates (AKTION.CH)\nGenerated by \`npm run emails\`. In Supabase: Authentication > Emails > Templates, paste the HTML and set the subject.\n\n${index.join("\n")}\n\nMapping: Reset Password = forgot-password link; Magic link = existing users signing in; Confirm signup = first sign-in of a new user; Change email address; Reauthentication.\nSender: use a verified Resend domain (SPF + DKIM + DMARC) with a from name of "AKTION.CH".\n`);
console.log("templates:", Object.keys(T).join(", "));

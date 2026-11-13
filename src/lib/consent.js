/* Cookie and privacy consent. Strictly necessary storage (theme, saved list, this choice) needs no consent;
   analytics is opt-in and off until the visitor accepts. Choice is stored in localStorage and a first-party cookie. */
import { POLICY_VERSION, OPERATOR, BACKEND, ENABLED } from "../config/backend.js";

const KEY = "bf-consent", VID = "bf-vid";
const subs = [];
export const onConsent = fn => subs.push(fn);
export function getConsent() {
  try { const c = JSON.parse(localStorage.getItem(KEY) || "null"); return c && c.v === POLICY_VERSION ? c : null; } catch (e) { return null; }
}
export function visitorId() {
  const c = getConsent(); if (!c || !c.a) return null;
  try { let v = localStorage.getItem(VID); if (!v) { v = crypto.randomUUID(); localStorage.setItem(VID, v); } return v; } catch (e) { return null; }
}
export function setConsent(analytics) {
  const c = { v: POLICY_VERSION, a: !!analytics, t: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(c)); if (!analytics) { localStorage.removeItem(VID); sessionStorage.removeItem("bf-sid"); } } catch (e) {}
  try { document.cookie = `bf_consent=${analytics ? "all" : "necessary"}; Max-Age=31536000; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; } catch (e) {}
  subs.forEach(f => { try { f(c); } catch (e) {} });
  return c;
}

const L = {
  en: { t: "Cookies & privacy", p: "We use essential storage to run the site. With your consent we also count anonymous visits and shop clicks to improve it. No ads, no selling data.", all: "Accept all", no: "Necessary only", set: "Settings", pol: "Privacy policy",
    ess: "Essential", essd: "Theme, saved list, this choice. Always on.", ana: "Analytics", anad: "Anonymous visits, tabs viewed, shop clicks. Random ID, no IP address.", save: "Save choice", close: "Close" },
  de: { t: "Cookies & Datenschutz", p: "Wir nutzen notwendigen Speicher für den Betrieb. Mit deiner Einwilligung zählen wir zusätzlich anonyme Besuche und Shop-Klicks, um die Seite zu verbessern. Keine Werbung, kein Datenverkauf.", all: "Alle akzeptieren", no: "Nur notwendige", set: "Einstellungen", pol: "Datenschutzerklärung",
    ess: "Notwendig", essd: "Design, Merkliste, diese Auswahl. Immer aktiv.", ana: "Statistik", anad: "Anonyme Besuche, Tabs, Shop-Klicks. Zufällige ID, keine IP-Adresse.", save: "Auswahl speichern", close: "Schliessen" },
  fr: { t: "Cookies et confidentialité", p: "Nous utilisons un stockage essentiel au fonctionnement. Avec votre accord, nous comptons aussi les visites anonymes et les clics vers les shops pour améliorer le site. Pas de publicité, pas de vente de données.", all: "Tout accepter", no: "Nécessaires seulement", set: "Réglages", pol: "Politique de confidentialité",
    ess: "Essentiel", essd: "Thème, liste, ce choix. Toujours actif.", ana: "Statistiques", anad: "Visites anonymes, onglets, clics shop. ID aléatoire, pas d'adresse IP.", save: "Enregistrer", close: "Fermer" },
  it: { t: "Cookie e privacy", p: "Usiamo memoria essenziale per far funzionare il sito. Con il tuo consenso contiamo anche visite anonime e clic sugli shop per migliorarlo. Niente pubblicità, nessuna vendita di dati.", all: "Accetta tutto", no: "Solo necessari", set: "Impostazioni", pol: "Informativa privacy",
    ess: "Essenziali", essd: "Tema, lista, questa scelta. Sempre attivi.", ana: "Statistiche", anad: "Visite anonime, schede, clic sugli shop. ID casuale, nessun indirizzo IP.", save: "Salva scelta", close: "Chiudi" }
};
const POL = {
  en: [["Who we are", `${OPERATOR.name} is a Swiss deals-comparison site. We show offers and link to shops; we do not sell products.${OPERATOR.contact ? " Contact: " + OPERATOR.contact + "." : ""}`],
    ["What we store without consent", "Strictly necessary data in your browser: light/dark mode, your saved list, price memory for \"since your last visit\", and your cookie choice. This stays on your device."],
    ["Analytics (only if you accept)", "A random visitor ID and session ID, the tab or page viewed, shop clicks, saves, language, device type (mobile/tablet/desktop), campaign tags (utm) and the referring site name. We do not store your IP address, your search text or any fingerprint."],
    ["Accounts (optional)", "If you sign in by email link we store your email address and your synced saved list. You can sign out or delete your account and linked data at any time from the account window."],
    ["Consent record", "We keep your choice (accepted or declined), the policy version and the time, so we can show it was respected."],
    ["Shops and affiliate links", "Many links go to shops (e.g. Amazon, Digitec). We may earn a commission. Those shops set their own cookies under their own policies once you click."],
    ["Service provider and retention", "Data is processed by our database provider Supabase. Analytics events are deleted after 14 months. We do not sell data or use it for advertising."],
    ["Your rights", "Under the Swiss Data Protection Act (nDSG) and the GDPR you can ask for access, correction or deletion. Change or withdraw your cookie choice any time via \"Cookie settings\" at the bottom of the page."]],
  de: [["Wer wir sind", `${OPERATOR.name} ist eine Schweizer Angebotsvergleichs-Seite. Wir zeigen Angebote und verlinken auf Shops; wir verkaufen keine Produkte.${OPERATOR.contact ? " Kontakt: " + OPERATOR.contact + "." : ""}`],
    ["Speicherung ohne Einwilligung", "Notwendige Daten in deinem Browser: Hell/Dunkel-Modus, deine Merkliste, Preisgedächtnis für «seit deinem letzten Besuch» und deine Cookie-Auswahl. Sie bleiben auf deinem Gerät."],
    ["Statistik (nur mit Einwilligung)", "Eine zufällige Besucher- und Sitzungs-ID, angesehener Tab bzw. Seite, Shop-Klicks, Merken, Sprache, Gerätetyp (Mobil/Tablet/Desktop), Kampagnen-Tags (utm) und der Name der verweisenden Seite. Wir speichern weder deine IP-Adresse noch deinen Suchtext noch einen Fingerabdruck."],
    ["Konto (optional)", "Bei Anmeldung per E-Mail-Link speichern wir deine E-Mail-Adresse und deine synchronisierte Merkliste. Du kannst dich jederzeit abmelden oder dein Konto samt Daten im Konto-Fenster löschen."],
    ["Einwilligungsnachweis", "Wir speichern deine Auswahl (akzeptiert oder abgelehnt), die Version der Erklärung und den Zeitpunkt, um die Einhaltung nachweisen zu können."],
    ["Shops und Affiliate-Links", "Viele Links führen zu Shops (z. B. Amazon, Digitec). Wir erhalten ggf. eine Provision. Diese Shops setzen nach dem Klick eigene Cookies gemäss ihren Richtlinien."],
    ["Dienstleister und Aufbewahrung", "Die Daten werden bei unserem Datenbank-Anbieter Supabase verarbeitet. Statistik-Ereignisse werden nach 14 Monaten gelöscht. Wir verkaufen keine Daten und nutzen sie nicht für Werbung."],
    ["Deine Rechte", "Nach dem Schweizer Datenschutzgesetz (nDSG) und der DSGVO kannst du Auskunft, Berichtigung oder Löschung verlangen. Deine Cookie-Auswahl kannst du jederzeit über «Cookie-Einstellungen» unten auf der Seite ändern oder widerrufen."]]
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function initConsent(lang) {
  const t = L[lang] || L.en;
  let bar = null;
  const closeBar = () => { if (bar) { bar.remove(); bar = null; } };
  const choose = a => { setConsent(a); closeBar(); };
  function openBar(settings) {
    closeBar();
    const cur = getConsent();
    bar = document.createElement("section");
    bar.className = "cb"; bar.setAttribute("role", "dialog"); bar.setAttribute("aria-label", t.t);
    bar.innerHTML = `<b>${esc(t.t)}</b><p>${esc(t.p)} <button type="button" class="linkbtn" data-cb-pol>${esc(t.pol)}</button></p>
      ${settings ? `<div class="cb-opts"><label><input type="checkbox" checked disabled> <span><b>${esc(t.ess)}</b> ${esc(t.essd)}</span></label>
      <label><input type="checkbox" id="cb-ana"${cur && cur.a ? " checked" : ""}> <span><b>${esc(t.ana)}</b> ${esc(t.anad)}</span></label></div>` : ""}
      <div class="cb-btns">${settings ? `<button type="button" class="pbtn solid" data-cb-save>${esc(t.save)}</button>` : `<button type="button" class="pbtn" data-cb-set>${esc(t.set)}</button>`}
      <button type="button" class="pbtn" data-cb-no>${esc(t.no)}</button><button type="button" class="pbtn solid" data-cb-all>${esc(t.all)}</button></div>`;
    bar.onclick = e => {
      if (e.target.closest("[data-cb-all]")) choose(true);
      else if (e.target.closest("[data-cb-no]")) choose(false);
      else if (e.target.closest("[data-cb-set]")) openBar(true);
      else if (e.target.closest("[data-cb-save]")) choose(!!bar.querySelector("#cb-ana").checked);
      else if (e.target.closest("[data-cb-pol]")) openPolicy();
    };
    document.body.appendChild(bar);
  }
  function openPolicy() {
    const w = document.createElement("div"); w.className = "modal"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true");
    w.innerHTML = `<div class="pol"><button class="close" type="button" aria-label="${esc(t.close)}">×</button><h3>${esc(t.pol)}</h3><p class="muted">${esc(POL[lang] ? "" : "English version")} v${esc(POLICY_VERSION)}</p>
      ${(POL[lang] || POL.en).map(([h, b]) => `<h4>${esc(h)}</h4><p>${esc(b)}</p>`).join("")}</div>`;
    const x = () => { w.remove(); document.removeEventListener("keydown", k); };
    const k = e => { if (e.key === "Escape") x(); };
    w.onclick = e => { if (e.target === w || e.target.closest(".close")) x(); };
    document.addEventListener("keydown", k); document.body.appendChild(w); w.querySelector(".close").focus();
  }
  document.querySelectorAll("[data-cookie-settings]").forEach(b => b.addEventListener("click", () => openBar(true)));
  document.querySelectorAll("[data-privacy]").forEach(b => b.addEventListener("click", openPolicy));
  if (!getConsent()) openBar(false);
}

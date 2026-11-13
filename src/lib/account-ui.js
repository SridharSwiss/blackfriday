/* Account window: email-link login, sign-out, delete account. Only wired when the backend is configured. */
import { sendLink, signOut, deleteAccount, user } from "./auth.js";
const L = {
  en: { t: "Your account", p: "Sign in with an email link (no password). Your saved list syncs across devices.", em: "Email address", go: "Send me a link", sent: "Check your inbox and open the link.", err: "Could not send. Check the address and try again.", as: "Signed in as", out: "Sign out", del: "Delete my account and data", sure: "Delete your account, saved list and linked analytics permanently?", x: "Close", note: "By signing in you agree to the privacy policy." },
  de: { t: "Dein Konto", p: "Melde dich per E-Mail-Link an (ohne Passwort). Deine Merkliste wird geräteübergreifend synchronisiert.", em: "E-Mail-Adresse", go: "Link senden", sent: "Prüfe dein Postfach und öffne den Link.", err: "Senden fehlgeschlagen. Adresse prüfen und erneut versuchen.", as: "Angemeldet als", out: "Abmelden", del: "Konto und Daten löschen", sure: "Konto, Merkliste und verknüpfte Statistik endgültig löschen?", x: "Schliessen", note: "Mit der Anmeldung stimmst du der Datenschutzerklärung zu." }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export function initAccountUi(lang, onChange) {
  const t = L[lang] || L.en;
  const open = () => {
    const w = document.createElement("div"); w.className = "modal"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true");
    const u = user(), x = () => w.remove();
    w.innerHTML = `<div class="pol acct"><button class="close" type="button" aria-label="${esc(t.x)}">×</button><h3>${esc(t.t)}</h3>` + (u
      ? `<p>${esc(t.as)} <b>${esc(u.email)}</b></p><div class="cb-btns"><button class="pbtn" data-out>${esc(t.out)}</button><button class="pbtn" data-del>${esc(t.del)}</button></div>`
      : `<p>${esc(t.p)}</p><form data-f><input type="email" required autocomplete="email" placeholder="${esc(t.em)}" aria-label="${esc(t.em)}"><button class="pbtn solid">${esc(t.go)}</button></form><p class="muted" data-m>${esc(t.note)}</p>`) + `</div>`;
    w.onclick = async e => {
      if (e.target === w || e.target.closest(".close")) return x();
      if (e.target.closest("[data-out]")) { signOut(); x(); onChange(); }
      if (e.target.closest("[data-del]") && confirm(t.sure)) { if (await deleteAccount()) { x(); onChange(); } }
    };
    w.addEventListener("submit", async e => {
      e.preventDefault(); const m = w.querySelector("[data-m]"); m.textContent = "…";
      m.textContent = (await sendLink(w.querySelector("input").value.trim())) ? t.sent : t.err;
    });
    document.body.appendChild(w); (w.querySelector("input") || w.querySelector(".close")).focus();
  };
  const b = document.getElementById("acct"); b.hidden = false; b.onclick = open;
}

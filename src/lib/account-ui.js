/* Account / profile window: sign in (password or email link), forgot password, change password, admin link (admins only), sign out, delete. */
import { sendLink, signOut, deleteAccount, user, signInPassword, setPassword, resetPassword, isAdmin } from "./auth.js";
const L = {
  en: { t: "Your account", p: "Sign in to sync your saved list across devices.", em: "Email address", pw: "Password", go: "Sign in", link: "Email me a sign-in link", forgot: "Forgot password?", sent: "Check your inbox and open the link.", err: "Something went wrong", bad: "Wrong email or password.",
    as: "Signed in as", out: "Sign out", del: "Delete my account and data", sure: "Delete your account, saved list and linked analytics permanently?", x: "Close", note: "By signing in you agree to the privacy policy.",
    chg: "Change password", np: "New password (min. 8 characters)", cp: "Repeat new password", save: "Save password", saved: "Password updated.", short: "Use at least 8 characters.", diff: "The passwords do not match.", admin: "Admin dashboard", rec: "Set a new password for your account." },
  de: { t: "Dein Konto", p: "Melde dich an, um deine Merkliste geräteübergreifend zu synchronisieren.", em: "E-Mail-Adresse", pw: "Passwort", go: "Anmelden", link: "Anmelde-Link per E-Mail senden", forgot: "Passwort vergessen?", sent: "Prüfe dein Postfach und öffne den Link.", err: "Etwas ist schiefgelaufen", bad: "E-Mail oder Passwort falsch.",
    as: "Angemeldet als", out: "Abmelden", del: "Konto und Daten löschen", sure: "Konto, Merkliste und verknüpfte Statistik endgültig löschen?", x: "Schliessen", note: "Mit der Anmeldung stimmst du der Datenschutzerklärung zu.",
    chg: "Passwort ändern", np: "Neues Passwort (mind. 8 Zeichen)", cp: "Neues Passwort wiederholen", save: "Passwort speichern", saved: "Passwort aktualisiert.", short: "Mindestens 8 Zeichen verwenden.", diff: "Die Passwörter stimmen nicht überein.", admin: "Admin-Dashboard", rec: "Lege ein neues Passwort für dein Konto fest." }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export function initAccountUi(lang, onChange) {
  const t = L[lang] || L.en;
  const open = (recovery) => {
    const w = document.createElement("div"); w.className = "modal"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true");
    const u = user(), x = () => w.remove();
    w.innerHTML = `<div class="pol acct"><button class="close" type="button" aria-label="${esc(t.x)}">×</button><h3>${esc(t.t)}</h3>` + (u
      ? `<p>${esc(t.as)} <b>${esc(u.email)}</b></p><div class="cb-btns" style="justify-content:flex-start;margin-top:8px" data-admin></div>
         <h4>${esc(t.chg)}</h4>${recovery ? `<p class="muted">${esc(t.rec)}</p>` : ""}<form data-pw><input type="password" required minlength="8" autocomplete="new-password" placeholder="${esc(t.np)}" aria-label="${esc(t.np)}"><input type="password" required minlength="8" autocomplete="new-password" placeholder="${esc(t.cp)}" aria-label="${esc(t.cp)}"><button class="pbtn solid">${esc(t.save)}</button></form><p class="muted" data-m></p>
         <div class="cb-btns" style="justify-content:flex-start;margin-top:14px"><button class="pbtn" data-out>${esc(t.out)}</button><button class="pbtn" data-del>${esc(t.del)}</button></div>`
      : `<p>${esc(t.p)}</p><form data-f><input type="email" required autocomplete="email" placeholder="${esc(t.em)}" aria-label="${esc(t.em)}"><input type="password" autocomplete="current-password" placeholder="${esc(t.pw)}" aria-label="${esc(t.pw)}"><button class="pbtn solid">${esc(t.go)}</button></form>
         <div class="cb-btns" style="justify-content:flex-start"><button class="pbtn" type="button" data-link>${esc(t.link)}</button><button class="pbtn" type="button" data-forgot>${esc(t.forgot)}</button></div><p class="muted" data-m>${esc(t.note)}</p>`) + `</div>`;
    const m = () => w.querySelector("[data-m]"), email = () => w.querySelector("input[type=email]").value;
    w.onclick = async e => {
      if (e.target === w || e.target.closest(".close")) return x();
      if (e.target.closest("[data-out]")) { signOut(); x(); onChange(); }
      if (e.target.closest("[data-del]") && confirm(t.sure)) { if (await deleteAccount()) { x(); onChange(); } }
      if (e.target.closest("[data-link]")) { const a = w.querySelector("input[type=email]"); if (!a.reportValidity()) return; m().textContent = "…"; const r = await sendLink(a.value); m().textContent = r ? `${t.err}: ${r}` : t.sent; }
      if (e.target.closest("[data-forgot]")) { const a = w.querySelector("input[type=email]"); if (!a.reportValidity()) return; m().textContent = "…"; const r = await resetPassword(a.value); m().textContent = r ? `${t.err}: ${r}` : t.sent; }
    };
    w.addEventListener("submit", async e => {
      e.preventDefault();
      if (e.target.matches("[data-f]")) {
        const pw = e.target.querySelector("input[type=password]").value;
        if (!pw) { m().textContent = "…"; const r = await sendLink(email()); m().textContent = r ? `${t.err}: ${r}` : t.sent; return; }
        m().textContent = "…"; const r = await signInPassword(email(), pw);
        if (r) { m().textContent = /invalid|credentials/i.test(r) ? t.bad : `${t.err}: ${r}`; return; }
        x(); onChange(); open();
      } else if (e.target.matches("[data-pw]")) {
        const [a, b] = e.target.querySelectorAll("input");
        if (a.value.length < 8) { m().textContent = t.short; return; }
        if (a.value !== b.value) { m().textContent = t.diff; return; }
        m().textContent = "…"; const r = await setPassword(a.value);
        m().textContent = r ? `${t.err}: ${r}` : t.saved; if (!r) e.target.reset();
      }
    });
    document.body.appendChild(w); (w.querySelector("input") || w.querySelector(".close")).focus();
    if (u) isAdmin().then(ok => { const s = w.querySelector("[data-admin]"); if (ok && s) s.innerHTML = `<a class="pbtn solid" href="/admin">${esc(t.admin)} →</a>`; });
  };
  const b = document.getElementById("acct"); b.hidden = false; b.onclick = () => open();
  return open;
}

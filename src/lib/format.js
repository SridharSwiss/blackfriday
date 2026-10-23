export const fmt = n => Number.isInteger(n) ? `${n.toLocaleString("de-CH")}.–` : n.toLocaleString("de-CH",{minimumFractionDigits:2,maximumFractionDigits:2});
export const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
export const ext = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
export const LABEL = {buy:"Buy now", wait:"Wait for Black Week", track:"Tracking", check:"Check price", live:"Live price"};

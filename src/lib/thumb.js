import { IMAGES } from "../data/images.js";
import { esc } from "./format.js";

/* ---------- product pictures ----------
   1) window.IMAGES["Exact product name"] = licensed photo URL (data/images.js) → shown as a photo
   2) otherwise an illustration drawn from the category and brand, so every product has a picture */
export const ICON = {
 "Phones":'<rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 37h6"/>',
 "Audio":'<path d="M10 30v-4a14 14 0 0 1 28 0v4"/><rect x="7" y="28" width="9" height="13" rx="2"/><rect x="32" y="28" width="9" height="13" rx="2"/>',
 "Gaming":'<rect x="5" y="15" width="38" height="20" rx="10"/><path d="M13 25h8M17 21v8"/><circle cx="31" cy="23" r="1.6"/><circle cx="35" cy="27" r="1.6"/>',
 "Computers":'<rect x="10" y="9" width="28" height="21" rx="2"/><path d="M5 36h38l-3 4H8z"/>',
 "Monitors":'<rect x="5" y="7" width="38" height="25" rx="2"/><path d="M24 32v8M16 40h16"/>',
 "Tablets":'<rect x="10" y="5" width="28" height="38" rx="4"/><circle cx="24" cy="38" r="1.4"/>',
 "Wearables":'<rect x="14" y="14" width="20" height="20" rx="6"/><path d="M18 14l2-8h8l2 8M18 34l2 8h8l2-8M24 19v5l3 3"/>',
 "Accessories":'<rect x="15" y="17" width="18" height="15" rx="3"/><path d="M20 10v7M28 10v7M24 32v10"/>',
 "Smart Home":'<path d="M7 22L24 8l17 14v19H7z"/><circle cx="24" cy="29" r="4"/>',
 "Networking":'<rect x="6" y="26" width="36" height="12" rx="3"/><path d="M14 26l-4-14M34 26l4-14M24 26V14"/><circle cx="14" cy="32" r="1.4"/>',
 "Printers":'<rect x="13" y="6" width="22" height="12"/><rect x="6" y="18" width="36" height="16" rx="3"/><rect x="14" y="28" width="20" height="14"/>',
 "TV":'<rect x="4" y="8" width="40" height="26" rx="2"/><path d="M24 34v7M15 41h18"/>',
 "Cameras":'<rect x="5" y="14" width="38" height="25" rx="4"/><circle cx="24" cy="26" r="7"/><path d="M16 14l3-5h10l3 5"/>',
 "Home":'<path d="M19 5v27"/><rect x="10" y="32" width="20" height="8" rx="3"/><circle cx="35" cy="36" r="4"/>',
 "Coffee":'<path d="M9 18h25v11a10 10 0 0 1-10 10h-5A10 10 0 0 1 9 29z"/><path d="M34 21h3a5 5 0 0 1 0 10h-3M17 6v6M25 6v6"/>',
 "Kitchen":'<path d="M8 19h32v15a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z"/><path d="M4 19h40M18 19v-6h12v6"/>',
 "Appliances":'<rect x="8" y="5" width="32" height="38" rx="3"/><circle cx="24" cy="27" r="9"/><path d="M8 14h32"/>',
 "PC Components":'<rect x="14" y="14" width="20" height="20" rx="2"/><path d="M19 8v6M24 8v6M29 8v6M19 34v6M24 34v6M29 34v6M8 19h6M8 24h6M8 29h6M34 19h6M34 24h6M34 29h6"/>',
 "Toys & Games":'<rect x="6" y="19" width="36" height="20" rx="2"/><rect x="11" y="12" width="9" height="7" rx="1.5"/><rect x="28" y="12" width="9" height="7" rx="1.5"/>',
 "Sports & Outdoor":'<path d="M4 40l14-23 8 12 6-8 12 19z"/><circle cx="36" cy="10" r="3"/>',
 "Bikes & E-mobility":'<circle cx="12" cy="32" r="8"/><circle cx="36" cy="32" r="8"/><path d="M12 32l8-14h11l5 14M20 18l-2-6h-4M31 18l-3-6h5"/>',
 "Tools & DIY":'<path d="M6 13h26v11H6zM32 16h9v5h-9M17 24l-2 17h9l2-17"/>',
 "Garden":'<path d="M9 39C9 19 21 8 40 8c0 19-10 31-31 31z"/><path d="M9 39l17-17"/>',
 "Fashion":'<path d="M17 6L6 12l4 8 6-3v24h16V17l6 3 4-8-11-6a7 7 0 0 1-14 0z"/>',
 "Watches & Jewellery":'<circle cx="24" cy="24" r="10"/><path d="M18 15l2-9h8l2 9M18 33l2 9h8l2-9M24 19v5l3 3"/>',
 "Fragrance & Beauty":'<rect x="12" y="18" width="24" height="24" rx="6"/><rect x="19" y="10" width="10" height="8" rx="1"/><path d="M24 5v5"/>',
 "Personal Care":'<rect x="21" y="17" width="6" height="27" rx="3"/><rect x="20" y="4" width="8" height="13" rx="2"/><path d="M22 8h4M22 12h4"/>',
 "Baby & Kids":'<path d="M10 9a16 16 0 0 0 16 16h12V20A14 14 0 0 0 24 6"/><path d="M8 25h30"/><circle cx="14" cy="38" r="4"/><circle cx="34" cy="38" r="4"/>',
 "Office & Furniture":'<path d="M14 6h20v18H14zM9 24h30M24 24v10M14 42l10-8 10 8"/>',
 "Travel & Car":'<path d="M6 30l5-11h26l5 11v8H6z"/><circle cx="14" cy="38" r="3"/><circle cx="34" cy="38" r="3"/><path d="M6 30h36"/>',
 "Books":'<path d="M7 8h15a4 4 0 0 1 4 4v29a3 3 0 0 0-3-3H7zM41 8H28a4 4 0 0 0-4 4v29a3 3 0 0 1 3-3h14z"/>',
 "Pets":'<circle cx="24" cy="31" r="8"/><circle cx="13" cy="19" r="3.5"/><circle cx="20" cy="12" r="3.5"/><circle cx="28" cy="12" r="3.5"/><circle cx="35" cy="19" r="3.5"/>',
 "Gift Cards & Travel":'<rect x="5" y="12" width="38" height="25" rx="3"/><path d="M5 20h38M13 30h9"/>',
 "Winter tyres":'<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="7"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4"/>',
 "_":'<path d="M6 24L24 6h16v16L22 40z"/><circle cx="33" cy="13" r="2.5"/>'
};
export const TWO = ["The Ordinary","La Roche-Posay","Ultimate Ears","Bowers & Wilkins","Black Diamond","The North Face","Under Armour","Hugo Boss","Calvin Klein","Polo Ralph Lauren","Ralph Lauren","Tommy Hilfiger","Fred Perry","Le Creuset","Big Green Egg","Home Assistant","Peak Design","Dr. Martens","New Balance","Paco Rabanne","Jean Paul Gaultier","Giorgio Armani","Carolina Herrera","Estée Lauder","Charlotte Tilbury","Rare Beauty","Beauty of Joseon","Paula's Choice","Caran d'Ache","Brändi Dog","Hot Wheels","Fisher-Price","Hans im Glück","Bang & Olufsen","Maison Francis Kurkdjian","Le Labo","Kuhn Rikon","Betty Bossi","Amazon Basics","Amazon Essentials","Concept2","Sea to Summit","Fjällräven","Viktor & Rolf","Thierry Mugler","Narciso Rodriguez","Jil Sander","Daniel Wellington","Herman Miller","Secretlab","Lian Li","be quiet!","Western Digital","Bambu Lab","Tour de Suisse","Busch & Müller","Pegasus Spiele","Lululemon"];
export const hue = s => { let x=0; for (const c of s) x=(x*31+c.charCodeAt(0))>>>0; return x%360; };
export const brandOf = n => (TWO.find(b=>n.startsWith(b+" ")) || n.split(" ")[0]).replace(/[–:]$/,"");
export function thumb(d){
  const photo = IMAGES[d.name] || d.img;
  const img = photo ? `<img src="${esc(photo)}" alt="${esc(d.name)}" loading="lazy" onerror="this.remove()">` : "";
  if (d.cat==="Books" && d.name.includes(" – ")){
    const [author,title] = d.name.split(" – ");
    return `<div class="thumb book" style="--h:${hue(title)}" role="img" aria-label="${esc(d.name)}"><div class="cover"><span class="t">${esc(title)}</span><span class="a">${esc(author)}</span></div>${img}</div>`;
  }
  const b = brandOf(d.name);
  return `<div class="thumb" style="--h:${hue(b)}" role="img" aria-label="${esc(d.name)}"><svg viewBox="0 0 48 48" aria-hidden="true">${ICON[d.cat]||ICON._}</svg><span class="brand">${esc(b)}</span>${img}</div>`;
}

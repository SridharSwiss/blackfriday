import { RAW } from "./top100.js";
import CATALOGUE from "./catalogue.js";
import { CAT_SHOPS } from "../config/shops.js";

export const TOP = RAW.map((r,i)=>{
  const [cat,name,spec,now,bw25,low,lowAt,q,note,shops] = r;
  const cands = [];
  if (bw25!=null) cands.push({p:bw25, where:"Black Week 2025"});
  if (low!=null) cands.push({p:low, where:lowAt});
  const best = cands.sort((a,b)=>a.p-b.p)[0] || null;
  let status, save = 0;
  if (now!=null && best){ status = now <= best.p*1.03 ? "buy" : "wait"; save = Math.max(0, now - best.p); }
  else if (now!=null) status = "track";
  else if (best) status = "wait";
  else status = "check";
  const show = now ?? best?.p ?? null;
  return {rank:i+1,top:true,cat:cat==="Beauty"?"Fragrance & Beauty":cat,name,spec,now,bw25,low,lowAt,best,status,save,show,q,note,shops:shops||CAT_SHOPS[cat]};
});
export const isTyre = n => /\d{3}\/\d{2} ?R\d{2}|WinterContact|Alpin \d|Reifen\b/i.test(n);  // tyres only, not accessories
/* every catalogue product links to Amazon.de first (large appliances excluded: not delivered to CH) */
export function withAmazon(cat, list){
  if (cat==="Appliances" || list.includes("amazon")) return list;
  // prepend Amazon so it appears as the primary shop button
  return ["amazon", ...list].slice(0, 4);
}
export const CAT_LIST = CATALOGUE.map(([cat,name,spec,now],i)=>({
  rank:TOP.length+i+1, top:false, cat, name, spec, now:now??null, bw25:null, low:null, lowAt:null, best:null,
  status: now!=null ? "track" : "live", save:0, show:now??null, q:name.replace(/\s*\(.*?\)/g,""), note:null, shops:isTyre(name) ? ["reifenonline","amazon"] : withAmazon(cat, CAT_SHOPS[cat]||["galaxus","brack"])
}));
export const DEALS = TOP.concat(CAT_LIST);
export const CATS = [...new Set(DEALS.map(d=>d.cat))].sort((a,b)=>a.localeCompare(b));

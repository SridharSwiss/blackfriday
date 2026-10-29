/* US retailers (search URL builders). Used by the US deals tab; amazoncom/bestbuy/walmart/target live in shops.js. */
const enc = encodeURIComponent;
export const US_SHOPS = {
  costco:   { name: "Costco",    search: s => `https://www.costco.com/CatalogSearch?keyword=${enc(s)}` },
  samsclub: { name: "Sam's Club", search: s => `https://www.samsclub.com/s/${enc(s)}` },
  homedepot:{ name: "Home Depot", search: s => `https://www.homedepot.com/s/${enc(s)}` },
  lowes:    { name: "Lowe's",    search: s => `https://www.lowes.com/search?searchTerm=${enc(s)}` },
  kohls:    { name: "Kohl's",    search: s => `https://www.kohls.com/search.jsp?search=${enc(s)}` },
  macys:    { name: "Macy's",    search: s => `https://www.macys.com/shop/featured/${enc(s)}` },
  nordstrom:{ name: "Nordstrom", search: s => `https://www.nordstrom.com/sr?keyword=${enc(s)}` },
  ulta:     { name: "Ulta",      search: s => `https://www.ulta.com/shop/search?search=${enc(s)}` },
  sephora:  { name: "Sephora",   search: s => `https://www.sephora.com/search?keyword=${enc(s)}` },
  lego:     { name: "LEGO",      search: s => `https://www.lego.com/en-us/search?q=${enc(s)}` },
  newegg:   { name: "Newegg",    search: s => `https://www.newegg.com/p/pl?d=${enc(s)}` },
  bh:       { name: "B&H",       search: s => `https://www.bhphotovideo.com/c/search?q=${enc(s)}` },
  wayfair:  { name: "Wayfair",   search: s => `https://www.wayfair.com/keyword.php?keyword=${enc(s)}` },
  dell:     { name: "Dell",      search: s => `https://www.dell.com/en-us/search/${enc(s)}` },
  apple:    { name: "Apple",     search: s => `https://www.apple.com/us/search/${enc(s)}` },
  nike:     { name: "Nike",      search: s => `https://www.nike.com/w?q=${enc(s)}` },
};

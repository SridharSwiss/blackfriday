/* Product photos: map an exact product name to a licensed image URL; the card then shows the photo
   instead of its illustration. Licensed sources only: Amazon Product Advertising API (after 3 qualifying
   PartnerNet sales, see scripts/images/amazon-pa-api.mjs), Icecat open product-content syndication
   (brand+MPN lookup, see scripts/images/icecat.mjs), Awin/Tradedoubler product feeds, brand press kits.
   Never a hotlinked photo scraped from a retailer's own product page - that's their copyrighted
   photography, not ours to reuse. A product without an entry here just shows its category illustration,
   which is the correct, zero-risk default - not a bug to "fix" by relaxing this rule.
   Example: "Apple AirPods Pro 3": "https://m.media-amazon.com/images/I/XXXX._SL500_.jpg" */
export const IMAGES = {
};

/* One free-license, generic photo per deal category, used as a fallback picture when a product has
   no exact licensed photo in images.js: it shows a real photo of "a TV" / "a coffee machine" / etc., not a
   claim that it's the exact SKU on that card. Source: Wikimedia Commons (public domain / CC-licensed for
   reuse including commercial use) - never a retailer's own product photography. See
   scripts/images/category-stock.mjs for how this is generated. A category without an entry here just
   keeps the generated SVG illustration. */
export const CATEGORY_IMAGES = {
  "Accessories": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Smartphone_case_cover_black.jpg/960px-Smartphone_case_cover_black.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
  "Appliances": "https://upload.wikimedia.org/wikipedia/commons/5/52/Minna_M3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
  "Audio": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg/960px-JBL_Flip_3_bluetooth_speaker_%28DSCF2653%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
  "Baby": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Children-sitting-in-the-new-type-of-stroller-142340819115.jpg/960px-Children-sitting-in-the-new-type-of-stroller-142340819115.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
  "Baby & Kids": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Children-sitting-in-the-new-type-of-stroller-142340819115.jpg/960px-Children-sitting-in-the-new-type-of-stroller-142340819115.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
};

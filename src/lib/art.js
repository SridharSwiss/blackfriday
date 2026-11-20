/* Generated product art: original filled two-tone illustrations (no third-party images) used when a deal has no licensed photo.
   64x64 viewBox, drawn with currentColor at different opacities so each card picks up its category/brand hue. */
const sh = '<ellipse cx="32" cy="57" rx="19" ry="3" fill="currentColor" opacity=".18"/>';
const A = (b) => sh + b;
const f = (o, d) => `<path d="${d}" fill="currentColor" opacity="${o}"/>`;
const r = (o, x, y, w, h, rx = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="currentColor" opacity="${o}"/>`;
const c = (o, x, y, rad) => `<circle cx="${x}" cy="${y}" r="${rad}" fill="currentColor" opacity="${o}"/>`;
export const ART = {
  tv: A(r(.9, 6, 12, 52, 33, 3) + r(.25, 9, 15, 46, 27, 1.5) + f(.5, "M12 40L24 27l9 9 7-6 12 10z") + r(.9, 27, 45, 10, 6, 1) + r(.9, 19, 51, 26, 3, 1.5)),
  audio: A(f(.9, "M12 38V30a20 20 0 0 1 40 0v8h-6V30a14 14 0 0 0-28 0v8z") + r(.9, 8, 34, 11, 18, 5) + r(.9, 47, 34, 11, 18, 5) + r(.3, 11, 38, 5, 10, 2.5) + r(.3, 50, 38, 5, 10, 2.5)),
  phone: A(r(.9, 20, 6, 24, 48, 5) + r(.25, 23, 12, 18, 34, 1.5) + c(.9, 32, 9.5, 1.4) + r(.5, 28, 52, 8, 2, 1)),
  laptop: A(r(.9, 12, 14, 40, 28, 3) + r(.25, 15, 17, 34, 22, 1.5) + f(.9, "M5 44h54l-4 7H9z") + r(.4, 27, 46, 10, 2, 1)),
  monitor: A(r(.9, 6, 9, 52, 34, 3) + r(.25, 9, 12, 46, 28, 1.5) + r(.9, 29, 43, 6, 8) + r(.9, 20, 51, 24, 3, 1.5)),
  tablet: A(r(.9, 14, 6, 36, 48, 5) + r(.25, 18, 11, 28, 38, 2) + c(.5, 32, 56, 1.6)),
  watch: A(r(.9, 21, 4, 22, 10, 3) + r(.9, 21, 50, 22, 10, 3) + r(.9, 16, 14, 32, 36, 9) + c(.25, 32, 32, 11) + f(.9, "M31 26h2v7h5v2H31z")),
  game: A(f(.9, "M10 24h44a8 8 0 0 1 8 9l-3 14a6 6 0 0 1-10 3l-6-7H21l-6 7a6 6 0 0 1-10-3L2 33a8 8 0 0 1 8-9z") + f(.3, "M14 32h10M19 27v10") + c(.3, 43, 30, 2.4) + c(.3, 49, 35, 2.4)),
  camera: A(r(.9, 6, 20, 52, 32, 6) + f(.9, "M20 20l4-8h16l4 8z") + c(.25, 32, 36, 12) + c(.9, 32, 36, 7) + c(.3, 32, 36, 3)),
  coffee: A(r(.9, 14, 6, 36, 8, 3) + r(.9, 14, 14, 8, 38, 2) + r(.9, 42, 14, 8, 38, 2) + r(.9, 14, 50, 36, 6, 2) + r(.25, 24, 20, 16, 14, 2) + r(.9, 26, 34, 12, 10, 2) + f(.5, "M28 36h8v6h-8z")),
  vacuum: A(c(.9, 32, 34, 24) + c(.25, 32, 34, 16) + c(.9, 32, 34, 6) + c(.3, 32, 34, 2.5) + r(.9, 26, 8, 12, 5, 2.5)),
  kitchen: A(f(.9, "M8 26h48v18a10 10 0 0 1-10 10H18A10 10 0 0 1 8 44z") + r(.9, 4, 22, 56, 6, 3) + f(.9, "M22 22v-6h20v6z") + r(.25, 14, 34, 36, 4, 2)),
  appliance: A(r(.9, 10, 6, 44, 50, 4) + r(.25, 13, 9, 38, 8, 2) + c(.25, 32, 36, 14) + c(.9, 32, 36, 9) + c(.3, 32, 36, 5)),
  home: A(f(.9, "M30 6h4l2 34h-8z") + f(.9, "M14 40h36l4 12H10z") + f(.3, "M12 44h40")),
  beauty: A(r(.9, 24, 26, 16, 28, 4) + r(.9, 28, 10, 8, 16, 2) + r(.9, 25, 6, 14, 6, 2) + r(.25, 27, 32, 10, 12, 2)),
  fashion: A(f(.9, "M22 6l-16 8 5 12 7-3v31h28V23l7 3 5-12-16-8c0 5-4 8-10 8S22 11 22 6z") + f(.25, "M26 6c0 4 3 6 6 6s6-2 6-6")),
  shoe: A(f(.9, "M4 38c10 0 12-9 17-18l7 6c4 3 9 4 16 5 6 1 11 4 11 9v4H4z") + r(.35, 4, 46, 56, 5, 2.5) + f(.25, "M24 28l-3 5M30 31l-3 5")),
  furniture: A(r(.9, 10, 20, 44, 18, 6) + r(.9, 4, 28, 12, 22, 5) + r(.9, 48, 28, 12, 22, 5) + r(.35, 14, 34, 36, 10, 3) + r(.9, 10, 52, 4, 5, 1) + r(.9, 50, 52, 4, 5, 1)),
  toys: A(r(.9, 8, 30, 26, 22, 3) + r(.9, 30, 22, 26, 30, 3) + c(.35, 17, 28, 3.5) + c(.35, 25, 28, 3.5) + c(.35, 39, 20, 3.5) + c(.35, 47, 20, 3.5)),
  sport: A(r(.9, 4, 22, 8, 20, 2) + r(.9, 52, 22, 8, 20, 2) + r(.9, 12, 26, 6, 12, 2) + r(.9, 46, 26, 6, 12, 2) + r(.9, 18, 30, 28, 4, 2)),
  tools: A(r(.9, 6, 14, 40, 16, 5) + r(.9, 46, 18, 12, 8, 2) + f(.9, "M18 30h12l-2 24H16z") + r(.3, 10, 18, 24, 4, 2)),
  baby: A(c(.9, 32, 34, 18) + c(.9, 18, 18, 7) + c(.9, 46, 18, 7) + c(.25, 26, 32, 2.5) + c(.25, 38, 32, 2.5) + f(.25, "M28 40h8l-4 4z")),
  health: A(r(.9, 8, 14, 48, 36, 6) + f(.25, "M28 22h8v8h8v8h-8v8h-8v-8h-8v-8h8z")),
  outdoor: A(f(.9, "M4 52L32 8l28 44z") + f(.25, "M32 8l8 44H24z") + f(.5, "M24 52h16l-8-22z")),
  car: A(f(.9, "M4 38l6-14a6 6 0 0 1 5-4h34a6 6 0 0 1 5 4l6 14v10H4z") + f(.25, "M16 24h32l4 10H12z") + c(.9, 16, 48, 7) + c(.9, 48, 48, 7) + c(.3, 16, 48, 3) + c(.3, 48, 48, 3)),
  telecom: A(f(.9, "M14 6h26l12 12v38H14z") + r(.25, 22, 26, 22, 18, 2) + r(.5, 26, 30, 6, 4, 1) + r(.5, 34, 30, 6, 4, 1) + r(.5, 26, 37, 14, 3, 1)),
  tyre: A(c(.9, 32, 32, 25) + c(.25, 32, 32, 16) + c(.9, 32, 32, 8) + c(.3, 32, 32, 3)),
  book: A(f(.9, "M8 10h20a4 4 0 0 1 4 4v38a4 4 0 0 0-4-4H8zM56 10H36a4 4 0 0 0-4 4v38a4 4 0 0 1 4-4h20z") + f(.25, "M12 16h14M12 22h14M38 16h14M38 22h14")),
  generic: A(f(.9, "M8 34L34 8h22v22L30 56z") + c(.3, 46, 18, 4)),
};
const MAP = { TV: "tv", Audio: "audio", Phones: "phone", Computers: "laptop", Monitors: "monitor", Tablets: "tablet", Wearables: "watch", Gaming: "game", Cameras: "camera", Coffee: "coffee", "Robot vacuums": "vacuum", Kitchen: "kitchen", Appliances: "appliance", Home: "home", "Smart Home": "home", Beauty: "beauty", "Personal Care": "beauty", Fashion: "fashion", Apparel: "fashion", Shoes: "shoe", Furniture: "furniture", Toys: "toys", LEGO: "toys", Sports: "sport", Sport: "sport", Tools: "tools", "Tools & DIY": "tools", "Baby & Kids": "baby", Baby: "baby", Health: "health", Outdoor: "outdoor", Garden: "outdoor", Car: "car", "Mobile Plans & Internet": "telecom", Telecom: "telecom", "Winter tyres": "tyre", Books: "book", Accessories: "watch", Networking: "telecom", Printers: "appliance", "PC Components": "laptop", Pets: "baby", "Bikes & E-mobility": "sport", Travel: "outdoor", Food: "kitchen" };
export const artFor = cat => ART[MAP[cat] || "generic"];

/* Travel & Holidays: providers link to their own landing page (no unverified deep-search URLs),
   hotels/flights use Booking.com and Google Travel search, which accept a plain query. */
const home = (name, url) => ({ name, search: () => url });
const enc = encodeURIComponent;
export const TRAVEL_SHOPS = {
  booking: { name: "Booking.com", search: s => `https://www.booking.com/searchresults.html?ss=${enc(s.replace(/^Hotel\s+/i, ""))}` },
  ghotels: { name: "Google Hotels", search: s => `https://www.google.com/travel/search?q=${enc("hotels " + s.replace(/^Hotel\s+/i, ""))}` },
  gflights: { name: "Google Flights", search: s => `https://www.google.com/travel/flights?q=${enc("flights " + s.replace(/\bflights?\b/i, "").replace(/\s+/g, " ").trim())}` },
  skyscanner: home("Skyscanner", "https://www.skyscanner.ch/"),
  swiss: home("SWISS", "https://www.swiss.com/ch/en"),
  lufthansa: home("Lufthansa", "https://www.lufthansa.com/ch/en/homepage"),
  edelweiss: home("Edelweiss", "https://www.flyedelweiss.com/"),
  qatar: home("Qatar Airways", "https://www.qatarairways.com/"),
  tap: home("TAP Air Portugal", "https://www.flytap.com/"),
  cathay: home("Cathay Pacific", "https://www.cathaypacific.com/"),
  easyjet: home("easyJet", "https://www.easyjet.com/"),
  eurowings: home("Eurowings", "https://www.eurowings.com/"),
  ryanair: home("Ryanair", "https://www.ryanair.com/"),
  tui: home("TUI Suisse", "https://www.tui.ch/"),
  helvetic: home("Helvetic Tours", "https://www.helvetictours.ch/"),
  sbb: home("SBB", "https://www.sbb.ch/en"),
  mobility: home("Mobility", "https://www.mobility.ch/en"),
  jungfrau: home("Jungfraubahn", "https://www.jungfrau.ch/en-gb/"),
  europcar: home("Europcar", "https://www.europcar.ch/"),
  airalo: home("Airalo", "https://www.airalo.com/"),
  holafly: home("Holafly", "https://holafly.com/"),
  saily: home("Saily", "https://saily.com/"),
};
const RULES = [
  [/^SWISS /i, ["swiss", "gflights"]], [/^Lufthansa/i, ["lufthansa", "gflights"]], [/^Qatar/i, ["qatar", "gflights"]],
  [/^TAP /i, ["tap", "gflights"]], [/^Cathay/i, ["cathay", "gflights"]], [/^easyJet/i, ["easyjet", "gflights"]],
  [/^Eurowings/i, ["eurowings", "gflights"]], [/^Ryanair/i, ["ryanair", "gflights"]], [/^Edelweiss/i, ["edelweiss", "gflights"]],
  [/^Skyscanner/i, ["skyscanner", "gflights"]], [/^TUI /i, ["tui", "booking"]], [/^Helvetic/i, ["helvetic", "tui"]],
  [/^Europcar/i, ["europcar", "booking"]], [/^Jungfrau/i, ["jungfrau", "sbb"]], [/^Airalo/i, ["airalo", "amazon"]],
  [/^Holafly/i, ["holafly", "amazon"]], [/^Saily/i, ["saily", "amazon"]], [/^Mobility/i, ["mobility"]],
  [/Halbtax|Generalabonnement|Supersaver|Swiss Travel Pass/i, ["sbb"]],
  [/^Hotel /i, ["booking", "ghotels"]],
];
export const travelShops = name => (RULES.find(([re]) => re.test(name)) || [null, ["booking", "ghotels", "gflights"]])[1];

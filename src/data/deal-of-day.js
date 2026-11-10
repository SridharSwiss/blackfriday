/* Deal of the day (Amazon.de, delivers to Switzerland). Shown as a pop-up card when the site opens.
   Price confirmed 10.11.2026 by three independent pages: delamar.de KW46 Amazon deals (09.11., valid from 10.11.),
   PC Games Hardware (Amazon "lowest price in 90 days", ~05.11.), hottip.de (05.11.).
   Amazon.de shows EUR incl. German VAT; for Swiss delivery the German VAT is removed and Swiss VAT added at checkout.
   Set `until` to the last day to show it (YYYY-MM-DD); after that the card disappears. Change `id` for a new deal so
   visitors who closed the previous one see the new one. */
export const DEAL_OF_DAY = {
  id: "dotd-2026-11-10-garmin-fr165",
  from: "2026-11-10",
  until: "2026-11-11",
  shop: "amazon",
  name: "Garmin Forerunner 165",
  spec: { en: "GPS running watch · AMOLED · up to 11 days battery",
          de: "GPS-Laufuhr · AMOLED · bis 11 Tage Akku",
          fr: "Montre de course GPS · AMOLED · jusqu'à 11 jours d'autonomie",
          it: "Orologio da corsa GPS · AMOLED · fino a 11 giorni di autonomia" },
  price: 165, was: 279.99, cur: "EUR",
  q: "Garmin Forerunner 165"
};

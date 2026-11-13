/* Backend for login + analytics (Supabase). Leave both empty to keep everything switched off:
   no login button, no events are sent, and the consent choice is only stored in this browser.
   After creating the dedicated project and running supabase/schema.sql, paste the project URL and the publishable key here. */
export const BACKEND = {
  url: "https://ahgxzqizzuxtqplkiqwa.supabase.co",
  key: "sb_publishable_tHX3aTM9QbUzeB2lo6kEfQ_uquZCB7Y",            // publishable (anon) key, safe to ship in the browser because RLS is enforced
};
export const ENABLED = !!(BACKEND.url && BACKEND.key);
export const POLICY_VERSION = "2026-11-13";
export const OPERATOR = { name: "AKTION.CH", contact: "" };   // add a contact email to show it in the policy

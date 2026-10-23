import { defineConfig } from "vite";

/* Emits robots.txt and sitemap.xml with the production URL.
   On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically; elsewhere set SITE_URL. */
function seoFiles() {
  return {
    name: "seo-files",
    generateBundle() {
      const host = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
      const base = host.replace(/\/$/, "");
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ""}` });
      if (base) {
        const today = new Date().toISOString().slice(0, 10);
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source:
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
</urlset>
` });
      }
    }
  };
}

export default defineConfig({
  plugins: [seoFiles()],
  build: { target: "es2020", sourcemap: false }
});

/* Render a campaign kit folder: every <section data-id> in kit.html -> PNG, reels.html?r=dates|tricks -> MP4 + cover.
   Usage: node scripts/render-kit.cjs marketing/2026-11-17-black-week-kit   (needs Playwright + ffmpeg) */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os'); const { execSync } = require('child_process');
const dir = path.resolve(process.argv[2] || '.'); const out = path.join(dir, 'export'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2400, height: 2000 } });
  await p.goto('file://' + path.join(dir, 'kit.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  for (const id of await p.$$eval('[data-id]', s => s.map(x => x.dataset.id))) {
    const el = await p.$(`[data-id="${id}"]`); const { width, height } = await el.boundingBox();
    await el.screenshot({ path: path.join(out, `${id}-${Math.round(width)}x${Math.round(height)}.png`) });
  }
  for (const r of ['dates', 'tricks']) {
    const q = await b.newPage({ viewport: { width: 1080, height: 1920 } });
    await q.goto('file://' + path.join(dir, 'reels.html') + '?r=' + r); await q.evaluate(() => document.fonts.ready); await q.waitForTimeout(500);
    const dur = await q.evaluate(() => window.DUR); const fr = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-'));
    for (let i = 0; i < Math.round(dur * 30); i++) { await q.evaluate(t => render(t), i / 30); await q.screenshot({ path: `${fr}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 }); }
    await q.evaluate(() => render(3.6)); await q.screenshot({ path: path.join(out, `reel-${r}-cover-1080x1920.png`) });
    execSync(`ffmpeg -y -loglevel error -framerate 30 -i ${fr}/f%04d.jpg -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 20 -movflags +faststart -c:a aac -b:a 128k ${path.join(out, `reel-${r}-1080x1920.mp4`)}`);
    fs.rmSync(fr, { recursive: true, force: true }); console.log(`reel ${r}: ${dur.toFixed(1)} s`); await q.close();
  }
  await b.close(); console.log('exported to', out);
})();

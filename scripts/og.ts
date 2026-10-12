// Renders a 1200x630 link-preview card for each page that has a title beside a scene, into public/og/.
// Each card reuses the built page's own eyebrow, title, lead and scene, frozen on its still frame.
// Run with `npm run og` (builds first), then commit the PNGs; the next build copies them into dist.
import { chromium } from 'playwright';
import { readFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, dirname, relative, sep } from 'node:path';

const DIST = 'dist';
const OUT = join('public', 'og');
const ORIGIN = 'http://og.local';
const TYPES: Record<string, string> = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml',
};

const CARD_CSS = `
html, body { margin: 0; background: var(--bg); }
.og-card { box-sizing: border-box; width: 1200px; height: 630px; padding: 64px 72px 56px; display: grid;
  grid-template-columns: 1fr 380px; grid-template-rows: 1fr auto; column-gap: 56px; background: var(--bg);
  border-top: 12px solid var(--accent); }
.og-text { align-self: center; }
.og-eyebrow { margin: 0 0 16px; font-size: 26px; font-weight: 600; color: var(--accent); }
.og-title { margin: 0; font-size: 58px; line-height: 1.12; color: var(--ink); }
.og-lead { margin: 20px 0 0; font-size: 26px; line-height: 1.4; color: var(--muted);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.og-site { grid-column: 1 / -1; margin: 0; font-size: 22px; color: var(--muted); }
.og-card .scene, .og-card .home-hero { align-self: center; justify-self: end; width: 380px; max-width: none; }
.og-card * { animation: none !important; transition: none !important; }
`;

function pages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return pages(p);
    return name === 'index.html' ? [p] : [];
  });
}

/** dist/a/b/index.html -> "a/b"; dist/index.html -> "index" (matches Base.astro's lookup). */
const slugOf = (file: string) => relative(DIST, dirname(file)).split(sep).join('/') || 'index';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce', colorScheme: 'light' });
await context.route(`${ORIGIN}/**`, async (route) => {
  const path = decodeURI(new URL(route.request().url()).pathname);
  let file = join(DIST, path);
  if (path.endsWith('/')) file = join(file, 'index.html');
  if (!existsSync(file)) return route.fulfill({ status: 404, body: '' });
  await route.fulfill({ body: readFileSync(file), contentType: TYPES[extname(file)] ?? 'application/octet-stream' });
});

const page = await context.newPage();
let made = 0;
for (const file of pages(DIST)) {
  const slug = slugOf(file);
  await page.goto(`${ORIGIN}/${slug === 'index' ? '' : `${slug}/`}`);
  const built = await page.evaluate(({ css, site }) => {
    const scene = document.querySelector('.intro .scene, .intro .home-hero');
    const title = document.querySelector('.takeaway h1')?.textContent?.trim();
    if (!scene || !title) return false;
    const eyebrow = document.querySelector('.takeaway .eyebrow')?.textContent?.split(' · ')[0]?.trim();
    const lead = document.querySelector('.takeaway .lead')?.textContent?.trim();
    const el = (tag: string, cls: string, text?: string) => {
      const e = document.createElement(tag);
      e.className = cls;
      if (text) e.textContent = text;
      return e;
    };
    const text = el('div', 'og-text');
    if (eyebrow) text.append(el('p', 'og-eyebrow', eyebrow));
    text.append(el('h1', 'og-title', title));
    if (lead) text.append(el('p', 'og-lead', lead));
    const card = el('div', 'og-card');
    card.append(text, scene, el('p', 'og-site', site));
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    document.body.className = '';
    document.body.replaceChildren(card);
    return true;
  }, { css: CARD_CSS, site: 'cherie-q.github.io' });
  if (!built) continue;
  const out = join(OUT, `${slug}.png`);
  mkdirSync(dirname(out), { recursive: true });
  await page.locator('.og-card').screenshot({ path: out });
  console.log(`og: ${out}`);
  made++;
}
await browser.close();
console.log(`og: ${made} cards`);

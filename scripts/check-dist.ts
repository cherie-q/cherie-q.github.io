// Post-build gate: fails on internal-detail leaks, em dashes in prose, broken internal links/anchors,
// or a page whose link-preview image is missing.
// Run after `astro build`: node scripts/check-dist.ts
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

const DIST = 'dist';

// Internal names (tools, repos, org, hosts, agents) are stored as hashes so this public file doesn't list them.
// To block another: node scripts/check-dist.ts --hash "some-name"   (or "org/" to block an org path)
const BLOCKED = new Set([
  '7d43df87c71ee1f1',
  '8ebb3a9af2e84da9',
  '225ba3026edf7964',
  'd2a3cc91a3825062',
  '36cc6518f2eb3ef8',
  'd7f53e788244b5b1',
  '0c40cf2120a4c795',
  'a1760c8116935e6f',
  '60601392fc228ce2',
  '6d275bf6676e616d',
]);
const hash = (term: string) => createHash('sha256').update(term.toLowerCase().replace(/\s+/g, ' ')).digest('hex').slice(0, 16);

if (process.argv[2] === '--hash') {
  console.log(`'${hash(process.argv[3] ?? '')}',`);
  process.exit(0);
}

// Checks every phrase of up to three words joined by one separator (as written), and the phrase plus the next character.
function blockedTerm(text: string): { index: number; length: number } | undefined {
  const lower = text.toLowerCase();
  const words = [...lower.matchAll(/[a-z0-9]+/g)];
  for (let i = 0; i < words.length; i++) {
    const start = words[i]!.index!;
    let phrase = words[i]![0];
    let end = start + phrase.length;
    for (let n = 1; ; n++) {
      if (BLOCKED.has(hash(phrase))) return { index: start, length: end - start };
      if (lower[end] && BLOCKED.has(hash(phrase + lower[end]))) return { index: start, length: end + 1 - start };
      const next = words[i + n];
      if (n === 3 || !next) break;
      const gap = lower.slice(end, next.index);
      if (!/^([-./_]|\s+)$/.test(gap)) break;
      phrase += (/\s/.test(gap) ? ' ' : gap) + next[0];
      end = next.index! + next[0].length;
    }
  }
  return undefined;
}

// Patterns that must never ship. Each was an internal detail removed during sanitization.
const LEAKS: [RegExp, string][] = [
  [/#\d{4}\b/, 'internal PR number'],
  [/\bAIU\b/, 'internal cost unit'],
  [/\.visualstudio\.com|dev\.azure\.com/i, 'internal host'],
  [/GPT-6|Opus 4\.8/, 'model name removed from the comparison'],
  [/\b(08|09|10)-[0-3]\d\b/, 'MM-DD date (use "Oct 7" style)'],
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));
const text = files.filter((f) => /\.(html|xml|txt|css|js)$/.test(f));
const errors: string[] = [];

// npm on a work machine writes the internal feed host into the lockfile; it must say registry.npmjs.org.
if (/"resolved": "https:\/\/(?!registry\.npmjs\.org\/)/.test(readFileSync('package-lock.json', 'utf8'))) {
  errors.push('package-lock.json: resolved URL not on registry.npmjs.org (rewrite before committing)');
}

for (const f of text) {
  const t = readFileSync(f, 'utf8');
  for (const [re, why] of LEAKS) {
    if (f.endsWith('.css') && why === 'internal PR number') continue; // hex colours like #0000
    const m = t.match(re);
    if (m) errors.push(`${f}: ${why}: "${t.slice(Math.max(0, m.index! - 40), m.index! + m[0].length + 20)}"`);
  }
  // CI logs are public, so show where the term is without printing it.
  const b = blockedTerm(t);
  if (b) errors.push(`${f}: blocked internal term: "${t.slice(Math.max(0, b.index - 40), b.index)}[blocked]${t.slice(b.index + b.length, b.index + b.length + 20)}"`);
}

const ids = new Map<string, Set<string>>();
for (const f of html) {
  const t = readFileSync(f, 'utf8');
  ids.set(f, new Set([...t.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!)));
}

function resolve(path: string): string | undefined {
  const clean = decodeURI(path).replace(/^\//, '');
  for (const c of [join(DIST, clean), join(DIST, clean, 'index.html')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return undefined;
}

for (const f of html) {
  const t = readFileSync(f, 'utf8');
  const visible = t.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '');
  if (visible.includes('\u2014')) errors.push(`${f}: em dash in prose`);
  const og = t.match(/property="og:image" content="https:\/\/cherie-q\.github\.io(\/[^"]+)"/)?.[1];
  if (!og || !resolve(og)) errors.push(`${f}: missing link-preview image ${og ?? ''} (run npm run og)`);
  for (const [, href] of t.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(href!)) continue;
    const [path, anchor] = href!.split('#') as [string, string | undefined];
    const target = path === '' ? f : resolve(path);
    if (!target) { errors.push(`${f}: broken link ${href}`); continue; }
    if (anchor && target.endsWith('.html') && !ids.get(target)?.has(anchor)) {
      errors.push(`${f}: missing anchor ${href}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((e) => e.split(sep).join('/')).join('\n'));
  console.error(`\ncheck-dist: ${errors.length} problem(s)`);
  process.exit(1);
}
console.log(`check-dist: ${html.length} pages clean (${relative('.', DIST)})`);

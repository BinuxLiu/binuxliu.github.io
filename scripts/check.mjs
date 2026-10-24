import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const profile = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
assert.equal(new Set(profile.publications.map(p => p.title)).size, profile.publications.length, 'Duplicate publications');
for (const publication of profile.publications) {
  assert.ok(['published', 'review', 'unspecified'].includes(publication.status), `Unknown publication status: ${publication.title}`);
  for (const key of ['title', 'venue', 'statusZh', 'statusEn']) assert.ok(publication[key], `Missing ${key}`);
  assert.ok(!publication.year || /^20\d{2}$/.test(publication.year), 'Invalid year');
}

for (const file of ['index.html', 'zh/index.html', 'en/index.html']) {
  const html = await readFile(path.join(root, file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate IDs`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: expected one h1`);
  assert.ok(!/undefined|\[object Object\]/.test(html), `${file}: missing rendered content`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (target.startsWith('#')) {
      assert.ok(ids.includes(target.slice(1)), `${file}: missing anchor ${target}`);
    } else if (!/^(https?:|mailto:|data:)/.test(target)) {
      const local = target.endsWith('/') ? target + 'index.html' : target;
      await access(path.resolve(root, path.dirname(file), local.split(/[?#]/)[0]));
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.ok(/rel="[^"]*noopener/.test(match[0]), `${file}: external link missing noopener`);
  }
  if (file !== 'index.html') {
    assert.equal([...html.matchAll(/class="publication"/g)].length, profile.publications.length, `${file}: publication count differs from source`);
    assert.ok(html.includes('data-motion-label'), `${file}: motion control label missing`);
    assert.ok(html.includes('mailto:binuxliu@gmail.com'), `${file}: contact missing`);
    assert.ok(!html.includes('fonts.googleapis.com'), `${file}: unexpected remote font dependency`);
  }
}
console.log('Checked both languages, publication data, internal links, assets, unique IDs, and contact controls.');

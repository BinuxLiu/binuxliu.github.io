import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const profile = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
assert.equal(new Set(profile.publications.map(p => p.title)).size, profile.publications.length, 'Duplicate publications');
assert.equal(profile.publications.filter(publication => publication.selected).length, 4, 'Expected four selected publications');
for (const publication of profile.publications) {
  assert.ok(['published', 'review', 'unspecified'].includes(publication.status), `Unknown publication status: ${publication.title}`);
  for (const key of ['title', 'venue', 'statusZh', 'statusEn']) assert.ok(publication[key], `Missing ${key}`);
  assert.ok(!publication.year || /^20\d{2}$/.test(publication.year), 'Invalid year');
  if (publication.selected !== undefined) assert.equal(typeof publication.selected, 'boolean', 'Invalid selected flag');
  if (publication.selected) {
    assert.ok(publication.image, `Selected publication needs an image: ${publication.title}`);
    assert.ok(publication.authors?.length, `Selected publication needs authors: ${publication.title}`);
  }
  if (publication.image) {
    assert.ok(publication.image.startsWith('assets/images/'), `Unexpected publication image path: ${publication.image}`);
    await access(path.join(root, publication.image));
    assert.ok(publication.imageAltZh && publication.imageAltEn, `Publication image needs both alternative texts: ${publication.title}`);
  }
  if (publication.authors !== undefined) {
    assert.ok(Array.isArray(publication.authors) && publication.authors.length > 0, `Invalid author list: ${publication.title}`);
    assert.ok(publication.authors.every(author => typeof author === 'string' && author.trim()), `Invalid author metadata: ${publication.title}`);
    assert.ok(publication.authors.some(author => author.includes('Bingxi Liu')), `Missing profile author: ${publication.title}`);
  }
  if (publication.resources !== undefined) {
    assert.ok(Array.isArray(publication.resources), `Invalid resources: ${publication.title}`);
    for (const resource of publication.resources) {
      assert.ok(resource.label && /^https?:\/\//.test(resource.url), `Invalid resource: ${publication.title}`);
    }
  }
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
    const publicationRows = [...html.matchAll(/<article\b[^>]*\bclass="[^"]*\bpublication\b[^"]*"[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
    assert.equal(publicationRows.length, profile.publications.length, `${file}: publication count differs from source`);
    assert.equal(publicationRows.filter(row => /data-selected="true"/.test(row)).length, 4, `${file}: selected publication count differs from source`);
    for (const row of publicationRows) {
      assert.ok(!/^<article\b[^>]*\bhidden(?:\s|=|>)/.test(row), `${file}: publications must remain visible without JavaScript`);
    }
    const filterButtons = [...html.matchAll(/<button\b[^>]*data-filter="[^"]+"[^>]*>/g)].map(match => match[0]);
    for (const filter of ['selected', 'all', 'published', 'review']) {
      assert.ok(filterButtons.some(button => button.includes(`data-filter="${filter}"`)), `${file}: missing ${filter} publication filter`);
    }
    assert.ok(filterButtons.some(button => /data-filter="selected"/.test(button) && /aria-pressed="true"/.test(button)), `${file}: selected publications must be the default filter`);
    for (const publication of profile.publications) {
      const row = publicationRows.find(item => item.includes(escape(publication.title.replace(/\.$/, ''))));
      assert.ok(row, `${file}: missing publication ${publication.title}`);
      if (publication.image) assert.ok(row.includes(`src="../${publication.image}"`), `${file}: missing publication image for ${publication.title}`);
      if (publication.authors) {
        const text = row.replace(/<[^>]*>/g, '');
        for (const author of publication.authors) assert.ok(text.includes(escape(author)), `${file}: missing author ${author} for ${publication.title}`);
      }
    }
    assert.ok(html.includes('mailto:binuxliu@gmail.com'), `${file}: contact missing`);
    assert.ok(!html.includes('fonts.googleapis.com'), `${file}: unexpected remote font dependency`);
  }
}
console.log('Checked both languages, selected publications, author metadata, internal links, assets, unique IDs, and contact controls.');

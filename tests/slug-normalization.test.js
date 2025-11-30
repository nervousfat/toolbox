import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../core.js';

test('Slugs normalize compatibility forms and combining accents consistently', () => {
  assert.equal(slugify('Café'), slugify('Cafe\u0301'));
  assert.equal(slugify('ﬀ Ａ ①'), 'ff-a-1');
  assert.equal(slugify('Straße'), 'straße');
  assert.equal(slugify('Привет 世界 ١٢٣'), 'привет-世界-١٢٣');
  assert.equal(slugify('👩‍💻 -- !!!'), '');
});

test('Slugs are idempotent and contain only Unicode letters digits and internal separators', () => {
  const inputs = ['  Crème__brûlée  ', '東京/大阪', 'ПрИвЕт 123', 'ＡＢＣ ①', 'a\u0301\u0308', 'one👩‍💻two', '---'];
  for (const input of inputs) {
    const slug = slugify(input);
    assert.equal(slugify(slug), slug, input);
    assert.match(slug, /^[\p{L}\p{N}-]*$/u);
    assert.ok(!slug.startsWith('-') && !slug.endsWith('-') && !slug.includes('--'));
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { unescapeHtml } from '../core.js';

test('Numeric HTML entities respect Unicode scalar boundaries and replace invalid scalar values', () => {
  for (const point of [1, 9, 0x7f, 0xd7ff, 0xe000, 0xffff, 0x10000, 0x10ffff]) {
    const expected = String.fromCodePoint(point);
    assert.equal(unescapeHtml(`&#${point};`), expected);
    assert.equal(unescapeHtml(`&#X${point.toString(16).toUpperCase()};`), expected);
  }
  for (const source of ['&#0;', '&#55296;', '&#57343;', '&#1114112;', '&#999999999999999999999999;']) {
    assert.equal(unescapeHtml(source), '\ufffd');
  }
});

test('HTML decoding requires semicolons, recognizes supported names, and never recursively decodes', () => {
  assert.equal(unescapeHtml('&AMP;&Lt;&gT;&QUOT;&APOS;&NBSP;'), '&<>"\'\u00a0');
  assert.equal(unescapeHtml('&amp;#65; &#38;lt;'), '&#65; &lt;');
  for (const source of ['&amp', '&#65', '&#x;', '&#-1;', '&copy;', '&#xGG;']) assert.equal(unescapeHtml(source), source);
});

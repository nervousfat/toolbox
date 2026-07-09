import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('slugify strips accents and joins with hyphens', () => {
  assert.equal(core.slugify('Café au Lait'), 'cafe-au-lait');
  assert.equal(core.slugify('  Hello,  World!  '), 'hello-world');
  assert.equal(core.slugify('你好世界'), '你好世界');
});

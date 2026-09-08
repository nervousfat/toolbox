import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('textStats counts lines bytes and code points', () => {
  const stats = core.textStats('héllo\nw');
  assert.equal(stats.lines, 2);
  assert.equal(stats.bytes, 8);
  assert.equal(stats.characters, 7);
});

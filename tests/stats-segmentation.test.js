import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('textStats counts lines bytes and code points', () => {
  const stats = core.textStats('héllo\nw');
  assert.equal(stats.lines, 2);
  assert.equal(stats.bytes, 8);
  assert.equal(stats.characters, 7);
});
test('textStats handles empty and CRLF input', () => {
  const empty = core.textStats('');
  assert.equal(empty.lines, 0);
  assert.equal(empty.bytes, 0);
  assert.equal(core.textStats('a\r\nb').lines, 2);
  assert.equal(core.textStats('你好').bytes, 6);
});

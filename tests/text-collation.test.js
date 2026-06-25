import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('sortLines sorts naturally with numeric awareness', () => {
  assert.equal(core.sortLines('a10\na2\nb1'), 'a2\na10\nb1');
  assert.equal(core.sortLines('a10\na2\nb1', true), 'b1\na10\na2');
});
test('uniqueLines preserves first occurrences', () => {
  assert.equal(core.uniqueLines('a\nb\na'), 'a\nb');
  assert.equal(core.uniqueLines('A\na\nB', true), 'A\nB');
  assert.equal(core.uniqueLines('x\r\nx'), 'x');
});

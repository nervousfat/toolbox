import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('uniqueLines and sortLines compose a dedupe pipeline', () => {
  assert.equal(core.sortLines(core.uniqueLines('b\r\na\nb\nA', true)), 'a\nb');
});
test('sortLines keeps duplicate lines adjacent', () => {
  assert.equal(core.sortLines('2\n1\n2'), '1\n2\n2');
  assert.equal(core.sortLines(''), '');
});

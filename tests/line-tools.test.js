import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('uniqueLines and sortLines compose a dedupe pipeline', () => {
  assert.equal(core.sortLines(core.uniqueLines('b\r\na\nb\nA', true)), 'a\nb');
});

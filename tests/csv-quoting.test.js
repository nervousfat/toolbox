import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('parseCsv handles quotes escapes and newline styles', () => {
  assert.deepEqual(core.parseCsv('a,"b""c",d\n1,2,3'), [['a', 'b"c', 'd'], ['1', '2', '3']]);
  assert.deepEqual(core.parseCsv('a,b\r\n1,2'), [['a', 'b'], ['1', '2']]);
  assert.deepEqual(core.parseCsv('﻿a,b'), [['a', 'b']]);
});
test('parseCsv rejects stray and unclosed quotes', () => {
  assert.throws(() => core.parseCsv('ab"c'), /CSV 引号位置不正确/);
  assert.throws(() => core.parseCsv('"open'), /CSV 引号未闭合/);
  assert.deepEqual(core.parseCsv(''), []);
});

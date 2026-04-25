import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('parseCsv handles quotes escapes and newline styles', () => {
  assert.deepEqual(core.parseCsv('a,"b""c",d\n1,2,3'), [['a', 'b"c', 'd'], ['1', '2', '3']]);
  assert.deepEqual(core.parseCsv('a,b\r\n1,2'), [['a', 'b'], ['1', '2']]);
  assert.deepEqual(core.parseCsv('﻿a,b'), [['a', 'b']]);
});

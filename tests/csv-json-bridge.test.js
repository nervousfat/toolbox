import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('csvToJson builds records and guards headers', () => {
  assert.equal(core.csvToJson('a,b\n1,2'), JSON.stringify([{ a: '1', b: '2' }], null, 2));
  assert.throws(() => core.csvToJson('a,a\n1,2'), /CSV 表头不能重复/);
  assert.throws(() => core.csvToJson('a,b\n1'), /第 2 行列数不一致/);
  assert.equal(core.csvToJson(''), '[]');
});

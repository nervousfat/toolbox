import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('csvToJson builds records and guards headers', () => {
  assert.equal(core.csvToJson('a,b\n1,2'), JSON.stringify([{ a: '1', b: '2' }], null, 2));
  assert.throws(() => core.csvToJson('a,a\n1,2'), /CSV 表头不能重复/);
  assert.throws(() => core.csvToJson('a,b\n1'), /第 2 行列数不一致/);
  assert.equal(core.csvToJson(''), '[]');
});
test('jsonToCsv quotes cells and defuses formulas', () => {
  assert.equal(core.jsonToCsv('[{"a":1,"b":"x"}]'), '"a","b"\r\n"1","x"');
  assert.ok(core.jsonToCsv('[{"a":"=SUM(A1)"}]').includes("'=SUM(A1)"));
  assert.throws(() => core.jsonToCsv('{"a":1}'), /JSON 必须是对象数组/);
});

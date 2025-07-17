import test from 'node:test';
import assert from 'node:assert/strict';
import { jsonToCsv, parseCsv } from '../core.js';

test('CSV formula prefixes receive a single text marker in both headers and data', () => {
  const samples = ['=1+1', '+2', '-3', '@name', '  =1', '\t+2', '\r\n-3'];
  for (const value of samples) {
    const rows = parseCsv(jsonToCsv(JSON.stringify([{ [value]: value }])));
    const normalized = value.replace(/\r\n|\r/g, '\n');
    assert.deepEqual(rows, [["'" + normalized], ["'" + normalized]]);
  }
});

test('CSV protection leaves already marked and ordinary cells unchanged', () => {
  const values = ["'=1", 'price - 3', 'plain+text', ' a=b', ' ', '', '你好'];
  for (const value of values) {
    const rows = parseCsv(jsonToCsv(JSON.stringify([{ text: value }])));
    assert.equal(rows[1][0], value);
  }
  assert.equal(parseCsv(jsonToCsv('[{"amount":-12}]'))[1][0], "'-12");
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { jsonToCsv, csvToJson } from '../core.js';

test('String-only CSV tables round trip Unicode delimiters and embedded LF characters', () => {
  const values = ['', '你好', '🌱', 'e\u0301', 'a,b', 'a"b', 'line\nnext', '\u0000', '  text  ', "'quoted"];
  const records = values.map((left, index) => ({ id: String(index).padStart(3, '0'), left, right: values[(index * 3 + 1) % values.length] }));
  const source = JSON.stringify(records);
  const encoded = jsonToCsv(source);
  assert.deepEqual(JSON.parse(csvToJson(encoded)), records);
  assert.equal(JSON.stringify(records), source, 'source collection remains unchanged');
});

test('CSV round trips preserve a generated grid without inferring scalar types', () => {
  const records = Array.from({ length: 64 }, (_, row) => ({
    index: String(row), number: `${row}.00`, boolean: row % 2 ? 'true' : 'false', note: `行${row},"${row % 7}"\n结束`
  }));
  assert.deepEqual(JSON.parse(csvToJson(jsonToCsv(JSON.stringify(records)))), records);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { jsonToCsv, parseCsv } from '../core.js';

test('CSV export unions heterogeneous own fields without inventing inherited values', () => {
  const source = '[{"name":"first","constructor":"own","__proto__":"named","toString":"text"},{"name":"second","extra":true}]';
  const rows = parseCsv(jsonToCsv(source));
  assert.deepEqual(rows[0], ['name', 'constructor', '__proto__', 'toString', 'extra']);
  assert.deepEqual(rows[1], ['first', 'own', 'named', 'text', '']);
  assert.deepEqual(rows[2], ['second', '', '', '', 'true']);
});

test('CSV export serializes nested values and maps null or absent cells to empty text', () => {
  const records = [{ list: [1, 'x'], object: { enabled: true }, absent: null }, { list: [], number: 0 }];
  const rows = parseCsv(jsonToCsv(JSON.stringify(records)));
  assert.deepEqual(rows[0], ['list', 'object', 'absent', 'number']);
  assert.deepEqual(rows[1], ['[1,"x"]', '{"enabled":true}', '', '']);
  assert.deepEqual(rows[2], ['[]', '', '', '0']);
  for (const value of ['{}', 'null', '[[]]', '[null]', '[true]']) assert.throws(() => jsonToCsv(value));
  assert.equal(jsonToCsv('[{},{}]'), '');
});

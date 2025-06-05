import test from 'node:test';
import assert from 'node:assert/strict';
import { prettyJson } from '../core.js';

test('JSON formatting preserves escaped controls and string contents at indentation boundaries', () => {
  const value = { controls: '\u0000\b\f\n\r\t', quote: '"\\', spaces: '  a  b  ', supplementary: '🌿' };
  const source = JSON.stringify(value);
  for (const spaces of [0, 1, 7, 8]) {
    const result = prettyJson(source, spaces);
    assert.deepEqual(JSON.parse(result), value);
    assert.equal(result, JSON.stringify(value, null, spaces));
  }
  assert.equal(prettyJson(source, 0), source);
  assert.match(prettyJson(source, 8), /\n {8}"controls"/);
});

test('JSON formatting rejects non-text sources and unsupported indentation types', () => {
  for (const value of [null, undefined, 3, true, {}, [], new String('{}')]) {
    assert.throws(() => prettyJson(value), TypeError);
  }
  for (const value of [9, -1, 0.5, NaN, Infinity, '2', null, false]) {
    assert.throws(() => prettyJson('{}', value), RangeError);
  }
  assert.throws(() => prettyJson('"literal\nnewline"'), SyntaxError);
  assert.throws(() => prettyJson('{"a":1,}'), SyntaxError);
});

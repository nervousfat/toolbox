import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv } from '../core.js';

test('CSV normalizes CRLF and CR both between records and within quoted fields', () => {
  for (const newline of ['\n', '\r', '\r\n']) {
    const source = `title,note${newline}one,"a${newline}b"${newline}`;
    assert.deepEqual(parseCsv(source), [['title', 'note'], ['one', 'a\nb']]);
  }
  assert.deepEqual(parseCsv('a,b\rc,d\r\ne,f\n'), [['a', 'b'], ['c', 'd'], ['e', 'f']]);
});

test('CSV closing quotes accept only record separators or end of input', () => {
  assert.deepEqual(parseCsv('"a","b"'), [['a', 'b']]);
  assert.deepEqual(parseCsv('""""'), [['"']]);
  assert.deepEqual(parseCsv('"a""b"'), [['a"b']]);
  for (const source of ['"a" ', '"a"\tb', ' "a"', '"a"b,c', '"a""']) {
    assert.throws(() => parseCsv(source), Error, source);
  }
});

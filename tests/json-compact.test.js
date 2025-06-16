import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { compactJson } from '../core.js';

test('JSON compaction removes formatting whitespace without changing whitespace inside strings', () => {
  const object = { sentence: '  a  b\t\n c ', emoji: '👩‍💻', accent: 'e\u0301' };
  const source = '\r\n\t ' + JSON.stringify(object, null, 6) + '\r\n';
  const result = compactJson(source);
  assert.deepEqual(JSON.parse(result.text), object);
  assert.equal(result.before, Buffer.byteLength(source, 'utf8'));
  assert.equal(result.after, Buffer.byteLength(result.text, 'utf8'));
  assert.equal(result.saved, result.before - result.after);
  assert.deepEqual(compactJson(result.text), { text: result.text, before: result.after, after: result.after, saved: 0 });
});

test('JSON compaction reports zero savings when canonical number spelling grows', () => {
  const result = compactJson('1e3');
  assert.equal(result.text, '1000');
  assert.equal(result.before, 3);
  assert.equal(result.after, 4);
  assert.equal(result.saved, 0);
  assert.throws(() => compactJson(123), TypeError);
  assert.throws(() => compactJson('[1,,2]'), SyntaxError);
});

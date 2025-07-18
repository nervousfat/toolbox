import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { encodeBase64 } from '../core.js';

test('Base64 chunk boundaries agree with the independent Node Buffer encoder', () => {
  for (const size of [0, 1, 2, 3, 8191, 8192, 8193, 16383, 16384, 16385]) {
    const source = 'a'.repeat(size);
    assert.equal(encodeBase64(source), Buffer.from(source, 'utf8').toString('base64'), `ASCII byte length ${size}`);
  }
  for (const prefix of [8188, 8189, 8190, 8191, 8192]) {
    const source = 'x'.repeat(prefix) + '🌿中文é';
    assert.equal(encodeBase64(source), Buffer.from(source, 'utf8').toString('base64'), `multibyte boundary ${prefix}`);
  }
});

test('Base64 encoding replaces isolated UTF-16 surrogates using UTF-8 replacement characters', () => {
  for (const source of ['\ud800', '\udfff', 'a\ud800b', '\ud800\ud800']) {
    assert.equal(encodeBase64(source), Buffer.from(source, 'utf8').toString('base64'));
  }
  for (const value of [null, 42, {}, []]) assert.throws(() => encodeBase64(value), TypeError);
});

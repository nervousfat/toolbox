import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeUrl } from '../core.js';

test('URL decoding processes one layer and leaves literal plus signs and unescaped text intact', () => {
  assert.equal(decodeUrl('%252F'), '%2F');
  assert.equal(decodeUrl('%2f%2F'), '//');
  assert.equal(decodeUrl('a+b%2Bc%20d'), 'a+b+c d');
  assert.equal(decodeUrl('中文🌿'), '中文🌿');
  assert.equal(decodeUrl('%EF%BB%BFtext'), '\uFEFFtext');
});

test('URL decoding throws without returning a partial result for malformed suffixes', () => {
  for (const source of ['valid%2', 'valid%GG', 'valid%E2%82', '%C0%AF', '%ED%A0%80', '%F4%90%80%80']) {
    assert.throws(() => decodeUrl(source), /URL 编码不完整或不是有效 UTF-8/, source);
  }
  assert.equal(decodeUrl('valid%20text'), 'valid text', 'a rejected call does not affect the next conversion');
  for (const value of [null, undefined, 1, {}]) assert.throws(() => decodeUrl(value), TypeError);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeUrl } from '../core.js';

test('URL component encoding escapes reserved separators and preserves only unreserved ASCII', () => {
  const unreserved = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  assert.equal(encodeUrl(unreserved), unreserved);
  const reserved = ":/?#[]@!$&'()*+,;=";
  const expected = '%3A%2F%3F%23%5B%5D%40%21%24%26%27%28%29%2A%2B%2C%3B%3D';
  assert.equal(encodeUrl(reserved), expected);
  assert.equal(encodeUrl(' \t\r\n%'), '%20%09%0D%0A%25');
  assert.equal(encodeUrl('𐀀'), '%F0%90%80%80');
});

test('URL encoding rejects either isolated surrogate while accepting valid pairs', () => {
  for (const source of ['\udc00', '\ud800x', 'x\udfff', '\ud800\ud800']) {
    assert.throws(() => encodeUrl(source), /Unicode/);
  }
  for (const value of [null, false, 0, {}]) assert.throws(() => encodeUrl(value), TypeError);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('base64 round-trips unicode text', () => {
  for (const sample of ['hello', '你好，世界', 'emoji 🌍 ok', '']) {
    assert.equal(core.decodeBase64(core.encodeBase64(sample)), sample);
  }
});

test('decodeBase64 rejects malformed input', () => {
  assert.throws(() => core.decodeBase64('a'), /Base64 格式不正确/);
  assert.throws(() => core.decodeBase64('!!!'), /Base64 格式不正确/);
});

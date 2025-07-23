import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { decodeBase64, encodeBase64 } from '../core.js';

test('Base64 decoding requires complete canonical padding and zero unused bits', () => {
  for (const [encoded, expected] of [['', ''], ['Zg==', 'f'], ['Zm8=', 'fo'], ['Zm9v', 'foo']]) {
    assert.equal(decodeBase64(encoded), expected);
  }
  for (const malformed of ['Zg', 'Zg=', 'Zg===', 'Zh==', 'Zm9=', '=Zg=', 'Zg==Zg==', 'Zg-_']) {
    assert.throws(() => decodeBase64(malformed), Error, malformed);
  }
  assert.equal(decodeBase64('\t Z m 9 v\r\n'), 'foo');
});

test('Base64 decoding rejects malformed UTF-8 and preserves a leading byte order marker', () => {
  for (const bytes of [[0x80], [0xc0, 0xaf], [0xe2, 0x82], [0xed, 0xa0, 0x80], [0xf4, 0x90, 0x80, 0x80]]) {
    assert.throws(() => decodeBase64(Buffer.from(bytes).toString('base64')));
  }
  for (const value of ['\uFEFF', '\uFEFFdocument', '\uFEFF\uFEFF', 'a\uFEFFb', '中文🌿']) {
    assert.equal(decodeBase64(encodeBase64(value)), value);
  }
});

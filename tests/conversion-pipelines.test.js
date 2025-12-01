import test from 'node:test';
import assert from 'node:assert/strict';
import { prettyJson, compactJson, encodeBase64, decodeBase64, encodeUrl, decodeUrl, escapeHtml, unescapeHtml } from '../core.js';

test('Text conversion pipelines preserve Unicode and delimiters when reversed in the correct order', () => {
  const values = ['', '中文 🌿', '<p title="a&b">\'text\'</p>', '100% + / ? #', 'line\nnext\tend', '\uFEFFdocument', '\u0000'];
  for (const value of values) {
    const encoded = encodeUrl(encodeBase64(escapeHtml(value)));
    const decoded = unescapeHtml(decodeBase64(decodeUrl(encoded)));
    assert.equal(decoded, value);
    assert.equal(unescapeHtml(escapeHtml(value)), value);
  }
});

test('JSON formatting followed by transport encoding preserves the parsed value', () => {
  const records = Array.from({ length: 32 }, (_, index) => ({ index, enabled: index % 2 === 0, label: `编号 ${index} 🌿`, values: [null, index / 2, `a&b\n${index}`] }));
  const source = JSON.stringify(records);
  const transport = encodeBase64(encodeUrl(prettyJson(source, 4)));
  const restored = compactJson(decodeUrl(decodeBase64(transport))).text;
  assert.deepEqual(JSON.parse(restored), records);
});

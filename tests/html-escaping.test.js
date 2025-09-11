import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../core.js';

test('HTML escaping handles adjacent delimiters and treats existing entities as literal text', () => {
  assert.equal(escapeHtml('&<>"\''), '&amp;&lt;&gt;&quot;&#39;');
  assert.equal(escapeHtml('&amp; &#39; &unknown;'), '&amp;amp; &amp;#39; &amp;unknown;');
  assert.equal(escapeHtml('&&<<'), '&amp;&amp;&lt;&lt;');
  assert.equal(escapeHtml('中文 🌿\n\t / = `'), '中文 🌿\n\t / = `');
});

test('HTML escaping composes over text chunks without altering their ordering', () => {
  const chunks = ['<p title="', '你好 & ', "'world'", '">', 'text', '</p>'];
  assert.equal(escapeHtml(chunks.join('')), chunks.map(escapeHtml).join(''));
  assert.equal(escapeHtml(''), '');
  for (const value of [null, undefined, 2, {}, []]) assert.throws(() => escapeHtml(value), TypeError);
});

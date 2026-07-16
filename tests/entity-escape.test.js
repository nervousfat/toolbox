import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('escapeHtml covers the five dangerous characters', () => {
  assert.equal(core.escapeHtml('<a href="x">&\'z\''), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;z&#39;');
});

test('unescapeHtml resolves named and numeric references', () => {
  assert.equal(core.unescapeHtml('&amp;&lt;&#65;&#x41;&nbsp;'), '&<AA\u00a0');
  assert.equal(core.unescapeHtml('&#0;'), '\ufffd');
});

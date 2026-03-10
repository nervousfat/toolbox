import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from './core.js';

test("JSON formatting preserves primitives and nesting", () => {
  const source = '{"items":[1,true,null],"name":"演示"}';
  const formatted = core.prettyJson(source, 4);
  assert.deepEqual(JSON.parse(formatted), JSON.parse(source));
  assert.ok(formatted.includes('\n    "items"'));
  assert.equal(core.prettyJson('null'), 'null');
  assert.throws(() => core.prettyJson('{broken}'));
  assert.throws(() => core.prettyJson('{}', -1));
  assert.throws(() => core.prettyJson('{}', 1.5));
});

test("JSON compaction measures UTF-8 bytes accurately", () => {
  const source = ' { "x": "你好" } ';
  const result = core.compactJson(source);
  assert.equal(result.text, '{"x":"你好"}');
  assert.equal(result.before, new TextEncoder().encode(source).length);
  assert.equal(result.after, new TextEncoder().encode(result.text).length);
  assert.equal(result.saved, result.before - result.after);
  assert.equal(core.compactJson('true').saved, 0);
  assert.throws(() => core.compactJson('undefined'));
});


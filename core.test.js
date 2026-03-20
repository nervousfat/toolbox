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

test("JSON inspection handles null and mixed trees", () => {
  const result = core.inspectJson('{"a":[1,null,{"b":true}]}');
  assert.equal(result.objects, 2);
  assert.equal(result.arrays, 1);
  assert.equal(result.values, 3);
  assert.equal(result.depth, 3);
  assert.deepEqual(core.inspectJson('null'), { objects: 0, arrays: 0, values: 1, depth: 0 });
  assert.equal(core.inspectJson('[]').arrays, 1);
  assert.throws(() => core.inspectJson(''));
});

test("CSV quoted fields retain commas quotes and newlines", () => {
  const rows = core.parseCsv('name,note\r\n"小明","a,b"\r\n"二","line\n""quoted"""\r\n');
  assert.deepEqual(rows[0], ['name', 'note']);
  assert.deepEqual(rows[1], ['小明', 'a,b']);
  assert.deepEqual(rows[2], ['二', 'line\n"quoted"']);
  assert.equal(rows.length, 3);
  assert.deepEqual(core.parseCsv('a,'), [['a', '']]);
  assert.deepEqual(core.parseCsv(''), []);
  assert.deepEqual(core.parseCsv('\uFEFFa\nb'), [['a'], ['b']]);
});

test("CSV rejects ambiguous malformed records", () => {
  assert.throws(() => core.parseCsv('"abc'));
  assert.throws(() => core.parseCsv('a"b'));
  assert.throws(() => core.parseCsv('"a"b'));
  assert.throws(() => core.csvToJson('a,a\n1,2'));
  assert.throws(() => core.csvToJson('a,\n1,2'));
  assert.throws(() => core.csvToJson('a,b\n1'));
  assert.equal(core.csvToJson(''), '[]');
  assert.deepEqual(JSON.parse(core.csvToJson('__proto__\nvalue')), [{ ['__proto__']: 'value' }]);
});


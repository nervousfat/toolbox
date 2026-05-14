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

test("CSV exports escaped values and spreadsheet-safe text", () => {
  const csv = core.jsonToCsv('[{"name":"=SUM(1)","note":"a,b"},{"name":"hello"}]');
  const rows = core.parseCsv(csv);
  assert.deepEqual(rows[0], ['name', 'note']);
  assert.equal(rows[1][0], "'=SUM(1)");
  assert.equal(rows[1][1], 'a,b');
  assert.equal(rows[2][1], '');
  assert.throws(() => core.jsonToCsv('[1]'));
  assert.equal(core.jsonToCsv('[]'), '');
});

test("Base64 round trips Unicode and large inputs", () => {
  for (const source of ['', 'hello', '你好 🌿', 'é'.repeat(20000)]) {
    const encoded = core.encodeBase64(source);
    assert.equal(core.decodeBase64(encoded), source);
  }
  assert.equal(core.encodeBase64('hello'), 'aGVsbG8=');
  assert.equal(core.decodeBase64(' aGVs\nbG8= '), 'hello');
  assert.throws(() => core.decodeBase64('Zg='));
  assert.throws(() => core.decodeBase64('/w=='));
  assert.throws(() => core.decodeBase64('Zh=='));
});

test("URL components preserve plus and reject malformed input", () => {
  const source = '你好 + &/?';
  assert.equal(core.decodeUrl(core.encodeUrl(source)), source);
  assert.equal(core.decodeUrl('a+b'), 'a+b');
  assert.equal(core.encodeUrl("!'()*"), '%21%27%28%29%2A');
  assert.throws(() => core.decodeUrl('%'));
  assert.throws(() => core.decodeUrl('%FF'));
  assert.throws(() => core.encodeUrl('\ud800'));
  assert.equal(core.decodeUrl(''), '');
});

test("HTML entities are text and decode only once", () => {
  const source = '<p title="你好">A & B</p>';
  assert.equal(core.unescapeHtml(core.escapeHtml(source)), source);
  assert.equal(core.unescapeHtml('&amp;lt;'), '&lt;');
  assert.equal(core.unescapeHtml('&#x1f331;'), '🌱');
  assert.equal(core.unescapeHtml('&#0;'), '\ufffd');
  assert.equal(core.unescapeHtml('&#xD800;'), '\ufffd');
  assert.equal(core.unescapeHtml('&unknown;'), '&unknown;');
  assert.equal(core.escapeHtml("'"), '&#39;');
});

test("Slugs preserve Chinese and normalize accented text", () => {
  assert.equal(core.slugify(' Hello, World! '), 'hello-world');
  assert.equal(core.slugify('Crème brûlée'), 'creme-brulee');
  assert.equal(core.slugify('你好 世界'), '你好-世界');
  assert.equal(core.slugify('one___two'), 'one-two');
  assert.equal(core.slugify('---'), '');
  assert.equal(core.slugify('ＡＢＣ'), 'abc');
  assert.equal(core.slugify('a   b'), 'a-b');
  assert.throws(() => core.slugify(null));
});

test("Text stats count grapheme clusters independently", () => {
  const result = core.textStats('👩‍💻');
  assert.equal(result.graphemes, 1);
  assert.equal(result.characters, 3);
  assert.equal(result.bytes, 11);
  assert.equal(core.textStats('').lines, 0);
  assert.equal(core.textStats('a\r\nb\rc\n').lines, 4);
  assert.equal(core.textStats('hello world').words, 2);
  assert.equal(core.textStats('e\u0301').graphemes, 1);
  assert.equal(core.textStats('你好').bytes, 6);
});

test("Line utilities keep stable deduplication and numeric sorting", () => {
  assert.equal(core.uniqueLines('A\nb\nA'), 'A\nb');
  assert.equal(core.uniqueLines('A\na', true), 'A');
  assert.equal(core.uniqueLines('a\n a'), 'a\n a');
  assert.equal(core.uniqueLines('a\r\na'), 'a');
  assert.equal(core.sortLines('10\n2\n1'), '1\n2\n10');
  assert.equal(core.sortLines('1\n2\n10', true), '10\n2\n1');
  assert.equal(core.uniqueLines(''), '');
  assert.equal(core.sortLines(''), '');
});


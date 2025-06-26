import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv } from '../core.js';

test('CSV empty fields remain distinct from absent records and final line terminators', () => {
  const cases = [
    ['', []],
    ['\n', [['']]],
    ['\n\n', [[''], ['']]],
    [',', [['', '']]],
    [',\n', [['', '']]],
    ['""', [['']]],
    ['"",', [['', '']]],
    ['a,b\n\n', [['a', 'b'], ['']]],
    ['a,b\n,', [['a', 'b'], ['', '']]]
  ];
  for (const [source, expected] of cases) assert.deepEqual(parseCsv(source), expected, JSON.stringify(source));
});

test('CSV strips one leading file marker while preserving markers within cells', () => {
  assert.deepEqual(parseCsv('\uFEFF'), []);
  assert.deepEqual(parseCsv('\uFEFFa,\uFEFFb'), [['a', '\uFEFFb']]);
  assert.deepEqual(parseCsv('"\uFEFFa"'), [['\uFEFFa']]);
  for (const value of [null, 0, {}, []]) assert.throws(() => parseCsv(value), TypeError);
});

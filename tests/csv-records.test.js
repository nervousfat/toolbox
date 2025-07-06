import test from 'node:test';
import assert from 'node:assert/strict';
import { csvToJson } from '../core.js';

test('CSV records preserve textual cell values and exact nonnumeric header order', () => {
  const source = 'second, first ,constructor,__proto__,toString\n002, true ,c,p,t';
  const [record] = JSON.parse(csvToJson(source));
  assert.deepEqual(Object.keys(record), ['second', ' first ', 'constructor', '__proto__', 'toString']);
  assert.equal(record.second, '002');
  assert.equal(record[' first '], ' true ');
  for (const [name, value] of [['constructor', 'c'], ['__proto__', 'p'], ['toString', 't']]) {
    assert.ok(Object.hasOwn(record, name));
    assert.equal(record[name], value);
  }
  assert.equal(Object.getPrototypeOf(record), Object.prototype);
});

test('CSV width errors identify the offending record and preserve significant header spaces', () => {
  assert.throws(() => csvToJson('a,b\n1,2\n3'), /第 3 行列数不一致/);
  assert.throws(() => csvToJson('a,b\n1,2,3'), /第 2 行列数不一致/);
  assert.throws(() => csvToJson('a, \n1,2'), /表头不能为空/);
  assert.deepEqual(JSON.parse(csvToJson('a, a\nx,y')), [{ a: 'x', ' a': 'y' }]);
  assert.equal(csvToJson('a,b'), '[]');
});

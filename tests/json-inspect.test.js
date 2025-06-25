import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectJson } from '../core.js';

test('JSON inspection traverses deeply nested input without recursive calls', () => {
  const depth = 12000;
  const source = '['.repeat(depth) + '0' + ']'.repeat(depth);
  assert.deepEqual(inspectJson(source), { objects: 0, arrays: depth, values: 1, depth });
});

test('JSON inspection counts empty containers as structures rather than scalar values', () => {
  assert.deepEqual(inspectJson('{"a":{},"b":[],"c":[{},[]]}'), { objects: 3, arrays: 3, values: 0, depth: 2 });
  for (const source of ['0', 'false', '""', 'null']) {
    assert.deepEqual(inspectJson(source), { objects: 0, arrays: 0, values: 1, depth: 0 });
  }
  assert.deepEqual(inspectJson('{}'), { objects: 1, arrays: 0, values: 0, depth: 0 });
});

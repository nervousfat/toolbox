import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('hexToRgb expands three-digit shorthand', () => {
  assert.deepEqual(core.hexToRgb('#abc'), { r: 170, g: 187, b: 204 });
  assert.deepEqual(core.hexToRgb('00ff10'), { r: 0, g: 255, b: 16 });
  assert.throws(() => core.hexToRgb('zzz'), /请输入三位或六位十六进制颜色/);
});

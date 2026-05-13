import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('hexToRgb expands three-digit shorthand', () => {
  assert.deepEqual(core.hexToRgb('#abc'), { r: 170, g: 187, b: 204 });
  assert.deepEqual(core.hexToRgb('00ff10'), { r: 0, g: 255, b: 16 });
  assert.throws(() => core.hexToRgb('zzz'), /请输入三位或六位十六进制颜色/);
});
test('contrastRatio separates black and white by twenty-one', () => {
  assert.ok(Math.abs(core.contrastRatio('#ffffff', '#000000') - 21) < 1e-9);
  assert.equal(core.contrastRatio('#333333', '#333333'), 1);
  assert.equal(core.rgbToHex(0, 255, 16), '#00ff10');
  assert.throws(() => core.rgbToHex(256, 0, 0), /RGB 通道应为 0 到 255 的整数/);
});

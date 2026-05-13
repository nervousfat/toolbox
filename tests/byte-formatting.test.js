import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from '../core.js';

test('formatBytes picks binary units', () => {
  assert.equal(core.formatBytes(0), '0 B');
  assert.equal(core.formatBytes(1023), '1023 B');
  assert.equal(core.formatBytes(1024), '1.00 KiB');
  assert.equal(core.formatBytes(1048576), '1.00 MiB');
  assert.equal(core.formatBytes(5 * 1073741824), '5.00 GiB');
});

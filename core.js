export function prettyJson(text, spaces = 2) {
  if (typeof text !== 'string') throw new TypeError('请输入 JSON 文本');
  if (!Number.isInteger(spaces) || spaces < 0 || spaces > 8) {
    throw new RangeError('缩进应为 0 到 8');
  }
  const value = JSON.parse(text);
  const result = JSON.stringify(value, null, spaces);
  return result;
}


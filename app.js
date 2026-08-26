import * as core from './core.js';
const byId = id => document.getElementById(id);
const input = byId('input');
const output = byId('output');
const operation = byId('operation');
const status = byId('status');
const operations = [
  ['json-pretty', 'JSON · 格式化', core.prettyJson, '为 JSON 添加两空格缩进。', '{"name":"小工具","items":[1,2,3]}', 'json'],
  ['json-compact', 'JSON · 压缩', text => core.compactJson(text).text, '移除 JSON 多余空白。', '{\n  "hello": "世界"\n}', 'json'],
  ['json-inspect', 'JSON · 结构统计', text => JSON.stringify(core.inspectJson(text), null, 2), '统计对象、数组、值和最大深度。', '{"items":[1,2,{"ok":true}]}', 'json'],
  ['csv-json', 'CSV → JSON', core.csvToJson, '首行作为表头，支持引号和字段内换行。', 'name,city\n小明,上海\n小雨,杭州', 'json'],
  ['json-csv', 'JSON → CSV', core.jsonToCsv, '将对象数组导出为 CSV，公式开头的字段会加单引号。', '[{"name":"小明","city":"上海"}]', 'csv'],
  ['base64-encode', 'Base64 · 编码', core.encodeBase64, '使用 UTF-8 编码，支持中文与 emoji。', '你好，世界 🌱', 'txt'],
  ['base64-decode', 'Base64 · 解码', core.decodeBase64, '输入完整 Base64，结果必须是有效 UTF-8。', '5L2g5aW977yM5LiW55WMIPCfjLE=', 'txt'],
  ['url-encode', 'URL · 编码', core.encodeUrl, '编码一个 URL 参数值，不用于编码完整网址。', '你好 + hello@example.com', 'txt'],
  ['url-decode', 'URL · 解码', core.decodeUrl, '解码 URL 参数；加号保持原样。', '%E4%BD%A0%E5%A5%BD%20%2B', 'txt'],
  ['html-escape', 'HTML · 转义', core.escapeHtml, '将 HTML 特殊字符转换为实体。', '<p title="你好">A & B</p>', 'txt'],
  ['html-unescape', 'HTML · 实体解码', core.unescapeHtml, '只解码为纯文本，不执行 HTML。', '&lt;strong&gt;你好&lt;/strong&gt;', 'txt'],
  ['slug', '文本 · 生成 slug', core.slugify, '统一大小写和分隔符，同时保留中文。', 'Hello, 世界! Crème', 'txt'],
  ['stats', '文本 · 字数统计', text => JSON.stringify(core.textStats(text), null, 2), '区分字素簇、Unicode 码点、词数和 UTF-8 字节数。', '你好 world 👩‍💻', 'json'],
  ['dedupe', '文本 · 行去重', core.uniqueLines, '保留首次出现的行，区分大小写。', 'apple\npear\napple', 'txt'],
  ['sort', '文本 · 自然排序', core.sortLines, '按行排序，数字 2 排在 10 前。', 'item 10\nitem 2\nitem 1', 'txt'],
  ['hex-rgb', '颜色 · HEX → RGB', text => JSON.stringify(core.hexToRgb(text), null, 2), '支持 #abc 和 #aabbcc 格式。', '#187763', 'json'],
  ['rgb-hex', '颜色 · RGB → HEX', text => { const parts = text.split(/[,\s]+/).filter(Boolean); if (parts.length !== 3) throw new Error('请输入三个 RGB 通道'); return core.rgbToHex(...parts.map(Number)); }, '输入三个整数，用逗号或空格分隔。', '24, 119, 99', 'txt'],
  ['contrast', '颜色 · 对比度', text => { const colors = text.trim().split(/[,\s]+/); if (colors.length !== 2) throw new Error('请输入两个 HEX 颜色'); const ratio = core.contrastRatio(...colors); return JSON.stringify({ ratio: Number(ratio.toFixed(2)), AA: ratio >= 4.5, AAA: ratio >= 7, largeTextAA: ratio >= 3 }, null, 2); }, '输入前景与背景 HEX 颜色，检查 WCAG 文本对比度。', '#187763 #ffffff', 'json'],
  ['bytes', '数据 · 字节单位', text => { if (!/^\d+$/.test(text.trim())) throw new Error('请输入非负整数字节数'); return core.formatBytes(Number(text)); }, '将字节数转换为 KiB、MiB 等二进制单位。', '1048576', 'txt']
];
for (const [value, label] of operations) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  operation.append(option);
}
const selected = () => operations.find(item => item[0] === operation.value);
byId('run').addEventListener('click', execute);
function execute() {
  try {
    if (new TextEncoder().encode(input.value).length > 1000000) throw new Error('输入不能超过 1 MB');
    output.value = selected()[2](input.value);
    status.textContent = '转换完成。';
  } catch (error) {
    output.value = '';
    status.textContent = '无法转换：' + error.message;
  }
  refreshOutput();
}
function refreshOutput() {
  const available = output.value.length > 0;
  for (const id of ['copy', 'download', 'swap']) byId(id).disabled = !available;
  byId('output-stats').textContent = core.formatBytes(new TextEncoder().encode(output.value).length);
}

function describe() {
  byId('description').textContent = selected()[3];
  output.value = '';
  status.textContent = '已选择：' + selected()[1];
  refreshOutput();
}
operation.addEventListener('change', describe);
input.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    execute();
  }
});
describe();

byId('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    status.textContent = '结果已复制。';
  } catch {
    output.focus(); output.select();
    status.textContent = '无法访问剪贴板，结果已选中，请手动复制。';
  }
});
byId('download').addEventListener('click', () => {
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = selected()[0] + '.' + selected()[5];
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = '已生成结果文件。';
});

function refreshInput() {
  const bytes = new TextEncoder().encode(input.value).length;
  byId('input-stats').textContent = core.formatBytes(bytes);
  if (bytes > 1000000) status.textContent = '输入超过 1 MB，请缩短后再转换。';
}
input.addEventListener('input', () => {
  refreshInput();
  output.value = '';
  refreshOutput();
  status.textContent = '输入已更新，请重新转换。';
});
byId('swap').addEventListener('click', () => {
  input.value = output.value;
  output.value = '';
  refreshInput(); refreshOutput();
  status.textContent = '结果已移入输入区，可选择下一个工具。';
});
refreshInput();

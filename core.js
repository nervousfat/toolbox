export function prettyJson(text, spaces = 2) {
  if (typeof text !== 'string') throw new TypeError('请输入 JSON 文本');
  if (!Number.isInteger(spaces) || spaces < 0 || spaces > 8) {
    throw new RangeError('缩进应为 0 到 8');
  }
  const value = JSON.parse(text);
  const result = JSON.stringify(value, null, spaces);
  return result;
}

export function compactJson(text) {
  if (typeof text !== 'string') throw new TypeError('请输入 JSON 文本');
  const value = JSON.parse(text);
  const compact = JSON.stringify(value);
  const before = new TextEncoder().encode(text).length;
  const after = new TextEncoder().encode(compact).length;
  const saved = Math.max(0, before - after);
  return { text: compact, before, after, saved };
}

export function inspectJson(text) {
  const root = JSON.parse(text);
  const pending = [{ value: root, depth: 0 }];
  const result = { objects: 0, arrays: 0, values: 0, depth: 0 };
  while (pending.length) {
    const { value, depth } = pending.pop();
    result.depth = Math.max(result.depth, depth);
    if (value && typeof value === 'object') {
      result[Array.isArray(value) ? 'arrays' : 'objects']++;
      for (const child of Object.values(value)) pending.push({ value: child, depth: depth + 1 });
    } else result.values++;
  }
  return result;
}

export function parseCsv(text) {
  if (typeof text !== 'string') throw new TypeError('请输入 CSV 文本');
  text = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (!text) return [];
  const rows = []; let row = []; let field = ''; let quoted = false; let closed = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') { quoted = false; closed = true; }
      else field += char;
    } else if (char === ',' || char === '\n') {
      row.push(field); field = ''; closed = false;
      if (char === '\n') { rows.push(row); row = []; }
    } else if (char === '"' && field === '' && !closed) quoted = true;
    else if (closed || char === '"') throw new Error('CSV 引号位置不正确');
    else field += char;
  }
  if (quoted) throw new Error('CSV 引号未闭合');
  if (!text.endsWith('\n') || row.length || field || closed) { row.push(field); rows.push(row); }
  return rows;
}

export function csvToJson(text) {
  const [headers, ...rows] = parseCsv(text);
  if (!headers) return '[]';
  if (headers.some(name => !name.trim())) throw new Error('CSV 表头不能为空');
  if (new Set(headers).size !== headers.length) throw new Error('CSV 表头不能重复');
  const records = rows.map((row, index) => {
    if (row.length !== headers.length) throw new Error('第 ' + (index + 2) + ' 行列数不一致');
    return Object.fromEntries(headers.map((name, col) => [name, row[col]]));
  });
  return JSON.stringify(records, null, 2);
}

export function jsonToCsv(text) {
  const records = JSON.parse(text);
  if (!Array.isArray(records) || records.some(row => !row || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error('JSON 必须是对象数组');
  }
  const headers = [...new Set(records.flatMap(row => Object.keys(row)))];
  if (!headers.length) return '';
  const quote = value => {
    let cell = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (/^[\s]*[=+@-]/.test(cell)) cell = "'" + cell;
    return '"' + cell.replaceAll('"', '""') + '"';
  };
  return [headers, ...records.map(row => headers.map(key => row[key]))].map(row => row.map(quote).join(',')).join('\r\n');
}


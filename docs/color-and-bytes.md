# 颜色与字节

- hexToRgb 接受三位或六位十六进制（可带 #）；
- rgbToHex 校验每个通道是 0–255 的整数；
- contrastRatio 按 WCAG 相对亮度计算，黑白恰好 21:1；
- formatBytes 使用二进制单位（KiB、MiB、GiB……），非整数输入报错。

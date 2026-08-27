# 实体转义

- escapeHtml 覆盖 &、<、>、"、' 五个字符；
- unescapeHtml 支持 amp/lt/gt/quot/apos/nbsp 与十进制、十六进制数字实体；
- 越界或代理区码位替换为 U+FFFD；
- 普通文本上转义与反转义互为逆运算。

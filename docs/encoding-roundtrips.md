# 编码往返

Base64 与 URL 编码都保证无损往返：

- encodeBase64 按 UTF-8 字节分块处理，支持任意 Unicode；
- decodeBase64 校验字母表与尾部位，损坏输入直接报错；
- encodeUrl 在 encodeURIComponent 基础上补转 !、'、(、)、*；
- decodeUrl 遇到不完整的 UTF-8 序列会给出明确错误。

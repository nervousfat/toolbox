# 开发工具箱

JSON、CSV、文本编码与颜色转换。这是一个可独立运行、可独立上传 GitHub 的浏览器 demo。

## 本地运行

需要 Node.js 22 或更新版本，无第三方依赖，无需 npm install。

```powershell
cd toolbox
npm start
```

打开 http://127.0.0.1:4173 。在本项目目录执行 `npm test` 运行领域逻辑测试，`npm run check` 检查脚本语法。若同时启动多个项目，先使用 `$env:PORT=4174` 等不同端口。

## 数据与使用

所有转换在浏览器本地完成，不调用远程接口。本工具箱不使用 localStorage 保存输入；刷新或关闭页面会丢失当前文本，请提前复制或下载结果。请通过本地 HTTP 服务访问，不要直接双击 HTML。

## 目录

- `index.html`：页面入口
- `app.js`：界面和浏览器交互
- `core.js`：可测试的领域逻辑
- `core.test.js`：边界条件及行为测试
- `base.css` / `style.css`：界面样式
- `server.mjs`：仅监听本机的静态文件服务

## 提交检查

执行 `npm run history` 查看当前仓库提交总数、2026 年前作者与提交者计数、日期及所有文件变更量；执行 `npm run history -- --details` 查看逐条提交明细。

## 演示提交历史

本仓库于 2026-09-10 创建。提交日期按要求分布在 2025-04-29 至 2026-09-10，属于本次生成的演示历史，并不代表实际历时一年多的开发。每次提交都包含真实的代码、测试或文档变更；时间顺序严格递增。作者与提交者邮箱使用用户指定的邮箱，不使用本机 GitHub 身份。

本项目具有独立的 Git 历史，可单独推送到 GitHub；推送不会改变既有提交日期。GitHub 贡献图是否记录这些提交取决于提交邮箱是否已关联并验证，以及是否位于符合条件的仓库默认分支等规则，详见 [GitHub 官方说明](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference)。

## 使用与维护指南

- [JSON 格式化、压缩与数值边界](docs/json-guide.md)
- [CSV 格式、类型转换和表格前缀](docs/csv-guide.md)
- [Unicode、Base64、URL 与 HTML 文本](docs/text-encoding-guide.md)
- [本地工作流与临时数据](docs/local-workflows.md)
- [输入规模与问题排查](docs/limits-and-troubleshooting.md)
- [自动测试与浏览器验收](docs/testing-guide.md)
- [提交日期与文件变更审计](docs/history-audit.md)

新增测试位于 `tests/`，`npm test` 会同时发现这些测试与原有 `core.test.js`。本轮补充仍于 2026-09-10 实际完成，新增的历史日期属于演示设置，不代表测试和文档在过去真实编写。

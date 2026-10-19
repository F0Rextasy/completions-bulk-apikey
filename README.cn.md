<div align="center">

```
 ██████╗ ██████╗ ███╗   ███╗██████╗ ██╗     ███████╗████████╗██╗ ██████╗
██╔════╝██╔═══██╗████╗ ████║██╔══██╗██║     ██╔════╝╚══██╔══╝██║██╔═══██╗
██║     ██║   ██║██╔████╔██║██████╔╝██║     █████╗     ██║   ██║██║   ██║
██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝     ██║   ██║██║   ██║
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ███████╗███████╗   ██║   ██║╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝

███╗   ██╗███████╗
████╗  ██║██╔════╝
██╔██╗ ██║███████╗
██║╚██╗██║╚════██║
██║ ╚████║███████║
╚═╝  ╚═══╝╚══════╝
```

# completions-me-bulk-apikey

**批量创建 Completions.me 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理服务（Claude、GPT、Gemini、Grok）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-26-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## 🎁 免费额度 — 你能获得多少

**面板自身的页面将该额度描述为“100% 免费 · 无限请求 · 无需信用卡”——注册表单不要求任何支付信息、不需要电子邮箱，也没有验证码。**

| 项目 | 值 |
| --- | --- |
| 价格 | **$0** — 面板自身页面上的“100% 免费 · 无限请求” |
| 需要银行卡 | **否** |
| 需要电子邮箱 | **否** — 注册表单只需用户名 + 密码 |
| 验证码 | 注册时**无** |
| 用量计量 | 账户上的 `GET /api/usage` |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 可接受任意 N |

> 💡 额度由 completions.me 设定，可能会变化。工具自身的实时检查才是准绳：

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 免费额度由 Completions.me 设定，可能会变化。请在 [completions.me](https://completions.me) 查看实时数字——并让工具自身的关卡来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 26 个

`GET https://completions.me/api/v1/models` 对已生成的密钥返回 **26 个模型**（测量于 2026-10-15）——完整列表收录在 [`src/models.json`](src/models.json) 中，而本构建通过 `GET /models` 验证密钥（聊天检查需通过 `verify --chat` 主动启用），因此此处尚无任何 id 带有勾选标记。

捕获的 `/api/v1/models` 响应随附于 [`src/models.json`](src/models.json) —— 它是元数据（端点、时间戳、数量），实时列表来自端点本身：

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 如何使用 API

基础 URL 是 **`https://completions.me/api/v1`** —— 这是面板在其自身仪表盘中显示的基础 URL（单独的 `/v1` 并非同一地址）。

```python
from openai import OpenAI

client = OpenAI(base_url="https://completions.me/api/v1", api_key="sk-cp_...")
print(client.chat.completions.create(
    model="claude-sonnet-4.6",
    messages=[{"role": "user", "content": "Hello!"}],
).choices[0].message.content)
```

```bash
curl https://completions.me/api/v1/chat/completions \
  -H "Authorization: Bearer sk-cp_…" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-sonnet-4.6","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 快速开始

```bash
# clone this repository (or download the ZIP), then:
cd completions-bulk-apikey

# 1) your proxy list — one exit per line (http://, socks5://, socks4:// or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go
node src/launcher.js               # interactive: mint / finish / verify / settings
# or directly:
node src/cli.js mint --count 3     # fresh accounts → one verified key each
node src/cli.js finish             # log back in to accounts already created and finish their key
node src/cli.js verify             # re-check the keys already on disk
```

`node src/cli.js help` 会列出所有任务。密钥写入 `keys.txt`，每行一个，在提供商自身的 API 返回密钥的那一刻即追加；每个账户的详细信息（用户名、密码、步骤、验证结果）写入 `accounts.json`。

### 🖱️ 启动器

```bash
node src/launcher.js
```

一个覆盖各任务模块的菜单：**mint**、**finish**、**verify**、**9Router**。它会询问数量、代理池和验证并发数，将它们记录在 `launcher.config.json` 中，并以正确的标志启动 `node src/cli.js <task>`。`node src/launcher.js --connect-9router` 会直接运行 9Router 注册，并首先询问基础 URL 和密码。

## ✅ 已验证可用 — 每个密钥都经过测试

只有当**该提供商自身的主机**用密钥成功应答时，密钥才算数：

| 检查 | 调用 | 预期 |
| --- | --- | --- |
| 认证 + 模型列表 | `GET https://completions.me/api/v1/models` | `200` + 该账户的模型目录（26 个模型） |

该检查从**与生成密钥不同的出口**运行，因此它不可能仅凭会话状态而非密钥有效性通过。`node src/cli.js verify` 会对你自己的文件精确复现该检查，你也可以手动执行：

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 |
| --- | --- |
| 注册 | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + 会话 cookie |
| 会话检查 | `GET /api/auth/session` — 生成流程在触碰密钥之前先确认账户存在 |
| 创建密钥 | `POST /api/keys`（来自注册/登录的会话 cookie）→ `{"key":"sk-cp_…"}` |
| 密钥列表 / 删除 | `GET /api/keys` · `DELETE /api/keys/{id}` |
| 用量 | `GET /api/usage` |
| 验证 | `GET /api/v1/models`（Bearer `sk-cp_…`）→ `200` |

一切都通过 `proxies.txt` 中的出口运行：每次尝试都会在使用前立即针对该主机预检其出口，中途失效的线路只消耗一次尝试，而不会导致整个运行失败。`finish` 会重新登录那些已注册但因出口失效而丢失密钥步骤的账户——新密钥来自 `mint`。

## ⚙️ CLI 选项

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

每个任务都有自己的标志——用 `node src/<task-file> --help` 直接询问它。

启动器将 `count`（每次运行生成的数量）和 `conc`（并行生成数，默认 `2`）保存在 `launcher.config.json` 中——无需任何环境变量。

`--count N` 可接受任意 N：配额存在于账户上，因此一个账户就是一个密钥。

## ⚡ 运行形态（预设）

`--preset=turbo|balanced|safe` 设置工作线程数 + 账户之间的暂停时间（turbo = 5，
balanced = 4，safe = 2）；显式的 `--conc`/`--gap`（或仓库自身的标志）始终优先，
且在没有 `--preset` 时，工具完全保持其历史形态。

推荐 Turbo（5 个工作线程）；更多则在性能较弱的电脑上有负载/封禁风险。

## 🛰️ 在代理之后

每次面板调用都通过 `proxies.txt` 中的一条线路进行（每行一个出口——`scheme://host:port[#comment]`，支持 `user:pass@`，也接受裸 `host:port`）。每次尝试都会在使用前立即针对 `completions.me` 预检其出口，中途失效的线路只消耗一次尝试，而不会导致整个运行失败——`finish` 会在新的出口上重新接续该账户。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个已验证的密钥——已被 git 忽略，绝不提交 |
| `accounts.json` | 每个账户一条记录：`username`、`password`、`steps`、`verify`——已被 git 忽略 |
| [`src/models.json`](src/models.json) | `/api/v1/models` 的捕获结果（端点、时间戳、数量） |
| `proxies.txt` | 你的出口，每行一个——已被 git 忽略 |
| `launcher.config.json` | 启动器记住的内容——已被 git 忽略 |
| `src/cli.js` · `src/launcher.js` | 任务运行器和交互式菜单 |
| `src/connect-9router.js` | 将 `keys.txt` 中的密钥注册为 9Router 连接（零依赖） |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。Completions.me 兼容 OpenAI，因此注册一次即可使用所有密钥：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

`keys.txt` 中的每个密钥都会成为 `completions-me` 提供商节点的一个连接（`--api-key <key>` 则注册单个密钥，`--model <id>` 覆盖默认模型）。然后在 9Router 中选择一个模型：

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

将连接器指向刷新后的 `keys.txt` 即可添加更多账户；节点及其模型列表保持不变。`node src/launcher.js --connect-9router` 正是运行此操作，并首先询问基础 URL 和密码。

## 🔑 一个密钥能带给你什么

| | |
| --- | --- |
| 🏢 提供商 | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 提供商提供的内容 | 100% 免费 · 无限请求 · 无需银行卡、无需电子邮箱、无需验证码 |
| 🔑 一个密钥能带给你什么 | 一个限定于其自身账户的 API 密钥：下方端点上的 26 个模型 id，受你套餐的限制。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://completions.me/api/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 completions.me 和你配置的收件箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

如果 completions.me 更改了注册形态、密钥路由或 API 基础地址，工具会在该步骤停止并说明原因。请**[提交 issue](../../issues)**，附上你运行的命令和确切输出；欢迎 PR。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>
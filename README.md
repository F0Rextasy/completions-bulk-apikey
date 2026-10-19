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

**Bulk-create Completions.me accounts with auto-generated API keys — OpenAI-compatible inference (Claude, GPT, Gemini, Grok) + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-26-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Free tier — how much you get

**The panel's own pages describe the tier as "100% Free · Unlimited Requests · No Credit Card" — and the register form asks for no payment details, no e-mail and no captcha.**

| What | Value |
| --- | --- |
| Price | **$0** — "100% Free · Unlimited Requests" on the panel's own pages |
| Card required | **No** |
| E-mail required | **No** — the register form takes a username + password only |
| Captcha | **None** on registration |
| Usage meter | `GET /api/usage` on the account |
| The unit that scales | **one account = one key** → `--count N` takes any N |

> 💡 The allowance is set by completions.me and can change. The tool's live check is what counts:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 The free tier is set by Completions.me and can change. Check the live numbers at [completions.me](https://completions.me) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 26 of them

`GET https://completions.me/api/v1/models` answers **26 models** for a minted key (measured 2026-10-15) — the full list is captured in [`src/models.json`](src/models.json), and this build verifies a key against `GET /models` (the chat check is opt-in via `verify --chat`), so no id carries a tick here yet.

The captured `/api/v1/models` answer ships in [`src/models.json`](src/models.json) — it is metadata (endpoint, timestamp, count), and the live list comes from the endpoint itself:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 How to use the API

The base URL is **`https://completions.me/api/v1`** — the base URL the panel shows in its own dashboard (`/v1` alone is not the same address).

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

## 🛠 Quick start

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

`node src/cli.js help` lists the tasks. Keys land in `keys.txt`, one per line, appended the moment the provider's own API answers with them; per-account detail (username, password, steps, verify result) lands in `accounts.json`.

### 🖱️ The launcher

```bash
node src/launcher.js
```

A menu over the task modules: **mint**, **finish**, **verify**, **9Router**. It asks for the count, the proxy pool and the verification concurrency, remembers them in `launcher.config.json`, and spawns `node src/cli.js <task>` with the right flags. `node src/launcher.js --connect-9router` runs the 9Router registration directly and asks for the base URL and password first.

## ✅ Verified working — every key is tested

A key counts only when **this provider's own host** answers with it:

| Check | Call | Expected |
| --- | --- | --- |
| auth + model list | `GET https://completions.me/api/v1/models` | `200` + the account's model catalog (26 models) |

The check runs from a **different exit than the one that minted the key**, so it cannot pass on session state rather than key validity. `node src/cli.js verify` reproduces exactly that check for your own file, and you can do it by hand:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| Step | Call |
| --- | --- |
| register | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + session cookie |
| session check | `GET /api/auth/session` — the mint confirms the account exists before it touches a key |
| key create | `POST /api/keys` (session cookie from register/login) → `{"key":"sk-cp_…"}` |
| key list / delete | `GET /api/keys` · `DELETE /api/keys/{id}` |
| usage | `GET /api/usage` |
| verify | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Everything runs through exits from `proxies.txt`: each attempt preflights its exit against this host immediately before use, and a line that dies mid-flow costs one attempt, not the run. `finish` re-logs in to accounts that registered but lost the key step to a dying exit — new keys come from `mint`.

## ⚙️ CLI options

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Each task takes its own flags — ask it directly with `node src/<task-file> --help`.

The launcher keeps `count` (mints per run) and `conc` (parallel mints, default `2`) in `launcher.config.json` — no environment variables are needed.

`--count N` takes any N: the quota lives on the account, so one account is one key.

## ⚡ Run shape (presets)

`--preset=turbo|balanced|safe` sets workers + the pause between accounts (turbo = 5,
balanced = 4, safe = 2); explicit `--conc`/`--gap` (or the repo's own flags) always win,
and without `--preset` the tool keeps its historical shape exactly.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.

## 🛰️ Behind a proxy

Every panel call goes through a line from `proxies.txt` (one exit per line — `scheme://host:port[#comment]`, `user:pass@` supported, bare `host:port` accepted). Each attempt preflights its exit against `completions.me` immediately before use, and a line that dies mid-flow costs one attempt, not the run — `finish` picks the account back up on a fresh exit.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one verified key per line — git-ignored, never committed |
| `accounts.json` | one record per account: `username`, `password`, `steps`, `verify` — git-ignored |
| [`src/models.json`](src/models.json) | the `/api/v1/models` capture (endpoint, timestamp, count) |
| `proxies.txt` | your exits, one per line — git-ignored |
| `launcher.config.json` | what the launcher remembers — git-ignored |
| `src/cli.js` · `src/launcher.js` | the task runner and the interactive menu |
| `src/connect-9router.js` | registers the keys in `keys.txt` as 9Router connections (zero-dep) |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Completions.me is OpenAI-compatible, so register it once and use every key:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Every key in `keys.txt` becomes one connection of the `completions-me` provider node (`--api-key <key>` registers a single key instead, `--model <id>` overrides the default). Then pick a model inside 9Router:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Point the connector at a refreshed `keys.txt` to add more accounts; the node and its model list stay the same. `node src/launcher.js --connect-9router` runs exactly this and asks for the base URL and password first.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 What the provider gives | 100% free · unlimited requests · no card, no e-mail, no captcha |
| 🔑 What one key gets you | one API key scoped to its own account: the 26 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Your data | only completions.me and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If completions.me changes the register shape, the key route or the API base, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>

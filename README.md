# completions-bulk-apikey

**Bulk-create Completions.me accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)

## 🤖 Models & free tier

`GET /api/v1/models` answers **26 models** for a minted key (measured 2026-10-15) — the Claude, GPT and Gemini lines side by side:

| family | models |
|---|---|
| Anthropic | `claude-opus-4.6`, `claude-opus-4.6-fast`, `claude-sonnet-4.6`, `claude-opus-4.5`, `claude-sonnet-4.5`, `claude-haiku-4.5` |
| OpenAI | `gpt-5.4`, `gpt-5.3-codex`, `gpt-5.2`, `gpt-5.2-codex`, `gpt-5.1`, `gpt-5-mini`, `gpt-4o`, `gpt-4.1` |
| Google | `gemini-3.1-pro-preview`, `gemini-3-pro-preview`, `gemini-3-flash-preview`, `gemini-2.5-pro` |
| others | `grok-code-fast-1`, `oswe-vscode-prime`, `oswe-vscode-secondary` |

The full catalog is in [`models.json`](models.json) — the raw `/api/v1/models` answer, captured with a key this tool minted.

**The free tier:** the panel's own pages describe it as **“100% Free · Unlimited Requests · No Credit Card”**, and the register form asks for no payment details, no e-mail and no captcha. Usage lives on the account (`GET /api/usage`), and the key reads the same 26-model catalog.

One account = one key, so **a new account is a new key** — `--count N` takes any N.

**API base:** `https://completions.me/api/v1` — the base URL the panel shows in its own dashboard (`/v1` alone is not the same address).

```python
from openai import OpenAI

client = OpenAI(base_url="https://completions.me/api/v1", api_key="sk-cp_...")
print(client.chat.completions.create(
    model="claude-sonnet-4.6",
    messages=[{"role": "user", "content": "Hello!"}],
).choices[0].message.content)
```

## 🔌 Connect to 9Router

Completions.me is OpenAI-compatible, so register it once and use every key:

```bash
node connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --keys-file keys.txt
```

Every key in `keys.txt` becomes one connection of the `completions-me` provider
node (`--api-key <key>` registers a single key instead, `--model <id>` overrides
the default). Then pick a model inside 9Router:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Point the connector at a refreshed `keys.txt` to add more accounts; the node and
its model list stay the same. `node launcher.js --connect-9router` runs exactly
this and asks for the base URL and password first.

## 🛠 Quick start

```bash
# clone this repository (or download the ZIP), then:
cd completions-bulk-apikey

# 1) your proxy list — one exit per line (http://, socks5://, socks4:// or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go
node launcher.js               # interactive: mint / finish / verify / settings
# or directly:
node cli.js mint --count 3     # fresh accounts → one verified key each
node cli.js finish             # log back in to accounts already created and finish their key
node cli.js verify             # re-check the keys already on disk
```

`node cli.js help` lists the tasks. Keys land in `keys.txt`, one per line, appended the moment the provider's own API answers with them; per-account detail (username, password, steps, verify result) lands in `accounts.json`.

## ✅ Verified working — every key is tested

A key counts only when **this provider's own host** answers with it:

| check | call | expected |
|---|---|---|
| auth + model list | `GET https://completions.me/api/v1/models` | `200` + the account's model catalog (26 models) |

The check runs from a **different exit than the one that minted the key**, so it cannot pass on session state rather than key validity. `node cli.js verify` reproduces exactly that check for your own file, and you can do it by hand:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 How it works

| step | call |
|---|---|
| register | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + session cookie |
| session check | `GET /api/auth/session` — the mint confirms the account exists before it touches a key |
| key create | `POST /api/keys` (session cookie from register/login) → `{"key":"sk-cp_…"}` |
| key list / delete | `GET /api/keys` · `DELETE /api/keys/{id}` |
| usage | `GET /api/usage` |
| verify | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Everything runs through exits from `proxies.txt`: each attempt preflights its exit against this host immediately before use, and a line that dies mid-flow costs one attempt, not the run. `finish` re-logs in to accounts that registered but lost the key step to a dying exit — that is what it is for; new keys come from `mint`.

## 📄 Files

| file | content |
|---|---|
| `keys.txt` | one verified key per line — git-ignored, never committed |
| `accounts.json` | one record per account: `username`, `password`, `steps`, `verify` — git-ignored |
| [`models.json`](models.json) | the `/api/v1/models` catalog as seen with a minted key |
| `proxies.txt` | your exits, one per line — git-ignored |
| `cli.js` · `launcher.js` | the task runner and the interactive menu (`mint` / `finish` / `verify`) |
| `connect-9router.js` | registers the keys in `keys.txt` as 9Router connections (zero-dep) |

## 🐞 Issues

If completions.me changes the register shape, the key route or the API base, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT — see [LICENSE](LICENSE).

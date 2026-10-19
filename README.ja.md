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

**自動生成された API キーで Completions.me アカウントを一括作成 — OpenAI 互換の推論（Claude、GPT、Gemini、Grok）+ 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-26-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 イシュー](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## 🎁 無料枠 — どれだけ使えるか

**パネル自身のページでは、この枠は「100% Free · Unlimited Requests · No Credit Card」と説明されており、登録フォームでは支払い情報、メールアドレス、キャプチャのいずれも求められません。**

| 項目 | 値 |
| --- | --- |
| 価格 | **$0** — パネル自身のページに「100% Free · Unlimited Requests」と記載 |
| カード必須 | **いいえ** |
| メール必須 | **いいえ** — 登録フォームはユーザー名 + パスワードのみ |
| キャプチャ | 登録時は**なし** |
| 使用量メーター | アカウントの `GET /api/usage` |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は任意の N を受け付けます |

> 💡 割り当ては completions.me 側で設定され、変更される可能性があります。実際に有効なのはツールのライブチェックです：

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 無料枠は Completions.me 側で設定され、変更される可能性があります。最新の数値は [completions.me](https://completions.me) で確認し、ツール自身のゲートに判断を任せてください：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 26 種

`GET https://completions.me/api/v1/models` は、発行されたキーに対して **26 モデル**を返します（2026-10-15 計測）— 全リストは [`src/models.json`](src/models.json) に記録されており、このビルドは `GET /models` に対してキーを検証します（チャットチェックは `verify --chat` でオプトイン）、そのためここではまだどの id にもチェックマークは付いていません。

記録された `/api/v1/models` の応答は [`src/models.json`](src/models.json) に同梱されています — これはメタデータ（エンドポイント、タイムスタンプ、件数）であり、ライブのリストはエンドポイント自体から取得されます：

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 API の使い方

ベース URL は **`https://completions.me/api/v1`** です — これはパネルが自身のダッシュボードに表示するベース URL です（`/v1` だけでは同じアドレスにはなりません）。

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

## 🛠 クイックスタート

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

`node src/cli.js help` でタスクの一覧を表示します。キーは `keys.txt` に 1 行ずつ保存され、プロバイダー自身の API がキーを返した瞬間に追記されます。アカウントごとの詳細（ユーザー名、パスワード、ステップ、検証結果）は `accounts.json` に保存されます。

### 🖱️ ランチャー

```bash
node src/launcher.js
```

タスクモジュール上にメニューを表示します：**mint**、**finish**、**verify**、**9Router**。件数、プロキシプール、検証の並列数を尋ね、それらを `launcher.config.json` に記憶し、適切なフラグを付けて `node src/cli.js <task>` を起動します。`node src/launcher.js --connect-9router` は 9Router の登録を直接実行し、最初にベース URL とパスワードを尋ねます。

## ✅ 動作検証済み — すべてのキーがテストされます

キーが有効とみなされるのは、**このプロバイダー自身のホスト**がそのキーで応答した場合のみです：

| チェック | 呼び出し | 期待値 |
| --- | --- | --- |
| 認証 + モデル一覧 | `GET https://completions.me/api/v1/models` | `200` + アカウントのモデルカタログ（26 モデル） |

このチェックは**キーを発行したのとは別の出口**から実行されるため、キーの有効性ではなくセッション状態で通ってしまうことはありません。`node src/cli.js verify` はあなた自身のファイルに対してまったく同じチェックを再現しますし、手動でも実行できます：

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し |
| --- | --- |
| 登録 | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + セッション Cookie |
| セッションチェック | `GET /api/auth/session` — mint はキーに触れる前にアカウントの存在を確認します |
| キー作成 | `POST /api/keys`（register/login からのセッション Cookie）→ `{"key":"sk-cp_…"}` |
| キー一覧 / 削除 | `GET /api/keys` · `DELETE /api/keys/{id}` |
| 使用量 | `GET /api/usage` |
| 検証 | `GET /api/v1/models`（Bearer `sk-cp_…`）→ `200` |

すべては `proxies.txt` の出口を通じて実行されます：各試行は使用直前にこのホストに対して出口をプリフライトし、フローの途中で死んだ行は 1 回の試行を消費するだけで、実行全体を失いません。`finish` は、登録はしたものの出口の死によりキー取得ステップを逃したアカウントに再ログインします — 新しいキーは `mint` から得られます。

## ⚙️ CLI オプション

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

各タスクは独自のフラグを受け付けます — `node src/<task-file> --help` で直接尋ねてください。

ランチャーは `count`（実行ごとの発行数）と `conc`（並列発行数、デフォルト `2`）を `launcher.config.json` に保持します — 環境変数は不要です。

`--count N` は任意の N を受け付けます：クォータはアカウントに紐づくため、1 アカウント = 1 キーです。

## ⚡ 実行形態（プリセット）

`--preset=turbo|balanced|safe` はワーカー数 + アカウント間のポーズを設定します（turbo = 5、
balanced = 4、safe = 2）。明示的な `--conc`/`--gap`（またはリポジトリ自身のフラグ）が常に優先され、
`--preset` を指定しない場合、ツールは従来の形態を正確に維持します。

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.

## 🛰️ プロキシの背後で

すべてのパネル呼び出しは `proxies.txt` の 1 行を通じて行われます（1 行につき 1 出口 — `scheme://host:port[#comment]`、`user:pass@` 対応、ベアの `host:port` も受け付け）。各試行は使用直前に `completions.me` に対して出口をプリフライトし、フローの途中で死んだ行は 1 回の試行を消費するだけで、実行全体を失いません — `finish` は新しい出口でアカウントを再開します。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 検証済みキーを 1 行ずつ — git 管理外、コミットされません |
| `accounts.json` | アカウントごとに 1 レコード：`username`、`password`、`steps`、`verify` — git 管理外 |
| [`src/models.json`](src/models.json) | `/api/v1/models` の記録（エンドポイント、タイムスタンプ、件数） |
| `proxies.txt` | あなたの出口、1 行ずつ — git 管理外 |
| `launcher.config.json` | ランチャーが記憶する内容 — git 管理外 |
| `src/cli.js` · `src/launcher.js` | タスクランナーとインタラクティブメニュー |
| `src/connect-9router.js` | `keys.txt` のキーを 9Router 接続として登録（依存ゼロ） |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。Completions.me は OpenAI 互換なので、一度登録すればすべてのキーを使えます：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

`keys.txt` の各キーは `completions-me` プロバイダーノードの 1 接続になります（`--api-key <key>` は単一キーを登録し、`--model <id>` はデフォルトを上書きします）。その後、9Router 内でモデルを選択します：

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

コネクタを更新された `keys.txt` に向ければ、さらにアカウントを追加できます。ノードとそのモデル一覧は変わりません。`node src/launcher.js --connect-9router` はまさにこれを実行し、最初にベース URL とパスワードを尋ねます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 プロバイダーが提供するもの | 100% 無料 · 無制限リクエスト · カード不要、メール不要、キャプチャ不要 |
| 🔑 1 つのキーで得られるもの | 自身のアカウントに紐づく 1 つの API キー：下記エンドポイントの 26 モデル id を、あなたのプランの制限内で利用可能。クォータは**アカウント**に紐づくため、このツールがキーごとに 1 アカウントを作成するのです |
| 🌐 API 形態 | OpenAI 互換：`POST https://completions.me/api/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは completions.me と、あなたが設定した inbox バックエンドのみ。キーはあなたのマシン上に留まります |

## 🐞 イシュー

completions.me が登録の形態、キーのルート、または API ベースを変更した場合、ツールはそのステップで停止し、その旨を報告します。実行したコマンドと正確な出力を添えて **[イシューを開いてください](../../issues)**。PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>
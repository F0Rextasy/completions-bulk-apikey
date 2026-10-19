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

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-26-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 無料枠 — 何がどれだけ使えるか

**パネル自身のページでは、この枠は「100% Free · Unlimited Requests · No Credit Card」と説明されており、登録フォームは支払い情報もメールアドレスもキャプチャも求めません。**

| 項目 | 値 |
| --- | --- |
| 価格 | **$0** — パネル自身のページに「100% Free · Unlimited Requests」と記載 |
| カード登録 | **不要** |
| メールアドレス | **不要** — 登録フォームはユーザー名 + パスワードのみ |
| キャプチャ | 登録時は**なし** |
| 使用量メーター | アカウントの `GET /api/usage` |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は任意の N を受け付けます |

> 💡 割り当て量は completions.me 側で設定されており、変更される可能性があります。実際に効くのはツールのライブチェックです：

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 無料枠は Completions.me 側で設定されており、変更される可能性があります。最新の数値は [completions.me](https://completions.me) で確認してください。そして最終判断はツール自身のゲートに委ねてください：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 26 個

`GET https://completions.me/api/v1/models` は、発行されたキーに対して **26 モデル**を返します（2026-10-15 計測）— 全リストは [`src/models.json`](src/models.json) に記録されています — さらに、そのすべてが 2026-10-19 に実際の `POST /chat/completions` に対して `200` を返しました（26/26 プローブ）：

|Model|✓|
|---|---|
|`claude-haiku-4.5`|✓|
|`claude-opus-4.5`|✓|
|`claude-opus-4.6`|✓|
|`claude-opus-4.6-fast`|✓|
|`claude-sonnet-4`|✓|
|`claude-sonnet-4.5`|✓|
|`claude-sonnet-4.6`|✓|
|`gemini-2.5-pro`|✓|
|`gemini-3-flash-preview`|✓|
|`gemini-3-pro-preview`|✓|
|`gemini-3.1-pro-preview`|✓|
|`gpt-4.1`|✓|
|`gpt-4o`|✓|
|`gpt-4o-mini`|✓|
|`gpt-5-mini`|✓|
|`gpt-5.1`|✓|
|`gpt-5.1-codex`|✓|
|`gpt-5.1-codex-max`|✓|
|`gpt-5.1-codex-mini`|✓|
|`gpt-5.2`|✓|
|`gpt-5.2-codex`|✓|
|`gpt-5.3-codex`|✓|
|`gpt-5.4`|✓|
|`grok-code-fast-1`|✓|
|`oswe-vscode-prime`|✓|
|`oswe-vscode-secondary`|✓|

取得した `/api/v1/models` の応答は [`src/models.json`](src/models.json) に同梱されています — これはメタデータ（エンドポイント、タイムスタンプ、件数）であり、ライブのリストはエンドポイント自体から取得します：

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 API の使い方

ベース URL は **`https://completions.me/api/v1`** です — パネルが自身のダッシュボードに表示するベース URL でもあります（`/v1` だけでは同じアドレスにはなりません）。

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

`node src/cli.js help` でタスクの一覧を表示します。キーは `keys.txt` に 1 行 1 件で書き込まれ、プロバイダー自身の API がキーを返した瞬間に追記されます。アカウントごとの詳細（ユーザー名、パスワード、ステップ、検証結果）は `accounts.json` に記録されます。

### 🖱️ ランチャー

```bash
node src/launcher.js
```

タスクモジュールをまとめたメニューです：**mint**、**finish**、**verify**、**9Router**。件数、プロキシプール、検証の並列数を尋ねて `launcher.config.json` に記憶し、適切なフラグを付けて `node src/cli.js <task>` を起動します。`node src/launcher.js --connect-9router` は 9Router 登録を直接実行し、その前にベース URL とパスワードを尋ねます。

## ✅ 動作検証済み — すべてのキーをテスト

キーが有効と数えられるのは、**このプロバイダー自身のホスト**がそのキーで応答したときだけです：

| チェック | 呼び出し | 期待値 |
| --- | --- | --- |
| 認証 + モデル一覧 | `GET https://completions.me/api/v1/models` | `200` + そのアカウントのモデルカタログ（26 モデル） |

このチェックは**キーを発行したのとは別の出口**から実行されるため、キーの有効性ではなくセッション状態で通過してしまうことはありません。`node src/cli.js verify` は手元のファイルに対してまったく同じチェックを再現しますし、手動でも行えます：

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
| セッション確認 | `GET /api/auth/session` — mint はキーに触れる前にアカウントの存在を確認します |
| キー作成 | `POST /api/keys`（登録/ログインで得たセッション Cookie） → `{"key":"sk-cp_…"}` |
| キー一覧 / 削除 | `GET /api/keys` · `DELETE /api/keys/{id}` |
| 使用量 | `GET /api/usage` |
| 検証 | `GET /api/v1/models`（Bearer `sk-cp_…`） → `200` |

すべての処理は `proxies.txt` の出口を経由して実行されます。各試行は使用直前にその出口をこのホストに対してプリフライトし、途中で切れた行のコストは実行全体ではなく 1 回の試行分だけです。`finish` は、出口の切断によってキー発行ステップを失った登録済みアカウントに再ログインします — 新しいキーは `mint` から得られます。

## ⚙️ CLI オプション

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

各タスクは独自のフラグを受け付けます — `node src/<task-file> --help` で直接確認してください。

ランチャーは `count`（1 実行あたりの mint 数）と `conc`（並列 mint 数、既定値 `2`）を `launcher.config.json` に保持します — 環境変数は不要です。

`--count N` は任意の N を受け付けます：割り当て量はアカウント側にあるため、1 アカウントが 1 キーです。

## ⚡ 実行形態（プリセット）

`--preset=turbo|balanced|safe` はワーカー数とアカウント間のポーズを設定します（turbo = 5、balanced = 4、safe = 2）。明示的な `--conc`/`--gap`（またはリポジトリ独自のフラグ）が常に優先され、`--preset` を指定しない場合、ツールは従来の形態をそのまま維持します。

Turbo を推奨します（5 ワーカー）。それ以上は非力なマシンでは負荷や BAN のリスクがあります。

## 🛰️ プロキシ経由の場合

パネルへのすべての呼び出しは `proxies.txt` の 1 行を経由します（1 行 1 出口 — `scheme://host:port[#comment]`、`user:pass@` 対応、ベアの `host:port` も可）。各試行は使用直前にその出口を `completions.me` に対してプリフライトし、途中で切れた行のコストは実行全体ではなく 1 回の試行分だけです — `finish` は新しい出口でそのアカウントを再開します。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 検証済みキーを 1 行 1 件 — git 管理外、コミットされません |
| `accounts.json` | アカウントごとに 1 レコード：`username`、`password`、`steps`、`verify` — git 管理外 |
| [`src/models.json`](src/models.json) | `/api/v1/models` の取得結果（エンドポイント、タイムスタンプ、件数） |
| `proxies.txt` | あなたの出口、1 行 1 件 — git 管理外 |
| `launcher.config.json` | ランチャーが記憶する内容 — git 管理外 |
| `src/cli.js` · `src/launcher.js` | タスクランナーと対話式メニュー |
| `src/connect-9router.js` | `keys.txt` のキーを 9Router 接続として登録（依存ゼロ） |

## 🔌 9Router への接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。Completions.me は OpenAI 互換なので、一度登録すればすべてのキーを使えます：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

`keys.txt` の各キーが `completions-me` プロバイダーノードの 1 接続になります（`--api-key <key>` で単一キーのみ登録、`--model <id>` で既定モデルを上書き）。その後、9Router 内でモデルを選択してください：

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

コネクタを更新済みの `keys.txt` に向ければアカウントを追加できます。ノードとそのモデル一覧は変わりません。`node src/launcher.js --connect-9router` はまさにこれを実行し、その前にベース URL とパスワードを尋ねます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 プロバイダーが提供するもの | 100% 無料 · 無制限リクエスト · カード不要、メール不要、キャプチャなし |
| 🔑 1 つのキーで得られるもの | 自身のアカウントに紐づく 1 つの API キー：下記エンドポイントの 26 個のモデル ID を、あなたのプランの上限まで。割り当て量は**アカウント**側にあるため、このツールがキーごとに 1 アカウントを作成するのはまさにそのためです |
| 🌐 API 形態 | OpenAI 互換：`POST https://completions.me/api/v1/chat/completions` |
| 🔒 あなたのデータ | 通信先は completions.me と、あなたが設定したインボックスバックエンドのみ。キーはあなたのマシンに留まります |

## 🐞 問題報告

completions.me が登録フォームの形式、キーのルート、または API ベースを変更した場合、ツールはそのステップで停止し、その旨を通知します。実行したコマンドと正確な出力を添えて **[issue を作成してください](../../issues)**。PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>
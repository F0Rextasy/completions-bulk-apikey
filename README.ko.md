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

**자동 생성 API 키로 Completions.me 계정을 대량 생성 — OpenAI 호환 추론(Claude, GPT, Gemini, Grok) + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-26-of-them) · [🧪 API 사용](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 무료 티어 — 얼마나 받을 수 있나요

**패널 자체 페이지에서는 이 티어를 "100% 무료 · 무제한 요청 · 신용카드 불필요"라고 설명하며, 등록 양식은 결제 정보, 이메일, 캡차를 요구하지 않습니다.**

| 항목 | 값 |
| --- | --- |
| 가격 | **$0** — 패널 자체 페이지 기준 "100% 무료 · 무제한 요청" |
| 카드 필요 | **아니요** |
| 이메일 필요 | **아니요** — 등록 양식은 사용자 이름 + 비밀번호만 받습니다 |
| 캡차 | 등록 시 **없음** |
| 사용량 측정 | 계정에서 `GET /api/usage` |
| 확장 단위 | **계정 하나 = 키 하나** → `--count N`은 임의의 N을 받습니다 |

> 💡 허용량은 completions.me에서 설정하며 변경될 수 있습니다. 도구의 실시간 검사가 기준입니다:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 무료 티어는 Completions.me에서 설정하며 변경될 수 있습니다. [completions.me](https://completions.me)에서 실시간 수치를 확인하고, 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js verify            # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 전체 26개

`GET https://completions.me/api/v1/models`는 발급된 키에 대해 **26개 모델**을 응답하며(2026-10-15 측정), 전체 목록은 [`src/models.json`](src/models.json)에 캡처되어 있습니다 — 그리고 모두 2026-10-19에 실제 `POST /chat/completions` 호출에 `200`으로 응답했습니다(26/26 프로브):

|모델|✓|
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

캡처된 `/api/v1/models` 응답은 [`src/models.json`](src/models.json)에 포함되어 있습니다 — 이는 메타데이터(엔드포인트, 타임스탬프, 개수)이며, 실시간 목록은 엔드포인트 자체에서 가져옵니다:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 API 사용 방법

기본 URL은 **`https://completions.me/api/v1`** 입니다 — 패널이 자체 대시보드에 표시하는 기본 URL입니다(`/v1`만으로는 같은 주소가 아닙니다).

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

## 🛠 빠른 시작

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

`node src/cli.js help`는 작업 목록을 보여줍니다. 키는 `keys.txt`에 한 줄에 하나씩 저장되며, 제공자의 자체 API가 키로 응답하는 즉시 추가됩니다. 계정별 세부 정보(사용자 이름, 비밀번호, 단계, 검증 결과)는 `accounts.json`에 저장됩니다.

### 🖱️ 런처

```bash
node src/launcher.js
```

작업 모듈에 대한 메뉴: **mint**, **finish**, **verify**, **9Router**. 실행 수, 프록시 풀, 검증 동시성을 묻고 이를 `launcher.config.json`에 기억한 뒤 올바른 플래그로 `node src/cli.js <task>`를 실행합니다. `node src/launcher.js --connect-9router`는 9Router 등록을 직접 실행하며 먼저 기본 URL과 비밀번호를 묻습니다.

## ✅ 작동 검증됨 — 모든 키가 테스트됩니다

키는 **이 제공자의 자체 호스트**가 해당 키로 응답할 때만 유효한 것으로 간주합니다:

| 검사 | 호출 | 예상 |
| --- | --- | --- |
| 인증 + 모델 목록 | `GET https://completions.me/api/v1/models` | `200` + 계정의 모델 카탈로그(26개 모델) |

검사는 **키를 발급한 출구와 다른 출구**에서 실행되므로, 키 유효성이 아닌 세션 상태로 통과할 수 없습니다. `node src/cli.js verify`는 사용자의 파일에 대해 바로 그 검사를 재현하며, 직접 수행할 수도 있습니다:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 |
| --- | --- |
| 등록 | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + 세션 쿠키 |
| 세션 확인 | `GET /api/auth/session` — 발급은 키를 건드리기 전에 계정이 존재하는지 확인합니다 |
| 키 생성 | `POST /api/keys` (등록/로그인에서 받은 세션 쿠키) → `{"key":"sk-cp_…"}` |
| 키 목록 / 삭제 | `GET /api/keys` · `DELETE /api/keys/{id}` |
| 사용량 | `GET /api/usage` |
| 검증 | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

모든 작업은 `proxies.txt`의 출구를 통해 실행됩니다: 각 시도는 사용 직전에 이 호스트를 대상으로 해당 출구를 사전 점검하며, 흐름 중간에 죽은 줄은 실행 전체가 아니라 시도 하나만 소모합니다. `finish`는 등록은 했지만 출구가 죽어 키 단계를 놓친 계정에 다시 로그인합니다 — 새 키는 `mint`에서 나옵니다.

## ⚙️ CLI 옵션

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

각 작업은 자체 플래그를 받습니다 — `node src/<task-file> --help`로 직접 확인하세요.

런처는 `count`(실행당 발급 수)와 `conc`(병렬 발급 수, 기본값 `2`)를 `launcher.config.json`에 유지합니다 — 환경 변수는 필요하지 않습니다.

`--count N`은 임의의 N을 받습니다: 할당량은 계정에 있으므로 계정 하나가 키 하나입니다.

## ⚡ 실행 구성(프리셋)

`--preset=turbo|balanced|safe`는 작업자 수 + 계정 간 일시 정지를 설정합니다(turbo = 5, balanced = 4, safe = 2). 명시적인 `--conc`/`--gap`(또는 저장소 자체 플래그)이 항상 우선하며, `--preset`이 없으면 도구는 기존 실행 구성을 그대로 유지합니다.

Turbo 권장(워커 5개); 더 많으면 저사양 컴퓨터에서 부하/차단 위험이 있습니다.

## 🛰️ 프록시 뒤에서

모든 패널 호출은 `proxies.txt`의 한 줄을 통해 이루어집니다(줄당 출구 하나 — `scheme://host:port[#comment]`, `user:pass@` 지원, 맨 `host:port` 허용). 각 시도는 사용 직전에 `completions.me`를 대상으로 해당 출구를 사전 점검하며, 흐름 중간에 죽은 줄은 실행 전체가 아니라 시도 하나만 소모합니다 — `finish`는 새 출구에서 계정을 다시 이어받습니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 검증된 키 하나 — git에서 무시되며, 절대 커밋되지 않음 |
| `accounts.json` | 계정당 레코드 하나: `username`, `password`, `steps`, `verify` — git에서 무시됨 |
| [`src/models.json`](src/models.json) | `/api/v1/models` 캡처(엔드포인트, 타임스탬프, 개수) |
| `proxies.txt` | 출구 목록, 한 줄에 하나 — git에서 무시됨 |
| `launcher.config.json` | 런처가 기억하는 설정 — git에서 무시됨 |
| `src/cli.js` · `src/launcher.js` | 작업 실행기와 대화형 메뉴 |
| `src/connect-9router.js` | `keys.txt`의 키를 9Router 연결로 등록합니다(의존성 없음) |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 셀프 호스팅 방식의 OpenAI 호환 라우터입니다. Completions.me는 OpenAI 호환이므로 한 번 등록하고 모든 키를 사용하세요:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

`keys.txt`의 모든 키는 `completions-me` 제공자 노드의 연결 하나가 됩니다(`--api-key <key>`는 대신 단일 키를 등록하고, `--model <id>`는 기본값을 재정의합니다). 그런 다음 9Router 안에서 모델을 선택하세요:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

커넥터를 갱신된 `keys.txt`로 지정하여 계정을 더 추가하세요. 노드와 모델 목록은 그대로 유지됩니다. `node src/launcher.js --connect-9router`는 바로 이 작업을 실행하며 먼저 기본 URL과 비밀번호를 묻습니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 제공자가 제공하는 것 | 100% 무료 · 무제한 요청 · 카드, 이메일, 캡차 불필요 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 API 키 하나: 아래 엔드포인트의 26개 모델 ID를 플랜 한도 내에서 사용할 수 있습니다. 할당량은 **계정**에 있으므로, 이 도구가 키마다 계정 하나를 만드는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 데이터 | completions.me와 구성한 받은편지함 백엔드에만 접속하며, 키는 사용자 컴퓨터에 남습니다 |

## 🐞 이슈

completions.me가 등록 형식, 키 경로 또는 API 기본 URL을 변경하면 도구는 해당 단계에서 멈추고 그 사실을 알려줍니다. 실행한 명령과 정확한 출력을 포함하여 **[이슈를 열어 주세요](../../issues)**; PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE)를 참조하세요.

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey 기여자

</div>
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

**자동 생성된 API 키로 Completions.me 계정을 대량 생성 — OpenAI 호환 추론(Claude, GPT, Gemini, Grok) + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-26-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## 🎁 무료 티어 — 얼마나 받을 수 있나

**패널 자체 페이지에서는 이 티어를 "100% Free · Unlimited Requests · No Credit Card"라고 설명하며, 가입 양식은 결제 정보, 이메일, 캡차를 요구하지 않습니다.**

| 항목 | 값 |
| --- | --- |
| 가격 | **$0** — 패널 자체 페이지에 "100% Free · Unlimited Requests" |
| 카드 필요 | **아니오** |
| 이메일 필요 | **아니오** — 가입 양식은 사용자 이름 + 비밀번호만 받습니다 |
| 캡차 | 가입 시 **없음** |
| 사용량 측정 | 계정에서 `GET /api/usage` |
| 확장되는 단위 | **계정 하나 = 키 하나** → `--count N`은 임의의 N을 받습니다 |

> 💡 허용량은 completions.me가 정하며 변경될 수 있습니다. 도구의 실시간 확인이 기준입니다:

```bash
node src/cli.js verify      # keys.txt의 모든 키가 제공자 호스트에 대해 다시 테스트됩니다
```

> 💡 무료 티어는 Completions.me가 정하며 변경될 수 있습니다. 실시간 수치는 [completions.me](https://completions.me)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # keys.txt의 모든 키가 실제 채팅 호출로 다시 테스트됩니다
```

## 🤖 모델 — 26개 전부

`GET https://completions.me/api/v1/models`는 발급된 키에 대해 **26개 모델**을 응답합니다(2026-10-15 측정) — 전체 목록은 [`src/models.json`](src/models.json)에 캡처되어 있으며, 이 빌드는 `GET /models`에 대해 키를 검증합니다(채팅 확인은 `verify --chat`으로 선택적), 따라서 여기서는 아직 어떤 id에도 체크 표시가 없습니다.

캡처된 `/api/v1/models` 응답은 [`src/models.json`](src/models.json)에 포함되어 있습니다 — 이는 메타데이터(엔드포인트, 타임스탬프, 개수)이며, 실시간 목록은 엔드포인트 자체에서 가져옵니다:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 API 사용 방법

베이스 URL은 **`https://completions.me/api/v1`** 입니다 — 패널이 자체 대시보드에 표시하는 베이스 URL입니다(`/v1`만으로는 같은 주소가 아닙니다).

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
# 이 저장소를 클론하거나(또는 ZIP을 다운로드한 후):
cd completions-bulk-apikey

# 1) 프록시 목록 — 한 줄에 하나의 출구 (http://, socks5://, socks4:// 또는 host:port만)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) 실행
node src/launcher.js               # 대화형: mint / finish / verify / settings
# 또는 직접:
node src/cli.js mint --count 3     # 새 계정 → 각각 검증된 키 하나
node src/cli.js finish             # 이미 생성된 계정에 다시 로그인하여 키 단계 완료
node src/cli.js verify             # 디스크에 있는 키 다시 확인
```

`node src/cli.js help`는 작업 목록을 표시합니다. 키는 `keys.txt`에 한 줄에 하나씩 저장되며, 제공자 자체 API가 키를 응답하는 즉시 추가됩니다. 계정별 세부 정보(사용자 이름, 비밀번호, 단계, 검증 결과)는 `accounts.json`에 저장됩니다.

### 🖱️ 런처

```bash
node src/launcher.js
```

작업 모듈 위의 메뉴: **mint**, **finish**, **verify**, **9Router**. 개수, 프록시 풀, 검증 동시성을 묻고 이를 `launcher.config.json`에 기억한 뒤, 적절한 플래그와 함께 `node src/cli.js <task>`를 실행합니다. `node src/launcher.js --connect-9router`는 9Router 등록을 바로 실행하며 먼저 베이스 URL과 비밀번호를 묻습니다.

## ✅ 검증됨 — 모든 키가 테스트됩니다

키는 **이 제공자 자체 호스트**가 해당 키로 응답할 때만 유효한 것으로 간주됩니다:

| 확인 | 호출 | 예상 |
| --- | --- | --- |
| 인증 + 모델 목록 | `GET https://completions.me/api/v1/models` | `200` + 계정의 모델 카탈로그(26개 모델) |

이 확인은 **키를 발급한 출구와 다른 출구**에서 실행되므로, 키 유효성이 아닌 세션 상태로 통과할 수 없습니다. `node src/cli.js verify`는 여러분의 파일에 대해 정확히 이 확인을 재현하며, 직접 수동으로도 할 수 있습니다:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 작동 방식

```
inbox (계정당 주소 하나)                                  계정마다 새 주소
   │
   ├─▶ 가입: Completions.me 페이지 → 이메일 주소 → inbox에서 온 코드 / 링크
   ├─▶ 세션: 계정의 쿠키 또는 액세스 토큰 확보
   ├─▶ 키 발급: 계정의 키 엔드포인트 → 평문 키가 한 번 반환됨 (즉시 디스크에 기록)
   └─▶ 실시간 증명: POST https://completions.me/api/v1/chat/completions → 실제 콘텐츠 = 키가 살아 있음
```

| 단계 | 호출 |
| --- | --- |
| 등록 | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + 세션 쿠키 |
| 세션 확인 | `GET /api/auth/session` — 발급은 키를 건드리기 전에 계정이 존재하는지 확인합니다 |
| 키 생성 | `POST /api/keys` (등록/로그인에서 받은 세션 쿠키) → `{"key":"sk-cp_…"}` |
| 키 목록 / 삭제 | `GET /api/keys` · `DELETE /api/keys/{id}` |
| 사용량 | `GET /api/usage` |
| 검증 | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

모든 것이 `proxies.txt`의 출구를 통해 실행됩니다: 각 시도는 사용 직전에 이 호스트에 대해 출구를 사전 점검하며, 흐름 중간에 죽은 줄은 실행 전체가 아니라 시도 하나만 소모합니다. `finish`는 등록했지만 죽은 출구 때문에 키 단계를 놓친 계정에 다시 로그인합니다 — 새 키는 `mint`에서 나옵니다.

## ⚙️ CLI 옵션

```bash
node src/cli.js mint [flags]     # 새 계정 → 각각 검증된 키 하나
node src/cli.js finish           # 이미 생성된 계정의 키 단계 완료
node src/cli.js verify           # 디스크에 있는 키 다시 확인
node src/cli.js 9router          # 로컬 9Router에 키 등록
node src/cli.js help
```

각 작업은 자체 플래그를 받습니다 — `node src/<task-file> --help`로 직접 물어보세요.

런처는 `count`(실행당 발급 수)와 `conc`(병렬 발급, 기본값 `2`)를 `launcher.config.json`에 유지합니다 — 환경 변수는 필요하지 않습니다.

`--count N`은 임의의 N을 받습니다: 할당량은 계정에 있으므로 계정 하나가 키 하나입니다.

## ⚡ 실행 형태 (프리셋)

`--preset=turbo|balanced|safe`는 워커 수 + 계정 간 일시정지를 설정합니다(turbo = 5,
balanced = 4, safe = 2). 명시적 `--conc`/`--gap`(또는 저장소 자체 플래그)이 항상 우선하며,
`--preset` 없이는 도구가 기존 형태를 그대로 유지합니다.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.

## 🛰️ 프록시 뒤에서

모든 패널 호출은 `proxies.txt`의 한 줄을 통해 이루어집니다(한 줄에 출구 하나 — `scheme://host:port[#comment]`, `user:pass@` 지원, `host:port`만도 허용). 각 시도는 사용 직전에 `completions.me`에 대해 출구를 사전 점검하며, 흐름 중간에 죽은 줄은 실행 전체가 아니라 시도 하나만 소모합니다 — `finish`는 새 출구에서 계정을 다시 이어받습니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 검증된 키 하나 — git 무시, 절대 커밋되지 않음 |
| `accounts.json` | 계정당 레코드 하나: `username`, `password`, `steps`, `verify` — git 무시 |
| [`src/models.json`](src/models.json) | `/api/v1/models` 캡처(엔드포인트, 타임스탬프, 개수) |
| `proxies.txt` | 출구 목록, 한 줄에 하나 — git 무시 |
| `launcher.config.json` | 런처가 기억하는 내용 — git 무시 |
| `src/cli.js` · `src/launcher.js` | 작업 실행기와 대화형 메뉴 |
| `src/connect-9router.js` | `keys.txt`의 키를 9Router 연결로 등록 (의존성 없음) |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다. Completions.me는 OpenAI 호환이므로 한 번 등록하고 모든 키를 사용하세요:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

`keys.txt`의 모든 키가 `completions-me` 제공자 노드의 연결 하나가 됩니다(`--api-key <key>`는 단일 키를 대신 등록하고, `--model <id>`는 기본값을 재정의합니다). 그런 다음 9Router 내에서 모델을 선택하세요:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

커넥터를 갱신된 `keys.txt`로 지정하여 계정을 더 추가하세요. 노드와 모델 목록은 그대로 유지됩니다. `node src/launcher.js --connect-9router`는 정확히 이것을 실행하며 먼저 베이스 URL과 비밀번호를 묻습니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 제공자가 주는 것 | 100% 무료 · 무제한 요청 · 카드, 이메일, 캡차 없음 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 한정된 API 키 하나: 아래 엔드포인트의 26개 모델 id를 요금제 한도 내에서 사용. 할당량은 **계정**에 있으므로, 이 도구가 키마다 계정 하나를 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 데이터 | completions.me와 여러분이 설정한 inbox 백엔드만 접촉됩니다; 키는 여러분의 컴퓨터에 남습니다 |

## 🐞 이슈

completions.me가 가입 형태, 키 경로 또는 API 베이스를 변경하면 도구는 해당 단계에서 멈추고 그 사실을 알립니다. 실행한 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**; PR도 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>
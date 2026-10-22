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

**Массово создавайте аккаунты Completions.me с автоматически сгенерированными API-ключами — вывод, совместимый с OpenAI (Claude, GPT, Gemini, Grok) + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-26-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Параметры](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Бесплатный тариф — сколько вы получаете

**Страницы самой панели описывают тариф как «100% бесплатно · неограниченное количество запросов · без кредитной карты» — а форма регистрации не запрашивает платёжные данные, e-mail и капчу.**

| Что | Значение |
| --- | --- |
| Цена | **$0** — «100% бесплатно · неограниченное количество запросов» на страницах самой панели |
| Требуется карта | **Нет** |
| Требуется e-mail | **Нет** — форма регистрации принимает только имя пользователя + пароль |
| Капча | **Нет** при регистрации |
| Счётчик использования | `GET /api/usage` в аккаунте |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` принимает любое N |

> 💡 Лимит устанавливается completions.me и может измениться. Решает живая проверка инструмента:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 Бесплатный тариф устанавливается Completions.me и может измениться. Проверяйте актуальные цифры на [completions.me](https://completions.me) — и пусть решение принимает собственный контроль инструмента:

```bash
node src/cli.js verify            # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 26

`GET https://completions.me/api/v1/models` возвращает **26 моделей** для выпущенного ключа (измерено 2026-10-15) — полный список зафиксирован в [`src/models.json`](src/models.json) — и каждая из них также ответила `200` на живой `POST /chat/completions` 2026-10-19 (26/26 проверок):

|Модель|✓|
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

Зафиксированный ответ `/api/v1/models` поставляется в [`src/models.json`](src/models.json) — это метаданные (эндпоинт, временная метка, количество), а живой список берётся из самого эндпоинта:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 Как использовать API

Базовый URL — **`https://completions.me/api/v1`** — тот базовый URL, который панель показывает в собственной панели управления (`/v1` сам по себе — не тот же адрес).

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

## 🛠 Быстрый старт

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

`node src/cli.js help` перечисляет задачи. Ключи попадают в `keys.txt`, по одному на строку, и добавляются в момент, когда собственный API провайдера отвечает ими; детали по каждому аккаунту (имя пользователя, пароль, шаги, результат проверки) попадают в `accounts.json`.

### 🖱️ Лаунчер

```bash
node src/launcher.js
```

Меню поверх модулей задач: **mint**, **finish**, **verify**, **9Router**. Оно спрашивает количество, пул прокси и параллельность проверки, запоминает их в `launcher.config.json` и запускает `node src/cli.js <task>` с нужными флагами. `node src/launcher.js --connect-9router` напрямую запускает регистрацию в 9Router и сначала спрашивает базовый URL и пароль.

## ✅ Проверено в работе — каждый ключ протестирован

Ключ считается рабочим только тогда, когда **собственный хост этого провайдера** отвечает с ним:

| Проверка | Запрос | Ожидается |
| --- | --- | --- |
| аутентификация + список моделей | `GET https://completions.me/api/v1/models` | `200` + каталог моделей аккаунта (26 моделей) |

Проверка выполняется через **другой выход, отличный от того, который выпустил ключ**, поэтому она не может пройти за счёт состояния сессии вместо действительности ключа. `node src/cli.js verify` воспроизводит ровно эту проверку для вашего файла, и её можно выполнить вручную:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| Шаг | Запрос |
| --- | --- |
| регистрация | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + cookie сессии |
| проверка сессии | `GET /api/auth/session` — выпуск подтверждает, что аккаунт существует, прежде чем трогать ключ |
| создание ключа | `POST /api/keys` (cookie сессии от регистрации/входа) → `{"key":"sk-cp_…"}` |
| список / удаление ключей | `GET /api/keys` · `DELETE /api/keys/{id}` |
| использование | `GET /api/usage` |
| проверка | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Всё идёт через выходы из `proxies.txt`: каждая попытка непосредственно перед использованием предварительно проверяет свой выход на этом хосте, а строка, которая отваливается в середине процесса, стоит одной попытки, а не всего запуска. `finish` повторно входит в аккаунты, которые зарегистрировались, но потеряли шаг с ключом из-за отвалившегося выхода — новые ключи создаются через `mint`.

## ⚙️ Параметры CLI

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Каждая задача принимает собственные флаги — спросите напрямую через `node src/<task-file> --help`.

Лаунчер хранит `count` (выпусков за запуск) и `conc` (параллельных выпусков, по умолчанию `2`) в `launcher.config.json` — переменные окружения не нужны.

`--count N` принимает любое N: квота живёт на аккаунте, поэтому один аккаунт — это один ключ.

## ⚡ Режимы запуска (пресеты)

`--preset=turbo|balanced|safe` задаёт воркеры + паузу между аккаунтами (turbo = 5,
balanced = 4, safe = 2); явные `--conc`/`--gap` (или собственные флаги репозитория) всегда имеют приоритет,
а без `--preset` инструмент сохраняет свою историческую конфигурацию в точности.

Рекомендуется Turbo (5 воркеров); больше — риск нагрузки/бана на слабом компьютере.

## 🛰️ За прокси

Каждый вызов панели идёт через строку из `proxies.txt` (один выход на строку — `scheme://host:port[#comment]`, поддерживается `user:pass@`, принимается и простой `host:port`). Каждая попытка непосредственно перед использованием предварительно проверяет свой выход на `completions.me`, а строка, которая отваливается в середине процесса, стоит одной попытки, а не всего запуска — `finish` подхватывает аккаунт заново на свежем выходе.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный ключ на строку — игнорируется git, никогда не коммитится |
| `accounts.json` | одна запись на аккаунт: `username`, `password`, `steps`, `verify` — игнорируется git |
| [`src/models.json`](src/models.json) | снимок `/api/v1/models` (эндпоинт, временная метка, количество) |
| `proxies.txt` | ваши выходы, по одному на строку — игнорируется git |
| `launcher.config.json` | то, что запоминает лаунчер — игнорируется git |
| `src/cli.js` · `src/launcher.js` | исполнитель задач и интерактивное меню |
| `src/connect-9router.js` | регистрирует ключи из `keys.txt` как подключения 9Router (без зависимостей) |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — самостоятельно размещаемый, OpenAI-совместимый роутер. Completions.me совместим с OpenAI, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `completions-me` (`--api-key <key>` вместо этого регистрирует один ключ, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри 9Router:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Направьте коннектор на обновлённый `keys.txt`, чтобы добавить больше аккаунтов; узел и его список моделей остаются прежними. `node src/launcher.js --connect-9router` запускает ровно это и сначала спрашивает базовый URL и пароль.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — самостоятельно размещаемый, OpenAI-совместимый роутер. Completions.me совместим с OpenAI, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `completions-me` (`--api-key <key>` вместо этого регистрирует один ключ, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри OmniRoute:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Направьте коннектор на обновлённый `keys.txt`, чтобы добавить больше аккаунтов; узел и его список моделей остаются прежними. `node src/launcher.js --connect-omniroute` запускает ровно это и сначала спрашивает базовый URL и пароль.
## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 Что даёт провайдер | 100% бесплатно · неограниченное количество запросов · без карты, без e-mail, без капчи |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к собственному аккаунту: 26 идентификаторов моделей на эндпоинте ниже, в пределах лимитов вашего тарифа. Квота живёт на **аккаунте**, и именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | Совместим с OpenAI: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Ваши данные | связь идёт только с completions.me и настроенным вами бэкендом входящей почты; ключи остаются на вашей машине |

## 🐞 Проблемы

Если completions.me изменит форму регистрации, маршрут ключей или базу API, инструмент остановится на этом шаге и сообщит об этом. **[Откройте issue](../../issues)** с командой, которую вы запускали, и точным выводом; PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 участники completions-me-bulk-apikey

</div>
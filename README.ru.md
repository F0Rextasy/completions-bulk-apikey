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

**Массовое создание аккаунтов Completions.me с автосгенерированными API-ключами — вывод, совместимый с OpenAI (Claude, GPT, Gemini, Grok) + коннектор для 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-26-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## 🎁 Бесплатный тариф — сколько вы получаете

**Собственные страницы панели описывают тариф как «100% Free · Unlimited Requests · No Credit Card» — а форма регистрации не запрашивает ни платёжных данных, ниe-mail, ни капчи.**

| Что | Значение |
| --- | --- |
| Цена | **$0** — «100% Free · Unlimited Requests» на собственных страницах панели |
| Нужна карта | **Нет** |
| Нужен e-mail | **Нет** — форма регистрации принимает только имя пользователя + пароль |
| Капча | **Нет** при регистрации |
| Счётчик использования | `GET /api/usage` для аккаунта |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` принимает любое N |

> 💡 Лимит устанавливается completions.me и может меняться. Решает живая проверка инструмента:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 Бесплатный тариф устанавливается Completions.me и может меняться. Проверяйте актуальные цифры на [completions.me](https://completions.me) — и пусть решает собственный фильтр инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 26

`GET https://completions.me/api/v1/models` возвращает **26 моделей** для созданного ключа (замерено 2026-10-15) — полный список сохранён в [`src/models.json`](src/models.json), а эта сборка проверяет ключ через `GET /models` (проверка чата включается флагом `verify --chat`), поэтому здесь пока ни у одного id нет галочки.

Сохранённый ответ `/api/v1/models` поставляется в [`src/models.json`](src/models.json) — это метаданные (endpoint, timestamp, count), а живой список приходит из самого эндпоинта:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 Как использовать API

Базовый URL — **`https://completions.me/api/v1`** — именно этот базовый URL панель показывает в своей собственной панели управления (один `/v1` — не тот же адрес).

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

`node src/cli.js help` перечисляет задачи. Ключи попадают в `keys.txt`, по одному в строке, добавляясь в момент, когда собственный API провайдера отвечает ими; детали по каждому аккаунту (имя пользователя, пароль, шаги, результат проверки) попадают в `accounts.json`.

### 🖱️ Лаунчер

```bash
node src/launcher.js
```

Меню поверх модулей задач: **mint**, **finish**, **verify**, **9Router**. Оно спрашивает количество, пул прокси и параллельность проверки, запоминает их в `launcher.config.json` и запускает `node src/cli.js <task>` с нужными флагами. `node src/launcher.js --connect-9router` сразу запускает регистрацию в 9Router, предварительно спрашивая базовый URL и пароль.

## ✅ Проверено на практике — каждый ключ протестирован

Ключ засчитывается только тогда, когда **собственный хост этого провайдера** отвечает им:

| Проверка | Вызов | Ожидается |
| --- | --- | --- |
| auth + model list | `GET https://completions.me/api/v1/models` | `200` + каталог моделей аккаунта (26 моделей) |

Проверка выполняется с **другого выхода, нежели тот, что создал ключ**, поэтому она не может пройти за счёт состояния сессии вместо валидности ключа. `node src/cli.js verify` воспроизводит ровно эту проверку для вашего собственного файла, и вы можете сделать её вручную:

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

| Шаг | Вызов |
| --- | --- |
| register | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + session cookie |
| session check | `GET /api/auth/session` — the mint confirms the account exists before it touches a key |
| key create | `POST /api/keys` (session cookie from register/login) → `{"key":"sk-cp_…"}` |
| key list / delete | `GET /api/keys` · `DELETE /api/keys/{id}` |
| usage | `GET /api/usage` |
| verify | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Всё выполняется через выходы из `proxies.txt`: каждая попытка проверяет свой выход против этого хоста непосредственно перед использованием, и строка, которая умирает посреди процесса, стоит одной попытки, а не всего запуска. `finish` повторно входит в аккаунты, которые зарегистрировались, но потеряли шаг создания ключа из-за умирающего выхода — новые ключи получаются через `mint`.

## ⚙️ Опции CLI

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Каждая задача принимает свои собственные флаги — спросите её напрямую через `node src/<task-file> --help`.

Лаунчер хранит `count` (количество созданий за запуск) и `conc` (параллельные создания, по умолчанию `2`) в `launcher.config.json` — переменные окружения не нужны.

`--count N` принимает любое N: квота живёт на аккаунте, поэтому один аккаунт — это один ключ.

## ⚡ Форма запуска (пресеты)

`--preset=turbo|balanced|safe` задаёт количество воркеров + паузу между аккаунтами (turbo = 5,
balanced = 4, safe = 2); явные `--conc`/`--gap` (или собственные флаги репозитория) всегда имеют приоритет,
а без `--preset` инструмент сохраняет свою историческую форму в точности.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.

## 🛰️ За прокси

Каждый вызов панели идёт через строку из `proxies.txt` (один выход на строку — `scheme://host:port[#comment]`, поддерживается `user:pass@`, принимается и голый `host:port`). Каждая попытка проверяет свой выход против `completions.me` непосредственно перед использованием, и строка, которая умирает посреди процесса, стоит одной попытки, а не всего запуска — `finish` подхватывает аккаунт заново на свежем выходе.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный ключ на строку — игнорируется git, никогда не коммитится |
| `accounts.json` | одна запись на аккаунт: `username`, `password`, `steps`, `verify` — игнорируется git |
| [`src/models.json`](src/models.json) | сохранённый ответ `/api/v1/models` (endpoint, timestamp, count) |
| `proxies.txt` | ваши выходы, по одному на строку — игнорируется git |
| `launcher.config.json` | то, что запоминает лаунчер — игнорируется git |
| `src/cli.js` · `src/launcher.js` | раннер задач и интерактивное меню |
| `src/connect-9router.js` | регистрирует ключи из `keys.txt` как подключения 9Router (без зависимостей) |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельный, совместимый с OpenAI роутер. Completions.me совместим с OpenAI, поэтому зарегистрируйте его один раз и используйте все ключи:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `completions-me` (`--api-key <key>` регистрирует вместо этого один ключ, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри 9Router:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Направьте коннектор на обновлённый `keys.txt`, чтобы добавить аккаунты; узел и его список моделей остаются прежними. `node src/launcher.js --connect-9router` запускает ровно это и сначала спрашивает базовый URL и пароль.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 Что даёт провайдер | 100% бесплатно · безлимитные запросы · без карты, без e-mail, без капчи |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 26 идентификаторов моделей на эндпоинте ниже, в пределах лимитов вашего тарифа. Квота живёт на **аккаунте**, поэтому этот инструмент создаёт по одному аккаунту на ключ |
| 🌐 Форма API | Совместим с OpenAI: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Ваши данные | связь происходит только с completions.me и бэкендом inbox, который вы настроили; ключи остаются на вашей машине |

## 🐞 Проблемы

Если completions.me изменит форму регистрации, маршрут ключей или базовый адрес API, инструмент остановится на этом шаге и сообщит об этом. **[Откройте issue](../../issues)** с командой, которую вы запустили, и точным выводом; PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>
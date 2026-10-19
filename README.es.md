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

**Crea cuentas de Completions.me en masa con claves API autogeneradas — inferencia compatible con OpenAI (Claude, GPT, Gemini, Grok) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-26-of-them) · [🧪 Usa la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>







---

## 🎁 Nivel gratuito — cuánto obtienes

**Las propias páginas del panel describen el nivel como "100% Free · Unlimited Requests · No Credit Card" — y el formulario de registro no pide datos de pago, ni correo electrónico, ni captcha.**

| Qué | Valor |
| --- | --- |
| Precio | **$0** — "100% Free · Unlimited Requests" en las propias páginas del panel |
| Tarjeta requerida | **No** |
| Correo electrónico requerido | **No** — el formulario de registro solo pide un nombre de usuario + contraseña |
| Captcha | **Ninguno** en el registro |
| Medidor de uso | `GET /api/usage` en la cuenta |
| La unidad que escala | **una cuenta = una clave** → `--count N` acepta cualquier N |

> 💡 El límite lo establece completions.me y puede cambiar. Lo que cuenta es la comprobación en vivo de la herramienta:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 El nivel gratuito lo establece Completions.me y puede cambiar. Consulta los números en vivo en [completions.me](https://completions.me) — y deja que la propia verificación de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 26

`GET https://completions.me/api/v1/models` responde **26 modelos** para una clave recién creada (medido el 2026-10-15) — la lista completa está capturada en [`src/models.json`](src/models.json), y esta compilación verifica una clave contra `GET /models` (la comprobación de chat es opcional mediante `verify --chat`), así que ningún id lleva una marca aquí todavía.

La respuesta capturada de `/api/v1/models` se incluye en [`src/models.json`](src/models.json) — son metadatos (endpoint, timestamp, count), y la lista en vivo proviene del propio endpoint:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 Cómo usar la API

La URL base es **`https://completions.me/api/v1`** — la URL base que el panel muestra en su propio dashboard (`/v1` por sí solo no es la misma dirección).

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

## 🛠 Inicio rápido

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

`node src/cli.js help` lista las tareas. Las claves se guardan en `keys.txt`, una por línea, añadidas en el momento en que la propia API del proveedor las devuelve; el detalle por cuenta (usuario, contraseña, pasos, resultado de verificación) se guarda en `accounts.json`.

### 🖱️ El lanzador

```bash
node src/launcher.js
```

Un menú sobre los módulos de tareas: **mint**, **finish**, **verify**, **9Router**. Pregunta por la cantidad, el grupo de proxies y la concurrencia de verificación, los recuerda en `launcher.config.json`, y lanza `node src/cli.js <task>` con los flags correctos. `node src/launcher.js --connect-9router` ejecuta directamente el registro de 9Router y pregunta primero por la URL base y la contraseña.

## ✅ Verificado y funcionando — cada clave se prueba

Una clave cuenta solo cuando **el propio host de este proveedor** responde con ella:

| Comprobación | Llamada | Esperado |
| --- | --- | --- |
| auth + lista de modelos | `GET https://completions.me/api/v1/models` | `200` + el catálogo de modelos de la cuenta (26 modelos) |

La comprobación se ejecuta desde **una salida distinta a la que creó la clave**, así que no puede pasar por el estado de la sesión en lugar de por la validez de la clave. `node src/cli.js verify` reproduce exactamente esa comprobación para tu propio archivo, y puedes hacerlo a mano:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| Paso | Llamada |
| --- | --- |
| registro | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + cookie de sesión |
| comprobación de sesión | `GET /api/auth/session` — el mint confirma que la cuenta existe antes de tocar una clave |
| creación de clave | `POST /api/keys` (cookie de sesión de register/login) → `{"key":"sk-cp_…"}` |
| listar / eliminar claves | `GET /api/keys` · `DELETE /api/keys/{id}` |
| uso | `GET /api/usage` |
| verificación | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Todo se ejecuta a través de salidas de `proxies.txt`: cada intento preverifica su salida contra este host inmediatamente antes de usarla, y una línea que muere a mitad del flujo cuesta un intento, no la ejecución. `finish` vuelve a iniciar sesión en las cuentas que se registraron pero perdieron el paso de la clave por una salida que murió — las claves nuevas provienen de `mint`.

## ⚙️ Opciones de CLI

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Cada tarea tiene sus propios flags — pregúntale directamente con `node src/<task-file> --help`.

El lanzador guarda `count` (mints por ejecución) y `conc` (mints en paralelo, por defecto `2`) en `launcher.config.json` — no se necesitan variables de entorno.

`--count N` acepta cualquier N: la cuota vive en la cuenta, así que una cuenta es una clave.

## ⚡ Forma de ejecución (presets)

`--preset=turbo|balanced|safe` establece los workers + la pausa entre cuentas (turbo = 5,
balanced = 4, safe = 2); los `--conc`/`--gap` explícitos (o los propios flags del repo) siempre ganan,
y sin `--preset` la herramienta mantiene exactamente su forma histórica.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.

## 🛰️ Detrás de un proxy

Cada llamada al panel pasa por una línea de `proxies.txt` (una salida por línea — `scheme://host:port[#comment]`, se admite `user:pass@`, se acepta `host:port` sin esquema). Cada intento preverifica su salida contra `completions.me` inmediatamente antes de usarla, y una línea que muere a mitad del flujo cuesta un intento, no la ejecución — `finish` retoma la cuenta en una salida nueva.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada por línea — ignorada por git, nunca comprometida |
| `accounts.json` | un registro por cuenta: `username`, `password`, `steps`, `verify` — ignorado por git |
| [`src/models.json`](src/models.json) | la captura de `/api/v1/models` (endpoint, timestamp, count) |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `launcher.config.json` | lo que recuerda el lanzador — ignorado por git |
| `src/cli.js` · `src/launcher.js` | el ejecutor de tareas y el menú interactivo |
| `src/connect-9router.js` | registra las claves de `keys.txt` como conexiones de 9Router (cero dependencias) |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado y compatible con OpenAI. Completions.me es compatible con OpenAI, así que regístralo una vez y usa todas las claves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Cada clave en `keys.txt` se convierte en una conexión del nodo de proveedor `completions-me` (`--api-key <key>` registra una sola clave en su lugar, `--model <id>` sobrescribe el valor por defecto). Luego elige un modelo dentro de 9Router:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Apunta el conector a un `keys.txt` actualizado para añadir más cuentas; el nodo y su lista de modelos siguen igual. `node src/launcher.js --connect-9router` ejecuta exactamente esto y pregunta primero por la URL base y la contraseña.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 Qué da el proveedor | 100% gratis · solicitudes ilimitadas · sin tarjeta, sin correo, sin captcha |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 26 ids de modelo en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | Compatible con OpenAI: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con completions.me y el backend de inbox que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Si completions.me cambia la forma del registro, la ruta de la clave o la base de la API, la herramienta se detiene en ese paso y lo indica. **[Abre un issue](../../issues)** con el comando que ejecutaste y la salida exacta; los PR son bienvenidos.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>
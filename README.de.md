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

**Completions.me-Konten in großen Mengen mit automatisch generierten API-Schlüsseln erstellen — OpenAI-kompatible Inferenz (Claude, GPT, Gemini, Grok) + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-26-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Funktionsweise](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

[Englisch](README.md) · [Türkisch](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Spanisch](README.es.md) · [Französisch](README.fr.md) · **Deutsch** · [Russisch](README.ru.md) · [Portugiesisch](README.pt.md)

</div>

---

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Die Seiten des Panels selbst beschreiben die Stufe als „100 % kostenlos · unbegrenzte Anfragen · keine Kreditkarte" — und das Registrierungsformular verlangt keine Zahlungsdaten, keine E-Mail und kein Captcha.**

| Was | Wert |
| --- | --- |
| Preis | **0 $** — „100 % kostenlos · unbegrenzte Anfragen" auf den Seiten des Panels selbst |
| Karte erforderlich | **Nein** |
| E-Mail erforderlich | **Nein** — das Registrierungsformular verlangt nur einen Benutzernamen + ein Passwort |
| Captcha | **Kein** Captcha bei der Registrierung |
| Nutzungsanzeige | `GET /api/usage` auf dem Konto |
| Die skalierende Einheit | **ein Konto = ein Schlüssel** → `--count N` akzeptiert jedes N |

> 💡 Das Kontingent wird von completions.me festgelegt und kann sich ändern. Maßgeblich ist die Live-Prüfung des Tools:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 Die kostenlose Stufe wird von Completions.me festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [completions.me](https://completions.me) — und lass die Prüfung des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 26

`GET https://completions.me/api/v1/models` antwortet **26 Modelle** für einen erzeugten Schlüssel (gemessen am 15.10.2026) — die vollständige Liste ist in [`src/models.json`](src/models.json) erfasst, und dieser Build verifiziert einen Schlüssel anhand von `GET /models` (die Chat-Prüfung ist optional über `verify --chat`), daher trägt hier noch keine ID ein Häkchen.

Die erfasste Antwort von `/api/v1/models` liegt in [`src/models.json`](src/models.json) — sie enthält Metadaten (Endpunkt, Zeitstempel, Anzahl), und die Live-Liste kommt vom Endpunkt selbst:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 So verwendest du die API

Die Basis-URL ist **`https://completions.me/api/v1`** — die Basis-URL, die das Panel in seinem eigenen Dashboard anzeigt (`/v1` allein ist nicht dieselbe Adresse).

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

## 🛠 Schnellstart

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

`node src/cli.js help` listet die Aufgaben auf. Schlüssel landen in `keys.txt`, einer pro Zeile, angehängt in dem Moment, in dem die API des Anbieters selbst sie zurückgibt; Details pro Konto (Benutzername, Passwort, Schritte, Verifizierungsergebnis) landen in `accounts.json`.

### 🖱️ Der Launcher

```bash
node src/launcher.js
```

Ein Menü über die Aufgabenmodule: **mint**, **finish**, **verify**, **9Router**. Es fragt nach der Anzahl, dem Proxy-Pool und der Verifizierungs-Parallelität, merkt sie sich in `launcher.config.json` und startet `node src/cli.js <task>` mit den passenden Flags. `node src/launcher.js --connect-9router` führt direkt die 9Router-Registrierung aus und fragt zuerst nach Basis-URL und Passwort.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Ein Schlüssel zählt nur, wenn **der Host dieses Anbieters selbst** damit antwortet:

| Prüfung | Aufruf | Erwartet |
| --- | --- | --- |
| Auth + Modellliste | `GET https://completions.me/api/v1/models` | `200` + der Modellkatalog des Kontos (26 Modelle) |

Die Prüfung läuft über einen **anderen Exit als den, der den Schlüssel erzeugt hat**, sodass sie nicht aufgrund von Sitzungszustand statt Schlüsselgültigkeit bestehen kann. `node src/cli.js verify` reproduziert genau diese Prüfung für deine eigene Datei, und du kannst sie auch manuell durchführen:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 Funktionsweise

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf |
| --- | --- |
| registrieren | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + Session-Cookie |
| Sitzungsprüfung | `GET /api/auth/session` — der Mint bestätigt, dass das Konto existiert, bevor er einen Schlüssel anfasst |
| Schlüssel erstellen | `POST /api/keys` (Session-Cookie aus Register/Login) → `{"key":"sk-cp_…"}` |
| Schlüssel auflisten / löschen | `GET /api/keys` · `DELETE /api/keys/{id}` |
| Nutzung | `GET /api/usage` |
| verifizieren | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Alles läuft über Exits aus `proxies.txt`: Jeder Versuch prüft seinen Exit unmittelbar vor der Verwendung gegen diesen Host vor, und eine Zeile, die mitten im Ablauf ausfällt, kostet einen Versuch, nicht den gesamten Lauf. `finish` meldet sich erneut bei Konten an, die sich registriert haben, aber den Schlüsselschritt durch einen ausfallenden Exit verloren haben — neue Schlüssel kommen von `mint`.

## ⚙️ CLI-Optionen

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Jede Aufgabe hat ihre eigenen Flags — frage sie direkt mit `node src/<task-file> --help` ab.

Der Launcher speichert `count` (Mints pro Lauf) und `conc` (parallele Mints, Standard `2`) in `launcher.config.json` — es sind keine Umgebungsvariablen erforderlich.

`--count N` akzeptiert jedes N: Das Kontingent liegt auf dem Konto, also ist ein Konto ein Schlüssel.

## ⚡ Ausführungsform (Presets)

`--preset=turbo|balanced|safe` legt Worker + die Pause zwischen Konten fest (turbo = 5,
balanced = 4, safe = 2); explizite `--conc`/`--gap` (oder die eigenen Flags des Repos) gewinnen immer,
und ohne `--preset` behält das Tool seine bisherige Form exakt bei.

Turbo wird empfohlen (5 Worker); mehr bedeutet Last-/Sperrrisiko auf schwachen Rechnern.

## 🛰️ Hinter einem Proxy

Jeder Panel-Aufruf geht über eine Zeile aus `proxies.txt` (ein Exit pro Zeile — `scheme://host:port[#comment]`, `user:pass@` unterstützt, bloßes `host:port` akzeptiert). Jeder Versuch prüft seinen Exit unmittelbar vor der Verwendung gegen `completions.me` vor, und eine Zeile, die mitten im Ablauf ausfällt, kostet einen Versuch, nicht den gesamten Lauf — `finish` nimmt das Konto über einen frischen Exit wieder auf.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein verifizierter Schlüssel pro Zeile — von git ignoriert, nie committet |
| `accounts.json` | ein Datensatz pro Konto: `username`, `password`, `steps`, `verify` — von git ignoriert |
| [`src/models.json`](src/models.json) | die Aufzeichnung von `/api/v1/models` (Endpunkt, Zeitstempel, Anzahl) |
| `proxies.txt` | deine Exits, einer pro Zeile — von git ignoriert |
| `launcher.config.json` | was sich der Launcher merkt — von git ignoriert |
| `src/cli.js` · `src/launcher.js` | der Task-Runner und das interaktive Menü |
| `src/connect-9router.js` | registriert die Schlüssel in `keys.txt` als 9Router-Verbindungen (zero-dep) |

## 🔌 Verbindung mit 9Router

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Completions.me ist OpenAI-kompatibel, also registriere es einmal und nutze jeden Schlüssel:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Jeder Schlüssel in `keys.txt` wird zu einer Verbindung des Provider-Knotens `completions-me` (`--api-key <key>` registriert stattdessen einen einzelnen Schlüssel, `--model <id>` überschreibt den Standard). Wähle dann ein Modell innerhalb von 9Router:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Richte den Connector auf eine aktualisierte `keys.txt`, um weitere Konten hinzuzufügen; der Knoten und seine Modellliste bleiben gleich. `node src/launcher.js --connect-9router` führt genau das aus und fragt zuerst nach Basis-URL und Passwort.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 Was der Anbieter gibt | 100 % kostenlos · unbegrenzte Anfragen · keine Karte, keine E-Mail, kein Captcha |
| 🔑 Was ein Schlüssel dir bringt | einen API-Schlüssel, der an sein eigenes Konto gebunden ist: die 26 Modell-IDs am untenstehenden Endpunkt, im Rahmen der Limits deines Tarifs. Das Kontingent liegt auf dem **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Deine Daten | nur completions.me und das von dir konfigurierte Inbox-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn completions.me die Registrierungsform, die Schlüsselroute oder die API-Basis ändert, hält das Tool an diesem Schritt an und teilt es mit. **[Öffne ein Issue](../../issues)** mit dem von dir ausgeführten Befehl und der exakten Ausgabe; PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey contributors

</div>
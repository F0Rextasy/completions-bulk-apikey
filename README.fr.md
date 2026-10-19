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

**Créez en masse des comptes Completions.me avec des clés API générées automatiquement — inférence compatible OpenAI (Claude, GPT, Gemini, Grok) + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-26-of-them) · [🧪 Utiliser l’API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Fonctionnement](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Offre gratuite — ce que vous obtenez

**Les pages du panneau décrivent elles-mêmes l’offre comme « 100 % gratuit · Requêtes illimitées · Aucune carte bancaire » — et le formulaire d’inscription ne demande ni détails de paiement, ni e-mail, ni captcha.**

| Élément | Valeur |
| --- | --- |
| Prix | **0 $** — « 100 % gratuit · Requêtes illimitées » sur les pages du panneau lui-même |
| Carte requise | **Non** |
| E-mail requis | **Non** — le formulaire d’inscription ne demande qu’un nom d’utilisateur + un mot de passe |
| Captcha | **Aucun** à l’inscription |
| Compteur d’utilisation | `GET /api/usage` sur le compte |
| L’unité qui évolue | **un compte = une clé** → `--count N` accepte n’importe quel N |

> 💡 Le quota est défini par completions.me et peut changer. C’est la vérification en direct de l’outil qui fait foi :

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 L’offre gratuite est définie par Completions.me et peut changer. Consultez les chiffres en direct sur [completions.me](https://completions.me) — et laissez la propre vérification de l’outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — tous les 26

`GET https://completions.me/api/v1/models` renvoie **26 modèles** pour une clé générée (mesuré le 2026-10-15) — la liste complète est capturée dans [`src/models.json`](src/models.json) — et chacun d’eux a également répondu à un `POST /chat/completions` en direct avec `200` le 2026-10-19 (26/26 sondes) :

|Modèle|✓|
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

La réponse capturée de `/api/v1/models` est fournie dans [`src/models.json`](src/models.json) — ce sont des métadonnées (point de terminaison, horodatage, nombre), et la liste en direct provient du point de terminaison lui-même :

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 Comment utiliser l’API

L’URL de base est **`https://completions.me/api/v1`** — l’URL de base que le panneau affiche dans son propre tableau de bord (`/v1` seul n’est pas la même adresse).

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

## 🛠 Démarrage rapide

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

`node src/cli.js help` liste les tâches. Les clés arrivent dans `keys.txt`, une par ligne, ajoutées au moment où l’API du fournisseur elle-même répond avec elles ; le détail par compte (nom d’utilisateur, mot de passe, étapes, résultat de vérification) arrive dans `accounts.json`.

### 🖱️ Le lanceur

```bash
node src/launcher.js
```

Un menu au-dessus des modules de tâches : **mint**, **finish**, **verify**, **9Router**. Il demande le nombre, le pool de proxys et la concurrence de vérification, les mémorise dans `launcher.config.json` et lance `node src/cli.js <task>` avec les bonnes options. `node src/launcher.js --connect-9router` exécute directement l’enregistrement 9Router et demande d’abord l’URL de base et le mot de passe.

## ✅ Vérifié fonctionnel — chaque clé est testée

Une clé ne compte que lorsque **l’hôte de ce fournisseur lui-même** répond avec elle :

| Vérification | Appel | Attendu |
| --- | --- | --- |
| authentification + liste des modèles | `GET https://completions.me/api/v1/models` | `200` + le catalogue de modèles du compte (26 modèles) |

La vérification s’exécute depuis une **sortie différente de celle qui a créé la clé**, afin qu’elle ne puisse pas réussir grâce à l’état de session plutôt qu’à la validité de la clé. `node src/cli.js verify` reproduit exactement cette vérification pour votre propre fichier, et vous pouvez le faire à la main :

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 Fonctionnement

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| Étape | Appel |
| --- | --- |
| inscription | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + cookie de session |
| vérification de session | `GET /api/auth/session` — la création confirme que le compte existe avant de toucher à une clé |
| création de clé | `POST /api/keys` (cookie de session issu de l’inscription/connexion) → `{"key":"sk-cp_…"}` |
| liste / suppression des clés | `GET /api/keys` · `DELETE /api/keys/{id}` |
| utilisation | `GET /api/usage` |
| vérification | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Tout passe par les sorties de `proxies.txt` : chaque tentative prévalide sa sortie auprès de cet hôte immédiatement avant utilisation, et une ligne qui meurt en cours de flux coûte une tentative, pas l’exécution. `finish` se reconnecte aux comptes qui se sont inscrits mais ont perdu l’étape de la clé à cause d’une sortie qui meurt — les nouvelles clés viennent de `mint`.

## ⚙️ Options CLI

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Chaque tâche accepte ses propres options — demandez-les directement avec `node src/<task-file> --help`.

Le lanceur conserve `count` (créations par exécution) et `conc` (créations parallèles, par défaut `2`) dans `launcher.config.json` — aucune variable d’environnement n’est nécessaire.

`--count N` accepte n’importe quel N : le quota réside sur le compte, donc un compte correspond à une clé.

## ⚡ Profil d’exécution (préréglages)

`--preset=turbo|balanced|safe` définit les workers + la pause entre les comptes (turbo = 5,
balanced = 4, safe = 2) ; les `--conc`/`--gap` explicites (ou les propres options du dépôt) l’emportent toujours,
et sans `--preset`, l’outil conserve exactement son profil historique.

Turbo est recommandé (5 workers) ; davantage présente un risque de charge/ban sur une machine faible.

## 🛰️ Derrière un proxy

Chaque appel au panneau passe par une ligne de `proxies.txt` (une sortie par ligne — `scheme://host:port[#comment]`, `user:pass@` pris en charge, `host:port` seul accepté). Chaque tentative prévalide sa sortie auprès de `completions.me` immédiatement avant utilisation, et une ligne qui meurt en cours de flux coûte une tentative, pas l’exécution — `finish` reprend le compte sur une nouvelle sortie.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée par ligne — ignoré par Git, jamais commité |
| `accounts.json` | un enregistrement par compte : `username`, `password`, `steps`, `verify` — ignoré par Git |
| [`src/models.json`](src/models.json) | la capture de `/api/v1/models` (point de terminaison, horodatage, nombre) |
| `proxies.txt` | vos sorties, une par ligne — ignoré par Git |
| `launcher.config.json` | ce que le lanceur mémorise — ignoré par Git |
| `src/cli.js` · `src/launcher.js` | l’exécuteur de tâches et le menu interactif |
| `src/connect-9router.js` | enregistre les clés de `keys.txt` comme connexions 9Router (zéro dépendance) |

## 🔌 Se connecter à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. Completions.me est compatible OpenAI, alors enregistrez-le une fois et utilisez chaque clé :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Chaque clé de `keys.txt` devient une connexion du nœud fournisseur `completions-me` (`--api-key <key>` enregistre plutôt une seule clé, `--model <id>` remplace la valeur par défaut). Choisissez ensuite un modèle dans 9Router :

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Pointez le connecteur vers un `keys.txt` actualisé pour ajouter d’autres comptes ; le nœud et sa liste de modèles restent identiques. `node src/launcher.js --connect-9router` exécute exactement cela et demande d’abord l’URL de base et le mot de passe.

## 🔑 Ce qu’une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 Ce que le fournisseur offre | 100 % gratuit · requêtes illimitées · aucune carte, aucun e-mail, aucun captcha |
| 🔑 Ce qu’une clé vous apporte | une clé API limitée à son propre compte : les 26 identifiants de modèles sur le point de terminaison ci-dessous, dans les limites de votre offre. Le quota réside sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l’API | Compatible OpenAI : `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Vos données | seuls completions.me et le backend de boîte de réception que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si completions.me modifie la structure de l’inscription, la route des clés ou la base de l’API, l’outil s’arrête à cette étape et le signale. **[Ouvrez un problème](../../issues)** avec la commande que vous avez exécutée et la sortie exacte ; les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 les contributeurs de completions-me-bulk-apikey

</div>
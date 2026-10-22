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

**Crie contas do Completions.me em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI (Claude, GPT, Gemini, Grok) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-26-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Nível gratuito — quanto você recebe

**As próprias páginas do painel descrevem o nível como "100% Grátis · Solicitações Ilimitadas · Sem Cartão de Crédito" — e o formulário de registro não pede dados de pagamento, nem e-mail e nem captcha.**

| O quê | Valor |
| --- | --- |
| Preço | **$0** — "100% Grátis · Solicitações Ilimitadas" nas próprias páginas do painel |
| Cartão exigido | **Não** |
| E-mail exigido | **Não** — o formulário de registro aceita apenas nome de usuário + senha |
| Captcha | **Nenhum** no registro |
| Medidor de uso | `GET /api/usage` na conta |
| A unidade que escala | **uma conta = uma chave** → `--count N` aceita qualquer N |

> 💡 A cota é definida pelo completions.me e pode mudar. O que conta é a verificação ao vivo da ferramenta:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 O nível gratuito é definido pelo Completions.me e pode mudar. Confira os números ao vivo em [completions.me](https://completions.me) — e deixe a própria verificação da ferramenta decidir:

```bash
node src/cli.js verify            # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 26

`GET https://completions.me/api/v1/models` responde **26 modelos** para uma chave gerada (medido em 2026-10-15) — a lista completa está capturada em [`src/models.json`](src/models.json) — e todos eles também responderam a um `POST /chat/completions` ao vivo com `200` em 2026-10-19 (26/26 sondagens):

|Modelo|✓|
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

A resposta capturada de `/api/v1/models` vem em [`src/models.json`](src/models.json) — são metadados (endpoint, timestamp, contagem), e a lista ao vivo vem do próprio endpoint:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 Como usar a API

A URL base é **`https://completions.me/api/v1`** — a URL base que o painel mostra no próprio dashboard (`/v1` sozinho não é o mesmo endereço).

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

## 🛠 Início rápido

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

`node src/cli.js help` lista as tarefas. As chaves ficam em `keys.txt`, uma por linha, anexadas no momento em que a própria API do provedor responde com elas; os detalhes por conta (nome de usuário, senha, etapas, resultado da verificação) ficam em `accounts.json`.

### 🖱️ O launcher

```bash
node src/launcher.js
```

Um menu sobre os módulos de tarefas: **mint**, **finish**, **verify**, **9Router**. Ele pergunta a contagem, o pool de proxies e a concorrência de verificação, lembra deles em `launcher.config.json` e inicia `node src/cli.js <task>` com as flags corretas. `node src/launcher.js --connect-9router` executa o registro do 9Router diretamente e pergunta a URL base e a senha primeiro.

## ✅ Verificado e funcionando — cada chave é testada

Uma chave só conta quando **o próprio host deste provedor** responde com ela:

| Verificação | Chamada | Esperado |
| --- | --- | --- |
| autenticação + lista de modelos | `GET https://completions.me/api/v1/models` | `200` + o catálogo de modelos da conta (26 modelos) |

A verificação é executada a partir de uma **saída diferente da que gerou a chave**, então ela não pode passar por estado de sessão em vez de validade da chave. `node src/cli.js verify` reproduz exatamente essa verificação para o seu próprio arquivo, e você pode fazer isso manualmente:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada |
| --- | --- |
| registrar | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + cookie de sessão |
| verificação de sessão | `GET /api/auth/session` — o mint confirma que a conta existe antes de tocar em uma chave |
| criação de chave | `POST /api/keys` (cookie de sessão do registro/login) → `{"key":"sk-cp_…"}` |
| listar / excluir chaves | `GET /api/keys` · `DELETE /api/keys/{id}` |
| uso | `GET /api/usage` |
| verificar | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Tudo passa por saídas de `proxies.txt`: cada tentativa faz uma verificação prévia da sua saída contra este host imediatamente antes do uso, e uma linha que morre no meio do fluxo custa uma tentativa, não a execução. `finish` faz login novamente em contas que se registraram, mas perderam a etapa da chave por causa de uma saída que morreu — novas chaves vêm de `mint`.

## ⚙️ Opções da CLI

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Cada tarefa aceita suas próprias flags — pergunte diretamente com `node src/<task-file> --help`.

O launcher mantém `count` (mints por execução) e `conc` (mints paralelos, padrão `2`) em `launcher.config.json` — nenhuma variável de ambiente é necessária.

`--count N` aceita qualquer N: a cota fica na conta, então uma conta é uma chave.

## ⚡ Formato de execução (presets)

`--preset=turbo|balanced|safe` define workers + a pausa entre contas (turbo = 5,
balanced = 4, safe = 2); `--conc`/`--gap` explícitos (ou as flags do próprio repositório) sempre prevalecem,
e sem `--preset` a ferramenta mantém exatamente seu formato histórico.

Turbo é recomendado (5 workers); mais que isso é risco de carga/ban em uma máquina fraca.

## 🛰️ Atrás de um proxy

Toda chamada ao painel passa por uma linha de `proxies.txt` (uma saída por linha — `scheme://host:port[#comment]`, `user:pass@` com suporte, `host:port` sem esquema aceito). Cada tentativa faz uma verificação prévia da sua saída contra `completions.me` imediatamente antes do uso, e uma linha que morre no meio do fluxo custa uma tentativa, não a execução — `finish` retoma a conta em uma nova saída.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada por linha — ignorado pelo git, nunca commitado |
| `accounts.json` | um registro por conta: `username`, `password`, `steps`, `verify` — ignorado pelo git |
| [`src/models.json`](src/models.json) | a captura de `/api/v1/models` (endpoint, timestamp, contagem) |
| `proxies.txt` | suas saídas, uma por linha — ignorado pelo git |
| `launcher.config.json` | o que o launcher lembra — ignorado pelo git |
| `src/cli.js` · `src/launcher.js` | o executor de tarefas e o menu interativo |
| `src/connect-9router.js` | registra as chaves em `keys.txt` como conexões do 9Router (zero-dep) |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. O Completions.me é compatível com OpenAI, então registre-o uma vez e use todas as chaves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

Cada chave em `keys.txt` se torna uma conexão do nó do provedor `completions-me` (`--api-key <key>` registra uma única chave em vez disso, `--model <id>` substitui o padrão). Depois, escolha um modelo dentro do 9Router:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Aponte o conector para um `keys.txt` atualizado para adicionar mais contas; o nó e sua lista de modelos permanecem os mesmos. `node src/launcher.js --connect-9router` executa exatamente isso e pergunta a URL base e a senha primeiro.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 O que o provedor oferece | 100% grátis · solicitações ilimitadas · sem cartão, sem e-mail, sem captcha |
| 🔑 O que uma chave oferece | uma chave de API vinculada à própria conta: os 26 ids de modelos no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, e é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Seus dados | somente o completions.me e o backend de caixa de entrada que você configurar são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Se o completions.me mudar o formato do registro, a rota da chave ou a base da API, a ferramenta para nessa etapa e avisa. **[Abra uma issue](../../issues)** com o comando que você executou e a saída exata; PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — consulte [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 colaboradores do completions-me-bulk-apikey

</div>
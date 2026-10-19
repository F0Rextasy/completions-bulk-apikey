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

**Otomatik oluşturulan API anahtarlarıyla toplu Completions.me hesabı oluşturun — OpenAI uyumlu çıkarım (Claude, GPT, Gemini, Grok) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-26%20served-412991?style=for-the-badge)](https://completions.me)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-26-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Ücretsiz katman — ne kadar alırsınız

**Panelin kendi sayfaları katmanı "100% Free · Unlimited Requests · No Credit Card" olarak tanımlıyor — ve kayıt formu hiçbir ödeme bilgisi, e-posta veya captcha istemiyor.**

| Ne | Değer |
| --- | --- |
| Fiyat | **$0** — panelin kendi sayfalarında "100% Free · Unlimited Requests" |
| Kart gerekli | **Hayır** |
| E-posta gerekli | **Hayır** — kayıt formu yalnızca kullanıcı adı + parola alır |
| Captcha | Kayıtta **Yok** |
| Kullanım ölçer | Hesapta `GET /api/usage` |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` herhangi bir N değerini alır |

> 💡 Kota completions.me tarafından belirlenir ve değişebilir. Aracın canlı kontrolü belirleyici olandır:

```bash
node src/cli.js verify      # every key in keys.txt is re-tested against the provider host
```

> 💡 Ücretsiz katman Completions.me tarafından belirlenir ve değişebilir. Canlı sayıları [completions.me](https://completions.me) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 26 tanesinin tamamı

`GET https://completions.me/api/v1/models` üretilmiş bir anahtar için **26 model** yanıtlıyor (ölçüm: 2026-10-15) — tam liste [`src/models.json`](src/models.json) dosyasında yakalanmıştır — ve her biri ayrıca 2026-10-19 tarihinde canlı bir `POST /chat/completions` `200` yanıtı verdi (26/26 deneme):

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

Yakalanan `/api/v1/models` yanıtı [`src/models.json`](src/models.json) dosyasında gelir — bu bir üst veridir (uç nokta, zaman damgası, sayı) ve canlı liste uç noktanın kendisinden gelir:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧪 API nasıl kullanılır

Temel URL **`https://completions.me/api/v1`** — panelin kendi kontrol panelinde gösterdiği temel URL (tek başına `/v1` aynı adres değildir).

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

## 🛠 Hızlı başlangıç

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

`node src/cli.js help` görevleri listeler. Anahtarlar `keys.txt` dosyasına düşer, her satıra bir tane, sağlayıcının kendi API'si onlarla yanıt verdiği anda eklenir; hesap başına ayrıntı (kullanıcı adı, parola, adımlar, doğrulama sonucu) `accounts.json` dosyasına düşer.

### 🖱️ Başlatıcı

```bash
node src/launcher.js
```

Görev modülleri üzerinde bir menü: **mint**, **finish**, **verify**, **9Router**. Sayıyı, proxy havuzunu ve doğrulama eşzamanlılığını sorar, bunları `launcher.config.json` dosyasında hatırlar ve `node src/cli.js <task>` komutunu doğru bayraklarla başlatır. `node src/launcher.js --connect-9router` doğrudan 9Router kaydını çalıştırır ve önce temel URL ile parolayı sorar.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

Bir anahtar yalnızca **bu sağlayıcının kendi ana makinesi** onunla yanıt verdiğinde geçerli sayılır:

| Kontrol | Çağrı | Beklenen |
| --- | --- | --- |
| kimlik doğrulama + model listesi | `GET https://completions.me/api/v1/models` | `200` + hesabın model kataloğu (26 model) |

Kontrol, **anahtarı üreten çıkıştan farklı bir çıkıştan** çalışır, böylece anahtar geçerliliği yerine oturum durumuyla geçemez. `node src/cli.js verify` kendi dosyanız için tam olarak bu kontrolü yeniden üretir ve bunu elle de yapabilirsiniz:

```bash
curl https://completions.me/api/v1/models -H "Authorization: Bearer sk-cp_…"
```

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Completions.me page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://completions.me/api/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı |
| --- | --- |
| kayıt | `POST /api/auth/register` `{username, password}` → `{"user":{"id":"usr_…","username":"…"}}` + oturum çerezi |
| oturum kontrolü | `GET /api/auth/session` — üretim, bir anahtara dokunmadan önce hesabın var olduğunu doğrular |
| anahtar oluşturma | `POST /api/keys` (kayıt/girişten gelen oturum çerezi) → `{"key":"sk-cp_…"}` |
| anahtar listeleme / silme | `GET /api/keys` · `DELETE /api/keys/{id}` |
| kullanım | `GET /api/usage` |
| doğrulama | `GET /api/v1/models` (Bearer `sk-cp_…`) → `200` |

Her şey `proxies.txt` içindeki çıkışlar üzerinden çalışır: her deneme, kullanımdan hemen önce çıkışını bu ana makineye karşı ön kontrol eder ve akış ortasında ölen bir satır tüm çalıştırmaya değil, bir denemeye mal olur. `finish`, kaydolmuş ancak anahtar adımını ölen bir çıkış yüzünden kaybetmiş hesaplara yeniden giriş yapar — yeni anahtarlar `mint`'ten gelir.

## ⚙️ CLI seçenekleri

```bash
node src/cli.js mint [flags]     # fresh accounts → one verified key each
node src/cli.js finish           # finish the key step for accounts already created
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js 9router          # register the keys with a local 9Router
node src/cli.js help
```

Her görev kendi bayraklarını alır — doğrudan `node src/<task-file> --help` ile sorun.

Başlatıcı, `count` (çalıştırma başına üretim) ve `conc` (paralel üretim, varsayılan `2`) değerlerini `launcher.config.json` dosyasında tutar — hiçbir ortam değişkeni gerekmez.

`--count N` herhangi bir N değerini alır: kota hesapta yaşar, yani bir hesap bir anahtardır.

## ⚡ Çalıştırma biçimi (ön ayarlar)

`--preset=turbo|balanced|safe` worker sayısını + hesaplar arasındaki duraklamayı ayarlar (turbo = 5,
balanced = 4, safe = 2); açıkça verilen `--conc`/`--gap` (veya deponun kendi bayrakları) her zaman kazanır
ve `--preset` olmadan araç tarihsel biçimini tam olarak korur.

Turbo önerilir (5 worker); daha fazlası zayıf bilgisayarda yük/ban riski.

## 🛰️ Proxy arkasında

Her panel çağrısı `proxies.txt` içindeki bir satırdan geçer (her satıra bir çıkış — `scheme://host:port[#comment]`, `user:pass@` desteklenir, çıplak `host:port` kabul edilir). Her deneme, kullanımdan hemen önce çıkışını `completions.me` adresine karşı ön kontrol eder ve akış ortasında ölen bir satır tüm çalıştırmaya değil, bir denemeye mal olur — `finish` hesabı yeni bir çıkışta yeniden ele alır.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | her satıra bir doğrulanmış anahtar — git tarafından yok sayılır, asla işlenmez |
| `accounts.json` | hesap başına bir kayıt: `username`, `password`, `steps`, `verify` — git tarafından yok sayılır |
| [`src/models.json`](src/models.json) | `/api/v1/models` yakalaması (uç nokta, zaman damgası, sayı) |
| `proxies.txt` | çıkışlarınız, her satıra bir tane — git tarafından yok sayılır |
| `launcher.config.json` | başlatıcının hatırladıkları — git tarafından yok sayılır |
| `src/cli.js` · `src/launcher.js` | görev çalıştırıcısı ve etkileşimli menü |
| `src/connect-9router.js` | `keys.txt` içindeki anahtarları 9Router bağlantıları olarak kaydeder (sıfır bağımlılık) |

## 🔌 9Router'a bağlanma

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Completions.me OpenAI uyumludur, bu yüzden bir kez kaydedin ve her anahtarı kullanın:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
```

`keys.txt` içindeki her anahtar, `completions-me` sağlayıcı düğümünün bir bağlantısı olur (`--api-key <key>` bunun yerine tek bir anahtar kaydeder, `--model <id>` varsayılanı geçersiz kılar). Ardından 9Router içinde bir model seçin:

```
completions-me/claude-sonnet-4.6
completions-me/gpt-5.4
completions-me/gemini-3-pro-preview
```

Daha fazla hesap eklemek için bağlayıcıyı yenilenmiş bir `keys.txt` dosyasına yönlendirin; düğüm ve model listesi aynı kalır. `node src/launcher.js --connect-9router` tam olarak bunu çalıştırır ve önce temel URL ile parolayı sorar.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Completions.me** — [completions.me](https://completions.me) |
| 🎁 Sağlayıcının verdikleri | 100% ücretsiz · sınırsız istek · kart yok, e-posta yok, captcha yok |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabına kapsanmış bir API anahtarı: aşağıdaki uç noktadaki 26 model kimliği, planınızın limitlerinde. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam olarak budur |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://completions.me/api/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca completions.me ve yapılandırdığınız inbox arka ucuna bağlanılır; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

completions.me kayıt biçimini, anahtar rotasını veya API temelini değiştirirse, araç o adımda durur ve bunu bildirir. Çalıştırdığınız komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**; PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 completions-me-bulk-apikey katkıda bulunanlar

</div>
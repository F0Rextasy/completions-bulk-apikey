#!/usr/bin/env node
'use strict';

/**
 * completions.me — REST mint (no browser needed).
 *
 * Contract measured from the app's own register chunk (`app/register/page-*.js`):
 *   POST /api/auth/register   {"username","password"} → 200, then the SPA pushes /dashboard
 *   (no captcha, no e-mail field, no mail layer anywhere in the chunk)
 *
 * The API-key route is *discovered*, not guessed: after registering we page the
 * dashboard, then try the small set of key routes such forks use, and record
 * which one answered. A key is written to keys.txt only after this provider's
 * own `/v1/models` answers 200 with it (or a real completion succeeds).
 *
 *   node src/mint-node.js --count 3 [--pool f]…
 */

const fs = require('fs');
const path = require('path');
/** The shared workspace engine is not part of this repo: a fresh clone must not
 *  crash on import, so its absence is explained at the first call that needs it. */
const engine = (() => {
  try {
    return require('../../_community/lib');
  } catch (e) {
    const hint = 'this tool needs the workspace engine (../../_community/lib) — a fresh clone of this repo does not ship it';
    const unavailable = () => {
      console.error(hint);
      process.exit(2);
    };
    return { loadExits: unavailable, ExitPool: unavailable, req: unavailable, sleep: unavailable, randHex: unavailable, randPass: unavailable, nowIso: unavailable, appendLine: unavailable, readJson: unavailable, writeJson: unavailable, extractCode: unavailable };
  }
})();
const { loadExits, ExitPool, req, sleep, randHex, randPass, nowIso, appendLine, readJson, writeJson, extractCode } = engine;

const argv = process.argv.slice(2);
const one = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const many = (n) => {
  const out = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === `--${n}` && argv[i + 1]) out.push(argv[i + 1]);
  return out;
};

const ORIGIN = one('base', 'https://completions.me');
const COUNT = parseInt(one('count', '3'), 10);
const POOLS = many('pool');
const DIR = path.resolve(__dirname, '..'); // data root (the repo root)
const KEYS = path.join(DIR, 'keys.txt');
const ACCOUNTS = path.join(DIR, 'accounts.json');
const LOG = path.join(DIR, 'out', `mint-node-${new Date().toISOString().slice(0, 10)}.log`);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';

const accounts = readJson(ACCOUNTS, []);
function log(...a) {
  const line = `[${nowIso()}] ${a.join(' ')}`;
  console.log(line);
  appendLine(LOG, line);
}

class Client {
  constructor(pool) {
    this.pool = pool;
    this.cookie = '';
  }
  async call(pathname, { method = 'GET', body = null, tries = 8, timeoutMs = 20000 } = {}) {
    return this.pool.attempt(
      async (p) => {
        const res = await req(p, ORIGIN + pathname, {
          method,
          body,
          headers: {
            accept: 'application/json, text/plain, */*',
            'user-agent': UA,
            origin: ORIGIN,
            referer: ORIGIN + '/register',
            ...(this.cookie ? { cookie: this.cookie } : {}),
          },
          timeoutMs,
          connectTimeoutMs: 8000,
        });
        const setCookie = res.headers['set-cookie'];
        if (setCookie && setCookie.length) {
          const jar = new Map(
            this.cookie
              .split(';')
              .map((s) => s.trim())
              .filter(Boolean)
              .map((s) => [s.split('=')[0], s])
          );
          for (const c of setCookie) jar.set(c.split('=')[0], c.split(';')[0]);
          this.cookie = [...jar.values()].join('; ');
        }
        let json = null;
        try {
          json = JSON.parse(res.text);
        } catch (e) {}
        return { status: res.status, json, text: res.text, headers: res.headers, exit: p.line };
      },
      { tries, label: `${method} ${pathname}` }
    );
  }
}

/** Try the handful of key routes these dashboards use; report which answered. */
async function discoverKeyRoute(client) {
  const candidates = [
    { path: '/api/keys', method: 'POST', body: { name: `cw-${randHex(4)}` } },
    { path: '/api/keys/create', method: 'POST', body: { name: `cw-${randHex(4)}` } },
    { path: '/api/user/keys', method: 'POST', body: { name: `cw-${randHex(4)}` } },
    { path: '/api/auth/keys', method: 'POST', body: { name: `cw-${randHex(4)}` } },
    { path: '/api/keys', method: 'GET' },
  ];
  const seen = [];
  for (const c of candidates) {
    let r = null;
    try {
      r = await client.call(c.path, { method: c.method, body: c.body, tries: 4 });
    } catch (e) {
      seen.push({ tried: `${c.method} ${c.path}`, error: String(e.message).slice(0, 120) });
      continue;
    }
    const blob = r.text || '';
    const key = (blob.match(/sk-[A-Za-z0-9_\-]{12,}/) || blob.match(/"(?:key|apiKey|api_key)"\s*:\s*"([^"]{12,})"/) || [])[1] || (blob.match(/sk-[A-Za-z0-9_\-]{12,}/) || [])[0] || null;
    seen.push({ tried: `${c.method} ${c.path}`, status: r.status, keys: key ? key.slice(0, 10) + '…' : null, body: blob.slice(0, 160) });
    if (key && r.status < 400) return { key, route: c, seen };
  }
  return { key: null, seen };
}

async function main() {
  const exits = loadExits(POOLS.length ? POOLS : undefined);
  const pool = new ExitPool(exits, { label: 'completions' });
  log(`exits ${exits.length} · origin ${ORIGIN}`);
  const made = [];
  for (let i = 0; i < COUNT; i++) {
    // Naming + collision policy (toolchain-scale): `cw` + crypto-hex + base36 tail
    // (18 chars total), asserted unique against accounts.json *before* the
    // request — a taken name looks exactly like "registration mysteriously
    // failing", so it is refused up front and the same string is never retried.
    const used = new Set(accounts.map((a) => a.username).filter(Boolean));
    let username = '';
    for (let guard = 0; guard < 16 && !username; guard++) {
      const candidate = `cw${randHex(7)}${Math.random().toString(36).slice(2, 8)}`.slice(0, 18);
      if (!used.has(candidate)) username = candidate;
    }
    if (!username) throw new Error('no unused username after 16 tries (accounts.json uniqueness assertion)');
    const password = randPass();
    const rec = { provider: 'completions-me', index: accounts.length + 1, username, password, created: nowIso(), steps: {} };
    log(`#${rec.index} ${username}`);
    try {
      const client = new Client(pool);
      const reg = await client.call('/api/auth/register', { method: 'POST', body: { username, password }, tries: 8 });
      rec.steps.register = { status: reg.status, body: reg.text.slice(0, 200), cookie: !!client.cookie, exit: reg.exit };
      log(`  register ${reg.status} ${reg.text.slice(0, 140)} cookie=${!!client.cookie}`);
      if (reg.status >= 400) {
        rec.status = 'register-refused';
        accounts.push(rec);
        writeJson(ACCOUNTS, accounts);
        continue;
      }
      // "hollow account" check (Cohere/ZenMux pattern): a 200 on register means
      // nothing until a password login and a session-bound call both work.
      const login = await client.call('/api/auth/login', { method: 'POST', body: { username, password }, tries: 6 });
      rec.steps.login = { status: login.status, body: login.text.slice(0, 160), exit: login.exit };
      log(`  login ${login.status} ${login.text.slice(0, 120)}`);
      const me = await client.call('/api/auth/me', { tries: 4 }).catch((e) => ({ status: 0, text: String(e.message) }));
      rec.steps.me = { status: me.status, body: String(me.text || '').slice(0, 160) };
      log(`  me ${me.status} ${String(me.text || '').slice(0, 100)}`);
      // Mandatory gate per Main: the register 200 must be followed by a session
      // that names the user, otherwise it is the hollow-account pattern and no
      // key gets minted (and nothing is written to keys.txt).
      const sess = await client.call('/api/auth/session', { tries: 5 });
      rec.steps.session = { status: sess.status, user: sess.json && sess.json.user ? sess.json.user.username : null, body: String(sess.text || '').slice(0, 140) };
      log(`  session ${sess.status} user=${rec.steps.session.user}`);
      if (!(sess.json && sess.json.user)) {
        rec.status = 'hollow-account';
        accounts.push(rec);
        writeJson(ACCOUNTS, accounts);
        continue;
      }
      const found = await discoverKeyRoute(client);
      rec.steps.keyRoute = found.seen;
      log(`  key route: ${found.key ? found.route.method + ' ' + found.route.path : 'NONE'} ${JSON.stringify(found.seen.map((s) => `${s.tried}=${s.status}`)).slice(0, 200)}`);
      if (!found.key) {
        rec.status = 'no-key';
        accounts.push(rec);
        writeJson(ACCOUNTS, accounts);
        continue;
      }
      rec.key = found.key;
      // own-API verification
      const models = await pool.attempt(
        async (p) => req(p, `${ORIGIN}/api/v1/models`, { headers: { authorization: `Bearer ${found.key}`, accept: 'application/json', 'user-agent': UA }, timeoutMs: 25000 }),
        { tries: 6, label: 'models' }
      );
      rec.verify = { host: new URL(ORIGIN).host, endpoint: '/v1/models', status: models.status, text: String(models.text).slice(0, 240) };
      log(`  verify /v1/models → ${models.status} ${rec.verify.text.slice(0, 100)}`);
      if (models.status === 200) {
        rec.status = 'minted';
        if (!fs.existsSync(KEYS) || !fs.readFileSync(KEYS, 'utf8').includes(found.key)) appendLine(KEYS, found.key);
        made.push(found.key);
        if (!fs.existsSync(path.join(__dirname, 'models.json'))) writeJson(path.join(__dirname, 'models.json'), { at: nowIso(), base: ORIGIN, body: models.text.slice(0, 20000) });
      } else {
        rec.status = 'key-unverified';
      }
    } catch (e) {
      rec.status = 'error';
      rec.error = String(e.message).slice(0, 240);
      log(`  ✖ ${rec.error}`);
    }
    accounts.push(rec);
    writeJson(ACCOUNTS, accounts);
    await sleep(1500);
  }
  log(`done: completions.me — ${made.length} new key(s), ${accounts.filter((a) => a.status === 'minted').length} minted account(s) total`);
}

main().catch((e) => {
  log(`FATAL ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`);
  process.exit(1);
});

#!/usr/bin/env node
'use strict';

/**
 * Re-verifies every key in keys.txt against the panel's own API, through the
 * exits in proxies.txt.
 *
 *   node src/verify.js                       # keys.txt, first exit that answers
 *   node src/verify.js --file keys.txt --limit 3 --conc 4 --chat
 *
 * The base URL is pinned here on purpose: the app serves its OpenAI-compatible
 * API under /api/v1 (not /v1), which is the single most common mistake made
 * against this panel.
 */

const fs = require('fs');
const path = require('path');
const { parseProxy, fetchText } = require('./proxy.js');

const HERE = path.resolve(__dirname, '..'); // data root (the repo root)
const BASE = 'https://completions.me/api/v1';
const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log('usage: node src/verify.js [--file keys.txt] [--pool proxies.txt] [--limit N] [--conc N] [--chat] [--model ID]');
  process.exit(0);
}
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
// A missing or non-numeric value must not become NaN: `Array.from({length: NaN})`
// spawns no worker at all, so the run would report "verified 0/N" without asking anything.
const int = (v, fallback) => (Number.isNaN(parseInt(v, 10)) ? fallback : parseInt(v, 10));

const KEYS_FILE = path.resolve(HERE, opt('file', 'keys.txt'));
const POOL_FILE = path.resolve(HERE, opt('pool', 'proxies.txt'));
const LIMIT = int(opt('limit', '0'), 0);
const CONC = Math.min(int(opt('conc', '4'), 4), 8);
const WITH_CHAT = argv.includes('--chat');
const MODEL = opt('model', '');

/** keys.txt and proxies.txt come from a run — say what is missing instead of
 *  spilling a raw ENOENT trace in a fresh clone. */
const readOrExit = (file, hint) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) {
    console.error(`${path.basename(file)} not found at ${file} — ${hint}`);
    process.exit(2);
  }
};

function readPool() {
  const out = [];
  for (const line of readOrExit(POOL_FILE, 'one proxy per line (scheme://host:port)').split(/\r?\n/)) {
    const raw = line.split(/\s+#/)[0].trim();
    if (!raw || raw.startsWith('#')) continue;
    const url = /^[a-z]+:\/\//i.test(raw) ? raw : `http://${raw}`;
    const p = parseProxy(url);
    if (p) out.push(p);
  }
  return out;
}

async function verifyOne(key, pool) {
  let lastError = '';
  for (let i = 0; i < Math.min(pool.length, 12); i++) {
    const proxy = pool[(i + Math.floor(Math.random() * pool.length)) % pool.length];
    try {
      const body = await fetchText(proxy, `${BASE}/models`, { timeoutMs: 20000, headers: { authorization: `Bearer ${key}`, accept: 'application/json' } });
      // fetchText resolves whatever the status is, so the verdict has to come from the
      // body: the documented 200 is the model list, an error page or 401 JSON is not.
      let j = null;
      try { j = JSON.parse(body); } catch (e) {}
      if (!j || !Array.isArray(j.data)) return { ok: false, error: `not a model list: ${String(body).slice(0, 100)}` };
      const models = j.data.map((m) => m.id);
      let chat = null; // read by the return below even when --chat is off
      if (WITH_CHAT && models.length) {
        const model = MODEL || models[0];
        try {
          const c = await fetchText(proxy, `${BASE}/chat/completions`, {
            method: 'POST',
            timeoutMs: 45000,
            headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
            body: { model, messages: [{ role: 'user', content: 'Reply with the single word: ok' }], max_tokens: 8 },
          });
          const j = JSON.parse(c);
          chat = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        } catch (e) {
          chat = `chat failed: ${String(e.message).slice(0, 80)}`;
        }
      }
      return { ok: true, models: models.length, chat };
    } catch (e) {
      lastError = String(e.message || e).slice(0, 120); // exit verdict, not a key verdict — rotate
    }
  }
  return { ok: false, error: lastError || 'no exit could carry the check' };
}

(async () => {
  const keys = readOrExit(KEYS_FILE, 'mint a batch first (node src/mint-node.js), then re-run this tool').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const list = LIMIT > 0 ? keys.slice(0, LIMIT) : keys;
  const pool = readPool();
  if (!pool.length) {
    console.error(`no exits in ${path.basename(POOL_FILE)} — one proxy per line (scheme://host:port)`);
    process.exit(2);
  }
  console.log(`${list.length} key(s), ${pool.length} exit(s), base ${BASE}`);
  let ok = 0;
  let idx = 0;
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (idx < list.length) {
        const key = list[idx++];
        const r = await verifyOne(key, pool);
        const short = `${key.slice(0, 10)}…${key.slice(-4)}`;
        if (r.ok) {
          ok++;
          console.log(`  LIVE  ${short}  models=${r.models}${r.chat ? `  chat=${JSON.stringify(String(r.chat).slice(0, 24))}` : ''}`);
        } else {
          console.log(`  DEAD  ${short}  ${r.error}`);
        }
      }
    })
  );
  console.log(`verified ${ok}/${list.length}`);
  process.exit(ok ? 0 : 1);
})();

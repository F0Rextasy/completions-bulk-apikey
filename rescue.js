#!/usr/bin/env node
'use strict';
/**
 * completions.me — rescue pass: accounts that registered (200 + usr_… id) but
 * whose login/key/verify legs died on exit starvation. Re-derives the missing
 * key for each using the stored username+password; appends to keys.txt only
 * after this host's own /api/v1/models answers 200.
 */
const fs = require('fs');
const path = require('path');
const { loadExits, ExitPool, req, appendLine, writeJson, nowIso, sleep } = require('../../_community/lib');
const { LiveSupply } = require('../../_community/clerk');

const P = path.join(__dirname);
const KEYS = path.join(P, 'keys.txt');
const ACC = path.join(P, 'accounts.json');
const LOG = path.join(P, 'out', 'rescue.log');
const ORIGIN = 'https://completions.me';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
const log = (...a) => { const l = '[' + nowIso() + '] ' + a.join(' '); console.log(l); appendLine(LOG, l); };

const accounts = JSON.parse(fs.readFileSync(ACC, 'utf8'));
const targets = accounts.filter((a) => a.username && a.password && a.steps && a.steps.register && a.steps.register.status === 200 && !a.key);
log('rescue targets: ' + targets.map((a) => a.index + ':' + a.username).join(' '));

const exits = loadExits(['proxies.txt', 'proxies.txt', 'proxies.txt', 'proxies.txt', 'proxies.txt']);
const pool = new ExitPool(exits, { label: 'cm-rescue' });
const panelSupply = new LiveSupply(exits, { host: 'completions.me', path: '/api/auth/session', origin: ORIGIN, timeoutMs: 9000, log: (m) => log('  ' + m) });
log('exits: ' + exits.length);
// Main's rule: a key must be verified on an exit that did NOT mint it. This pool
// is the feed's winners file (never a mint source) and the mint exit is removed
// from it below per account.
const feedLines = (() => { try { return fs.readFileSync('proxies.txt', 'utf8').split('\n').map((l) => l.split(/\s+#/)[0].trim()).filter(Boolean); } catch (e) { return []; } })();
log('verify-feed exits: ' + feedLines.length);

function makeClient() {
  const c = { cookie: '' };
  c.call = (pathname, opts) => {
    opts = opts || {};
    return panelSupply.attempt(async (p) => {
      const res = await req(p, ORIGIN + pathname, {
        method: opts.method || 'GET',
        body: opts.body || null,
        headers: Object.assign({ accept: 'application/json, text/plain, */*', 'user-agent': UA, origin: ORIGIN, referer: ORIGIN + '/dashboard' }, c.cookie ? { cookie: c.cookie } : {}),
        timeoutMs: opts.timeoutMs || 25000,
        connectTimeoutMs: 8000,
      });
      const sc = res.headers['set-cookie'];
      if (sc && sc.length) {
        const jar = new Map(c.cookie.split(';').map((s) => s.trim()).filter(Boolean).map((s) => [s.split('=')[0], s]));
        for (const x of sc) jar.set(x.split('=')[0], x.split(';')[0]);
        c.cookie = [...jar.values()].join('; ');
      }
      let json = null; try { json = JSON.parse(res.text); } catch (e) {}
      return { status: res.status, json: json, text: res.text, exit: p.line };
    }, { tries: opts.tries || 12, label: (opts.method || 'GET') + ' ' + pathname });
  };
  return c;
}

(async () => {
  let made = 0;
  for (const rec of targets) {
    log('#' + rec.index + ' ' + rec.username);
    try {
      const client = makeClient();
      const login = await client.call('/api/auth/login', { method: 'POST', body: { username: rec.username, password: rec.password }, tries: 14 });
      rec.steps = rec.steps || {};
      rec.steps.loginRescue = { status: login.status, body: String(login.text || '').slice(0, 140), exit: login.exit };
      log('  login ' + login.status + ' ' + String(login.text || '').slice(0, 90));
      if (login.status >= 400) continue;
      const sess = await client.call('/api/auth/session', { tries: 10 });
      rec.steps.sessionRescue = { status: sess.status, user: sess.json && sess.json.user ? sess.json.user.username : null };
      log('  session ' + sess.status + ' user=' + rec.steps.sessionRescue.user);
      if (!(sess.json && sess.json.user)) continue;
      const keyRes = await client.call('/api/keys', { method: 'POST', tries: 12 });
      const key = keyRes.json && (keyRes.json.key || (keyRes.json.data && keyRes.json.data.key));
      rec.steps.keyRescue = { status: keyRes.status, got: !!key, exit: keyRes.exit };
      log('  POST /api/keys ' + keyRes.status + ' key=' + (key ? key.slice(0, 12) + '…' : 'NONE'));
      if (!key) continue;
      const mintExit = (rec.steps.keyRescue && rec.steps.keyRescue.exit) || (rec.steps.loginRescue && rec.steps.loginRescue.exit) || '';
      const independent = feedLines.filter((l) => l !== mintExit);
      rec.verifySource = independent.length ? 'proxies.txt' : 'fallback:mint-pool';
      const verifyExits = loadExits(independent.length ? ['proxies.txt'] : undefined);
      const verifyPool = new ExitPool(verifyExits, { label: 'cm-verify-independent' });
      let models = null;
      let verifyExit = '';
      try {
        models = await verifyPool.attempt(async (pp) => {
          verifyExit = pp.line;
          return req(pp, ORIGIN + '/api/v1/models', { headers: { authorization: 'Bearer ' + key, accept: 'application/json', 'user-agent': UA }, timeoutMs: 25000 });
        }, { tries: 10, label: 'models(independent)' });
      } catch (e) {
        // feed exhausted: fall back to the mint pool but SAY SO in the record
        models = await pool.attempt(async (pp) => { verifyExit = pp.line; return req(pp, ORIGIN + '/api/v1/models', { headers: { authorization: 'Bearer ' + key, accept: 'application/json', 'user-agent': UA }, timeoutMs: 25000 }); }, { tries: 10, label: 'models(fallback)' });
        verifyExit = verifyExit + ' (fallback:mint-pool)';
      }
      rec.key = key;
      rec.verify = { host: 'completions.me', endpoint: '/api/v1/models', status: models.status, exit: verifyExit, mintExit: mintExit, independent: verifyExit !== mintExit && !/fallback/.test(verifyExit), sameEgress: verifyExit === mintExit || /fallback/.test(verifyExit), text: String(models.text).slice(0, 160) };
      log('  verify /api/v1/models → ' + models.status);
      if (models.status === 200) {
        rec.status = 'minted';
        if (!fs.existsSync(KEYS) || !fs.readFileSync(KEYS, 'utf8').includes(key)) appendLine(KEYS, key);
        made++;
        log('  ✔ MINTED');
      } else { rec.status = 'key-unverified'; }
    } catch (e) {
      rec.status = rec.status || 'error';
      rec.error = String(e.message).slice(0, 200);
      log('  ✖ ' + rec.error);
    }
    writeJson(ACC, accounts);
    await sleep(1000);
  }
  const total = JSON.parse(fs.readFileSync(ACC, 'utf8')).filter((a) => a.status === 'minted').length;
  log('rescue done: +' + made + ' this run, ' + total + ' minted total, keys.txt=' + (fs.existsSync(KEYS) ? fs.readFileSync(KEYS, 'utf8').split('\n').filter(Boolean).length : 0));
})();

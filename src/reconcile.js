#!/usr/bin/env node
'use strict';
/**
 * completions.me reconciliation: make keys.txt and accounts.json describe the
 * same set, with provenance per key — username, mint exit, verify exit, and an
 * explicit sameEgress flag — and mark any key whose account is genuinely
 * unknown instead of leaving it silently authoritative.
 *
 *   node src/reconcile.js
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
    return { loadExits: unavailable, ExitPool: unavailable, req: unavailable, nowIso: unavailable };
  }
})();
const { loadExits, ExitPool, req, nowIso } = engine;

const argv = process.argv.slice(2);
if (argv.includes('--help') || argv.includes('-h')) {
  console.log('usage: node src/reconcile.js   (no flags — rewrites keys.txt + accounts.json from the run logs)');
  process.exit(0);
}

const P = path.resolve(__dirname, '..'); // data root (the repo root)
const KEYS = path.join(P, 'keys.txt');
const ACC = path.join(P, 'accounts.json');
const OUT = path.join(P, 'out', 'reconcile.json');
const ORIGIN = 'https://completions.me';

/** accounts.json and keys.txt come from a run — say what is missing instead of
 *  spilling a raw ENOENT trace in a fresh clone. */
const readOrExit = (file) => {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) {
    console.error(`${path.basename(file)} not found at ${file} — mint a batch first (node src/mint-node.js), then re-run this tool`);
    process.exit(2);
  }
};

const accounts = JSON.parse(readOrExit(ACC));
const keyLines = readOrExit(KEYS).split('\n').filter((l) => l.trim());
const keys = keyLines.map((l) => l.split(/\s+#/)[0].trim()).filter((l) => l && !l.startsWith('#'));
const comments = new Map();
for (const l of keyLines) { const m = l.split(/\s+#\s?/); if (m[1]) comments.set(m[0].trim(), m[1]); }

// 1) mine the run logs for username <-> key provenance lost to the write race
const logBlob = ['out/rescue.log', 'out/mint-node.log', 'out/mint-node2.log', 'out/mint-scale.log', 'out/rescue-launch.log', 'out/rescue2-launch.log', 'out/rescue3-launch.log']
  .map((f) => { try { return fs.readFileSync(path.join(P, f), 'utf8'); } catch (e) { return ''; } })
  .join('\n');
const logPairs = [];
{
  let current = null;
  for (const line of logBlob.split('\n')) {
    const u = line.match(/^\[[^\]]+\]\s+#(\d+)\s+(\S+)/);
    if (u) current = { index: parseInt(u[1], 10), username: u[2] };
    const k = line.match(/key=(sk-cp_[A-Za-z0-9_\-]+)/);
    if (k) logPairs.push({ key: k[1], username: current && current.username, index: current && current.index, line: line.slice(0, 120) });
    const k2 = line.match(/{"key":"(sk-cp_[A-Za-z0-9_\-]+)"/);
    if (k2) logPairs.push({ key: k2[1], username: current && current.username, index: current && current.index, line: line.slice(0, 120) });
  }
}

let maxIdx = accounts.reduce((m, a) => Math.max(m, a.index || 0), 0);
const pool = new ExitPool(loadExits(['proxies.txt', 'proxies.txt', 'proxies.txt', 'proxies.txt']), { label: 'reconcile' });

(async () => {
  const rows = [];
  for (const key of keys) {
    let rec = accounts.find((a) => a.key === key);
    let source = 'record';
    if (!rec) {
      const hit = logPairs.find((p) => p.key === key);
      rec = {
        provider: 'completions-me', index: ++maxIdx, key, status: 'minted', created: nowIso(),
        username: hit && hit.username ? hit.username : null,
        note: hit && hit.username ? 'record reconstructed from rescue log (username recovered)' : 'record reconstructed during reconcile (account unknown)',
      };
      accounts.push(rec);
      source = hit && hit.username ? 'log-mined' : 'reconstructed-unknown';
    }
    const mintExit = (rec.verify && rec.verify.mintExit) || (rec.steps && rec.steps.keyRescue && rec.steps.keyRescue.exit) || '';
    let st = 0; let n = 0; let exitLine = '';
    for (let pass = 0; pass < 2 && st !== 200; pass++) {
      try {
        const r = await pool.attempt(async (p) => { exitLine = p.line; return req(p, ORIGIN + '/api/v1/models', { headers: { authorization: 'Bearer ' + key, accept: 'application/json' }, timeoutMs: 25000 }); }, { tries: 6, label: 'verify' });
        st = r.status; n = (String(r.text).match(/"id":/g) || []).length;
      } catch (e) { st = 0; }
    }
    const independent = !!exitLine && exitLine !== mintExit;
    rec.verify = { host: 'completions.me', endpoint: '/api/v1/models', status: st, exit: exitLine, mintExit: mintExit, independent: independent, sameEgress: !!exitLine && !independent, models: n };
    if (st === 200) rec.status = 'minted';
    if (!rec.username) comments.set(key, 'provenance unknown — minted by rescue, account record lost');
    rows.push({ key: key.slice(0, 18) + '…', record: rec.username || 'MISSING', index: rec.index, source, verifyExit: exitLine || '-', mintExit: mintExit || '-', status: st, models: n, sameEgress: !!exitLine && !independent });
  }

  // 2) honour the honest-marking rule in the key file itself
  const rewritten = keyLines
    .map((l) => {
      const k = l.split(/\s+#/)[0].trim();
      if (!k || k.startsWith('#')) return l; // a standalone comment is not a key
      return comments.has(k) ? k + '  # ' + comments.get(k) : k;
    })
    .join('\n') + '\n';
  fs.writeFileSync(KEYS, rewritten, { mode: 0o600 });
  fs.writeFileSync(ACC, JSON.stringify(accounts, null, 2), { mode: 0o600 });

  // 3) re-run the uniqueness assertion over the now-complete record set
  const names = accounts.map((a) => a.username).filter(Boolean);
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  const summary = {
    at: nowIso(), keys: keys.length, records: accounts.length,
    withVerify200: accounts.filter((a) => a.verify && a.verify.status === 200).length,
    independent: accounts.filter((a) => a.verify && a.verify.independent).length,
    sameEgress: accounts.filter((a) => a.verify && a.verify.sameEgress).length,
    usernameDupes: dupes, uniquenessHolds: dupes.length === 0, rows,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 1).slice(0, 2600));
})();

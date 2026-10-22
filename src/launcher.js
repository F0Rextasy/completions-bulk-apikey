#!/usr/bin/env node
'use strict';

/**
 * Interactive launcher for completions-bulk-apikey — a menu over the task modules.
 * Settings persist in launcher.config.json next to this file.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..'); // data root (the repo root)
const CONFIG = path.join(ROOT, 'launcher.config.json');
const POOL = path.join(ROOT, 'proxies.txt');
const KEYS = path.join(ROOT, 'keys.txt');

const defaults = { count: 30, conc: 2 };
let cfg = { ...defaults };
try { Object.assign(cfg, JSON.parse(fs.readFileSync(CONFIG, 'utf8'))); } catch (e) {}
const save = () => fs.writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n');
const ARGS = {"mint":["--count","count","--pool","proxies.txt"],"finish":[],"verify":["--file","keys.txt","--conc","conc"]};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, fb) => new Promise((r) => rl.question(q + (fb !== undefined ? ' [' + fb + ']' : '') + ': ', (a) => r(String(a).trim() || fb)));

const LOGO = String.raw`
   ██████╗   ██████╗  ███╗   ███╗ ██████╗  ██╗      ███████╗ ████████╗ ██╗  ██████╗  ███╗   ██╗ ███████╗      ███╗   ███╗ ███████╗
  ██╔════╝  ██╔═══██╗ ████╗ ████║ ██╔══██╗ ██║      ██╔════╝ ╚══██╔══╝ ██║ ██╔═══██╗ ████╗  ██║ ██╔════╝      ████╗ ████║ ██╔════╝
  ██║       ██║   ██║ ██╔████╔██║ ██████╔╝ ██║      █████╗      ██║    ██║ ██║   ██║ ██╔██╗ ██║ ███████╗      ██╔████╔██║ █████╗
  ██║       ██║   ██║ ██║╚██╔╝██║ ██╔═══╝  ██║      ██╔══╝      ██║    ██║ ██║   ██║ ██║╚██╗██║ ╚════██║      ██║╚██╔╝██║ ██╔══╝
  ╚██████╗  ╚██████╔╝ ██║ ╚═╝ ██║ ██║      ███████╗ ███████╗    ██║    ██║ ╚██████╔╝ ██║ ╚████║ ███████║ ██╗  ██║ ╚═╝ ██║ ███████╗
   ╚═════╝   ╚═════╝  ╚═╝     ╚═╝ ╚═╝      ╚══════╝ ╚══════╝    ╚═╝    ╚═╝  ╚═════╝  ╚═╝  ╚══╝ ╚══════╝ ╚═╝  ╚═╝     ╚═╝ ╚══════╝
`;

function banner() {
  const w = 78;
  const box = (s) => '  │ ' + s.padEnd(w) + ' │';
  console.log(LOGO);
  console.log('  ┌' + '─'.repeat(w + 2) + '┐');
  console.log(box('completions-bulk-apikey  ·  one account per key, live-verified'));
  console.log(box('completions-bulk-apikey contributors · MIT'));
  console.log('  └' + '─'.repeat(w + 2) + '┘\n');
}

const count = (f) => { try { return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#')).length; } catch (e) { return 0; } };

function run(args) {
  const [file, ...rest] = args;
  console.log('\n▶ node src/' + args.join(' ') + '\n');
  const r = spawnSync(process.execPath, [path.join(__dirname, file), ...rest], { windowsHide: true, cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) console.log('\n⚠ exited with code ' + r.status);
}

function argsFor(task) {
  const spec = ARGS[task] || [];
  return spec.map((v) => (v === 'count' ? String(cfg.count) : v === 'conc' ? String(cfg.conc) : v));
}

async function settings() {
  console.log('\nSettings');
  console.log('  1) count      ' + cfg.count);
  console.log('  2) conc       ' + cfg.conc);
  console.log('  0) back');
  const p = await ask('choose', '0');
  if (p === '1') cfg.count = parseInt(await ask('count', cfg.count), 10) || cfg.count;
  if (p === '2') cfg.conc = parseInt(await ask('concurrency', cfg.conc), 10) || cfg.conc;
  save();
}

async function nineRouter() {
  console.log('\n9Router — register the keys in keys.txt as one connection each');
  const base = await ask('9Router base URL', 'http://localhost:20128');
  const password = await ask('9Router password', '123456');
  const file = await ask('Key file to register (one key per line)', 'keys.txt');
  const model = await ask('Default model for the connection', 'claude-sonnet-4.6');
  console.log('\n▶ node src/connect-9router.js --base ' + base + ' --keys-file ' + file + ' --model ' + model + '\n');
  const r = spawnSync(process.execPath, [path.join(__dirname, 'connect-9router.js'), '--base', base, '--password', password, '--keys-file', file, '--model', model], { windowsHide: true, cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) console.log('\n⚠ exited with code ' + r.status);
}

async function main() {
  if (process.argv.includes('--connect-9router')) {
    await nineRouter();
    rl.close();
    return;
  }

  if (process.argv.includes('--connect-omniroute')) {
    await omniRouter();
    rl.close();
    return;
  }
  process.stdout.write('\x1b[2J\x1b[H');
  banner();
  console.log('  proxy exits: ' + (count(POOL) || 'none — running WITHOUT a proxy (direct)') + '     keys on disk: ' + count(KEYS) + '\n');
  console.log('  1) mint      create fresh accounts and mint one key each');
  console.log('  2) finish    log in to accounts already created and finish their key');
  console.log('  3) verify    re-check keys that are already on disk');
  console.log('  4) Settings');
  console.log('  5) 9Router   register the keys in keys.txt with a 9Router instance');
  console.log('  0) Exit\n');
  const choice = await ask('choose', '1');
  if (choice === '1') {
    run(['mint-node.js', ...argsFor('mint')]);
  }
  else if (choice === '2') {
    run(['rescue.js', ...argsFor('finish')]);
  }
  else if (choice === '3') {
    run(['verify.js', ...argsFor('verify')]);
  }
  else if (choice === '4') {
    await settings();
  }
  else if (choice === '5') {
    await nineRouter();
  } else {
    rl.close();
    return;
  }
  await ask('\npress enter for the menu', '');
  return main();
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Interactive launcher: run `node src/launcher.js` and pick a menu item.');
  process.exit(0);
}

main().catch((e) => { console.error('launcher failed:', e.stack || e.message); process.exit(1); });

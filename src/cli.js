#!/usr/bin/env node
'use strict';

/**
 * Command dispatcher for completions-bulk-apikey.
 *
 *   node src/cli.js mint     create fresh accounts and mint one key each
 *   node src/cli.js finish   log in to accounts already created and finish their key
 *   node src/cli.js verify   re-check keys that are already on disk
 *   node src/cli.js 9router  register the keys in keys.txt with a 9Router instance
 *   node src/cli.js help
 * Presets (operator standard v3): `--preset=turbo|balanced|safe` on mint picks
 * workers + the pause; explicit flags win; absent = today's defaults.
 *
 * Every task spawns the matching module in this folder, so a crash in one run
 * never leaves state behind in this process.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const TASKS = {
  mint: { file: 'mint-node.js', note: 'create fresh accounts and mint one key each' },
  finish: { file: 'rescue.js', note: 'log in to accounts already created and finish their key' },
  verify: { file: 'verify.js', note: 're-check keys that are already on disk' },
  '9router': { file: 'connect-9router.js', note: 'register the keys in keys.txt with a 9Router instance' },
};

/**
 * `--dry`: the resolved plan, then exit 0 — the dispatcher never spawns a task
 * module, so nothing is written and no request is sent.
 */
if (process.argv.includes('--dry')) {
  const dryArgv = process.argv.slice(2);
  const val = (name, dflt) => {
    const i = dryArgv.indexOf(name);
    return i >= 0 && dryArgv[i + 1] && !dryArgv[i + 1].startsWith('--') ? dryArgv[i + 1] : dflt;
  };
  const poolFile = val('--pool', 'proxies.txt');
  const exits = (() => {
    try {
      return fs.readFileSync(path.resolve(__dirname, '..', poolFile), 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#')).length;
    } catch (e) {
      return 0;
    }
  })();
  console.log('completions dry run — nothing is written and no request is sent.');
  console.log(`  task     ${dryArgv[0] && !dryArgv[0].startsWith('--') ? dryArgv[0] : 'mint'}`);
  console.log(`  count    ${val('--count', '3')} key(s)`);
  console.log(`  pool     ${exits ? `${exits} exit(s) from ${poolFile}` : `direct (no usable exit in ${poolFile})`}`);
  console.log('  keys     keys.txt · verify writes dead keys to keys-dead.txt');
  process.exit(0);
}

function help() {
  console.log('completions-bulk-apikey — one account per key, live-verified\n');
  console.log('usage: node src/cli.js <task> [options]\n');
  console.log('tasks:');
  for (const [name, t] of Object.entries(TASKS)) console.log('  ' + name.padEnd(9) + ' ' + t.note);
  console.log('\noptions: every task takes its own flags — ask it directly:');
  console.log('  node src/<task-file> --help');
  console.log('\nproxy pool:');
  console.log('  one exit per line in proxies.txt — scheme://host:port[#comment], user:pass@ supported');
  console.log('\nno options? run the interactive launcher:  node src/launcher.js');
  console.log('  --preset=turbo|balanced|safe  run shape for mint (turbo = 5 workers)');
}

const argv = process.argv.slice(2);
// A leading flag IS the task (`--count 3` = mint), so only a real task name is dropped.
const task = argv[0] === '--connect-9router' ? '9router'
  : argv[0] && argv[0].startsWith('--') && !['--help', '-h'].includes(argv[0]) ? 'mint'
    : argv[0];
if (!task || task === 'help' || task === '--help' || task === '-h') {
  help();
  process.exit(0);
}
const entry = TASKS[task];
if (!entry) {
  console.error('unknown task: ' + task + '\n');
  help();
  process.exit(1);
}
const childArgs = (argv[0] === task || argv[0] === '--connect-9router') ? argv.slice(1) : argv;
const child = spawnSync(process.execPath, [path.join(__dirname, entry.file), ...childArgs], {
  windowsHide: true,
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  env: process.env,
});
process.exit(child.status === null ? 1 : child.status);

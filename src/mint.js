#!/usr/bin/env node
'use strict';
// Re-runnable mint for this provider; gates + engine live in ../config.json.
process.argv.push('--name', require('path').basename(require('path').resolve(__dirname, '..')));
try {
  require('../../_community/provider-cli.js');
} catch (e) {
  console.error('mint: this entry point needs the workspace engine (../../_community/provider-cli.js) — a fresh clone of this repo does not ship it');
  process.exit(2);
}

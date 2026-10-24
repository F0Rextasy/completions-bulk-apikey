#!/usr/bin/env node
'use strict';
// Re-runnable mint for this provider — the same engine the `mint` task of
// src/cli.js runs (`--count N`, `--pool FILE`, `--preset=turbo|balanced|safe`,
// and every other flag is parsed by src/mint-node.js).
require('./mint-node.js');

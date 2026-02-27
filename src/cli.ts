#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getVersion } from './lib/utils.js';
import { latestCommand } from './commands/latest.js';
import { dsexCommand } from './commands/dsex.js';
import { top30Command } from './commands/top30.js';
import { historicalCommand } from './commands/historical.js';

const program = new Command();

program
  .name('dse-ai')
  .description('AI-friendly CLI for Dhaka Stock Exchange data - Scrapes from dsebd.org')
  .version(getVersion());

latestCommand(program);
dsexCommand(program);
top30Command(program);
historicalCommand(program);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

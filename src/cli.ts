#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getVersion } from './lib/utils.js';

const program = new Command();

program
  .name('dse-ai')
  .description('AI-friendly CLI for DSentiment APIs - Dhaka Stock Exchange data')
  .version(getVersion());

// Commands will be added here

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

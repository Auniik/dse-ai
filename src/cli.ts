#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getVersion } from './lib/utils.js';
import { latestCommand } from './commands/latest.js';
import { dsexCommand } from './commands/dsex.js';
import { top30Command } from './commands/top30.js';
import { top20Command } from './commands/top20.js';
import { historicalCommand } from './commands/historical.js';
import { gainersCommand } from './commands/gainers.js';
import { losersCommand } from './commands/losers.js';
import { companyCommand } from './commands/company.js';
import { marketStatsCommand } from './commands/market-stats.js';

const program = new Command();

program
  .name('dse-ai')
  .description('AI-friendly CLI for Dhaka Stock Exchange data - Scrapes from dsebd.org')
  .version(getVersion());

latestCommand(program);
dsexCommand(program);
top30Command(program);
top20Command(program);
historicalCommand(program);
gainersCommand(program);
losersCommand(program);
program.addCommand(companyCommand);
marketStatsCommand(program);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

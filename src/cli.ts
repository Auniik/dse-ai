#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getVersion } from './lib/utils.js';
import { authCommand } from './commands/auth.js';
import { whoamiCommand } from './commands/whoami.js';
import { logoutCommand } from './commands/logout.js';

const program = new Command();

program
  .name('dse-ai')
  .description('AI-friendly CLI for DSentiment APIs')
  .version(getVersion());

authCommand(program);
whoamiCommand(program);
logoutCommand(program);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

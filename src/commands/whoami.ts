import type { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from '../lib/utils.js';

export function whoamiCommand(program: Command): void {
  program
    .command('whoami')
    .description('Display current authentication information')
    .action(() => {
      const auth = loadConfig('auth');

      if (!auth) {
        console.log(chalk.yellow('\n⚠️  Not authenticated'));
        console.log(chalk.gray('Run: dse-ai auth\n'));
        return;
      }

      console.log(chalk.blue('\n👤 Current Authentication:\n'));
      console.log(chalk.white('API URL:'), chalk.cyan(auth.apiUrl || 'Not set'));
      console.log(chalk.white('API Key:'), chalk.cyan('***' + auth.apiKey.slice(-4)));
      console.log(chalk.white('Authenticated:'), chalk.green(auth.timestamp));
      console.log();
    });
}

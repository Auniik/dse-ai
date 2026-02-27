import type { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { deleteConfig, loadConfig } from '../lib/utils.js';

export function logoutCommand(program: Command): void {
  program
    .command('logout')
    .description('Remove stored credentials')
    .action(async () => {
      const auth = loadConfig('auth');

      if (!auth) {
        console.log(chalk.yellow('\n⚠️  Not authenticated\n'));
        return;
      }

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to logout?',
          default: false,
        },
      ]);

      if (confirm) {
        deleteConfig('auth');
        console.log(chalk.green('\n✓ Logged out successfully\n'));
      } else {
        console.log(chalk.gray('\nLogout cancelled\n'));
      }
    });
}

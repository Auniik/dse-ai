import type { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { saveConfig, loadConfig, getApiBaseUrl } from '../lib/utils.js';

export function configCommand(program: Command): void {
  program
    .command('config')
    .description('Configure API settings')
    .option('-s, --show', 'Show current configuration')
    .option('-u, --url <url>', 'Set API base URL')
    .action(async (options) => {
      if (options.show) {
        const baseUrl = getApiBaseUrl();
        console.log(chalk.blue('\n⚙️  Current Configuration:\n'));
        console.log(chalk.white('API Base URL:'), chalk.cyan(baseUrl));
        console.log();
        return;
      }

      if (options.url) {
        saveConfig('config', { baseUrl: options.url });
        console.log(chalk.green(`\n✓ API Base URL set to: ${options.url}\n`));
        return;
      }

      // Interactive config
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseUrl',
          message: 'Enter API Base URL:',
          default: getApiBaseUrl(),
          validate: (input: string) => {
            try {
              new URL(input);
              return true;
            } catch {
              return 'Please enter a valid URL';
            }
          },
        },
      ]);

      saveConfig('config', { baseUrl: answers.baseUrl });
      console.log(chalk.green('\n✓ Configuration saved!\n'));
    });
}

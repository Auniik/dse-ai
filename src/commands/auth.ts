import type { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { saveConfig } from '../lib/utils.js';

export function authCommand(program: Command): void {
  program
    .command('auth')
    .description('Authenticate with DSentiment API')
    .action(async () => {
      console.log(chalk.blue('\n🔐 DSentiment Authentication\n'));

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'apiKey',
          message: 'Enter your DSentiment API key:',
          validate: (input: string) => {
            if (!input || input.trim().length === 0) {
              return 'API key cannot be empty';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'apiUrl',
          message: 'Enter API URL (optional):',
          default: 'https://api.dsentiment.com',
        },
      ]);

      const spinner = ora('Validating credentials...').start();

      try {
        // TODO: Add actual API validation call here
        await new Promise(resolve => setTimeout(resolve, 1000));

        saveConfig('auth', {
          apiKey: answers.apiKey,
          apiUrl: answers.apiUrl,
          timestamp: new Date().toISOString(),
        });

        spinner.succeed(chalk.green('Authentication successful!'));
        console.log(chalk.gray('\nCredentials saved to ~/.dse-ai/auth.json'));
      } catch (error) {
        spinner.fail(chalk.red('Authentication failed'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });
}

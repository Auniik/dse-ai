import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatStockTable, formatToon } from '../lib/formatter.js';

export function latestCommand(program: Command): void {
  program
    .command('latest')
    .description('Get latest stock data for all instruments')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options) => {
      const spinner = ora('Fetching latest stock data...').start();

      try {
        const client = new DseApiClient();
        const data = await client.getLatest();

        spinner.succeed(chalk.green('Data fetched successfully!'));

        if (options.json) {
          console.log(JSON.stringify(data, null, 2));
        } else if (options.markdown) {
          const { formatMarkdown } = await import('../lib/formatter.js');
          console.log(formatMarkdown(data));
        } else if (options.toon) {
          console.log(formatToon(data));
        } else {
          console.log(formatStockTable(data, '📊 Latest Stock Data'));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });
}

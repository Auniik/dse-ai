import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatStockTable, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

export function createLosersCommand() {
  const command = new Command('losers');

  command
    .description('Get top 10 losers of the day')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options: FormatOptions) => {
      const spinner = ora('Fetching top losers...').start();

      try {
        const client = new DseApiClient();
        const result = await client.getLosers();

        if (result.data.length === 0) {
          spinner.warn(chalk.yellow('No losers data found'));
          return;
        }

        spinner.succeed(chalk.green('Data fetched successfully!'));

        if (options.json) {
          console.log(formatJson(result.data));
        } else if (options.markdown) {
          console.log(formatMarkdown(result.data));
        } else if (options.toon) {
          console.log(formatToon(result.data));
        } else {
          const title = result.date || 'Top 10 Losers';
          console.log(formatStockTable(result.data, `📉 ${title}`));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });

  return command;
}

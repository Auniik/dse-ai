import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatStockTable, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

interface HistoricalOptions extends FormatOptions {
  start: string;
  end: string;
  inst?: string;
}

export function createHistoricalCommand() {
  const command = new Command('historical');

  command
    .description('Get historical stock data for a date range')
    .requiredOption('-s, --start <date>', 'Start date (YYYY-MM-DD)')
    .requiredOption('-e, --end <date>', 'End date (YYYY-MM-DD)')
    .option('-i, --inst <symbol>', 'Trading code/symbol (default: All Instrument)')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options: HistoricalOptions) => {
      const spinner = ora(
        `Fetching historical data from ${options.start} to ${options.end}...`
      ).start();

      try {
        const client = new DseApiClient();
        const result = await client.getHistorical(
          options.start,
          options.end,
          options.inst
        );

        if (result.data.length === 0) {
          spinner.warn(chalk.yellow('No data found for the specified date range'));
          return;
        }

        spinner.succeed(chalk.green('Data fetched successfully!'));

        if (options.json) {
          console.log(JSON.stringify(result.data, null, 2));
        } else if (options.markdown) {
          const { formatMarkdown } = await import('../lib/formatter.js');
          console.log(formatMarkdown(result.data));
        } else if (options.toon) {
          console.log(formatToon(result.data));
        } else {
          const title = result.date || 'Historical Data';
          console.log(formatStockTable(result.data, `📊 ${title}`));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });

  return command;
}

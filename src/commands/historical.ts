import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatStockTable, formatToon } from '../lib/formatter.js';

export function historicalCommand(program: Command): void {
  program
    .command('historical')
    .description('Get historical stock data for a date range')
    .requiredOption('-s, --start <date>', 'Start date (YYYY-MM-DD)')
    .requiredOption('-e, --end <date>', 'End date (YYYY-MM-DD)')
    .option('-i, --inst <symbol>', 'Trading code/symbol (default: All Instrument)')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options) => {
      const spinner = ora(
        `Fetching historical data from ${options.start} to ${options.end}...`
      ).start();

      try {
        const client = new DseApiClient();
        const data = await client.getHistorical(
          options.start,
          options.end,
          options.inst
        );

        if (data.length === 0) {
          spinner.warn(chalk.yellow('No data found for the specified date range'));
          return;
        }

        spinner.succeed(chalk.green('Data fetched successfully!'));

        if (options.json) {
          console.log(JSON.stringify(data, null, 2));
        } else if (options.markdown) {
          const { formatMarkdown } = await import('../lib/formatter.js');
          console.log(formatMarkdown(data));
        } else if (options.toon) {
          console.log(formatToon(data));
        } else {
          const title = options.inst
            ? `📅 Historical Data - ${options.inst} (${options.start} to ${options.end})`
            : `📅 Historical Data (${options.start} to ${options.end})`;
          console.log(formatStockTable(data, title));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });
}

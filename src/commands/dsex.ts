import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatStockTable, formatToon } from '../lib/formatter.js';

export function createDsexCommand() {
  const command = new Command('dsex');

  command
    .description('Get DSEX market data with optional symbol filter')
    .argument('[symbol]', 'Optional trading symbol to filter')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (symbol, options) => {
      const spinner = ora(
        symbol 
          ? `Fetching DSEX data for ${symbol}...`
          : 'Fetching DSEX market data...'
      ).start();

      try {
        const client = new DseApiClient();
        const result = await client.getDsex(symbol);

        if (result.data.length === 0) {
          spinner.warn(chalk.yellow(`No data found${symbol ? ` for symbol: ${symbol}` : ''}`));
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
          const title = result.date || (symbol ? `DSEX Data - ${symbol}` : 'DSEX Market Data');
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

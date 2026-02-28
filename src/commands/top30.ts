import type { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatStockTable, formatToon } from '../lib/formatter.js';

export function top30Command(program: Command): void {
  program
    .command('top30')
    .description('Get top 30 performing stocks')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options) => {
      const spinner = ora('Fetching top 30 stocks...').start();

      try {
        const client = new DseApiClient();
        const result = await client.getTop30();

        spinner.succeed(chalk.green('Data fetched successfully!'));

        if (options.json) {
          console.log(JSON.stringify(result.data, null, 2));
        } else if (options.markdown) {
          const { formatMarkdown } = await import('../lib/formatter.js');
          console.log(formatMarkdown(result.data));
        } else if (options.toon) {
          console.log(formatToon(result.data));
        } else {
          const title = result.date || 'Top 30 Stocks';
          console.log(formatStockTable(result.data, `📊 ${title}`));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });
}

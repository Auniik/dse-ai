import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatStockTable, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

export function createGainersCommand() {
  const command = new Command('gainers');

  command
    .description('Get top 10 gainers of the day')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options: FormatOptions) => {
      const spinner = ora('Fetching top gainers...').start();

      try {
        const client = new DseApiClient();
        const result = await client.getGainers();

        if (result.data.length === 0) {
          spinner.warn(chalk.yellow('No gainers data found'));
          return;
        }

        spinner.stop();

        if (options.json) {
          console.log(formatJson({ data: result.data, date: result.date }));
        } else if (options.markdown) {
          console.log(formatMarkdown(result.data));
        } else if (options.toon) {
          console.log(formatToon({ data: result.data, date: result.date }));
        } else {
          const title = result.date || 'Top 10 Gainers';
          console.log(formatStockTable(result.data, `📈 ${title}`));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });

  return command;
}

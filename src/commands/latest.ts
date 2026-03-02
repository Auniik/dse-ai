import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatStockTable, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';
import type { LatestType } from '../lib/scrapers/latest-scraper.js';

const SORT_DESCRIPTIONS: Record<LatestType, string> = {
  'trade-code': 'By Trading Code (default)',
  'change': 'By % Change',
  'value': 'By Value',
  'volume': 'By Volume',
  'ltp': 'By Last Trade Price',
  'alpha': 'Alphabetically',
  'debt': 'Debt Board (Treasury Bonds)',
};

interface LatestOptions extends FormatOptions {
  byChange?: boolean;
  byValue?: boolean;
  byVolume?: boolean;
  byLtp?: boolean;
  alpha?: boolean;
  debt?: boolean;
}

export function createLatestCommand() {
  const command = new Command('latest');

  command
    .description('Get latest stock data for all instruments')
    .option('--by-change', 'Sort by % change')
    .option('--by-value', 'Sort by value')
    .option('--by-volume', 'Sort by volume')
    .option('--by-ltp', 'Sort by last trade price')
    .option('--alpha', 'Sort alphabetically')
    .option('--debt', 'Show debt board (treasury bonds)')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options: LatestOptions) => {
      // Determine sort type
      let type: LatestType = 'trade-code';
      if (options.byChange) type = 'change';
      else if (options.byValue) type = 'value';
      else if (options.byVolume) type = 'volume';
      else if (options.byLtp) type = 'ltp';
      else if (options.alpha) type = 'alpha';
      else if (options.debt) type = 'debt';

      const spinner = ora(`Fetching latest stock data (${SORT_DESCRIPTIONS[type]})...`).start();

      try {
        const client = new DseApiClient();
        const result = await client.getLatest(type);

        spinner.stop();

        if (options.json) {
          console.log(formatJson({ data: result.data, date: result.date }));
        } else if (options.markdown) {
          console.log(formatMarkdown(result.data));
        } else if (options.toon) {
          console.log(formatToon({ data: result.data, date: result.date }));
        } else {
          const title = result.date || `Latest Stock Data - ${SORT_DESCRIPTIONS[type]}`;
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

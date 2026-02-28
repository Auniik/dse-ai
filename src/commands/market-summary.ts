import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatStockTable, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

interface MarketSummaryOptions extends FormatOptions {
  records?: boolean;
  recent?: boolean;
  days?: string;
}

export function createMarketSummaryCommand() {
  const command = new Command('market-summary');

  command
  .alias('summary')
  .description('Get recent market information and highest records')
  .option('--records', 'Show only highest records')
  .option('--recent', 'Show only recent daily data')
  .option('--days <number>', 'Limit recent data to N days (default: 10)', '10')
  .option('-j, --json', 'Output as JSON')
  .option('-m, --markdown', 'Output as Markdown')
  .option('-t, --toon', 'Output as TOON (compact for LLMs)')
  .action(async (options: MarketSummaryOptions) => {
    const spinner = ora('Fetching market summary...').start();
    const client = new DseApiClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';
      const { highestRecords, recentData } = await client.getMarketSummary();
      
      const showRecords = options.records || (!options.recent && !options.records);
      const showRecent = options.recent || (!options.recent && !options.records);
      const daysLimit = parseInt(options.days || '10', 10);

      spinner.succeed(chalk.green(`Fetched market summary data`));

      if (format === 'json') {
        const output: any = {};
        if (showRecords) output.highestRecords = highestRecords;
        if (showRecent) output.recentData = recentData.slice(0, daysLimit);
        console.log(formatJson(output));
      } else if (format === 'markdown') {
        if (showRecords) {
          console.log('# Highest Records\n');
          console.log(formatMarkdown(highestRecords as any));
          console.log();
        }
        if (showRecent) {
          console.log('# Recent Market Information\n');
          console.log(formatMarkdown(recentData.slice(0, daysLimit) as any));
        }
      } else if (format === 'toon') {
        const output: any = {};
        if (showRecords) output.highestRecords = highestRecords;
        if (showRecent) output.recentData = recentData.slice(0, daysLimit);
        console.log(formatToon(output));
      } else {
        // Table format
        if (showRecords) {
          console.log(chalk.bold.cyan('\n🏆 Highest Records (All-Time Peaks)\n'));
          
          const { default: Table } = await import('cli-table3');
          const table = new Table({
            head: [chalk.bold('Metric'), chalk.bold('Value'), chalk.bold('Date')],
            style: {
              head: ['cyan'],
              border: ['gray'],
            },
            colWidths: [50, 20, 15],
          });

          highestRecords.forEach(record => {
            table.push([
              record.metric,
              chalk.yellow(record.value),
              chalk.gray(record.date),
            ]);
          });

          console.log(table.toString());
          console.log(chalk.gray(`\nTotal: ${highestRecords.length} records\n`));
        }

        if (showRecent) {
          const limitedData = recentData.slice(0, daysLimit);
          console.log(chalk.bold.cyan(`\n📊 Recent Market Information (Last ${limitedData.length} Days)\n`));
          console.log(formatStockTable(limitedData as any));
          console.log(chalk.gray(`\nShowing ${limitedData.length} of ${recentData.length} days`));
          if (recentData.length > daysLimit) {
            console.log(chalk.dim(`Tip: Use --days ${recentData.length} to see all available data`));
          }
        }
      }
    } catch (error: any) {
      spinner.fail(chalk.red('Failed to fetch market summary'));
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

  return command;
}

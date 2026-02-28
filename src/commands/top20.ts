import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatStockTable, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

interface Top20Options extends FormatOptions {
  value?: boolean;
  volume?: boolean;
  trade?: boolean;
}

export function createTop20Command() {
  const command = new Command('top20');

  command
    .description('Get top 20 shares by value, volume, or trade')
    .option('-v, --value', 'Show top 20 by value (default: show all)')
    .option('-o, --volume', 'Show top 20 by volume')
    .option('-t, --trade', 'Show top 20 by trade')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options: Top20Options) => {
      const spinner = ora('Fetching top 20 shares...').start();

      try {
        const client = new DseApiClient();
        
        // Determine which type to fetch
        let type: 'value' | 'volume' | 'trade' | undefined;
        if (options.value) type = 'value';
        else if (options.volume) type = 'volume';
        else if (options.trade) type = 'trade';

        const data = await client.getTop20(type);

        spinner.succeed(chalk.green('Data fetched successfully!'));

        // Output based on format
        if (options.json) {
          if (type) {
            const result = data as { data: any[]; date: string };
            console.log(formatJson(result.data));
          } else {
            console.log(formatJson(data));
          }
        } else if (options.markdown) {
          if (type) {
            const result = data as { data: any[]; date: string };
            console.log(formatMarkdown(result.data));
          } else {
            const allData = data as { value: { data: any[]; date: string }; volume: { data: any[]; date: string }; trade: { data: any[]; date: string } };
            console.log(`## Top 20 by Value (${allData.value.date})\n`);
            console.log(formatMarkdown(allData.value.data));
            console.log(`\n## Top 20 by Volume (${allData.volume.date})\n`);
            console.log(formatMarkdown(allData.volume.data));
            console.log(`\n## Top 20 by Trade (${allData.trade.date})\n`);
            console.log(formatMarkdown(allData.trade.data));
          }
        } else if (options.toon) {
          console.log(formatToon(data));
        } else {
          // Table format
          if (type) {
            const result = data as { data: any[]; date: string };
            const title = result.date || 'Top 20 Shares';
            console.log(formatStockTable(result.data, `📊 ${title}`));
          } else {
            const allData = data as { value: { data: any[]; date: string }; volume: { data: any[]; date: string }; trade: { data: any[]; date: string } };
            console.log(formatStockTable(allData.value.data, `📊 ${allData.value.date}`));
            console.log('\n');
            console.log(formatStockTable(allData.volume.data, `📊 ${allData.volume.date}`));
            console.log('\n');
            console.log(formatStockTable(allData.trade.data, `📊 ${allData.trade.date}`));
          }
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
        process.exit(1);
      }
    });

  return command;
}

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatStockTable, formatToon, formatMarkdown } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

interface CircuitOptions extends FormatOptions {
  upper?: boolean;
  lower?: boolean;
  all?: boolean;
}

export function createCircuitCommand() {
  const command = new Command('circuit');

  command
    .description('Get circuit breaker status and limits')
    .option('--upper', 'Show only upper circuit breaker hits')
    .option('--lower', 'Show only lower circuit breaker hits')
    .option('--all', 'Show all circuit breaker limits (default)')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options: CircuitOptions) => {
      const spinner = ora('Fetching circuit breaker data...').start();

      try {
        const client = new DseApiClient();
        let result;
        let title = 'Circuit Breaker Status';
        
        if (options.upper) {
          result = await client.getCircuitBreakersHit('upper');
          title = '🔺 Upper Circuit Breaker Hits';
        } else if (options.lower) {
          result = await client.getCircuitBreakersHit('lower');
          title = '🔻 Lower Circuit Breaker Hits';
        } else if (options.all) {
          result = await client.getCircuitBreakers();
          title = '📋 All Circuit Breaker Limits';
        } else {
          // Default: show both hits
          result = await client.getCircuitBreakersHit('both');
          title = '⚡ Circuit Breaker Hits';
        }

        spinner.stop();

        const { data, date } = result;
        const dateHeader = date ? `${title} - ${date}` : title;

        if (options.toon) {
          console.log(formatToon(data));
          return;
        }

        if (options.json) {
          console.log(JSON.stringify(data, null, 2));
          return;
        }

        if (options.markdown) {
          console.log(`# ${dateHeader}\n`);
          console.log(formatMarkdown(data as any));
          return;
        }

        // Default: Table format
        if (data.length === 0) {
          console.log(chalk.yellow(`\n${dateHeader}\n`));
          console.log(chalk.gray('No circuit breakers hit.'));
          return;
        }

        console.log(chalk.bold.cyan(`\n${dateHeader}\n`));
        console.log(formatStockTable(data as any));
        
        if (!options.all) {
          console.log(chalk.gray(`\nShowing ${data.length} circuit breaker hit(s). Use --all to see all limits.`));
        } else {
          console.log(chalk.gray(`\nShowing all ${data.length} circuit breaker limits.`));
        }
      } catch (error) {
        spinner.stop();
        console.error(chalk.red('Error fetching circuit breaker data:'), error);
        process.exit(1);
      }
    });

  return command;
}

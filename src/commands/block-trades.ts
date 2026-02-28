import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

interface BlockTradesOptions extends FormatOptions {
  minValue?: string;
  symbol?: string;
  top?: string;
}

export function createBlockTradesCommand() {
  const command = new Command('block-trades');

  command
  .alias('blocks')
  .description('Show block transactions (institutional trading activity)')
  .option('--min-value <amount>', 'Filter by minimum value in millions (e.g., 10 for 10M Tk)')
  .option('--symbol <code>', 'Filter by specific instrument code')
  .option('--top <n>', 'Show only top N trades by value', '20')
  .option('-j, --json', 'Output as JSON')
  .option('-m, --markdown', 'Output as Markdown')
  .option('-t, --toon', 'Output as TOON (compact for LLMs)')
  .action(async (options: BlockTradesOptions) => {
    const spinner = ora('Fetching block trades data...').start();
    const client = new DseApiClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';
      const result = await client.getBlockTrades();
      
      let trades = result.data;
      
      // Apply filters
      if (options.minValue) {
        const minVal = parseFloat(options.minValue);
        trades = trades.filter(t => parseFloat(t.valueInMn) >= minVal);
      }
      
      if (options.symbol) {
        const symbolUpper = options.symbol.toUpperCase();
        trades = trades.filter(t => t.instrCode.toUpperCase().includes(symbolUpper));
      }
      
      // Sort by value descending
      trades.sort((a, b) => parseFloat(b.valueInMn) - parseFloat(a.valueInMn));
      
      // Limit to top N
      const topN = parseInt(options.top || '20', 10);
      if (topN > 0 && topN < trades.length) {
        trades = trades.slice(0, topN);
      }
      
      spinner.succeed(chalk.green(`Found ${trades.length} block trades (${result.totalScrips} scrips)`));
      
      if (trades.length === 0) {
        console.log(chalk.yellow('\n⚠️  No block trades found matching criteria'));
        console.log(chalk.gray(`Date: ${result.date}`));
        return;
      }

      console.log(chalk.gray(`Date: ${result.date}`));
      console.log(chalk.cyan(`Total: ${result.totalTrades} trades, ${result.totalQuantity.toLocaleString()} shares, ${result.totalValue.toFixed(2)}M Tk\n`));

      if (format === 'json') {
        console.log(formatJson({ 
          trades, 
          date: result.date,
          summary: {
            totalTrades: result.totalTrades,
            totalQuantity: result.totalQuantity,
            totalValue: result.totalValue,
            totalScrips: result.totalScrips
          }
        }));
      } else if (format === 'markdown') {
        console.log(`# Block Transactions\n`);
        console.log(`**Date:** ${result.date}  `);
        console.log(`**Summary:** ${result.totalTrades} trades, ${result.totalQuantity.toLocaleString()} shares, ${result.totalValue.toFixed(2)}M Tk\n`);
        console.log(formatMarkdown(trades as any));
      } else if (format === 'toon') {
        console.log(formatToon({ 
          trades, 
          date: result.date,
          summary: {
            totalTrades: result.totalTrades,
            totalQuantity: result.totalQuantity,
            totalValue: result.totalValue,
            totalScrips: result.totalScrips
          }
        }));
      } else {
        // Table format
        console.log(chalk.bold.cyan('📊 Block Transactions (Institutional Activity)\n'));
        
        const { default: Table } = await import('cli-table3');
        const table = new Table({
          head: [
            chalk.bold('Symbol'),
            chalk.bold('Max Price'),
            chalk.bold('Min Price'),
            chalk.bold('Trades'),
            chalk.bold('Quantity'),
            chalk.bold('Value (M Tk)')
          ],
          style: {
            head: ['cyan'],
            border: ['gray']
          },
          colAligns: ['left', 'right', 'right', 'right', 'right', 'right']
        });

        trades.forEach(trade => {
          const value = parseFloat(trade.valueInMn);
          const valueColor = value >= 10 ? chalk.green : value >= 5 ? chalk.yellow : chalk.white;
          
          table.push([
            chalk.cyan(trade.instrCode),
            trade.maxPrice,
            trade.minPrice,
            trade.trades,
            parseInt(trade.quantity).toLocaleString(),
            valueColor(value.toFixed(3))
          ]);
        });

        console.log(table.toString());
        console.log(chalk.gray('\n💡 Tip: Use --min-value 10 to filter large trades (>10M Tk)'));
        console.log(chalk.gray('💡 Tip: Use --symbol GP to filter by instrument code'));
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch block trades'));
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      }
      process.exit(1);
    }
  });

  return command;
}

import { Command } from 'commander';
import Table from 'cli-table3';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { encode as toonEncode } from '@toon-format/toon';
import { formatJson } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

interface MarketStatsOptions extends FormatOptions {
  block?: boolean;
}

export function createMarketStatsCommand() {
  const command = new Command('market-stats');

  command
    .alias('stats')
    .description('Get market statistics and overview')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .option('--no-block', 'Hide block trades table')
    .action(async (options: MarketStatsOptions) => {
      const spinner = ora('Fetching market statistics...').start();

      try {
        const client = new DseApiClient();
        const result = await client.getMarketStatistics();

        spinner.stop();

        const { data, date } = result;
        const dateHeader = date ? `Market Statistics for ${date}` : 'Market Statistics';

        if (options.toon) {
          console.log(toonEncode(data));
          return;
        }

        if (options.json) {
          console.log(formatJson(data));
          return;
        }

        if (options.markdown) {
          console.log(formatMarkdown(data, dateHeader, options.block !== false));
          return;
        }

        // Default: Rich table format
        console.log(chalk.bold.cyan(`\n📊 ${dateHeader}\n`));

        // Categories Table
        console.log(chalk.bold.yellow('📈 Issues by Category:'));
        const catTable = new Table({
          head: [
            chalk.bold('Category'),
            chalk.bold('Advanced'),
            chalk.bold('Declined'),
            chalk.bold('Unchanged'),
            chalk.bold('Total Traded'),
          ],
          style: {
            head: [],
            border: ['gray'],
          },
        });

        data.categories.forEach((cat) => {
          catTable.push([
            cat.category,
            chalk.green(cat.advanced),
            chalk.red(cat.declined),
            chalk.yellow(cat.unchanged),
            chalk.cyan(cat.totalTraded),
          ]);
        });

        console.log(catTable.toString());

        // Transactions Table
        console.log(chalk.bold.yellow('\n💹 Total Transactions:'));
        const txTable = new Table({
          head: [chalk.bold('Metric'), chalk.bold('Value')],
          style: {
            head: [],
            border: ['gray'],
          },
        });

        txTable.push(
          ['Number of Trades', chalk.cyan(data.transactions.trades)],
          ['Volume (Nos.)', chalk.cyan(data.transactions.volume)],
          ['Value (Tk)', chalk.green(data.transactions.value)]
        );

        console.log(txTable.toString());

        // Market Capitalization
        console.log(chalk.bold.yellow('\n💰 Market Capitalization:'));
        const capTable = new Table({
          head: [chalk.bold('Type'), chalk.bold('Value (Tk)')],
          style: {
            head: [],
            border: ['gray'],
          },
        });

        capTable.push(
          ['Equity', chalk.cyan(data.marketCap.equity)],
          ['Mutual Fund', chalk.cyan(data.marketCap.mutualFund)],
          ['Debt Securities', chalk.cyan(data.marketCap.debtSecurities)],
          [chalk.bold('TOTAL'), chalk.bold.green(data.marketCap.total)]
        );

        console.log(capTable.toString());

        // Block Trades
        if (options.block !== false && data.blockTrades.length > 0) {
          console.log(chalk.bold.yellow(`\n📦 Block Transactions (${data.blockTrades.length} scrips):`));
          const blockTable = new Table({
            head: [
              chalk.bold('Code'),
              chalk.bold('Max Price'),
              chalk.bold('Min Price'),
              chalk.bold('Trades'),
              chalk.bold('Quantity'),
              chalk.bold('Value (Mn)'),
            ],
            style: {
              head: [],
              border: ['gray'],
            },
          });

          data.blockTrades.forEach((trade) => {
            blockTable.push([
              chalk.cyan(trade.instrCode),
              trade.maxPrice,
              trade.minPrice,
              trade.trades,
              trade.quantity,
              chalk.green(trade.value),
            ]);
          });

          console.log(blockTable.toString());
        }

        console.log(); // Empty line at end
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch market statistics'));
        if (error instanceof Error) {
          console.error(chalk.red('Error:'), error.message);
        }
        process.exit(1);
      }
    });

  return command;
}

function formatMarkdown(data: any, header: string, includeBlock: boolean): string {
  let md = `# ${header}\n\n`;

  // Categories
  md += `## 📈 Issues by Category\n\n`;
  md += `| Category | Advanced | Declined | Unchanged | Total Traded |\n`;
  md += `|----------|----------|----------|-----------|-------------|\n`;
  data.categories.forEach((cat: any) => {
    md += `| ${cat.category} | ${cat.advanced} | ${cat.declined} | ${cat.unchanged} | ${cat.totalTraded} |\n`;
  });
  md += `\n`;

  // Transactions
  md += `## 💹 Total Transactions\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| Number of Trades | ${data.transactions.trades} |\n`;
  md += `| Volume (Nos.) | ${data.transactions.volume} |\n`;
  md += `| Value (Tk) | ${data.transactions.value} |\n\n`;

  // Market Cap
  md += `## 💰 Market Capitalization\n\n`;
  md += `| Type | Value (Tk) |\n`;
  md += `|------|------------|\n`;
  md += `| Equity | ${data.marketCap.equity} |\n`;
  md += `| Mutual Fund | ${data.marketCap.mutualFund} |\n`;
  md += `| Debt Securities | ${data.marketCap.debtSecurities} |\n`;
  md += `| **TOTAL** | **${data.marketCap.total}** |\n\n`;

  // Block Trades
  if (includeBlock && data.blockTrades.length > 0) {
    md += `## 📦 Block Transactions (${data.blockTrades.length} scrips)\n\n`;
    md += `| Code | Max Price | Min Price | Trades | Quantity | Value (Mn) |\n`;
    md += `|------|-----------|-----------|--------|----------|------------|\n`;
    data.blockTrades.forEach((trade: any) => {
      md += `| ${trade.instrCode} | ${trade.maxPrice} | ${trade.minPrice} | ${trade.trades} | ${trade.quantity} | ${trade.value} |\n`;
    });
    md += `\n`;
  }

  return md;
}

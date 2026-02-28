import { Command } from 'commander';
import { getAPIClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatToon } from '../lib/formatter.js';
import chalk from 'chalk';
import ora from 'ora';

export const marketOverviewCommand = new Command('market-overview')
  .alias('overview')
  .description('Get comprehensive market overview with category stats, transactions, and market cap')
  .option('--categories', 'Show only category statistics')
  .option('--transactions', 'Show only transaction statistics')
  .option('--market-cap', 'Show only market capitalization')
  .option('-j, --json', 'Output in JSON format')
  .option('-m, --markdown', 'Output in Markdown format')
  .option('-t, --toon', 'Output in TOON format')
  .action(async (options) => {
    const spinner = ora('Fetching market overview...').start();
    const client = getAPIClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';
      const result = await client.getMarketOverview();
      
      const showCategories = options.categories || (!options.categories && !options.transactions && !options.marketCap);
      const showTransactions = options.transactions || (!options.categories && !options.transactions && !options.marketCap);
      const showMarketCap = options.marketCap || (!options.categories && !options.transactions && !options.marketCap);
      
      spinner.succeed(chalk.green('Fetched market overview data'));
      
      console.log(chalk.gray(`Date: ${result.date}\n`));

      if (format === 'json') {
        const output: any = { date: result.date };
        if (showCategories) output.categoryStats = result.categoryStats;
        if (showTransactions) output.transactions = result.transactions;
        if (showMarketCap) output.marketCap = result.marketCap;
        console.log(formatJson(output));
      } else if (format === 'markdown') {
        if (showCategories) {
          console.log('# Category Statistics\n');
          console.log(formatMarkdown(result.categoryStats as any));
          console.log();
        }
        if (showTransactions) {
          console.log('# Total Transactions\n');
          console.log(`- **Trades**: ${result.transactions.trades.toLocaleString()}`);
          console.log(`- **Volume**: ${result.transactions.volume.toLocaleString()} shares`);
          console.log(`- **Value**: ${result.transactions.value.toLocaleString()} Tk\n`);
        }
        if (showMarketCap) {
          console.log('# Market Capitalization\n');
          console.log(`- **Equity**: ${(result.marketCap.equity / 1e9).toFixed(2)}B Tk`);
          console.log(`- **Mutual Fund**: ${(result.marketCap.mutualFund / 1e9).toFixed(2)}B Tk`);
          console.log(`- **Debt Securities**: ${(result.marketCap.debtSecurities / 1e9).toFixed(2)}B Tk`);
          console.log(`- **Total**: ${(result.marketCap.total / 1e9).toFixed(2)}B Tk\n`);
        }
      } else if (format === 'toon') {
        const output: any = { date: result.date };
        if (showCategories) output.categoryStats = result.categoryStats;
        if (showTransactions) output.transactions = result.transactions;
        if (showMarketCap) output.marketCap = result.marketCap;
        console.log(formatToon(output));
      } else {
        // Table format
        const { default: Table } = await import('cli-table3');
        
        if (showCategories) {
          console.log(chalk.bold.cyan('📊 Category Statistics\n'));
          
          const table = new Table({
            head: [
              chalk.bold('Category'),
              chalk.bold('Advanced'),
              chalk.bold('Declined'),
              chalk.bold('Unchanged'),
              chalk.bold('Total Traded')
            ],
            style: {
              head: ['cyan'],
              border: ['gray']
            }
          });

          result.categoryStats.forEach(cat => {
            const advColor = cat.advanced > cat.declined ? chalk.green : chalk.white;
            const decColor = cat.declined > cat.advanced ? chalk.red : chalk.white;
            
            table.push([
              cat.category,
              advColor(cat.advanced.toString()),
              decColor(cat.declined.toString()),
              cat.unchanged.toString(),
              chalk.cyan(cat.totalTraded.toString())
            ]);
          });

          console.log(table.toString());
          console.log();
        }

        if (showTransactions) {
          console.log(chalk.bold.cyan('💰 Total Transactions\n'));
          
          const transTable = new Table({
            head: [chalk.bold('Metric'), chalk.bold('Value')],
            style: {
              head: ['cyan'],
              border: ['gray']
            }
          });

          transTable.push(
            ['Trades', chalk.green(result.transactions.trades.toLocaleString())],
            ['Volume', chalk.yellow(result.transactions.volume.toLocaleString() + ' shares')],
            ['Value', chalk.green(result.transactions.value.toLocaleString() + ' Tk')]
          );

          console.log(transTable.toString());
          console.log();
        }

        if (showMarketCap) {
          console.log(chalk.bold.cyan('🏦 Market Capitalization\n'));
          
          const capTable = new Table({
            head: [chalk.bold('Type'), chalk.bold('Value (Billion Tk)'), chalk.bold('Percentage')],
            style: {
              head: ['cyan'],
              border: ['gray']
            },
            colAligns: ['left', 'right', 'right']
          });

          const total = result.marketCap.total;
          capTable.push(
            [
              'Equity',
              chalk.green((result.marketCap.equity / 1e9).toFixed(2)),
              chalk.gray(((result.marketCap.equity / total) * 100).toFixed(1) + '%')
            ],
            [
              'Mutual Fund',
              chalk.yellow((result.marketCap.mutualFund / 1e9).toFixed(2)),
              chalk.gray(((result.marketCap.mutualFund / total) * 100).toFixed(1) + '%')
            ],
            [
              'Debt Securities',
              chalk.blue((result.marketCap.debtSecurities / 1e9).toFixed(2)),
              chalk.gray(((result.marketCap.debtSecurities / total) * 100).toFixed(1) + '%')
            ],
            [
              chalk.bold('Total'),
              chalk.bold.cyan((total / 1e9).toFixed(2)),
              chalk.bold('100.0%')
            ]
          );

          console.log(capTable.toString());
        }
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch market overview'));
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      }
      process.exit(1);
    }
  });

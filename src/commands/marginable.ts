import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatToon } from '../lib/formatter.js';
import type { FormatOptions } from '../types/common.js';

interface MarginableOptions extends FormatOptions {
  category?: string;
  symbol?: string;
}

export function createMarginableCommand() {
  const command = new Command('marginable');

  command
  .alias('margin')
  .description('Show stocks eligible for margin financing')
  .option('--category <cat>', 'Filter by category (A, B, N, Z)')
  .option('--symbol <code>', 'Search for specific trading code')
  .option('-j, --json', 'Output as JSON')
  .option('-m, --markdown', 'Output as Markdown')
  .option('-t, --toon', 'Output as TOON (compact for LLMs)')
  .action(async (options: MarginableOptions) => {
    const spinner = ora('Fetching marginable securities...').start();
    const client = new DseApiClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';
      const result = await client.getMarginableSecurities();
      
      let securities = result.data;
      
      // Apply filters
      if (options.category) {
        const catUpper = options.category.toUpperCase();
        securities = securities.filter(s => s.category.toUpperCase() === catUpper);
      }
      
      if (options.symbol) {
        const symbolUpper = options.symbol.toUpperCase();
        securities = securities.filter(s => s.tradingCode.toUpperCase().includes(symbolUpper));
      }
      
      spinner.succeed(chalk.green(`Found ${securities.length} marginable securities`));
      
      if (securities.length === 0) {
        console.log(chalk.yellow('\n⚠️  No marginable securities found matching criteria'));
        console.log(chalk.gray(`Date: ${result.date}`));
        return;
      }

      console.log(chalk.gray(`Date: ${result.date}`));
      console.log(chalk.cyan(`Total: ${result.total} securities eligible for margin financing\n`));

      if (format === 'json') {
        console.log(formatJson({ 
          securities, 
          date: result.date,
          total: result.total,
          filtered: securities.length
        }));
      } else if (format === 'markdown') {
        console.log(`# Margin Financeable Securities\n`);
        console.log(`**Date:** ${result.date}  `);
        console.log(`**Total:** ${result.total} securities\n`);
        console.log(formatMarkdown(securities as any));
      } else if (format === 'toon') {
        console.log(formatToon({ 
          securities, 
          date: result.date,
          total: result.total,
          filtered: securities.length
        }));
      } else {
        // Table format
        console.log(chalk.bold.cyan('💰 Margin Financeable Securities\n'));
        
        const { default: Table } = await import('cli-table3');
        const table = new Table({
          head: [
            chalk.bold('#'),
            chalk.bold('Trading Code'),
            chalk.bold('Company Name'),
            chalk.bold('Category')
          ],
          style: {
            head: ['cyan'],
            border: ['gray']
          }
        });

        securities.forEach((security, index) => {
          const catColor = security.category === 'A' ? chalk.green : 
                          security.category === 'B' ? chalk.yellow : 
                          chalk.white;
          
          table.push([
            (index + 1).toString(),
            chalk.cyan(security.tradingCode),
            security.companyName,
            catColor(security.category)
          ]);
        });

        console.log(table.toString());
        
        // Show category breakdown
        const categoryCount = securities.reduce((acc, s) => {
          acc[s.category] = (acc[s.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log(chalk.gray('\n📊 Category Breakdown:'));
        Object.entries(categoryCount).sort().forEach(([cat, count]) => {
          const color = cat === 'A' ? chalk.green : cat === 'B' ? chalk.yellow : chalk.white;
          console.log(color(`   ${cat}: ${count} securities`));
        });
        
        console.log(chalk.gray('\n💡 Tip: Use --category A to filter by category'));
        console.log(chalk.gray('💡 Tip: Use --symbol BANK to search for specific stocks'));
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch marginable securities'));
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      }
      process.exit(1);
    }
  });

  return command;
}

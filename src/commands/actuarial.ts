import { Command } from 'commander';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatToon } from '../lib/formatter.js';
import chalk from 'chalk';
import ora from 'ora';
import type { FormatOptions } from '../types/common.js';

interface ActuarialOptions extends FormatOptions {
  compliant?: boolean;
  nonCompliant?: boolean;
}

export function createActuarialCommand() {
  const command = new Command('actuarial');

  command
  .alias('insurance')
  .description('Show actuarial valuation status for insurance companies')
  .option('--compliant', 'Show only compliant companies')
  .option('--non-compliant', 'Show only non-compliant companies')
  .option('-j, --json', 'Output in JSON format')
  .option('-m, --markdown', 'Output in Markdown format')
  .option('-t, --toon', 'Output in TOON format')
  .action(async (options: ActuarialOptions) => {
    const spinner = ora('Fetching actuarial valuation status...').start();
    const client = new DseApiClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';
      const result = await client.getActuarialValuation();
      
      let valuations = result.data;
      
      // Apply filters
      if (options.compliant) {
        valuations = valuations.filter(v => v.status.toLowerCase() === 'yes');
      } else if (options.nonCompliant) {
        valuations = valuations.filter(v => v.status.toLowerCase() === 'no');
      }
      
      spinner.succeed(chalk.green(`Found ${valuations.length} insurance companies`));
      
      console.log(chalk.gray(`Date: ${result.date}`));
      console.log(chalk.cyan(`Total: ${result.total} companies | Compliant: ${result.compliant} | Non-Compliant: ${result.nonCompliant}\n`));

      if (format === 'json') {
        console.log(formatJson({ 
          companies: valuations,
          date: result.date,
          summary: {
            total: result.total,
            compliant: result.compliant,
            nonCompliant: result.nonCompliant
          }
        }));
      } else if (format === 'markdown') {
        console.log(`# Actuarial Valuation Status\n`);
        console.log(`**Date:** ${result.date}  `);
        console.log(`**Summary:** ${result.compliant} compliant, ${result.nonCompliant} non-compliant\n`);
        console.log(formatMarkdown(valuations as any));
      } else if (format === 'toon') {
        console.log(formatToon({ 
          companies: valuations,
          date: result.date,
          summary: {
            total: result.total,
            compliant: result.compliant,
            nonCompliant: result.nonCompliant
          }
        }));
      } else {
        // Table format
        console.log(chalk.bold.cyan('🏥 Actuarial Valuation Status (Insurance Companies)\n'));
        
        const { default: Table } = await import('cli-table3');
        const table = new Table({
          head: [
            chalk.bold('#'),
            chalk.bold('Trading Code'),
            chalk.bold('Company Name'),
            chalk.bold('Status')
          ],
          style: {
            head: ['cyan'],
            border: ['gray']
          }
        });

        valuations.forEach((company, index) => {
          const statusColor = company.status.toLowerCase() === 'yes' ? chalk.green : chalk.red;
          const statusIcon = company.status.toLowerCase() === 'yes' ? '✓' : '✗';
          
          table.push([
            (index + 1).toString(),
            chalk.cyan(company.tradingCode),
            company.companyName,
            statusColor(`${statusIcon} ${company.status}`)
          ]);
        });

        console.log(table.toString());
        
        const complianceRate = ((result.compliant / result.total) * 100).toFixed(1);
        console.log(chalk.gray(`\n📊 Compliance Rate: ${complianceRate}% (${result.compliant}/${result.total})`));
        
        console.log(chalk.gray('\n💡 Tip: Use --compliant to show only compliant companies'));
        console.log(chalk.gray('💡 Tip: Use --non-compliant to show only non-compliant companies'));
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch actuarial valuation status'));
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      }
      process.exit(1);
    }
  });

  return command;
}

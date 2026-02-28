import { Command } from 'commander';
import { getAPIClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatToon } from '../lib/formatter.js';
import chalk from 'chalk';
import ora from 'ora';

export const riskCommand = new Command('risk-screen')
  .alias('risk')
  .description('Show companies with going concern threats')
  .option('-j, --json', 'Output in JSON format')
  .option('-m, --markdown', 'Output in Markdown format')
  .option('-t, --toon', 'Output in TOON format')
  .action(async (options) => {
    const spinner = ora('Fetching risk data...').start();
    const client = getAPIClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';
      const result = await client.getGoingConcernThreats();
      
      spinner.succeed(chalk.green(`Found ${result.data.length} companies with going concern threats`));
      
      if (result.data.length === 0) {
        console.log(chalk.green('\n✓ No companies with going concern threats found'));
        console.log(chalk.gray(`As of: ${result.date}`));
        return;
      }

      console.log(chalk.gray(`As of: ${result.date}\n`));

      if (format === 'json') {
        console.log(formatJson({ threats: result.data, date: result.date, count: result.data.length }));
      } else if (format === 'markdown') {
        console.log(`# Companies with Going Concern Threats\n`);
        console.log(`**As of:** ${result.date}  `);
        console.log(`**Total:** ${result.data.length} companies\n`);
        console.log(formatMarkdown(result.data as any));
      } else if (format === 'toon') {
        console.log(formatToon({ threats: result.data, date: result.date, count: result.data.length }));
      } else {
        // Table format
        console.log(chalk.bold.red(`⚠️  ${result.data.length} Companies with Going Concern Threats\n`));
        
        const { default: Table } = await import('cli-table3');
        const table = new Table({
          head: [chalk.bold('#'), chalk.bold('Trading Code'), chalk.bold('Company Name'), chalk.bold('Status')],
          style: {
            head: ['cyan'],
            border: ['gray']
          }
        });

        result.data.forEach((company, index) => {
          table.push([
            (index + 1).toString(),
            chalk.red(company.tradingCode),
            company.companyName,
            chalk.yellow(company.status)
          ]);
        });

        console.log(table.toString());
        console.log(chalk.red('\n⚠️  RISK WARNING: These companies face bankruptcy/delisting threats'));
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch risk data'));
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      }
      process.exit(1);
    }
  });

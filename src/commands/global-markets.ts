import { Command } from 'commander';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatToon } from '../lib/formatter.js';
import chalk from 'chalk';
import ora from 'ora';

export function createGlobalMarketsCommand() {
  const command = new Command('global-markets');

  command
  .alias('global')
  .description('Compare DSE with international stock markets')
  .option('--region <name>', 'Filter by region (e.g., "Asia Pacific", "Europe")')
  .option('--country <name>', 'Search for specific country')
  .option('-j, --json', 'Output in JSON format')
  .option('-m, --markdown', 'Output in Markdown format')
  .option('-t, --toon', 'Output in TOON format')
  .action(async (options) => {
    const spinner = ora('Fetching global markets data...').start();
    const client = new DseApiClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';
      const result = await client.getGlobalMarkets();
      
      let markets = result.data;
      
      // Apply filters
      if (options.region) {
        const regionLower = options.region.toLowerCase();
        markets = markets.filter(m => m.region.toLowerCase().includes(regionLower));
      }
      
      if (options.country) {
        const countryLower = options.country.toLowerCase();
        markets = markets.filter(m => m.country.toLowerCase().includes(countryLower));
      }
      
      spinner.succeed(chalk.green(`Found ${markets.length} global markets`));
      
      if (markets.length === 0) {
        console.log(chalk.yellow('\n⚠️  No markets found matching criteria'));
        console.log(chalk.gray(`Available regions: ${result.regions.join(', ')}`));
        return;
      }

      console.log(chalk.cyan(`Regions: ${result.regions.join(', ')}\n`));

      if (format === 'json') {
        console.log(formatJson({ markets, regions: result.regions }));
      } else if (format === 'markdown') {
        console.log(`# Global Markets Comparison\n`);
        console.log(`**Regions:** ${result.regions.join(', ')}\n`);
        console.log(formatMarkdown(markets as any));
      } else if (format === 'toon') {
        console.log(formatToon({ markets, regions: result.regions }));
      } else {
        // Table format - group by region
        const { default: Table } = await import('cli-table3');
        
        const regionGroups = markets.reduce((acc, market) => {
          if (!acc[market.region]) acc[market.region] = [];
          acc[market.region].push(market);
          return acc;
        }, {} as Record<string, typeof markets>);

        for (const [region, regionMarkets] of Object.entries(regionGroups)) {
          console.log(chalk.bold.cyan(`\n🌍 ${region}\n`));
          
          const table = new Table({
            head: [
              chalk.bold('Country'),
              chalk.bold('Index'),
              chalk.bold('Month %'),
              chalk.bold('Year %'),
              chalk.bold('GDP %'),
              chalk.bold('Inflation %'),
              chalk.bold('Rate %')
            ],
            style: {
              head: ['cyan'],
              border: ['gray']
            },
            colAligns: ['left', 'right', 'right', 'right', 'right', 'right', 'right']
          });

          regionMarkets.forEach(market => {
            const monthChange = parseFloat(market.changeMonth.replace(/[()]/g, ''));
            const yearChange = parseFloat(market.changeYear.replace(/[()]/g, ''));
            
            const monthColor = monthChange >= 0 ? chalk.green : chalk.red;
            const yearColor = yearChange >= 0 ? chalk.green : chalk.red;
            
            // Highlight Bangladesh
            const countryName = market.country.includes('Bangladesh') ? 
              chalk.yellow(market.country) : market.country;
            
            table.push([
              countryName,
              market.indexCurrent,
              monthColor(market.changeMonth),
              yearColor(market.changeYear),
              market.gdpGrowth,
              market.inflation,
              market.interestRate
            ]);
          });

          console.log(table.toString());
        }
        
        console.log(chalk.gray('\n💡 Tip: Use --region "Asia Pacific" to filter by region'));
        console.log(chalk.gray('💡 Tip: Use --country Bangladesh to see only Bangladesh'));
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to fetch global markets'));
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      }
      process.exit(1);
    }
  });

  return command;
}

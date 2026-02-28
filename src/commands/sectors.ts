import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatMarkdown, formatStockTable, formatToon } from '../lib/formatter.js';
import type { SectorPE, SectorStock } from '../lib/scrapers/sector-scraper.js';
import type { FormatOptions } from '../types/common.js';

interface SectorsOptions extends FormatOptions {
  sector?: string;
  area?: string;
}

export function createSectorsCommand() {
  const command = new Command('sectors');

  command
    .description('Get sectoral P/E ratios and performance')
    .option('--sector <name>', 'Get stocks for a specific sector (e.g., Bank, IT Sector)')
    .option('--area <id>', 'Get stocks for a sector by area ID')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .action(async (options: SectorsOptions) => {
      const spinner = ora('Fetching sector data...').start();
      const client = new DseApiClient();

    try {
      const format = options.json ? 'json' : options.markdown ? 'markdown' : options.toon ? 'toon' : 'table';

      // If specific sector requested
      if (options.sector || options.area) {
        let areaId = options.area;

        // If sector name provided, find the area ID
        if (options.sector && !options.area) {
          const { data: sectors } = await client.getSectoralPE();
          const searchTerm = options.sector.toLowerCase();
          
          // Try exact match first, then startsWith, then includes
          let sector = sectors.find((s: SectorPE) => s.name.toLowerCase() === searchTerm);
          if (!sector) {
            sector = sectors.find((s: SectorPE) => s.name.toLowerCase().startsWith(searchTerm));
          }
          if (!sector) {
            sector = sectors.find((s: SectorPE) => {
              // For includes, match word boundaries to avoid partial matches like "IT" in "Institutions"
              const words = s.name.toLowerCase().split(/\s+/);
              return words.some(word => word.includes(searchTerm));
            });
          }

          if (!sector) {
            spinner.fail(chalk.red(`Sector "${options.sector}" not found`));
            console.log(chalk.yellow('\nAvailable sectors:'));
            sectors.forEach((s: SectorPE) => console.log(chalk.cyan(`  - ${s.name}`)));
            process.exit(1);
          }

          areaId = sector.areaId;
        }

        const { data, date, sectorName } = await client.getSectorStocks(areaId!);
        spinner.succeed(chalk.green(`Fetched ${data.length} stocks from ${sectorName}`));

        if (format === 'json') {
          console.log(formatJson(data));
        } else if (format === 'markdown') {
          console.log(`# ${sectorName} - ${date}\n`);
          console.log(formatMarkdown(data as any));
        } else if (format === 'toon') {
          console.log(formatToon(data));
        } else {
          console.log(chalk.bold.cyan(`\n${sectorName} - ${date}\n`));
          console.log(formatStockTable(data as any));
          console.log(chalk.gray(`\nTotal: ${data.length} stocks`));
        }
      } else {
        // Show all sectors with P/E ratios
        const { data, date } = await client.getSectoralPE();
        spinner.succeed(chalk.green(`Fetched ${data.length} sectors`));

        if (format === 'json') {
          console.log(formatJson(data));
        } else if (format === 'markdown') {
          console.log(`# Sectoral Median P/E Ratios - ${date}\n`);
          console.log(formatMarkdown(data as any));
        } else if (format === 'toon') {
          console.log(formatToon(data));
        } else {
          console.log(chalk.bold.cyan(`\n📊 Sectoral Median P/E Ratios - ${date}\n`));

          // Custom table for sectors
          const { default: Table } = await import('cli-table3');
          const table = new Table({
            head: [chalk.bold('Sector'), chalk.bold('Median P/E'), chalk.bold('Area ID')],
            style: {
              head: ['cyan'],
              border: ['gray'],
            },
            colWidths: [40, 15, 12],
          });

          data.forEach((sector: SectorPE) => {
            const pe = parseFloat(sector.medianPE);
            const peColor = pe > 20 ? chalk.red : pe > 15 ? chalk.yellow : chalk.green;

            table.push([
              sector.name,
              peColor(sector.medianPE),
              chalk.gray(sector.areaId),
            ]);
          });

          console.log(table.toString());
          console.log(chalk.gray(`\nTotal: ${data.length} sectors\n`));
          console.log(chalk.dim(`Tip: Use --sector "Bank" or --area 11 to see stocks in a specific sector`));
        }
      }
    } catch (error: any) {
      spinner.fail(chalk.red('Failed to fetch sector data'));
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

  return command;
}

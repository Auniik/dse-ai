import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatToon } from '../lib/formatter.js';
import type { Holiday } from '../lib/scrapers/holidays-scraper.js';
import type { FormatOptions } from '../types/common.js';

interface HolidaysOptions extends FormatOptions {
  isToday?: boolean;
  date?: string;
}

export function createHolidaysCommand() {
  const command = new Command('holidays');

  command
    .description('View DSE trading holidays')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .option('--is-today', 'Check if today is a holiday')
    .option('-d, --date <date>', 'Check if a specific date (YYYY-MM-DD) is a holiday')
    .action(async (options: HolidaysOptions) => {
      const spinner = ora('Fetching holidays...').start();

      try {
        const apiClient = new DseApiClient();
        const data = await apiClient.getHolidays();
        
        spinner.stop();

        if (data.holidays.length === 0) {
          console.log('No holidays found.');
          return;
        }

        if (options.isToday || options.date) {
          const checkDate = options.date || new Date().toISOString().split('T')[0];
          const holiday = data.holidays.find(h => h.dates.includes(checkDate));
          
          if (holiday) {
            if (options.json) {
              console.log(formatJson({ isHoliday: true, holiday, date: checkDate }));
            } else if (options.toon) {
              console.log(formatToon({ isHoliday: true, holiday, date: checkDate }));
            } else {
              const label = options.date ? `Date ${checkDate}` : `Today (${checkDate})`;
              console.log(chalk.green(`✓ ${label} is a holiday!`));
              console.log(chalk.bold(`\nHoliday: ${holiday.name}`));
              console.log(`Days: ${holiday.days.join('-')}`);
              console.log(`Duration: ${holiday.numberOfDays}`);
              console.log(`Date Range: ${holiday.dates[0]} to ${holiday.dates[holiday.dates.length - 1]}`);
            }
          } else {
            if (options.json) {
              console.log(formatJson({ isHoliday: false, date: checkDate }));
            } else if (options.toon) {
              console.log(formatToon({ isHoliday: false, date: checkDate }));
            } else {
              const label = options.date ? `Date ${checkDate}` : `Today (${checkDate})`;
              console.log(chalk.yellow(`✗ ${label} is not a holiday.`));
            }
          }
          return;
        }

        if (options.json) {
          console.log(formatJson(data));
        } else if (options.toon) {
          console.log(formatToon(data));
        } else if (options.markdown) {
          console.log(formatHolidaysMarkdown(data.holidays, data.year));
        } else {
          console.log(formatHolidaysTable(data.holidays, data.year));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        if (error instanceof Error) {
          console.error('Error fetching holidays:', error.message);
        }
        process.exit(1);
      }
    });

  return command;
}

function formatHolidaysTable(holidays: Holiday[], year: string): string {
  const rows = holidays.map((item, index) => {
    const dateRange = item.dates.length === 1 
      ? item.dates[0] 
      : `${item.dates[0]} to ${item.dates[item.dates.length - 1]}`;
    
    const dayStr = item.days.join('-');
    
    return [
      (index + 1).toString(),
      truncate(item.name, 40),
      dateRange,
      dayStr,
      item.numberOfDays
    ];
  });

  const headers = ['#', 'Holiday Name', 'Date Range', 'Day(s)', 'Days'];
  const colWidths = [4, 42, 24, 25, 8];

  let output = `\n${chalk.bold(`DSE Trading Holidays - ${year}`)}\n\n`;
  
  output += headers.map((h, i) => chalk.cyan(h.padEnd(colWidths[i]))).join(' ') + '\n';
  output += colWidths.map(w => '─'.repeat(w)).join(' ') + '\n';
  
  rows.forEach(row => {
    output += row.map((cell, i) => cell.padEnd(colWidths[i])).join(' ') + '\n';
  });

  output += `\n${chalk.bold('Total Holidays:')} ${holidays.length}\n`;

  return output;
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + '...';
}

function formatHolidaysMarkdown(holidays: Holiday[], year: string): string {
  let output = `# DSE Trading Holidays - ${year}\n\n`;
  output += '| # | Holiday Name | Dates | Day(s) | Days |\n';
  output += '|---|--------------|-------|--------|------|\n';
  
  holidays.forEach((item, index) => {
    const dateStr = item.dates.length === 1 
      ? item.dates[0] 
      : `${item.dates[0]} to ${item.dates[item.dates.length - 1]}`;
    const dayStr = item.days.join('-');
    output += `| ${index + 1} | ${item.name} | ${dateStr} | ${dayStr} | ${item.numberOfDays} |\n`;
  });
  
  output += `\n**Total Holidays:** ${holidays.length}\n`;
  return output;
}

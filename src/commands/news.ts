import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatToon } from '../lib/formatter.js';
import type { NewsItem } from '../lib/scrapers/news-scraper.js';
import type { FormatOptions } from '../types/common.js';

interface NewsOptions extends FormatOptions {
  symbol?: string;
  startDate?: string;
  endDate?: string;
  days?: string;
  limit?: string;
}

export function createNewsCommand() {
  const command = new Command('news');

  command
    .description('View news archive from DSE')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .option('-s, --symbol <code>', 'Filter by trading symbol (e.g., EXCH)')
    .option('--start-date <date>', 'Start date (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date (YYYY-MM-DD)')
    .option('-d, --days <number>', 'News from last N days (default: 30)', '30')
    .option('-l, --limit <number>', 'Limit number of news items')
    .action(async (options: NewsOptions) => {
      const spinner = ora('Fetching news...').start();

      try {
        const apiClient = new DseApiClient();
        let apiOptions: { symbol?: string; startDate?: string; endDate?: string } = {};

        if (options.symbol) {
          // Search by symbol
          apiOptions.symbol = options.symbol.toUpperCase();
        } else if (options.startDate && options.endDate) {
          // Search by date range
          apiOptions.startDate = options.startDate;
          apiOptions.endDate = options.endDate;
        } else if (options.days) {
          // Default: last N days
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(endDate.getDate() - parseInt(options.days));
          
          const formatDate = (d: Date) => d.toISOString().split('T')[0];
          apiOptions.startDate = formatDate(startDate);
          apiOptions.endDate = formatDate(endDate);
        }

        const data = await apiClient.getNews(apiOptions);
        
        spinner.stop();
        
        // Apply limit if specified
        let news = data.news;
        if (options.limit) {
          news = news.slice(0, parseInt(options.limit));
        }

        if (news.length === 0) {
          console.log('No news found for the specified criteria.');
          return;
        }

        // Determine output format
        if (options.json) {
          console.log(formatJson({ ...data, news }));
        } else if (options.toon) {
          console.log(formatToon({ ...data, news }));
        } else if (options.markdown) {
          console.log(formatNewsMarkdown(news));
          console.log(`\nTotal News: ${news.length}${options.limit ? ` (showing ${options.limit} of ${data.totalNews})` : ''}`);
        } else {
          // Default: table format
          console.log(formatNewsTable(news));
          console.log(`\nTotal News: ${news.length}${options.limit ? ` (showing ${options.limit} of ${data.totalNews})` : ''}`);
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        if (error instanceof Error) {
          console.error('Error fetching news:', error.message);
        }
        process.exit(1);
      }
    });

  return command;
}

function formatNewsTable(news: NewsItem[]): string {
  const rows = news.map((item, index) => {
    return [
      (index + 1).toString(),
      item.postDate,
      item.tradingCode,
      truncate(item.title, 50),
      truncate(item.news || 'N/A', 60)
    ];
  });

  const headers = ['#', 'Date', 'Symbol', 'Title', 'News'];
  const colWidths = [4, 12, 12, 52, 62];

  let output = '\n'; // Add leading newline
  
  // Header
  output += headers.map((h, i) => h.padEnd(colWidths[i])).join(' ') + '\n';
  output += colWidths.map(w => '─'.repeat(w)).join(' ') + '\n';
  
  // Rows
  rows.forEach(row => {
    output += row.map((cell, i) => cell.padEnd(colWidths[i])).join(' ') + '\n';
  });

  return output;
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + '...';
}

function formatNewsMarkdown(news: NewsItem[]): string {
  let output = '';
  news.forEach((item, index) => {
    output += `## ${index + 1}. ${item.title}\n\n`;
    output += `- **Symbol**: ${item.tradingCode}\n`;
    output += `- **Date**: ${item.postDate}\n`;
    output += `- **News**: ${item.news || 'N/A'}\n\n`;
    output += '---\n\n';
  });
  return output;
}

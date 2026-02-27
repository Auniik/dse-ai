import Table from 'cli-table3';
import chalk from 'chalk';
import type { StockData } from '../types/index.js';

export function formatStockTable(data: StockData[], title?: string): string {
  if (!data || data.length === 0) {
    return chalk.yellow('No data available');
  }

  // Get headers from first row
  const headers = Object.keys(data[0]);
  
  const table = new Table({
    head: headers.map(h => chalk.cyan(h)),
    style: {
      head: [],
      border: ['gray']
    }
  });

  // Add rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] || '';
      
      // Color positive/negative changes
      if (header.toLowerCase().includes('change')) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue >= 0 ? chalk.green(value) : chalk.red(value);
        }
      }
      
      return value;
    });
    
    table.push(values);
  });

  let output = '';
  if (title) {
    output += chalk.bold.blue(`\n${title}\n`);
  }
  output += table.toString();
  output += chalk.gray(`\n\nTotal: ${data.length} records\n`);

  return output;
}

export function formatJson(data: any): string {
  return JSON.stringify(data, null, 2);
}

export function formatMarkdown(data: StockData[]): string {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  const headers = Object.keys(data[0]);
  
  let md = '| ' + headers.join(' | ') + ' |\n';
  md += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
  
  data.forEach(row => {
    md += '| ' + headers.map(h => row[h] || '').join(' | ') + ' |\n';
  });

  return md;
}

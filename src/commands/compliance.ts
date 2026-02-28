import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { formatJson, formatToon } from '../lib/formatter.js';
import type { FinancialSubmission } from '../lib/scrapers/financial-compliance-scraper.js';
import type { FormatOptions } from '../types/common.js';

interface ComplianceOptions extends FormatOptions {
  symbol?: string;
  q1?: boolean;
  q2?: boolean;
  q3?: boolean;
  annual?: boolean;
  nonSubmitted?: boolean;
  delayed?: boolean;
}

export function createComplianceCommand() {
  const command = new Command('compliance');

  command
    .description('View financial statement submission status')
    .option('-j, --json', 'Output as JSON')
    .option('-m, --markdown', 'Output as Markdown')
    .option('-t, --toon', 'Output as TOON (compact for LLMs)')
    .option('-s, --symbol <code>', 'Filter by trading symbol (e.g., AAMRANET)')
    .option('--q1', 'Filter Q1 submissions only')
    .option('--q2', 'Filter Q2 submissions only')
    .option('--q3', 'Filter Q3 submissions only')
    .option('--annual', 'Filter Annual submissions only')
    .option('--non-submitted', 'Show only non-submitted reports')
    .option('--delayed', 'Show only delayed submissions')
    .action(async (options: ComplianceOptions) => {
      const spinner = ora('Fetching financial compliance data...').start();

      try {
        const apiClient = new DseApiClient();
        
        // Build quarters array
        const quarters: string[] = [];
        if (options.q1) quarters.push('Q1');
        if (options.q2) quarters.push('Q2');
        if (options.q3) quarters.push('Q3');
        if (options.annual) quarters.push('Annual');
        
        const data = await apiClient.getFinancialCompliance(
          options.symbol?.toUpperCase(),
          quarters.length > 0 ? quarters : undefined
        );
        
        spinner.succeed(chalk.green('Data fetched successfully!'));
        
        let submissions = data.submissions;
        
        // Apply status filters
        if (options.nonSubmitted) {
          submissions = submissions.filter(s => s.status === 'Non-Submission');
        } else if (options.delayed) {
          submissions = submissions.filter(s => s.status === 'Delayed Submission');
        }
        
        if (submissions.length === 0) {
          console.log('No submissions found for the specified criteria.');
          if (!options.symbol) {
            console.log('\nTip: Use --symbol <CODE> to view a specific company\'s compliance status.');
          }
          return;
        }

        // Determine output format
        if (options.json) {
          console.log(formatJson({ ...data, submissions }));
        } else if (options.toon) {
          console.log(formatToon({ ...data, submissions }));
        } else if (options.markdown) {
          console.log(formatComplianceMarkdown(submissions, data.symbol));
        } else {
          // Default: table format
          console.log(formatComplianceTable(submissions, data.symbol));
          console.log(`\nTotal Submissions: ${submissions.length}`);
          
          // Show summary stats
          const nonSubmitted = submissions.filter(s => s.status === 'Non-Submission').length;
          const delayed = submissions.filter(s => s.status === 'Delayed Submission').length;
          const submitted = submissions.filter(s => s.status === 'Submitted').length;
          
          console.log(`\nStatus Summary:`);
          console.log(`  Submitted: ${submitted}`);
          if (delayed > 0) console.log(`  Delayed: ${delayed}`);
          if (nonSubmitted > 0) console.log(`  Non-Submitted: ${nonSubmitted}`);
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to fetch data'));
        if (error instanceof Error) {
          console.error('Error fetching financial compliance data:', error.message);
        }
        process.exit(1);
      }
    });

  return command;
}

function formatComplianceTable(submissions: FinancialSubmission[], symbol?: string): string {
  if (symbol) {
    console.log(`\nFinancial Compliance Status for ${symbol}\n`);
  }
  
  const rows = submissions.map((item, index) => {
    // Color code status
    let statusDisplay = item.status;
    if (item.status === 'Non-Submission') {
      statusDisplay = `🔴 ${item.status}`;
    } else if (item.status === 'Delayed Submission') {
      statusDisplay = `🟡 ${item.status}`;
    } else if (item.status === 'Submitted') {
      statusDisplay = `🟢 ${item.status}`;
    }
    
    return [
      item.financialYear,
      item.quarter,
      item.period.substring(0, 20) + (item.period.length > 20 ? '...' : ''),
      item.submissionDeadline,
      item.submissionDate || '-',
      statusDisplay,
      item.websiteStatus || '-'
    ];
  });

  const headers = ['FY', 'Quarter', 'Period', 'Deadline', 'Submitted', 'Status', 'Web Status'];
  const colWidths = [12, 8, 23, 12, 12, 25, 12];

  let output = '\n';
  
  // Header
  output += headers.map((h, i) => h.padEnd(colWidths[i])).join(' ') + '\n';
  output += colWidths.map(w => '─'.repeat(w)).join(' ') + '\n';
  
  // Rows
  rows.forEach(row => {
    output += row.map((cell, i) => cell.padEnd(colWidths[i])).join(' ') + '\n';
  });

  return output;
}

function formatComplianceMarkdown(submissions: FinancialSubmission[], symbol?: string): string {
  let output = '';
  
  if (symbol) {
    output += `# Financial Compliance Status: ${symbol}\n\n`;
  } else {
    output += `# Financial Compliance Status\n\n`;
  }
  
  submissions.forEach((item, index) => {
    const statusEmoji = item.status === 'Non-Submission' ? '🔴' : 
                       item.status === 'Delayed Submission' ? '🟡' : '🟢';
    
    output += `## ${index + 1}. ${item.financialYear} - ${item.quarter}\n\n`;
    output += `- **Period**: ${item.period}\n`;
    output += `- **Deadline**: ${item.submissionDeadline}\n`;
    output += `- **Submitted**: ${item.submissionDate || 'Not submitted'}\n`;
    output += `- **Status**: ${statusEmoji} ${item.status}\n`;
    output += `- **Website**: ${item.websiteStatus || 'Not uploaded'}\n`;
    
    if (item.extensionApplication !== '-') {
      output += `- **Extension Applied**: ${item.extensionApplication}\n`;
    }
    if (item.approvedDeadline !== '-') {
      output += `- **Approved Deadline**: ${item.approvedDeadline}\n`;
    }
    
    output += '\n---\n\n';
  });
  
  return output;
}

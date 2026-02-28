import { Command } from 'commander';
import Table from 'cli-table3';
import chalk from 'chalk';
import ora from 'ora';
import { DseApiClient } from '../lib/api-client.js';
import { encode as toonEncode } from '@toon-format/toon';
import type { CompanyInfo } from '../lib/scrapers/company-scraper.js';

export const companyCommand = new Command('company')
  .description('Get company financial information')
  .argument('<symbol>', 'Trading code/symbol (e.g., CITYBANK, GP)')
  .option('-j, --json', 'Output in JSON format')
  .option('-m, --markdown', 'Output in Markdown format')
  .option('--toon', 'Output in TOON format')
  .action(async (symbol: string, options) => {
    const spinner = ora('Fetching company information...').start();

    try {
      const client = new DseApiClient();
      const result = await client.getCompany(symbol);

      spinner.stop();

      if (!result.data) {
        console.log(chalk.red(`❌ Company not found: ${symbol}`));
        process.exit(1);
      }

      const data = result.data;
      const dateHeader = result.date ? ` as of ${result.date}` : '';

      if (options.toon) {
        console.log(toonEncode(data));
        return;
      }

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
      }

      if (options.markdown) {
        console.log(formatMarkdown(data, dateHeader));
        return;
      }

      // Default: Rich table format
      console.log(chalk.bold.cyan(`\n🏢 ${data.companyName} (${data.tradingCode})`));
      console.log(chalk.gray(`Sector: ${data.sector}${dateHeader}\n`));

      // Market Information
      console.log(chalk.bold.yellow('📊 Market Information:'));
      const marketTable = new Table({
        chars: {
          top: '─',
          'top-mid': '┬',
          'top-left': '┌',
          'top-right': '┐',
          bottom: '─',
          'bottom-mid': '┴',
          'bottom-left': '└',
          'bottom-right': '┘',
          left: '│',
          'left-mid': '├',
          mid: '─',
          'mid-mid': '┼',
          right: '│',
          'right-mid': '┤',
          middle: '│',
        },
        colWidths: [30, 25, 30, 25],
      });

      marketTable.push(
        [
          chalk.bold('Last Trading Price'),
          chalk.green(data.marketInfo.ltp),
          chalk.bold('Change'),
          data.marketInfo.changePercent.startsWith('-')
            ? chalk.red(`${data.marketInfo.change} (${data.marketInfo.changePercent})`)
            : chalk.green(`${data.marketInfo.change} (${data.marketInfo.changePercent})`),
        ],
        [
          chalk.bold('Closing Price'),
          data.marketInfo.closingPrice,
          chalk.bold('Opening Price'),
          data.marketInfo.openingPrice,
        ],
        [
          chalk.bold("Day's Range"),
          data.marketInfo.dayRange,
          chalk.bold("52 Week's Range"),
          data.marketInfo.fiftyTwoWeekRange,
        ],
        [
          chalk.bold("Day's Volume"),
          data.marketInfo.dayVolume,
          chalk.bold("Day's Value (mn)"),
          data.marketInfo.dayValue,
        ],
        [
          chalk.bold('Market Cap (mn)'),
          chalk.cyan(data.marketInfo.marketCap),
          chalk.bold('Free Float Cap (mn)'),
          data.marketInfo.freeFloatMarketCap,
        ]
      );

      console.log(marketTable.toString());

      // Financial Metrics
      console.log(chalk.bold.yellow('\n💰 Financial Metrics:'));
      const financialTable = new Table({
        chars: {
          top: '─',
          'top-mid': '┬',
          'top-left': '┌',
          'top-right': '┐',
          bottom: '─',
          'bottom-mid': '┴',
          'bottom-left': '└',
          'bottom-right': '┘',
          left: '│',
          'left-mid': '├',
          mid: '─',
          'mid-mid': '┼',
          right: '│',
          'right-mid': '┤',
          middle: '│',
        },
        colWidths: [30, 25, 30, 25],
      });

      financialTable.push(
        [
          chalk.bold('EPS (Basic)'),
          chalk.green(data.financials.epsBasic),
          chalk.bold('EPS (Diluted)'),
          data.financials.epsDiluted || 'N/A',
        ],
        [
          chalk.bold('NAV Per Share'),
          chalk.cyan(data.financials.navPerShare),
          chalk.bold('P/E Ratio (Basic)'),
          data.financials.peRatioBasic,
        ],
        [
          chalk.bold('P/E Ratio (Diluted)'),
          data.financials.peRatioDiluted || 'N/A',
          chalk.bold('Profit for Year (mn)'),
          data.financials.profitForYear,
        ]
      );

      console.log(financialTable.toString());

      // Capital Structure
      console.log(chalk.bold.yellow('\n🏦 Capital Structure:'));
      const capitalTable = new Table({
        chars: {
          top: '─',
          'top-mid': '┬',
          'top-left': '┌',
          'top-right': '┐',
          bottom: '─',
          'bottom-mid': '┴',
          'bottom-left': '└',
          'bottom-right': '┘',
          left: '│',
          'left-mid': '├',
          mid: '─',
          'mid-mid': '┼',
          right: '│',
          'right-mid': '┤',
          middle: '│',
        },
        colWidths: [30, 25, 30, 25],
      });

      capitalTable.push(
        [
          chalk.bold('Authorized Capital (mn)'),
          data.basicInfo.authorizedCapital,
          chalk.bold('Paid-up Capital (mn)'),
          data.basicInfo.paidUpCapital,
        ],
        [
          chalk.bold('Face Value'),
          data.basicInfo.faceValue,
          chalk.bold('Market Lot'),
          data.basicInfo.marketLot,
        ],
        [
          chalk.bold('Total Securities'),
          data.basicInfo.totalSecurities,
          chalk.bold('Debut Trading Date'),
          data.basicInfo.debutTradingDate,
        ]
      );

      console.log(capitalTable.toString());

      // AGM & Dividends
      console.log(chalk.bold.yellow('\n📈 AGM & Dividends:'));
      const agmTable = new Table({
        head: [chalk.bold('Type'), chalk.bold('Details')],
        colWidths: [30, 80],
        wordWrap: true,
      });

      agmTable.push(
        [chalk.bold('Last AGM'), data.agmInfo.lastAGMDate],
        [chalk.bold('Year Ended'), data.agmInfo.yearEnded],
        [chalk.bold('Cash Dividend'), chalk.green(data.agmInfo.cashDividend)],
        [chalk.bold('Bonus Issue'), chalk.cyan(data.agmInfo.bonusIssue)],
        [chalk.bold('Right Issue'), data.agmInfo.rightIssue || 'N/A'],
        [chalk.bold('Reserve & Surplus (mn)'), data.agmInfo.reserveSurplus]
      );

      console.log(agmTable.toString());

      // Shareholding Pattern
      console.log(chalk.bold.yellow('\n👥 Shareholding Pattern:'));
      const shareTable = new Table({
        head: [
          chalk.bold('Sponsor/Director'),
          chalk.bold('Government'),
          chalk.bold('Institute'),
          chalk.bold('Foreign'),
          chalk.bold('Public'),
        ],
      });

      shareTable.push([
        `${data.shareholding.sponsor}%`,
        `${data.shareholding.govt}%`,
        `${data.shareholding.institute}%`,
        `${data.shareholding.foreign}%`,
        `${data.shareholding.public}%`,
      ]);

      console.log(shareTable.toString());

      // Contact Information
      if (data.contact.website || data.contact.email) {
        console.log(chalk.bold.yellow('\n📞 Contact:'));
        const contactTable = new Table({
          head: [chalk.bold('Type'), chalk.bold('Details')],
          colWidths: [20, 90],
          wordWrap: true,
        });

        if (data.contact.website) {
          contactTable.push([chalk.bold('Website'), chalk.blue(data.contact.website)]);
        }
        if (data.contact.email) {
          contactTable.push([chalk.bold('Email'), data.contact.email]);
        }
        if (data.contact.phone) {
          contactTable.push([chalk.bold('Phone'), data.contact.phone]);
        }

        console.log(contactTable.toString());
      }

      console.log(); // Empty line at end
    } catch (error) {
      spinner.stop();
      console.error(chalk.red('Error fetching company data:'), error);
      process.exit(1);
    }
  });

function formatMarkdown(data: CompanyInfo, dateHeader: string): string {
  let md = `# ${data.companyName} (${data.tradingCode})\n\n`;
  md += `**Sector:** ${data.sector}${dateHeader}\n\n`;

  md += `## 📊 Market Information\n\n`;
  md += `| Metric | Value | Metric | Value |\n`;
  md += `|--------|-------|--------|-------|\n`;
  md += `| Last Trading Price | ${data.marketInfo.ltp} | Change | ${data.marketInfo.change} (${data.marketInfo.changePercent}) |\n`;
  md += `| Closing Price | ${data.marketInfo.closingPrice} | Opening Price | ${data.marketInfo.openingPrice} |\n`;
  md += `| Day's Range | ${data.marketInfo.dayRange} | 52 Week's Range | ${data.marketInfo.fiftyTwoWeekRange} |\n`;
  md += `| Day's Volume | ${data.marketInfo.dayVolume} | Day's Value (mn) | ${data.marketInfo.dayValue} |\n`;
  md += `| Market Cap (mn) | ${data.marketInfo.marketCap} | Free Float Cap (mn) | ${data.marketInfo.freeFloatMarketCap} |\n\n`;

  md += `## 💰 Financial Metrics\n\n`;
  md += `| Metric | Value |\n`;
  md += `|--------|-------|\n`;
  md += `| EPS (Basic) | ${data.financials.epsBasic} |\n`;
  md += `| EPS (Diluted) | ${data.financials.epsDiluted || 'N/A'} |\n`;
  md += `| NAV Per Share | ${data.financials.navPerShare} |\n`;
  md += `| P/E Ratio (Basic) | ${data.financials.peRatioBasic} |\n`;
  md += `| P/E Ratio (Diluted) | ${data.financials.peRatioDiluted || 'N/A'} |\n`;
  md += `| Profit for Year (mn) | ${data.financials.profitForYear} |\n\n`;

  md += `## 🏦 Capital Structure\n\n`;
  md += `| Item | Value |\n`;
  md += `|------|-------|\n`;
  md += `| Authorized Capital (mn) | ${data.basicInfo.authorizedCapital} |\n`;
  md += `| Paid-up Capital (mn) | ${data.basicInfo.paidUpCapital} |\n`;
  md += `| Face Value | ${data.basicInfo.faceValue} |\n`;
  md += `| Market Lot | ${data.basicInfo.marketLot} |\n`;
  md += `| Total Securities | ${data.basicInfo.totalSecurities} |\n`;
  md += `| Debut Trading Date | ${data.basicInfo.debutTradingDate} |\n\n`;

  md += `## 📈 AGM & Dividends\n\n`;
  md += `| Type | Details |\n`;
  md += `|------|----------|\n`;
  md += `| Last AGM | ${data.agmInfo.lastAGMDate} |\n`;
  md += `| Year Ended | ${data.agmInfo.yearEnded} |\n`;
  md += `| Cash Dividend | ${data.agmInfo.cashDividend} |\n`;
  md += `| Bonus Issue | ${data.agmInfo.bonusIssue} |\n`;
  md += `| Right Issue | ${data.agmInfo.rightIssue || 'N/A'} |\n`;
  md += `| Reserve & Surplus (mn) | ${data.agmInfo.reserveSurplus} |\n\n`;

  md += `## 👥 Shareholding Pattern\n\n`;
  md += `| Sponsor/Director | Government | Institute | Foreign | Public |\n`;
  md += `|------------------|------------|-----------|---------|--------|\n`;
  md += `| ${data.shareholding.sponsor}% | ${data.shareholding.govt}% | ${data.shareholding.institute}% | ${data.shareholding.foreign}% | ${data.shareholding.public}% |\n\n`;

  if (data.contact.website || data.contact.email) {
    md += `## 📞 Contact\n\n`;
    if (data.contact.website) md += `- **Website:** ${data.contact.website}\n`;
    if (data.contact.email) md += `- **Email:** ${data.contact.email}\n`;
    if (data.contact.phone) md += `- **Phone:** ${data.contact.phone}\n`;
  }

  return md;
}

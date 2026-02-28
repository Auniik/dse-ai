#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { getVersion } from './lib/utils.js';
import { createLatestCommand } from './commands/latest.js';
import { createDsexCommand } from './commands/dsex.js';
import { createTop30Command } from './commands/top30.js';
import { createTop20Command } from './commands/top20.js';
import { createHistoricalCommand } from './commands/historical.js';
import { createGainersCommand } from './commands/gainers.js';
import { createLosersCommand } from './commands/losers.js';
import { createCompanyCommand } from './commands/company.js';
import { createMarketStatsCommand } from './commands/market-stats.js';
import { createCircuitCommand } from './commands/circuit.js';
import { createSectorsCommand } from './commands/sectors.js';
import { createMarketSummaryCommand } from './commands/market-summary.js';
import { createRiskScreenCommand } from './commands/risk-screen.js';
import { createBlockTradesCommand } from './commands/block-trades.js';
import { createMarketOverviewCommand } from './commands/market-overview.js';
import { createMarginableCommand } from './commands/marginable.js';
import { createGlobalMarketsCommand } from './commands/global-markets.js';
import { createActuarialCommand } from './commands/actuarial.js';
import { createNewsCommand } from './commands/news.js';
import { createComplianceCommand } from './commands/compliance.js';

const program = new Command();

program
  .name('dse-ai')
  .description('AI-friendly CLI for Dhaka Stock Exchange data - Scrapes from dsebd.org')
  .version(getVersion());

program.addCommand(createLatestCommand());
program.addCommand(createDsexCommand());
program.addCommand(createTop30Command());
program.addCommand(createTop20Command());
program.addCommand(createHistoricalCommand());
program.addCommand(createGainersCommand());
program.addCommand(createLosersCommand());
program.addCommand(createCompanyCommand());
program.addCommand(createMarketStatsCommand());
program.addCommand(createCircuitCommand());
program.addCommand(createSectorsCommand());
program.addCommand(createMarketSummaryCommand());
program.addCommand(createRiskScreenCommand());
program.addCommand(createBlockTradesCommand());
program.addCommand(createMarketOverviewCommand());
program.addCommand(createMarginableCommand());
program.addCommand(createGlobalMarketsCommand());
program.addCommand(createActuarialCommand());
program.addCommand(createNewsCommand());
program.addCommand(createComplianceCommand());

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

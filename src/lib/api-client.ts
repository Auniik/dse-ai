import type { StockData } from '../types/index.js';
import { scrapeLatest, type LatestType } from './scrapers/latest-scraper.js';
import { scrapeTop30, scrapeTop20 } from './scrapers/top-scraper.js';
import { scrapeDsex } from './scrapers/dsex-scraper.js';
import { scrapeHistorical } from './scrapers/historical-scraper.js';
import { scrapeGainers, scrapeLosers } from './scrapers/movers-scraper.js';
import { scrapeCompany, type CompanyInfo } from './scrapers/company-scraper.js';
import { scrapeMarketStatistics, type MarketStatistics } from './scrapers/market-stats-scraper.js';
import { scrapeCircuitBreakers, scrapeCircuitBreakersHit, type CircuitBreakerData } from './scrapers/circuit-scraper.js';
import { scrapeSectoralPE, scrapeSectorStocks, type SectorPE, type SectorStock } from './scrapers/sector-scraper.js';
import { scrapeMarketSummary, type HighestRecord, type DailyMarketInfo } from './scrapers/market-summary-scraper.js';
import { scrapeGoingConcernThreats, type GoingConcernThreat, type RiskData } from './scrapers/risk-scraper.js';
import { scrapeBlockTrades, type BlockTrade, type BlockTradesData } from './scrapers/block-trades-scraper.js';
import { scrapeMarketOverview, type MarketOverviewData } from './scrapers/market-overview-scraper.js';
import { scrapeMarginableSecurities, type MarginableSecurity, type MarginableSecuritiesData } from './scrapers/marginable-scraper.js';
import { scrapeGlobalMarkets, type GlobalMarket, type GlobalMarketsData } from './scrapers/global-markets-scraper.js';
import { scrapeActuarialValuation, type ActuarialValuation, type ActuarialValuationData } from './scrapers/actuarial-scraper.js';
import { scrapeNews, type NewsItem, type NewsData } from './scrapers/news-scraper.js';
import { scrapeFinancialCompliance, type FinancialSubmission, type FinancialComplianceData } from './scrapers/financial-compliance-scraper.js';
import { scrapeHolidays, type Holiday, type HolidaysData } from './scrapers/holidays-scraper.js';

export class DseApiClient {
  async getLatest(type: LatestType = 'trade-code'): Promise<{ data: StockData[]; date: string }> {
    return scrapeLatest(type);
  }

  async getDsex(symbol?: string): Promise<{ data: StockData[]; date: string }> {
    return scrapeDsex(symbol);
  }

  async getTop30(): Promise<{ data: StockData[]; date: string }> {
    return scrapeTop30();
  }

  async getTop20(
    type?: 'value' | 'volume' | 'trade'
  ): Promise<
    | { data: StockData[]; date: string }
    | {
        value: { data: StockData[]; date: string };
        volume: { data: StockData[]; date: string };
        trade: { data: StockData[]; date: string };
      }
  > {
    return scrapeTop20(type);
  }

  async getHistorical(startDate: string, endDate: string, inst?: string): Promise<{ data: StockData[]; date: string }> {
    return scrapeHistorical(startDate, endDate, inst);
  }

  async getGainers(): Promise<{ data: StockData[]; date: string }> {
    return scrapeGainers();
  }

  async getLosers(): Promise<{ data: StockData[]; date: string }> {
    return scrapeLosers();
  }

  async getCompany(symbol: string): Promise<{ data: CompanyInfo | null; date: string }> {
    return scrapeCompany(symbol);
  }

  async getMarketStatistics(): Promise<{ data: MarketStatistics; date: string }> {
    return scrapeMarketStatistics();
  }

  async getCircuitBreakers(): Promise<{ data: CircuitBreakerData[]; date: string }> {
    return scrapeCircuitBreakers();
  }

  async getCircuitBreakersHit(type: 'upper' | 'lower' | 'both' = 'both'): Promise<{ data: CircuitBreakerData[]; date: string }> {
    return scrapeCircuitBreakersHit(type);
  }

  async getSectoralPE(): Promise<{ data: SectorPE[]; date: string }> {
    return scrapeSectoralPE();
  }

  async getSectorStocks(areaId: string): Promise<{ data: SectorStock[]; date: string; sectorName: string }> {
    return scrapeSectorStocks(areaId);
  }

  async getMarketSummary(): Promise<{ highestRecords: HighestRecord[]; recentData: DailyMarketInfo[] }> {
    return scrapeMarketSummary();
  }

  async getGoingConcernThreats(): Promise<RiskData> {
    return scrapeGoingConcernThreats();
  }

  async getBlockTrades(): Promise<BlockTradesData> {
    return scrapeBlockTrades();
  }

  async getMarketOverview(): Promise<MarketOverviewData> {
    return scrapeMarketOverview();
  }

  async getMarginableSecurities(): Promise<MarginableSecuritiesData> {
    return scrapeMarginableSecurities();
  }

  async getGlobalMarkets(): Promise<GlobalMarketsData> {
    return scrapeGlobalMarkets();
  }

  async getActuarialValuation(): Promise<ActuarialValuationData> {
    return scrapeActuarialValuation();
  }

  async getNews(options?: { symbol?: string; startDate?: string; endDate?: string }): Promise<NewsData> {
    return scrapeNews(options);
  }

  async getFinancialCompliance(symbol?: string, quarters?: string[]): Promise<FinancialComplianceData> {
    return scrapeFinancialCompliance(symbol, quarters);
  }

  async getHolidays(): Promise<HolidaysData> {
    return scrapeHolidays();
  }
}

let apiClient: DseApiClient | null = null;

export function getAPIClient(): DseApiClient {
  if (!apiClient) {
    apiClient = new DseApiClient();
  }
  return apiClient;
}


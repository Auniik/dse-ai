import type { StockData } from '../types/index.js';
import { getLatest, type LatestType } from './scrapers/latest-scraper.js';
import { getTop30, getTop20 } from './scrapers/top-scraper.js';
import { getDsex } from './scrapers/dsex-scraper.js';
import { getHistorical } from './scrapers/historical-scraper.js';
import { getGainers, getLosers } from './scrapers/movers-scraper.js';
import { getCompany, type CompanyInfo } from './scrapers/company-scraper.js';
import { getMarketStatistics, type MarketStatistics } from './scrapers/market-stats-scraper.js';
import { getCircuitBreakers, getCircuitBreakersHit, type CircuitBreakerData } from './scrapers/circuit-scraper.js';
import { scrapeSectoralPE, scrapeSectorStocks, type SectorPE, type SectorStock } from './scrapers/sector-scraper.js';
import { scrapeMarketSummary, type HighestRecord, type DailyMarketInfo } from './scrapers/market-summary-scraper.js';
import { scrapeGoingConcernThreats, type GoingConcernThreat, type RiskData } from './scrapers/risk-scraper.js';
import { scrapeBlockTrades, type BlockTrade, type BlockTradesData } from './scrapers/block-trades-scraper.js';
import { scrapeMarketOverview, type MarketOverviewData } from './scrapers/market-overview-scraper.js';
import { scrapeMarginableSecurities, type MarginableSecurity, type MarginableSecuritiesData } from './scrapers/marginable-scraper.js';
import { scrapeGlobalMarkets, type GlobalMarket, type GlobalMarketsData } from './scrapers/global-markets-scraper.js';
import { scrapeActuarialValuation, type ActuarialValuation, type ActuarialValuationData } from './scrapers/actuarial-scraper.js';
import { scrapeNews, type NewsItem, type NewsData } from './scrapers/news-scraper.js';

export class DseApiClient {
  async getLatest(type: LatestType = 'trade-code'): Promise<{ data: StockData[]; date: string }> {
    return getLatest(type);
  }

  async getDsex(symbol?: string): Promise<{ data: StockData[]; date: string }> {
    return getDsex(symbol);
  }

  async getTop30(): Promise<{ data: StockData[]; date: string }> {
    return getTop30();
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
    return getTop20(type);
  }

  async getHistorical(startDate: string, endDate: string, inst?: string): Promise<{ data: StockData[]; date: string }> {
    return getHistorical(startDate, endDate, inst);
  }

  async getGainers(): Promise<{ data: StockData[]; date: string }> {
    return getGainers();
  }

  async getLosers(): Promise<{ data: StockData[]; date: string }> {
    return getLosers();
  }

  async getCompany(symbol: string): Promise<{ data: CompanyInfo | null; date: string }> {
    return getCompany(symbol);
  }

  async getMarketStatistics(): Promise<{ data: MarketStatistics; date: string }> {
    return getMarketStatistics();
  }

  async getCircuitBreakers(): Promise<{ data: CircuitBreakerData[]; date: string }> {
    return getCircuitBreakers();
  }

  async getCircuitBreakersHit(type: 'upper' | 'lower' | 'both' = 'both'): Promise<{ data: CircuitBreakerData[]; date: string }> {
    return getCircuitBreakersHit(type);
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
    const response = await fetch('https://www.dsebd.org/going-concern-threat-list.php');
    const html = await response.text();
    return scrapeGoingConcernThreats(html);
  }

  async getBlockTrades(): Promise<BlockTradesData> {
    const response = await fetch('https://www.dsebd.org/mst.txt');
    const text = await response.text();
    return scrapeBlockTrades(text);
  }

  async getMarketOverview(): Promise<MarketOverviewData> {
    const response = await fetch('https://www.dsebd.org/mst.txt');
    const text = await response.text();
    return scrapeMarketOverview(text);
  }

  async getMarginableSecurities(): Promise<MarginableSecuritiesData> {
    const response = await fetch('https://www.dsebd.org/marginable-securities.php');
    const html = await response.text();
    return scrapeMarginableSecurities(html);
  }

  async getGlobalMarkets(): Promise<GlobalMarketsData> {
    const response = await fetch('https://www.dsebd.org/markets.php');
    const html = await response.text();
    return scrapeGlobalMarkets(html);
  }

  async getActuarialValuation(): Promise<ActuarialValuationData> {
    const response = await fetch('https://www.dsebd.org/actuarial-valuation-status.php');
    const html = await response.text();
    return scrapeActuarialValuation(html);
  }

  async getNews(options?: { symbol?: string; startDate?: string; endDate?: string }): Promise<NewsData> {
    let url = 'https://www.dsebd.org/old_news.php?archive=news';
    
    if (options?.symbol) {
      url += `&inst=${options.symbol}&criteria=3`;
    } else if (options?.startDate && options?.endDate) {
      url += `&startDate=${options.startDate}&endDate=${options.endDate}&criteria=4`;
    } else {
      // Default: last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      
      const formatDate = (d: Date) => d.toISOString().split('T')[0];
      url += `&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&criteria=4`;
    }
    
    const response = await fetch(url);
    const html = await response.text();
    return scrapeNews(html);
  }
}

let apiClient: DseApiClient | null = null;

export function getAPIClient(): DseApiClient {
  if (!apiClient) {
    apiClient = new DseApiClient();
  }
  return apiClient;
}


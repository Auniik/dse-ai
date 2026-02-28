import type { StockData } from '../types/index.js';
import { getLatest, type LatestType } from './scrapers/latest-scraper.js';
import { getTop30, getTop20 } from './scrapers/top-scraper.js';
import { getDsex } from './scrapers/dsex-scraper.js';
import { getHistorical } from './scrapers/historical-scraper.js';

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
}


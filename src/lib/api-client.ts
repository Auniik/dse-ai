import * as cheerio from 'cheerio';
import type { StockData } from '../types/index.js';

const BASE_URL = 'https://dsebd.org';

const DSE_URLS = {
  LATEST_DATA: `${BASE_URL}/latest_share_price_scroll_l.php`,
  DSEX: `${BASE_URL}/dseX_share.php`,
  TOP_30: `${BASE_URL}/dse30_share.php`,
  HISTORICAL_DATA: `${BASE_URL}/day_end_archive.php`,
};

export class DseApiClient {
  private async fetchWithRetry(url: string, maxRetries = 3): Promise<string> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.text();
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    throw new Error('Failed to fetch data');
  }

  private parseTable(html: string): StockData[] {
    const $ = cheerio.load(html);
    const data: StockData[] = [];

    // Find the table with class 'shares-table' or 'table-bordered'
    const table = $('table.shares-table, table.table-bordered').first();
    if (!table.length) return data;

    // Get headers from first row
    const headers: string[] = [];
    table.find('tr').first().find('th').each((_, el) => {
      headers.push($(el).text().trim());
    });

    // Parse data rows
    table.find('tr').slice(1).each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length === 0) return;

      const rowData: StockData = {};
      cells.each((idx, cell) => {
        if (idx < headers.length) {
          const value = $(cell).text().trim().replace(/,/g, '');
          rowData[headers[idx]] = value;
        }
      });

      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    });

    return data;
  }

  async getLatest(): Promise<StockData[]> {
    const html = await this.fetchWithRetry(DSE_URLS.LATEST_DATA);
    return this.parseTable(html);
  }

  async getDsex(symbol?: string): Promise<StockData[]> {
    const html = await this.fetchWithRetry(DSE_URLS.DSEX);
    const data = this.parseTable(html);

    if (symbol) {
      return data.filter(item => {
        const tradingCode = item['TRADING CODE'] || item['Trading Code'] || '';
        return tradingCode.toUpperCase() === symbol.toUpperCase();
      });
    }

    return data;
  }

  async getTop30(): Promise<StockData[]> {
    const html = await this.fetchWithRetry(DSE_URLS.TOP_30);
    return this.parseTable(html);
  }

  async getHistorical(startDate: string, endDate: string, inst = 'All Instrument'): Promise<StockData[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      inst,
      archive: 'data',
    });

    const url = `${DSE_URLS.HISTORICAL_DATA}?${params.toString()}`;
    const html = await this.fetchWithRetry(url);
    
    const $ = cheerio.load(html);
    const data: StockData[] = [];

    // Historical data has a different table structure
    const table = $('table.table-bordered').first();
    if (!table.length) return data;

    // Get headers
    const headers: string[] = [];
    table.find('thead tr th, tbody tr:first th').each((_, el) => {
      headers.push($(el).text().trim());
    });

    // Parse tbody rows
    table.find('tbody tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length === 0) return;

      const rowData: StockData = {};
      cells.each((idx, cell) => {
        if (idx < headers.length) {
          const value = $(cell).text().trim().replace(/,/g, '');
          rowData[headers[idx]] = value;
        }
      });

      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    });

    return data;
  }
}

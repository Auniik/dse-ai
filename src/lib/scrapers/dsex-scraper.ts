import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry, parseTable, getDateHeader } from './common.js';

const BASE_URL = 'https://dsebd.org';

export async function scrapeDsex(symbol?: string): Promise<{ data: StockData[]; date: string }> {
  try {
    const url = `${BASE_URL}/dseX_share.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    const data = parseTable(html) as StockData[];
    const dateHeader = getDateHeader($);

    // Filter by symbol if provided
    const filteredData = symbol
      ? data.filter((item) => {
          const tradingCode = item['TRADING CODE'] || item['Trading Code'] || '';
          return tradingCode.toUpperCase() === symbol.toUpperCase();
        })
      : data;

    return { data: filteredData, date: dateHeader };
  } catch (error) {
    throw new Error(`Failed to scrape DSEX data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

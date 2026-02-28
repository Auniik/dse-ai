import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry, parseTableElement, getDateHeader } from './common.js';

const BASE_URL = 'https://dsebd.org';

export async function scrapeTop30(): Promise<{ data: StockData[]; date: string }> {
  try {
    const url = `${BASE_URL}/dse30_share.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    const table = $('table.shares-table, table.table-bordered').first();
    const data = parseTableElement($, table);
    const dateHeader = getDateHeader($);
    return { data, date: dateHeader };
  } catch (error) {
    throw new Error(`Failed to scrape top 30: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function scrapeTop20(
  type?: 'value' | 'volume' | 'trade'
): Promise<
  | { data: StockData[]; date: string }
  | {
      value: { data: StockData[]; date: string };
      volume: { data: StockData[]; date: string };
      trade: { data: StockData[]; date: string };
    }
> {
  try {
    const url = `${BASE_URL}/top_20_share.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Parse all three tables with their dates
    const tables = $('table.shares-table');
    const headers = $('.BodyHead.topBodyHead');

    const results: {
      value: { data: StockData[]; date: string };
      volume: { data: StockData[]; date: string };
      trade: { data: StockData[]; date: string };
    } = {
      value: { data: [], date: '' },
      volume: { data: [], date: '' },
      trade: { data: [], date: '' },
    };

    // First table: By Value
    if (tables.length > 0) {
      results.value.data = parseTableElement($, $(tables[0]));
      if (headers.length > 0) {
        results.value.date = $(headers[0]).text().trim();
      }
    }

    // Second table: By Volume
    if (tables.length > 1) {
      results.volume.data = parseTableElement($, $(tables[1]));
      if (headers.length > 1) {
        results.volume.date = $(headers[1]).text().trim();
      }
    }

    // Third table: By Trade
    if (tables.length > 2) {
      results.trade.data = parseTableElement($, $(tables[2]));
      if (headers.length > 2) {
        results.trade.date = $(headers[2]).text().trim();
      }
    }

    // Return specific type if requested
    if (type) {
      return results[type];
    }

    // Return all tables with dates
    return results;
  } catch (error) {
    throw new Error(`Failed to scrape top 20: ${error instanceof Error ? error.message : String(error)}`);
  }
}

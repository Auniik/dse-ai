import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry, parseTable, getDateHeader } from './common.js';

const BASE_URL = 'https://dsebd.org';

export type LatestType = 'trade-code' | 'change' | 'value' | 'volume' | 'ltp' | 'alpha' | 'debt';

const LATEST_URLS: Record<LatestType, string> = {
  'trade-code': `${BASE_URL}/latest_share_price_scroll_l.php`,
  'change': `${BASE_URL}/latest_share_price_scroll_by_change.php`,
  'value': `${BASE_URL}/latest_share_price_scroll_by_value.php`,
  'volume': `${BASE_URL}/latest_share_price_scroll_by_volume.php`,
  'ltp': `${BASE_URL}/latest_share_price_scroll_by_ltp.php`,
  'alpha': `${BASE_URL}/latest_share_price_alpha.php`,
  'debt': `${BASE_URL}/latest_share_price_scroll_treasury_bond.php`,
};

export async function scrapeLatest(type: LatestType = 'trade-code'): Promise<{ data: StockData[]; date: string }> {
  try {
    const url = LATEST_URLS[type];
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    
    const data = parseTable(html);
    const dateHeader = getDateHeader($);
    
    return { data, date: dateHeader };
  } catch (error) {
    throw new Error(`Failed to scrape latest prices: ${error instanceof Error ? error.message : String(error)}`);
  }
}

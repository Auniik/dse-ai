import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry, parseTable, getDateHeader } from './common.js';

const BASE_URL = 'https://dsebd.org';

export async function scrapeGainers(): Promise<{ data: StockData[]; date: string }> {
  try {
    const url = `${BASE_URL}/top_ten_gainer.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    const data = parseTable(html) as StockData[];
    const dateHeader = getDateHeader($);
    
    return { data, date: dateHeader };
  } catch (error) {
    throw new Error(`Failed to scrape gainers: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function scrapeLosers(): Promise<{ data: StockData[]; date: string }> {
  try {
    const url = `${BASE_URL}/top_ten_loser.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    const data = parseTable(html) as StockData[];
    const dateHeader = getDateHeader($);
    
    return { data, date: dateHeader };
  } catch (error) {
    throw new Error(`Failed to scrape losers: ${error instanceof Error ? error.message : String(error)}`);
  }
}

import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry, parseTable } from './common.js';

const BASE_URL = 'https://dsebd.org';

export async function scrapeHistorical(
  startDate: string,
  endDate: string,
  inst = 'All Instrument'
): Promise<{ data: StockData[]; date: string }> {
  try {
    const params = new URLSearchParams({
      startDate,
      endDate,
      inst,
      archive: 'data',
    });

    const url = `${BASE_URL}/day_end_archive.php?${params.toString()}`;
    const html = await fetchWithRetry(url);

    const data = parseTable(html) as StockData[];

    // Construct date header from parameters
    const dateHeader = inst === 'All Instrument'
      ? `Historical Data from ${startDate} to ${endDate}`
      : `Historical Data for ${inst} from ${startDate} to ${endDate}`;

    return { data, date: dateHeader };
  } catch (error) {
    throw new Error(`Failed to scrape historical data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

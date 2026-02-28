import * as cheerio from 'cheerio';
import { fetchWithRetry } from './common.js';

export interface HighestRecord {
  [key: string]: string;
  metric: string;
  value: string;
  date: string;
}

export interface DailyMarketInfo {
  [key: string]: string;
  date: string;
  totalTrade: string;
  totalVolume: string;
  totalValue: string;
  totalMarketCap: string;
  dsexIndex: string;
  dsesIndex: string;
  ds30Index: string;
  dgenIndex: string;
}

export async function scrapeMarketSummary(): Promise<{
  highestRecords: HighestRecord[];
  recentData: DailyMarketInfo[];
}> {
  const url = 'https://www.dsebd.org/recent_market_information.php';
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const highestRecords: HighestRecord[] = [];
  const recentData: DailyMarketInfo[] = [];

  // Parse Highest Records table (first table)
  $('table.table-bordered').first().find('tr').each((index, row) => {
    if (index === 0) return; // Skip header
    const cells = $(row).find('td');
    if (cells.length >= 3) {
      highestRecords.push({
        metric: $(cells[0]).text().trim(),
        value: $(cells[1]).text().trim(),
        date: $(cells[2]).text().trim(),
      });
    }
  });

  // Parse Recent Market Information table (table with _id="data-table")
  $('table[_id="data-table"] tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 9) {
      recentData.push({
        date: $(cells[0]).text().trim(),
        totalTrade: $(cells[1]).text().trim(),
        totalVolume: $(cells[2]).text().trim(),
        totalValue: $(cells[3]).text().trim(),
        totalMarketCap: $(cells[4]).text().trim(),
        dsexIndex: $(cells[5]).text().trim(),
        dsesIndex: $(cells[6]).text().trim(),
        ds30Index: $(cells[7]).text().trim(),
        dgenIndex: $(cells[8]).text().trim(),
      });
    }
  });

  return { highestRecords, recentData };
}

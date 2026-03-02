import { fetchWithRetry, extractDate } from './common.js';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://dsebd.org';

export interface CircuitBreakerData {
  [key: string]: string;
  '#': string;
  'Trade Code': string;
  'Breaker %': string;
  'Tick Size': string;
  'Open Adj. Price': string;
  'Ref. Floor Price': string;
  'Lower Limit': string;
  'Upper Limit': string;
  'Ref. Floor Price for Block Market': string;
}

export async function scrapeCircuitBreakers(): Promise<{ data: CircuitBreakerData[]; date: string }> {
  try {
    const url = `${BASE_URL}/cbul.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Extract date from header
    const header = $('h2.BodyHead').first().text();
    const date = extractDate(header);

    // Parse the table - it has complex headers with rowspan/colspan
    const data: CircuitBreakerData[] = [];
    const table = $('table.table-bordered').first();
    
    // Skip header rows and parse data directly with known column structure
    table.find('tr').each((idx, row) => {
      // Skip first 2 rows (headers)
      if (idx < 2) return;
      
      const cells = $(row).find('td');
      if (cells.length < 9) return;

      const rowData: any = {
        '#': $(cells[0]).text().trim(),
        'Trade Code': $(cells[1]).text().trim(),
        'Breaker %': $(cells[2]).text().trim(),
        'Tick Size': $(cells[3]).text().trim(),
        'Open Adj. Price': $(cells[4]).text().trim(),
        'Ref. Floor Price': $(cells[5]).text().trim(),
        'Lower Limit': $(cells[6]).text().trim(),
        'Upper Limit': $(cells[7]).text().trim(),
        'Ref. Floor Price for Block Market': $(cells[8]).text().trim(),
      };

      data.push(rowData as CircuitBreakerData);
    });

    return { data, date };
  } catch (error) {
    throw new Error(`Failed to scrape circuit breakers: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function scrapeCircuitBreakersHit(type: 'upper' | 'lower' | 'both' = 'both'): Promise<{ data: CircuitBreakerData[]; date: string }> {
  try {
    const { data, date } = await scrapeCircuitBreakers();
    
    // Filter for circuit breakers that have been hit
    // A circuit breaker is "hit" when Ref. Floor Price has a value
    let filtered = data.filter((row: CircuitBreakerData) => row['Ref. Floor Price'] && row['Ref. Floor Price'] !== '-' && row['Ref. Floor Price'].trim() !== '');
    
    // Further filter by type if specified
    if (type === 'upper') {
      // Upper limit hit when Ref. Floor Price >= Upper Limit
      filtered = filtered.filter((row: CircuitBreakerData) => {
        const floorPrice = parseFloat(row['Ref. Floor Price'].replace(/,/g, ''));
        const upperLimit = parseFloat(row['Upper Limit'].replace(/,/g, ''));
        return !isNaN(floorPrice) && !isNaN(upperLimit) && floorPrice >= upperLimit;
      });
    } else if (type === 'lower') {
      // Lower limit hit when Ref. Floor Price <= Lower Limit
      filtered = filtered.filter((row: CircuitBreakerData) => {
        const floorPrice = parseFloat(row['Ref. Floor Price'].replace(/,/g, ''));
        const lowerLimit = parseFloat(row['Lower Limit'].replace(/,/g, ''));
        return !isNaN(floorPrice) && !isNaN(lowerLimit) && floorPrice <= lowerLimit;
      });
    }
    
    return { data: filtered, date };
  } catch (error) {
    throw new Error(`Failed to scrape circuit breakers hit: ${error instanceof Error ? error.message : String(error)}`);
  }
}


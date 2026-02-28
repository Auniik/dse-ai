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
  'Public Market': string;
  'Ref. Floor Price for Block Market': string;
  'Ref. Floor Price': string;
  'Lower Limit': string;
  'Upper Limit': string;
}

export async function getCircuitBreakers(): Promise<{ data: CircuitBreakerData[]; date: string }> {
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
      'Public Market': $(cells[5]).text().trim(),
      'Ref. Floor Price for Block Market': $(cells[6]).text().trim(),
      'Ref. Floor Price': $(cells[6]).text().trim(), // Same as block market floor  
      'Lower Limit': $(cells[7]).text().trim(),
      'Upper Limit': $(cells[8]).text().trim(),
    };

    data.push(rowData as CircuitBreakerData);
  });

  return { data, date };
}

export async function getCircuitBreakersHit(type: 'upper' | 'lower' | 'both' = 'both'): Promise<{ data: CircuitBreakerData[]; date: string }> {
  const { data, date } = await getCircuitBreakers();
  
  // Filter for circuit breakers that have been hit
  // A circuit breaker is "hit" when Public Market column has a value
  let filtered = data.filter(row => row['Public Market'] && row['Public Market'] !== '-' && row['Public Market'].trim() !== '');
  
  // Further filter by type if specified
  if (type === 'upper') {
    // Upper limit hit when Public Market >= Upper Limit
    filtered = filtered.filter(row => {
      const publicPrice = parseFloat(row['Public Market'].replace(/,/g, ''));
      const upperLimit = parseFloat(row['Upper Limit'].replace(/,/g, ''));
      return !isNaN(publicPrice) && !isNaN(upperLimit) && publicPrice >= upperLimit;
    });
  } else if (type === 'lower') {
    // Lower limit hit when Public Market <= Lower Limit
    filtered = filtered.filter(row => {
      const publicPrice = parseFloat(row['Public Market'].replace(/,/g, ''));
      const lowerLimit = parseFloat(row['Lower Limit'].replace(/,/g, ''));
      return !isNaN(publicPrice) && !isNaN(lowerLimit) && publicPrice <= lowerLimit;
    });
  }
  
  return { data: filtered, date };
}


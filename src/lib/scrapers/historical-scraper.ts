import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://dsebd.org';

export async function getHistorical(
  startDate: string,
  endDate: string,
  inst = 'All Instrument'
): Promise<{ data: StockData[]; date: string }> {
  const params = new URLSearchParams({
    startDate,
    endDate,
    inst,
    archive: 'data',
  });

  const url = `${BASE_URL}/day_end_archive.php?${params.toString()}`;
  const html = await fetchWithRetry(url);

  const $ = cheerio.load(html);
  const data: StockData[] = [];

  // Historical data has a different table structure
  const table = $('table.table-bordered').first();
  if (!table.length) return { data, date: '' };

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

  // Construct date header from parameters
  const dateHeader = inst === 'All Instrument'
    ? `Historical Data from ${startDate} to ${endDate}`
    : `Historical Data for ${inst} from ${startDate} to ${endDate}`;

  return { data, date: dateHeader };
}

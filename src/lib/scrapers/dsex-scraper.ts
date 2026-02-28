import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://dsebd.org';

export async function getDsex(symbol?: string): Promise<{ data: StockData[]; date: string }> {
  const url = `${BASE_URL}/dseX_share.php`;
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const data: StockData[] = [];
  const table = $('table.table-bordered').first();
  if (!table.length) return { data, date: '' };

  // Get headers
  const headers: string[] = [];
  table.find('tr').first().find('th').each((_, el) => {
    headers.push($(el).text().trim());
  });

  // Parse rows
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

  // Extract date header
  const dateHeader = $('.BodyHead.topBodyHead').first().text().trim();

  // Filter by symbol if provided
  const filteredData = symbol
    ? data.filter((item) => {
        const tradingCode = item['TRADING CODE'] || item['Trading Code'] || '';
        return tradingCode.toUpperCase() === symbol.toUpperCase();
      })
    : data;

  return { data: filteredData, date: dateHeader };
}

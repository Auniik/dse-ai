import * as cheerio from 'cheerio';
import type { StockData } from '../../types/index.js';
import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://dsebd.org';

export async function getGainers(): Promise<{ data: StockData[]; date: string }> {
  const url = `${BASE_URL}/top_ten_gainer.php`;
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const data: StockData[] = [];
  const table = $('table.shares-table, table.table-bordered').first();
  
  if (!table.length) return { data, date: '' };

  const headers: string[] = [];
  table.find('tr').first().find('th').each((_, el) => {
    headers.push($(el).text().trim());
  });

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

  const dateHeader = $('.BodyHead.topBodyHead').first().text().trim();
  return { data, date: dateHeader };
}

export async function getLosers(): Promise<{ data: StockData[]; date: string }> {
  const url = `${BASE_URL}/top_ten_loser.php`;
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const data: StockData[] = [];
  const table = $('table.shares-table, table.table-bordered').first();
  
  if (!table.length) return { data, date: '' };

  const headers: string[] = [];
  table.find('tr').first().find('th').each((_, el) => {
    headers.push($(el).text().trim());
  });

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

  const dateHeader = $('.BodyHead.topBodyHead').first().text().trim();
  return { data, date: dateHeader };
}

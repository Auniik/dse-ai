import * as cheerio from 'cheerio';

export async function fetchWithRetry(url: string, maxRetries = 3): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  throw new Error('Failed to fetch data');
}

export function parseTable(html: string): any[] {
  const $ = cheerio.load(html);
  const data: any[] = [];

  // Find the table with class 'shares-table' or 'table-bordered'
  const table = $('table.shares-table, table.table-bordered').first();
  if (!table.length) return data;

  // Get headers from first row
  const headers: string[] = [];
  table.find('tr').first().find('th').each((_, el) => {
    headers.push($(el).text().trim());
  });

  // Parse data rows
  table.find('tr').slice(1).each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length === 0) return;

    const rowData: any = {};
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

  return data;
}

export function parseTableElement($: any, table: any): any[] {
  const data: any[] = [];
  const headers: string[] = [];

  // Get headers
  table.find('tr').first().find('th').each((_: number, el: any) => {
    headers.push($(el).text().trim());
  });

  // Parse rows
  table.find('tr').slice(1).each((_: number, row: any) => {
    const cells = $(row).find('td');
    if (cells.length === 0) return;

    const rowData: any = {};
    cells.each((idx: number, cell: any) => {
      if (idx < headers.length) {
        const value = $(cell).text().trim().replace(/,/g, '');
        rowData[headers[idx]] = value;
      }
    });

    if (Object.keys(rowData).length > 0) {
      data.push(rowData);
    }
  });

  return data;
}

export function extractDate(text: string): string {
  // Extract date and time from text like "Latest Share Price On Feb 26, 2026 at 2:20 PM"
  // Return the full "On <date> at <time>" part
  const match = text.match(/[Oo]n\s+(.+)/i);
  return match ? match[1].trim() : '';
}

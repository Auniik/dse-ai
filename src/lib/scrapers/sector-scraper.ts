import * as cheerio from 'cheerio';
import { fetchWithRetry, extractDate, parseTable } from './common.js';

export interface SectorPE {
  [key: string]: string;
  name: string;
  medianPE: string;
  areaId: string;
}

export interface SectorStock {
  [key: string]: string;
  rank: string;
  tradingCode: string;
  ltp: string;
  high: string;
  low: string;
  closePrice: string;
  openAdjPrice: string;
  change: string;
  trade: string;
  valueMn: string;
  volume: string;
}

export async function scrapeSectoralPE(): Promise<{ data: SectorPE[]; date: string }> {
  const url = 'https://www.dsebd.org/sectoral_PE.php';
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const date = extractDate($('.BodyHead.topBodyHead').text());
  const sectors: SectorPE[] = [];

  $('table.shares-table tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 3) {
      const link = $(cells[1]).find('a');
      const name = link.text().trim();
      const href = link.attr('href') || '';
      const areaMatch = href.match(/area=(\d+)/);
      const areaId = areaMatch ? areaMatch[1] : '';
      const medianPE = $(cells[2]).text().trim();

      if (name && medianPE) {
        sectors.push({ name, medianPE, areaId });
      }
    }
  });

  return { data: sectors, date };
}

export async function scrapeSectorStocks(areaId: string): Promise<{ data: SectorStock[]; date: string; sectorName: string }> {
  const url = `https://www.dsebd.org/ltp_industry.php?area=${areaId}`;
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  const date = extractDate($('.BodyHead.topBodyHead').text());
  
  // Extract sector name from header  
  const header = $('.BodyHead.topBodyHead').text();
  const sectorMatch = header.match(/Business Area:.*?([\w\s&]+?)\s+on/);
  const sectorName = sectorMatch ? sectorMatch[1].trim() : 'Unknown';

  const stocks: SectorStock[] = [];

  $('table.shares-table tbody tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 11) {
      stocks.push({
        rank: $(cells[0]).text().trim(),
        tradingCode: $(cells[1]).find('a').text().trim() || $(cells[1]).text().trim(),
        ltp: $(cells[2]).text().trim(),
        high: $(cells[3]).text().trim(),
        low: $(cells[4]).text().trim(),
        closePrice: $(cells[5]).text().trim(),
        openAdjPrice: $(cells[6]).text().trim(),
        change: $(cells[7]).text().trim(),
        trade: $(cells[8]).text().trim(),
        valueMn: $(cells[9]).text().trim(),
        volume: $(cells[10]).text().trim(),
      });
    }
  });

  return { data: stocks, date, sectorName };
}

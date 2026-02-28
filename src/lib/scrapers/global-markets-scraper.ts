import * as cheerio from 'cheerio';

export interface GlobalMarket {
  country: string;
  region: string;
  indexCurrent: string;
  indexPrevious: string;
  changeMonth: string;
  changeYear: string;
  gdpGrowth: string;
  inflation: string;
  interestRate: string;
  [key: string]: string;
}

export interface GlobalMarketsData {
  data: GlobalMarket[];
  regions: string[];
}

export async function scrapeGlobalMarkets(html: string): Promise<GlobalMarketsData> {
  const $ = cheerio.load(html);
  
  const markets: GlobalMarket[] = [];
  let currentRegion = '';
  const regions: string[] = [];
  
  $('table.table-bordered tr').each((_, row) => {
    const cells = $(row).find('td');
    
    // Check if this is a region header row
    if (cells.length === 1 && $(cells[0]).attr('colspan') === '8') {
      currentRegion = $(cells[0]).text().trim();
      if (currentRegion && !regions.includes(currentRegion)) {
        regions.push(currentRegion);
      }
      return;
    }
    
    // Parse data rows (should have 8 cells)
    if (cells.length >= 8 && currentRegion) {
      const country = $(cells[0]).text().trim();
      const indexCurrent = $(cells[1]).text().trim().replace(/\s+/g, '');
      const indexPrevious = $(cells[2]).text().trim().replace(/\s+/g, '');
      const changeMonth = $(cells[3]).text().trim().replace(/\s+/g, '');
      const changeYear = $(cells[4]).text().trim().replace(/\s+/g, '');
      const gdpGrowth = $(cells[5]).text().trim().replace(/\s+/g, '');
      const inflation = $(cells[6]).text().trim().replace(/\s+/g, '');
      const interestRate = $(cells[7]).text().trim().replace(/\s+/g, '');
      
      if (country && indexCurrent) {
        markets.push({
          country,
          region: currentRegion,
          indexCurrent,
          indexPrevious,
          changeMonth,
          changeYear,
          gdpGrowth,
          inflation,
          interestRate
        });
      }
    }
  });
  
  return {
    data: markets,
    regions
  };
}

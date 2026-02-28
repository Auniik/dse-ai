import * as cheerio from 'cheerio';

export interface MarginableSecurity {
  tradingCode: string;
  companyName: string;
  category: string;
  [key: string]: string;
}

export interface MarginableSecuritiesData {
  data: MarginableSecurity[];
  date: string;
  total: number;
}

export async function scrapeMarginableSecurities(html: string): Promise<MarginableSecuritiesData> {
  const $ = cheerio.load(html);
  
  const dateText = $('.BodyHead').text();
  const dateMatch = dateText.match(/as on\s+(.+?)$/);
  const date = dateMatch ? dateMatch[1].trim() : 'N/A';
  
  const securities: MarginableSecurity[] = [];
  
  $('table.table-bordered tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 4) {
      const tradingCode = $(cells[1]).text().trim();
      const companyName = $(cells[2]).text().trim();
      const category = $(cells[3]).text().trim();
      
      if (tradingCode && companyName) {
        securities.push({
          tradingCode,
          companyName,
          category
        });
      }
    }
  });
  
  return {
    data: securities,
    date,
    total: securities.length
  };
}

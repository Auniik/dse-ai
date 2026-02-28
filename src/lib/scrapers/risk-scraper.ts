import * as cheerio from 'cheerio';
import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://www.dsebd.org';

export interface GoingConcernThreat {
  tradingCode: string;
  companyName: string;
  status: string;
  [key: string]: string;
}

export interface RiskData {
  data: GoingConcernThreat[];
  date: string;
}

export async function scrapeGoingConcernThreats(): Promise<RiskData> {
  try {
    const url = `${BASE_URL}/going-concern-threat-list.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    
    const dateText = $('.BodyHead').text();
    const dateMatch = dateText.match(/as on\s+(.+?)$/);
    const date = dateMatch ? dateMatch[1].trim() : 'N/A';
    
    const threats: GoingConcernThreat[] = [];
    
    $('table.table-bordered tbody tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 4) {
        const tradingCode = $(cells[1]).text().trim();
        const companyName = $(cells[2]).text().trim();
        const status = $(cells[3]).text().trim();
        
        if (tradingCode && companyName) {
          threats.push({
            tradingCode,
            companyName,
            status
          });
        }
      }
    });
    
    return { data: threats, date };
  } catch (error) {
    throw new Error(`Failed to scrape going concern threats: ${error instanceof Error ? error.message : String(error)}`);
  }
}

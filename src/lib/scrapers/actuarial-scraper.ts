import * as cheerio from 'cheerio';

export interface ActuarialValuation {
  tradingCode: string;
  companyName: string;
  status: string;
  [key: string]: string;
}

export interface ActuarialValuationData {
  data: ActuarialValuation[];
  date: string;
  total: number;
  compliant: number;
  nonCompliant: number;
}

export async function scrapeActuarialValuation(html: string): Promise<ActuarialValuationData> {
  const $ = cheerio.load(html);
  
  const dateText = $('.BodyHead').text();
  const dateMatch = dateText.match(/as on\s+(.+?)$/);
  const date = dateMatch ? dateMatch[1].trim() : 'N/A';
  
  const valuations: ActuarialValuation[] = [];
  let compliant = 0;
  let nonCompliant = 0;
  
  $('table.table-bordered tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length >= 4) {
      const tradingCode = $(cells[1]).text().trim();
      const companyName = $(cells[2]).text().trim();
      const status = $(cells[3]).text().trim();
      
      if (tradingCode && companyName) {
        valuations.push({
          tradingCode,
          companyName,
          status
        });
        
        if (status.toLowerCase() === 'yes') {
          compliant++;
        } else {
          nonCompliant++;
        }
      }
    }
  });
  
  return {
    data: valuations,
    date,
    total: valuations.length,
    compliant,
    nonCompliant
  };
}

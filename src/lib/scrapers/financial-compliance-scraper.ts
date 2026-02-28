import * as cheerio from 'cheerio';

export interface FinancialSubmission {
  tradingCode: string;
  yearEnd: string;
  financialYear: string;
  quarter: string;
  period: string;
  submissionDeadline: string;
  extensionApplication: string;
  approvedDeadline: string;
  submissionDate: string;
  status: string;
  websiteStatus: string;
  [key: string]: string;
}

export interface FinancialComplianceData {
  submissions: FinancialSubmission[];
  totalSubmissions: number;
  symbol?: string;
}

export async function scrapeFinancialCompliance(
  symbol?: string,
  quarters?: string[]
): Promise<FinancialComplianceData> {
  try {
    const url = 'https://www.dsebd.org/ajax/load-financial-upload-status.php';
    
    // Build form data
    const formData = new URLSearchParams();
    
    if (symbol) {
      formData.append('tradeCode', symbol);
    } else {
      formData.append('tradeCode', '');
    }
    
    // If no quarters specified, get all by sending all quarter types
    if (!quarters || quarters.length === 0) {
      formData.append('quarters[]', 'Q1');
      formData.append('quarters[]', 'Q2');
      formData.append('quarters[]', 'Q3');
      formData.append('quarters[]', 'Annual');
    } else {
      quarters.forEach(q => {
        formData.append('quarters[]', q);
      });
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (compatible; dse-ai/1.0)',
      },
      body: formData.toString()
    });
    
    const html = await response.text();
    return parseFinancialCompliance(html, symbol);
  } catch (error) {
    throw new Error(`Failed to scrape financial compliance: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function parseFinancialCompliance(html: string, symbol?: string): FinancialComplianceData {
  const $ = cheerio.load(html);
  const submissions: FinancialSubmission[] = [];
  
  // Find the table
  const $table = $('table.table').first();
  
  // Parse each row (skip header)
  $table.find('tr').each((index, row) => {
    if (index === 0) return; // Skip header
    
    const $row = $(row);
    const cells = $row.find('td').map((_, cell) => $(cell).text().trim()).get();
    
    if (cells.length >= 11) {
      submissions.push({
        tradingCode: cells[0],
        yearEnd: cells[1],
        financialYear: cells[2],
        quarter: cells[3],
        period: cells[4],
        submissionDeadline: cells[5],
        extensionApplication: cells[6],
        approvedDeadline: cells[7],
        submissionDate: cells[8],
        status: cells[9],
        websiteStatus: cells[10]
      });
    }
  });
  
  return {
    submissions,
    totalSubmissions: submissions.length,
    symbol
  };
}

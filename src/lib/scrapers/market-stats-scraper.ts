import * as cheerio from 'cheerio';
import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://dsebd.org';

export interface MarketCategory {
  category: string;
  advanced: string;
  declined: string;
  unchanged: string;
  totalTraded: string;
}

export interface MarketTransaction {
  trades: string;
  volume: string;
  value: string;
}

export interface MarketCapitalization {
  equity: string;
  mutualFund: string;
  debtSecurities: string;
  total: string;
}

export interface BlockTrade {
  instrCode: string;
  maxPrice: string;
  minPrice: string;
  trades: string;
  quantity: string;
  value: string;
}

export interface MarketStatistics {
  date: string;
  categories: MarketCategory[];
  transactions: MarketTransaction;
  marketCap: MarketCapitalization;
  blockTrades: BlockTrade[];
}

export async function getMarketStatistics(): Promise<{ data: MarketStatistics; date: string }> {
  const url = `${BASE_URL}/market-statistics.php`;
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  // Get the pre-formatted text
  const preText = $('pre').text();
  
  // Extract date from header
  const dateMatch = preText.match(/TODAY'S SHARE MARKET\s*:\s*(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';

  // Parse categories
  const categories: MarketCategory[] = [];
  const categoryNames = ['All Category', 'A Category', 'B Category', 'N Category', 'Z Category', 'MUTUAL FUND (MF)', 'CORPORATE BOND (CB)', 'Govt. Sec (G-Sec)'];
  
  for (const catName of categoryNames) {
    const catRegex = new RegExp(
      `${catName.replace(/[()]/g, '\\$&')}\\s+ISSUES ADVANCED\\s+:\\s+(\\d+)\\s+ISSUES DECLINED\\s+:\\s+(\\d+)\\s+ISSUES UNCHANGED\\s+:\\s+(\\d+)\\s+TOTAL ISSUES TRADED\\s+:\\s+(\\d+)`,
      'i'
    );
    const match = preText.match(catRegex);
    if (match) {
      categories.push({
        category: catName,
        advanced: match[1],
        declined: match[2],
        unchanged: match[3],
        totalTraded: match[4],
      });
    }
  }

  // Parse transactions
  const tradesMatch = preText.match(/A\.\s*NO\. OF TRADES\s+:\s+([\d,]+)/);
  const volumeMatch = preText.match(/B\.\s*VOLUME\(Nos\.\)\s+:\s+([\d,]+)/);
  const valueMatch = preText.match(/C\.\s*VALUE\(Tk\)\s+:\s+([\d,.]+)/);

  const transactions: MarketTransaction = {
    trades: tradesMatch ? tradesMatch[1] : '',
    volume: volumeMatch ? volumeMatch[1] : '',
    value: valueMatch ? valueMatch[1] : '',
  };

  // Parse market capitalization
  const equityMatch = preText.match(/1\.\s*EQUITY\s+:\s+([\d,.]+)/);
  const mfMatch = preText.match(/2\.\s*MUTUAL FUND\s+:\s+([\d,.]+)/);
  const debtMatch = preText.match(/3\.\s*DEBT SECURITIES\s+:\s+([\d,.]+)/);
  const totalCapMatch = preText.match(/TOTAL\s+:\s+([\d,.]+)/);

  const marketCap: MarketCapitalization = {
    equity: equityMatch ? equityMatch[1] : '',
    mutualFund: mfMatch ? mfMatch[1] : '',
    debtSecurities: debtMatch ? debtMatch[1] : '',
    total: totalCapMatch ? totalCapMatch[1] : '',
  };

  // Parse block trades
  const blockTrades: BlockTrade[] = [];
  const blockHeaderIndex = preText.indexOf('PRICES IN BLOCK TRANSACTIONS');
  
  if (blockHeaderIndex !== -1) {
    const blockSection = preText.substring(blockHeaderIndex);
    const lines = blockSection.split('\n');
    
    for (const line of lines) {
      // Skip header lines and separators
      if (line.includes('PRICES IN BLOCK') || line.includes('===') || 
          line.includes('Instr Code') || line.includes('---') ||
          line.trim().startsWith('Total') || !line.trim()) {
        continue;
      }
      
      // Match format: INSTRCODE   PRICE   PRICE   NUMBER   NUMBER   NUMBER
      const match = line.match(/^\s*([A-Z0-9&]+)\s+([\d.]+)\s+([\d.]+)\s+(\d+)\s+([\d,]+)\s+([\d.]+)/);
      if (match) {
        blockTrades.push({
          instrCode: match[1],
          maxPrice: match[2],
          minPrice: match[3],
          trades: match[4],
          quantity: match[5],
          value: match[6],
        });
      }
    }
  }

  const data: MarketStatistics = {
    date,
    categories,
    transactions,
    marketCap,
    blockTrades,
  };

  return { data, date };
}

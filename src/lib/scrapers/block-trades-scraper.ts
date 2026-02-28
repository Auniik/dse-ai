import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://www.dsebd.org';

export interface BlockTrade {
  instrCode: string;
  maxPrice: string;
  minPrice: string;
  trades: string;
  quantity: string;
  valueInMn: string;
  [key: string]: string;
}

export interface BlockTradesData {
  data: BlockTrade[];
  date: string;
  totalTrades: number;
  totalQuantity: number;
  totalValue: number;
  totalScrips: number;
}

export async function scrapeBlockTrades(): Promise<BlockTradesData> {
  try {
    const url = `${BASE_URL}/mst.txt`;
    const text = await fetchWithRetry(url);
    const lines = text.split('\n');
  
  // Find date from header
  let date = 'N/A';
  const dateLineIndex = lines.findIndex(line => line.includes('PRICES IN BLOCK TRANSACTIONS'));
  if (dateLineIndex !== -1) {
    const dateLine = lines[dateLineIndex];
    const dateMatch = dateLine.match(/:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      date = dateMatch[1];
    }
  }
  
  // Find header line and data start
  const headerIndex = lines.findIndex(line => line.includes('Instr Code') && line.includes('Max Price'));
  if (headerIndex === -1) {
    return { data: [], date, totalTrades: 0, totalQuantity: 0, totalValue: 0, totalScrips: 0 };
  }
  
  const trades: BlockTrade[] = [];
  let totalTrades = 0;
  let totalQuantity = 0;
  let totalValue = 0;
  let totalScrips = 0;
  
  // Parse data lines (start after empty line following header)
  for (let i = headerIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Stop at summary line or empty section
    if (line.includes('------') || line.includes('Total number of scrips')) {
      // Try to extract totals
      const totalLine = lines[i + 1] || '';
      const parts = totalLine.trim().split(/\s+/);
      if (parts.length >= 3) {
        totalTrades = parseInt(parts[0]) || 0;
        totalQuantity = parseInt(parts[1]) || 0;
        totalValue = parseFloat(parts[2]) || 0;
      }
      
      // Get total scrips count
      const scripsLine = lines.find(l => l.includes('Total number of scrips traded in Block'));
      if (scripsLine) {
        const match = scripsLine.match(/=\s*(\d+)/);
        if (match) totalScrips = parseInt(match[1]);
      }
      break;
    }
    
    if (!line || line.length < 10) continue;
    
    // Parse fixed-width format
    const parts = line.split(/\s+/);
    if (parts.length >= 6) {
      trades.push({
        instrCode: parts[0],
        maxPrice: parts[1],
        minPrice: parts[2],
        trades: parts[3],
        quantity: parts[4],
        valueInMn: parts[5]
      });
    }
  }
  
  return {
    data: trades,
    date,
    totalTrades,
    totalQuantity,
    totalValue,
    totalScrips
  };
  } catch (error) {
    throw new Error(`Failed to scrape block trades: ${error instanceof Error ? error.message : String(error)}`);
  }
}

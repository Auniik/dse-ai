export interface CategoryStats {
  category: string;
  advanced: number;
  declined: number;
  unchanged: number;
  totalTraded: number;
  [key: string]: string | number;
}

export interface TransactionStats {
  trades: number;
  volume: number;
  value: number;
}

export interface MarketCapitalization {
  equity: number;
  mutualFund: number;
  debtSecurities: number;
  total: number;
}

export interface MarketOverviewData {
  date: string;
  categoryStats: CategoryStats[];
  transactions: TransactionStats;
  marketCap: MarketCapitalization;
}

export async function scrapeMarketOverview(text: string): Promise<MarketOverviewData> {
  const lines = text.split('\n');
  
  // Extract date
  let date = 'N/A';
  const dateLineIndex = lines.findIndex(line => line.includes("TODAY'S SHARE MARKET"));
  if (dateLineIndex !== -1) {
    const dateLine = lines[dateLineIndex];
    const dateMatch = dateLine.match(/:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      date = dateMatch[1];
    }
  }
  
  // Parse category statistics
  const categoryStats: CategoryStats[] = [];
  const categories = ['All Category', 'A Category', 'B Category', 'N Category', 'Z Category', 
                      'MUTUAL FUND (MF)', 'CORPORATE BOND (CB)', 'Govt. Sec (G-Sec)'];
  
  for (const category of categories) {
    const catIndex = lines.findIndex(line => line.trim() === category);
    if (catIndex !== -1) {
      const stats: CategoryStats = {
        category: category,
        advanced: 0,
        declined: 0,
        unchanged: 0,
        totalTraded: 0
      };
      
      // Extract stats from next few lines
      for (let i = catIndex + 1; i < catIndex + 10; i++) {
        const line = lines[i];
        if (line.includes('ISSUES ADVANCED')) {
          const match = line.match(/:\s*(\d+)/);
          if (match) stats.advanced = parseInt(match[1]);
        } else if (line.includes('ISSUES DECLINED')) {
          const match = line.match(/:\s*(\d+)/);
          if (match) stats.declined = parseInt(match[1]);
        } else if (line.includes('ISSUES UNCHANGED')) {
          const match = line.match(/:\s*(\d+)/);
          if (match) stats.unchanged = parseInt(match[1]);
        } else if (line.includes('TOTAL ISSUES TRADED')) {
          const match = line.match(/:\s*(\d+)/);
          if (match) stats.totalTraded = parseInt(match[1]);
          break;
        }
      }
      
      categoryStats.push(stats);
    }
  }
  
  // Parse total transactions
  const transactions: TransactionStats = {
    trades: 0,
    volume: 0,
    value: 0
  };
  
  const transIndex = lines.findIndex(line => line.includes('TOTAL TRANSACTIONS'));
  if (transIndex !== -1) {
    for (let i = transIndex + 1; i < transIndex + 10; i++) {
      const line = lines[i];
      if (line.includes('NO. OF TRADES')) {
        const match = line.match(/:\s*(\d+)/);
        if (match) transactions.trades = parseInt(match[1]);
      } else if (line.includes('VOLUME')) {
        const match = line.match(/:\s*(\d+)/);
        if (match) transactions.volume = parseInt(match[1]);
      } else if (line.includes('VALUE')) {
        const match = line.match(/:\s*([\d.]+)/);
        if (match) transactions.value = parseFloat(match[1]);
      }
    }
  }
  
  // Parse market capitalization
  const marketCap: MarketCapitalization = {
    equity: 0,
    mutualFund: 0,
    debtSecurities: 0,
    total: 0
  };
  
  const capIndex = lines.findIndex(line => line.includes('MARKET CAPITALISATION'));
  if (capIndex !== -1) {
    for (let i = capIndex + 1; i < capIndex + 10; i++) {
      const line = lines[i];
      if (line.includes('1. EQUITY')) {
        const match = line.match(/:\s*([\d.]+)/);
        if (match) marketCap.equity = parseFloat(match[1]);
      } else if (line.includes('2. MUTUAL FUND')) {
        const match = line.match(/:\s*([\d.]+)/);
        if (match) marketCap.mutualFund = parseFloat(match[1]);
      } else if (line.includes('3. DEBT SECURITIES')) {
        const match = line.match(/:\s*([\d.]+)/);
        if (match) marketCap.debtSecurities = parseFloat(match[1]);
      } else if (line.includes('TOTAL') && line.includes(':')) {
        const match = line.match(/:\s*([\d.]+)/);
        if (match) marketCap.total = parseFloat(match[1]);
        break;
      }
    }
  }
  
  return {
    date,
    categoryStats,
    transactions,
    marketCap
  };
}

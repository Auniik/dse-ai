import * as cheerio from 'cheerio';
import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://dsebd.org';

export interface CompanyInfo {
  companyName: string;
  tradingCode: string;
  sector: string;
  marketInfo: {
    ltp: string;
    change: string;
    changePercent: string;
    dayRange: string;
    fiftyTwoWeekRange: string;
    closingPrice: string;
    openingPrice: string;
    yesterdayClose: string;
    dayTrade: string;
    dayVolume: string;
    dayValue: string;
    marketCap: string;
    freeFloatMarketCap: string;
    lastUpdate: string;
  };
  basicInfo: {
    authorizedCapital: string;
    paidUpCapital: string;
    faceValue: string;
    marketLot: string;
    totalSecurities: string;
    debutTradingDate: string;
    instrumentType: string;
  };
  agmInfo: {
    lastAGMDate: string;
    yearEnded: string;
    cashDividend: string;
    bonusIssue: string;
    rightIssue: string;
    reserveSurplus: string;
  };
  financials: {
    epsBasic: string;
    epsDiluted: string;
    navPerShare: string;
    profitForYear: string;
    peRatioBasic: string;
    peRatioDiluted: string;
  };
  shareholding: {
    sponsor: string;
    govt: string;
    institute: string;
    foreign: string;
    public: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

export async function getCompany(symbol: string): Promise<{ data: CompanyInfo | null; date: string }> {
  const url = `${BASE_URL}/displayCompany.php?name=${symbol.toUpperCase()}`;
  const html = await fetchWithRetry(url);
  const $ = cheerio.load(html);

  // Extract company name
  const companyName = $('h2.BodyHead').first().text().replace('Company Name:', '').trim();
  
  if (!companyName) {
    return { data: null, date: '' };
  }

  // Extract market date
  const dateHeader = $('h2:contains("Market Information")').first().text();
  const dateMatch = dateHeader.match(/[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}/);
  const date = dateMatch ? dateMatch[0] : '';

  const data: CompanyInfo = {
    companyName,
    tradingCode: symbol.toUpperCase(),
    sector: '',
    marketInfo: {
      ltp: '',
      change: '',
      changePercent: '',
      dayRange: '',
      fiftyTwoWeekRange: '',
      closingPrice: '',
      openingPrice: '',
      yesterdayClose: '',
      dayTrade: '',
      dayVolume: '',
      dayValue: '',
      marketCap: '',
      freeFloatMarketCap: '',
      lastUpdate: '',
    },
    basicInfo: {
      authorizedCapital: '',
      paidUpCapital: '',
      faceValue: '',
      marketLot: '',
      totalSecurities: '',
      debutTradingDate: '',
      instrumentType: '',
    },
    agmInfo: {
      lastAGMDate: '',
      yearEnded: '',
      cashDividend: '',
      bonusIssue: '',
      rightIssue: '',
      reserveSurplus: '',
    },
    financials: {
      epsBasic: '',
      epsDiluted: '',
      navPerShare: '',
      profitForYear: '',
      peRatioBasic: '',
      peRatioDiluted: '',
    },
    shareholding: {
      sponsor: '',
      govt: '',
      institute: '',
      foreign: '',
      public: '',
    },
    contact: {
      address: '',
      phone: '',
      email: '',
      website: '',
    },
  };

  // Extract market info table
  $('table').each((_, table) => {
    const $table = $(table);
    $table.find('tr').each((_, row) => {
      const $row = $(row);
      const cells = $row.find('th, td');
      
      // Process pairs of th-td or 4 cells (th-td-th-td)
      if (cells.length === 4) {
        const key1 = $(cells[0]).text().trim();
        const value1 = $(cells[1]).text().trim();
        const key2 = $(cells[2]).text().trim();
        const value2 = $(cells[3]).text().trim();
        
        parseKeyValue(key1, value1, data, $(cells[1]));
        parseKeyValue(key2, value2, data, $(cells[3]));
      } else if (cells.length === 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        parseKeyValue(key, value, data, $(cells[1]));
      }
    });
  });

  // Extract AGM date
  $('h2.BodyHead').each((_, el) => {
    const text = $(el).text();
    if (text.includes('Last AGM')) {
      const agmMatch = text.match(/Last AGM held on:\s*([^\s]+)/);
      if (agmMatch) {
        data.agmInfo.lastAGMDate = agmMatch[1].trim();
      }
      const yearMatch = text.match(/For the year ended:\s*(.+)/);
      if (yearMatch) {
        data.agmInfo.yearEnded = yearMatch[1].trim();
      }
    }
  });

  // Extract latest financial data from audited statements table
  // Find table with 2024 data
  $('table').each((_, table) => {
    const $table = $(table);
    const tableText = $table.text();
    
    // Look for financial performance table with recent year
    if (tableText.includes('2024') && tableText.includes('EPS') && tableText.includes('NAV')) {
      $table.find('tr').each((_, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        // Check if this row starts with a year (colspan=2 for year)
        if (cells.length >= 10) {
          const firstCell = cells.eq(0);
          const secondCell = cells.eq(1);
          
          // Check if first two cells form the year 2024
          if (firstCell.attr('colspan') === '2' && firstCell.text().trim() === '2024') {
            // Indices after colspan=2: 0(year), 1(-), 2(-), 3(-), 4(EPS-Basic), 5(EPS-Diluted/-), 6(-), 7(NAV), 8(-), 9(-), 10(Profit), 11(TCI), 12(TCI)
            data.financials.epsBasic = cells.eq(4).text().trim(); // EPS - Continuing Operations
            data.financials.epsDiluted = cells.eq(5).text().trim(); // Diluted EPS
            data.financials.navPerShare = cells.eq(7).text().trim(); // NAV Per Share
            data.financials.profitForYear = cells.eq(10).text().trim(); // Profit for the year
          }
        }
      });
    }
  });

  // Extract current P/E ratio (latest date column - last column)
  $('table').each((_, table) => {
    const $table = $(table);
    const tableText = $table.text();
    
    // Look for P/E ratio table
    if (tableText.includes('P/E Ratio') && tableText.includes('Basic EPS')) {
      $table.find('tr').each((_, row) => {
        const cells = $(row).find('td, th');
        if (cells.length > 1) {
          const rowTitle = cells.eq(0).text().trim();
          
          if (rowTitle.includes('Current P/E Ratio using Basic EPS')) {
            data.financials.peRatioBasic = cells.eq(cells.length - 1).text().trim();
          }
          if (rowTitle.includes('Current P/E ratio using Diluted EPS')) {
            data.financials.peRatioDiluted = cells.eq(cells.length - 1).text().trim();
          }
        }
      });
    }
  });

  // Extract latest shareholding data
  const shareHoldingText = $('h2:contains("Other Information")').next().text();
  const sponsorMatch = shareHoldingText.match(/Sponsor\/Director:\s*([\d.]+)/);
  const govtMatch = shareHoldingText.match(/Govt:\s*([\d.]+)/);
  const instituteMatch = shareHoldingText.match(/Institute:\s*([\d.]+)/);
  const foreignMatch = shareHoldingText.match(/Foreign:\s*([\d.]+)/);
  const publicMatch = shareHoldingText.match(/Public:\s*([\d.]+)/);

  if (sponsorMatch) data.shareholding.sponsor = sponsorMatch[1];
  if (govtMatch) data.shareholding.govt = govtMatch[1];
  if (instituteMatch) data.shareholding.institute = instituteMatch[1];
  if (foreignMatch) data.shareholding.foreign = foreignMatch[1];
  if (publicMatch) data.shareholding.public = publicMatch[1];

  return { data, date };
}

function parseKeyValue(key: string, value: string, data: CompanyInfo, $element?: cheerio.Cheerio<any>): void {
  switch (key) {
    case 'Last Trading Price':
      data.marketInfo.ltp = value;
      break;
    case 'Change*':
      // Extract from nested table
      if ($element) {
        const nestedCells = $element.find('td');
        data.marketInfo.change = nestedCells.eq(0).text().trim();
        data.marketInfo.changePercent = nestedCells.eq(1).text().trim();
      }
      break;
    case "Day's Range":
      data.marketInfo.dayRange = value;
      break;
    case "52 Weeks' Moving Range":
      data.marketInfo.fiftyTwoWeekRange = value;
      break;
    case 'Closing Price':
      data.marketInfo.closingPrice = value;
      break;
    case 'Opening Price':
      data.marketInfo.openingPrice = value;
      break;
    case "Yesterday's Closing Price":
      data.marketInfo.yesterdayClose = value;
      break;
    case "Day's Trade (Nos.)":
      data.marketInfo.dayTrade = value;
      break;
    case "Day's Volume (Nos.)":
      data.marketInfo.dayVolume = value;
      break;
    case "Day's Value (mn)":
      data.marketInfo.dayValue = value;
      break;
    case 'Market Capitalization (mn)':
      data.marketInfo.marketCap = value;
      break;
    case 'Free Float Market Cap. (mn)':
      data.marketInfo.freeFloatMarketCap = value;
      break;
    case 'Last Update':
      data.marketInfo.lastUpdate = value;
      break;
    case 'Authorized Capital (mn)':
      data.basicInfo.authorizedCapital = value;
      break;
    case 'Paid-up Capital (mn)':
      data.basicInfo.paidUpCapital = value;
      break;
    case 'Face/par Value':
      data.basicInfo.faceValue = value;
      break;
    case 'Market Lot':
      data.basicInfo.marketLot = value;
      break;
    case 'Total No. of Outstanding Securities':
      data.basicInfo.totalSecurities = value;
      break;
    case 'Debut Trading Date':
      data.basicInfo.debutTradingDate = value;
      break;
    case 'Type of Instrument':
      data.basicInfo.instrumentType = value;
      break;
    case 'Sector':
      data.sector = value;
      break;
    case 'Cash Dividend':
      data.agmInfo.cashDividend = value;
      break;
    case 'Bonus Issue (Stock Dividend)':
      data.agmInfo.bonusIssue = value;
      break;
    case 'Right Issue':
      data.agmInfo.rightIssue = value;
      break;
    case 'Reserve & Surplus without OCI (mn)':
      data.agmInfo.reserveSurplus = value;
      break;
    case 'Address':
      data.contact.address = value;
      break;
    case 'Contact Phone':
      data.contact.phone = value;
      break;
    case 'E-mail':
      data.contact.email = value;
      break;
    case 'Web Address':
      data.contact.website = value;
      break;
  }
}

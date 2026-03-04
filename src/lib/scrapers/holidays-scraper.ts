import * as cheerio from 'cheerio';
import { fetchWithRetry } from './common.js';

const BASE_URL = 'https://www.dsebd.org';

function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

function parseDateRange(dateStr: string, year: string): string[] {
  let startDate: string;
  let endDate: string;
  
  if (dateStr.includes(' - ')) {
    const parts = dateStr.split(' - ').map(s => s.trim());
    if (parts.length === 2) {
      startDate = normalizeDate(parts[0], year);
      endDate = normalizeDate(parts[1], year);
      return generateDateRange(startDate, endDate);
    }
  }
  
  const rangeMatch = dateStr.match(/^(\d{1,2})-(\d{1,2})\s+(\w+)$/);
  if (rangeMatch) {
    const startDay = rangeMatch[1];
    const endDay = rangeMatch[2];
    const month = rangeMatch[3];
    startDate = normalizeDate(`${startDay} ${month}`, year);
    endDate = normalizeDate(`${endDay} ${month}`, year);
    return generateDateRange(startDate, endDate);
  }
  
  const normalized = normalizeDate(dateStr, year);
  return [normalized];
}

function normalizeDate(dateStr: string, year: string): string {
  const months: { [key: string]: string } = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12'
  };
  
  const match = dateStr.match(/(\d{1,2})\s+(\w+)/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const monthName = match[2];
    const month = months[monthName];
    
    if (month) {
      return `${year}-${month}-${day}`;
    }
  }
  
  return dateStr;
}

export interface Holiday {
  name: string;
  dates: string[];
  days: string[];
  numberOfDays: string;
}

export interface HolidaysData {
  year: string;
  holidays: Holiday[];
  totalHolidays: number;
}

export async function scrapeHolidays(): Promise<HolidaysData> {
  try {
    const url = `${BASE_URL}/hts.php`;
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    const holidays: Holiday[] = [];

    const yearMatch = $.text().match(/Calendar Year (\d{4})/);
    const year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();

    let foundHolidaysTable = false;
    
    $('table').each((_, table) => {
      const $table = $(table);
      
      const firstRowText = $table.find('tr').first().text().trim();
      if (!firstRowText.includes('Name of Holidays')) {
        return;
      }
      
      foundHolidaysTable = true;
      
      $table.find('tr').each((rowIndex, row) => {
        if (rowIndex === 0) return;
        
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length >= 4) {
          const rowData: string[] = [];
          cells.each((_, cell) => {
            rowData.push($(cell).text().trim());
          });
          
          if (rowData[0] && rowData[1] && rowData[2] && rowData[3]) {
            const dates = parseDateRange(rowData[1], year);
            const days = rowData[2].split('-').map(d => d.trim());
            holidays.push({
              name: rowData[0],
              dates,
              days,
              numberOfDays: rowData[3]
            });
          }
        }
      });
    });

    return {
      year,
      holidays,
      totalHolidays: holidays.length
    };
  } catch (error) {
    throw new Error(`Failed to scrape holidays: ${error instanceof Error ? error.message : String(error)}`);
  }
}

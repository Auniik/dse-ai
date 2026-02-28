import * as cheerio from 'cheerio';
import { fetchWithRetry, getDateHeader } from './common.js';

const BASE_URL = 'https://www.dsebd.org';

export interface NewsItem {
  tradingCode: string;
  title: string;
  news: string;
  postDate: string;
  [key: string]: string;
}

export interface NewsData {
  dateRange?: string;
  company?: string;
  news: NewsItem[];
  totalNews: number;
}

export async function scrapeNews(options?: { symbol?: string; startDate?: string; endDate?: string }): Promise<NewsData> {
  try {
    let url = `${BASE_URL}/old_news.php?archive=news`;
    
    if (options?.symbol) {
      url += `&inst=${options.symbol}&criteria=3`;
    } else if (options?.startDate && options?.endDate) {
      url += `&startDate=${options.startDate}&endDate=${options.endDate}&criteria=4`;
    } else {
      // Default: last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      
      const formatDate = (d: Date) => d.toISOString().split('T')[0];
      url += `&startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&criteria=4`;
    }
    
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    const newsItems: NewsItem[] = [];
  
  // Extract date range or company info from header
  const header = getDateHeader($);
  let dateRange: string | undefined;
  let company: string | undefined;
  
  if (header.includes('from:')) {
    dateRange = header;
  } else if (header.includes('Trading Code:')) {
    company = header;
  }
  
  // Find the table.table-news element (there's only one)
  const $table = $('table.table-news').first();
  
  let newsItem: Partial<NewsItem> = {
    tradingCode: '',
    title: '',
    news: '',
    postDate: ''
  };
  
  // Parse each row in the table
  $table.find('tr').each((_, row) => {
    const $row = $(row);
    const th = $row.find('th').first().text().trim();
    const td = $row.find('td').first().text().trim();
    
    // Check if this is a separator (hr tag)
    if ($row.find('hr').length > 0) {
      // Save current news item if complete
      if (newsItem.tradingCode && newsItem.title && newsItem.postDate) {
        newsItems.push(newsItem as NewsItem);
      }
      // Reset for next news item
      newsItem = {
        tradingCode: '',
        title: '',
        news: '',
        postDate: ''
      };
      return;
    }
    
    if (th === 'Trading Code:') {
      newsItem.tradingCode = td;
    } else if (th === 'News Title:') {
      newsItem.title = td;
    } else if (th === 'News:') {
      newsItem.news = td;
    } else if (th === 'Post Date:') {
      newsItem.postDate = td;
    }
  });
  
  // Don't forget the last news item
  if (newsItem.tradingCode && newsItem.title && newsItem.postDate) {
    newsItems.push(newsItem as NewsItem);
  }
  
  return {
    dateRange,
    company,
    news: newsItems,
    totalNews: newsItems.length
  };
  } catch (error) {
    throw new Error(`Failed to scrape news: ${error instanceof Error ? error.message : String(error)}`);
  }
}

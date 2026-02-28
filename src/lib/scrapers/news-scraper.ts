import * as cheerio from 'cheerio';

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

export function scrapeNews(html: string): NewsData {
  const $ = cheerio.load(html);
  const news: NewsItem[] = [];
  
  // Extract date range or company info from header
  const header = $('h2.BodyHead.topBodyHead').text().trim();
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
        news.push(newsItem as NewsItem);
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
    news.push(newsItem as NewsItem);
  }
  
  return {
    dateRange,
    company,
    news,
    totalNews: news.length
  };
}

export interface Config {
  baseUrl: string;
}

export interface DseApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StockData {
  [key: string]: string;
}

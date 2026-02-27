import type { DseApiResponse, StockData } from '../types/index.js';
import { getApiBaseUrl } from './utils.js';

export class DseApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as DseApiResponse<T>;
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data as T;
  }

  async getLatest(): Promise<StockData[]> {
    return this.request<StockData[]>('/dse/latest');
  }

  async getDsex(symbol?: string): Promise<StockData[]> {
    const params = symbol ? { symbol } : undefined;
    return this.request<StockData[]>('/dse/dsexdata', params);
  }

  async getTop30(): Promise<StockData[]> {
    return this.request<StockData[]>('/dse/top30');
  }

  async getHistorical(startDate: string, endDate: string, inst?: string): Promise<StockData[]> {
    const params: Record<string, string> = {
      startDate,
      endDate,
    };
    
    if (inst) {
      params.inst = inst;
    }

    return this.request<StockData[]>('/dse/historical', params);
  }
}

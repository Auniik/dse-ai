export interface AuthConfig {
  apiKey: string;
  apiUrl: string;
  timestamp: string;
}

export interface DseApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

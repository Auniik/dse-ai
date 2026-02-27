import { describe, it, expect } from 'vitest';
import { DseApiClient } from '../../src/lib/api-client';

describe('DseApiClient', () => {
  it('should create instance with default base URL', () => {
    const client = new DseApiClient();
    expect(client).toBeDefined();
  });

  it('should have all required methods', () => {
    const client = new DseApiClient();
    expect(typeof client.getLatest).toBe('function');
    expect(typeof client.getDsex).toBe('function');
    expect(typeof client.getTop30).toBe('function');
    expect(typeof client.getHistorical).toBe('function');
  });
});

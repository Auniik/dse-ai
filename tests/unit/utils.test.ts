import { describe, it, expect } from 'vitest';
import { getVersion } from '../../src/lib/utils';

describe('Utils', () => {
  it('should get version from package.json', () => {
    const version = getVersion();
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

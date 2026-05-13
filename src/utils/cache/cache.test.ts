import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { isCacheValid } from './cache';

describe('isCacheValid', () => {
  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for timestamp less than 10 minutes old', () => {
    // 5 minutes ago
    const timestamp = Date.now() - 5 * 60 * 1000;
    expect(isCacheValid(timestamp)).toBe(true);
  });

  it('returns true for timestamp exactly 9 minutes 59 seconds old', () => {
    // 9 minutes 59 seconds ago
    const timestamp = Date.now() - (9 * 60 * 1000 + 59 * 1000);
    expect(isCacheValid(timestamp)).toBe(true);
  });

  it('returns false for timestamp exactly 10 minutes old', () => {
    // Exactly 10 minutes ago
    const timestamp = Date.now() - 10 * 60 * 1000;
    expect(isCacheValid(timestamp)).toBe(false);
  });

  it('returns false for timestamp more than 10 minutes old', () => {
    // 15 minutes ago
    const timestamp = Date.now() - 15 * 60 * 1000;
    expect(isCacheValid(timestamp)).toBe(false);
  });

  it('returns true for current timestamp', () => {
    const timestamp = Date.now();
    expect(isCacheValid(timestamp)).toBe(true);
  });

  it('returns true for timestamp 1 second ago', () => {
    const timestamp = Date.now() - 1000;
    expect(isCacheValid(timestamp)).toBe(true);
  });

  it('returns false for very old timestamp', () => {
    // 1 hour ago
    const timestamp = Date.now() - 60 * 60 * 1000;
    expect(isCacheValid(timestamp)).toBe(false);
  });
});

/**
 * Property 9: Cache Timestamp Validation
 * **Validates: Requirements 12.2**
 * 
 * For any timestamp value, the cache validation function SHALL correctly identify
 * whether the timestamp represents data that is less than 10 minutes old (valid cache)
 * or 10 minutes or older (stale cache).
 */
describe('Property 9: Cache Timestamp Validation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('correctly identifies fresh vs stale data based on timestamp', () => {
    fc.assert(
      fc.property(fc.integer(), (minutesAgo) => {
        const timestamp = Date.now() - minutesAgo * 60 * 1000;
        const isValid = isCacheValid(timestamp);
        const shouldBeValid = minutesAgo < 10;
        expect(isValid).toBe(shouldBeValid);
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

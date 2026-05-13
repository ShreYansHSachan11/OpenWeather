/**
 * Cache validation utilities for weather data
 */

const TEN_MINUTES_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Checks if cached data is still valid based on timestamp
 * @param timestamp - Unix timestamp in milliseconds when data was cached
 * @returns true if timestamp is less than 10 minutes old, false otherwise
 */
export function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < TEN_MINUTES_MS;
}

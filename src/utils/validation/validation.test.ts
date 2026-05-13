import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateCityName } from './validation';

describe('validateCityName', () => {
  it('should accept valid city names with non-whitespace characters', () => {
    expect(validateCityName('London')).toBe(true);
    expect(validateCityName('New York')).toBe(true);
    expect(validateCityName('São Paulo')).toBe(true);
    expect(validateCityName('Tokyo')).toBe(true);
    expect(validateCityName('a')).toBe(true);
  });

  it('should reject empty strings', () => {
    expect(validateCityName('')).toBe(false);
  });

  it('should reject whitespace-only strings', () => {
    expect(validateCityName(' ')).toBe(false);
    expect(validateCityName('  ')).toBe(false);
    expect(validateCityName('   ')).toBe(false);
    expect(validateCityName('\t')).toBe(false);
    expect(validateCityName('\n')).toBe(false);
    expect(validateCityName(' \t\n ')).toBe(false);
  });

  it('should accept strings with leading/trailing whitespace but non-whitespace content', () => {
    expect(validateCityName(' London ')).toBe(true);
    expect(validateCityName('  Paris  ')).toBe(true);
    expect(validateCityName('\tBerlin\n')).toBe(true);
  });

  it('should accept city names with special characters', () => {
    expect(validateCityName('Saint-Denis')).toBe(true);
    expect(validateCityName("L'Aquila")).toBe(true);
    expect(validateCityName('Zürich')).toBe(true);
  });
});

/**
 * Property-Based Tests
 * Feature: weather-dashboard
 * **Validates: Requirements 1.2**
 */
describe('validateCityName - Property-Based Tests', () => {
  /**
   * Property 1: Input Validation Rejects Invalid City Names
   * 
   * For any string input, the city name validation function SHALL reject 
   * empty strings and whitespace-only strings, and SHALL accept strings 
   * containing at least one non-whitespace character.
   */
  it('Property 1: validates city name input correctly for any string', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        const isValid = validateCityName(input);
        const hasNonWhitespace = input.trim().length > 0;
        
        // The validation result should match whether the string has non-whitespace content
        expect(isValid).toBe(hasNonWhitespace);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

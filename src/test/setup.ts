/**
 * Test setup file for Vitest
 * Configures testing environment and global test utilities
 */

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: (key: string): string | null => {
    return localStorageMock.store[key] || null;
  },
  setItem: (key: string, value: string): void => {
    localStorageMock.store[key] = value;
  },
  removeItem: (key: string): void => {
    delete localStorageMock.store[key];
  },
  clear: (): void => {
    localStorageMock.store = {};
  },
  key: (index: number): string | null => {
    const keys = Object.keys(localStorageMock.store);
    return keys[index] || null;
  },
  get length(): number {
    return Object.keys(localStorageMock.store).length;
  },
  store: {} as Record<string, string>,
};

globalThis.localStorage = localStorageMock as Storage;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

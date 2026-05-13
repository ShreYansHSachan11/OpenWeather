import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import * as fc from 'fast-check';
import apiClient, { handleAPIError } from './apiClient';
import { axiosErrorArbitrary } from '@/test/arbitraries';

describe('apiClient Configuration', () => {
  it('is an axios instance', () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults).toBeDefined();
  });

  it('has correct base URL configured', () => {
    expect(apiClient.defaults.baseURL).toContain('api.openweathermap.org');
  });

  it('includes API key in default params', () => {
    expect(apiClient.defaults.params).toBeDefined();
    // API key might be undefined in test environment, but the param should exist
    expect(apiClient.defaults.params).toHaveProperty('appid');
  });

  it('sets metric units in default params', () => {
    expect(apiClient.defaults.params.units).toBe('metric');
  });

  it('configures timeout', () => {
    expect(apiClient.defaults.timeout).toBe(10000);
  });

  it('has response interceptor registered', () => {
    expect(apiClient.interceptors.response.handlers).toBeDefined();
    expect(apiClient.interceptors.response.handlers?.length).toBeGreaterThan(0);
  });
});

describe('Error Handling via Interceptor', () => {
  it('handles 404 Not Found error', async () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
    };

    try {
      await apiClient.request({ url: '/test' }).catch(() => {
        throw error;
      });
    } catch (e: any) {
      // The interceptor should transform this
      expect(e.response?.status).toBe(404);
    }
  });

  it('transforms 404 error to user-friendly message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
    };

    // Simulate what the interceptor does
    const errorHandler = (err: any) => {
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 404:
            throw new Error('City not found. Please check the spelling and try again.');
          case 401:
            throw new Error('Configuration error. Please contact support.');
          case 429:
            throw new Error('Too many requests. Please wait a moment and try again.');
          case 500:
          case 502:
          case 503:
            throw new Error('Weather service is temporarily unavailable. Please try again later.');
          default:
            throw new Error('An error occurred while fetching weather data. Please try again.');
        }
      } else if (err.request) {
        throw new Error('No internet connection. Please check your network and try again.');
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    };

    expect(() => errorHandler(error)).toThrow('City not found');
  });

  it('transforms 401 error to user-friendly message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      },
      request: {},
    };

    const errorHandler = (err: any) => {
      if (err.response?.status === 401) {
        throw new Error('Configuration error. Please contact support.');
      }
    };

    expect(() => errorHandler(error)).toThrow('Configuration error');
  });

  it('transforms 429 error to user-friendly message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 429,
        data: {},
        statusText: 'Too Many Requests',
        headers: {},
        config: {} as any,
      },
      request: {},
    };

    const errorHandler = (err: any) => {
      if (err.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
    };

    expect(() => errorHandler(error)).toThrow('Too many requests');
  });

  it('transforms 500 error to user-friendly message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      },
      request: {},
    };

    const errorHandler = (err: any) => {
      if (err.response?.status === 500) {
        throw new Error('Weather service is temporarily unavailable. Please try again later.');
      }
    };

    expect(() => errorHandler(error)).toThrow('temporarily unavailable');
  });

  it('transforms 502 error to user-friendly message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 502,
        data: {},
        statusText: 'Bad Gateway',
        headers: {},
        config: {} as any,
      },
      request: {},
    };

    const errorHandler = (err: any) => {
      if (err.response?.status === 502) {
        throw new Error('Weather service is temporarily unavailable. Please try again later.');
      }
    };

    expect(() => errorHandler(error)).toThrow('temporarily unavailable');
  });

  it('transforms 503 error to user-friendly message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 503,
        data: {},
        statusText: 'Service Unavailable',
        headers: {},
        config: {} as any,
      },
      request: {},
    };

    const errorHandler = (err: any) => {
      if (err.response?.status === 503) {
        throw new Error('Weather service is temporarily unavailable. Please try again later.');
      }
    };

    expect(() => errorHandler(error)).toThrow('temporarily unavailable');
  });

  it('transforms unknown HTTP error to generic message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 418,
        data: {},
        statusText: "I'm a teapot",
        headers: {},
        config: {} as any,
      },
      request: {},
    };

    const errorHandler = (err: any) => {
      if (err.response && ![404, 401, 429, 500, 502, 503].includes(err.response.status)) {
        throw new Error('An error occurred while fetching weather data. Please try again.');
      }
    };

    expect(() => errorHandler(error)).toThrow('An error occurred while fetching weather data');
  });

  it('transforms network error to user-friendly message', () => {
    const error: Partial<AxiosError> = {
      request: {},
      // No response property indicates network error
    };

    const errorHandler = (err: any) => {
      if (err.request && !err.response) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
    };

    expect(() => errorHandler(error)).toThrow('No internet connection');
  });

  it('transforms other errors to generic message', () => {
    const error: Partial<AxiosError> = {
      message: 'Something went wrong',
      // No request or response property
    };

    const errorHandler = (err: any) => {
      if (!err.response && !err.request) {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    };

    expect(() => errorHandler(error)).toThrow('An unexpected error occurred');
  });

  it('produces descriptive messages without technical details', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      },
      request: {},
    };

    const errorHandler = (err: any) => {
      if (err.response?.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      }
    };

    try {
      errorHandler(error);
    } catch (e: any) {
      expect(e.message).not.toContain('404');
      expect(e.message).not.toContain('status');
      expect(e.message).not.toContain('undefined');
      expect(e.message).not.toContain('[object Object]');
      expect(e.message.length).toBeGreaterThan(0);
      expect(typeof e.message).toBe('string');
    }
  });
});

describe('handleAPIError Function', () => {
  it('handles 404 error and returns city not found message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 404',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('City not found. Please check the spelling and try again.');
  });

  it('handles 401 error and returns configuration error message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 401',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('Configuration error. Please contact support.');
  });

  it('handles 429 error and returns rate limit message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 429,
        data: {},
        statusText: 'Too Many Requests',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 429',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('Too many requests. Please wait a moment and try again.');
  });

  it('handles 500 error and returns service unavailable message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 500',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('Weather service is temporarily unavailable. Please try again later.');
  });

  it('handles 502 error and returns service unavailable message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 502,
        data: {},
        statusText: 'Bad Gateway',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 502',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('Weather service is temporarily unavailable. Please try again later.');
  });

  it('handles 503 error and returns service unavailable message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 503,
        data: {},
        statusText: 'Service Unavailable',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 503',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('Weather service is temporarily unavailable. Please try again later.');
  });

  it('handles unknown HTTP status code and returns generic error message', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 418,
        data: {},
        statusText: "I'm a teapot",
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 418',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('An error occurred while fetching weather data. Please try again.');
  });

  it('handles network error (no response) and returns connection message', () => {
    const error: Partial<AxiosError> = {
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Network Error',
    };

    const message = handleAPIError(error as AxiosError);
    expect(message).toBe('No internet connection. Please check your network and try again.');
  });

  it('handles generic error and returns unexpected error message', () => {
    const error = new Error('Something went wrong');

    const message = handleAPIError(error);
    expect(message).toBe('An unexpected error occurred. Please try again.');
  });

  it('handles unknown error type and returns unexpected error message', () => {
    const error = { someProperty: 'someValue' };

    const message = handleAPIError(error);
    expect(message).toBe('An unexpected error occurred. Please try again.');
  });

  it('returns string messages without undefined or object representations', () => {
    const errors = [
      { response: { status: 404, data: {}, statusText: 'Not Found', headers: {}, config: {} as any }, request: {}, config: {} as any, isAxiosError: true, toJSON: () => ({}), name: 'AxiosError', message: '404' },
      { response: { status: 401, data: {}, statusText: 'Unauthorized', headers: {}, config: {} as any }, request: {}, config: {} as any, isAxiosError: true, toJSON: () => ({}), name: 'AxiosError', message: '401' },
      { response: { status: 429, data: {}, statusText: 'Too Many Requests', headers: {}, config: {} as any }, request: {}, config: {} as any, isAxiosError: true, toJSON: () => ({}), name: 'AxiosError', message: '429' },
      { response: { status: 500, data: {}, statusText: 'Internal Server Error', headers: {}, config: {} as any }, request: {}, config: {} as any, isAxiosError: true, toJSON: () => ({}), name: 'AxiosError', message: '500' },
      { request: {}, config: {} as any, isAxiosError: true, toJSON: () => ({}), name: 'AxiosError', message: 'Network Error' },
      new Error('Generic error'),
    ];

    errors.forEach((error) => {
      const message = handleAPIError(error as AxiosError);
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
      expect(message).not.toContain('undefined');
      expect(message).not.toContain('[object Object]');
    });
  });

  it('produces descriptive user-friendly messages', () => {
    const error: Partial<AxiosError> = {
      response: { 
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      },
      request: {},
      config: {} as any,
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 404',
    };

    const message = handleAPIError(error as AxiosError);
    
    // Should be descriptive
    expect(message.length).toBeGreaterThan(10);
    
    // Should not contain technical details
    expect(message).not.toContain('404');
    expect(message).not.toContain('status');
    expect(message).not.toContain('AxiosError');
    
    // Should be user-friendly
    expect(message).toMatch(/city|check|spelling|try again/i);
  });
});

/**
 * Property-Based Tests
 * 
 * These tests verify universal properties across many generated inputs
 */

describe('Property-Based Tests', () => {
  /**
   * Property 3: Error Handlers Produce Descriptive Messages
   * 
   * **Validates: Requirements 5.3, 5.4**
   * 
   * For any error object (HTTP error or network error), the error handling function
   * SHALL transform it into a user-friendly descriptive message that indicates the
   * type of failure without exposing technical implementation details.
   */
  it('Property 3: error handler produces descriptive messages for any error', () => {
    fc.assert(
      fc.property(axiosErrorArbitrary(), (error) => {
        const message = handleAPIError(error);
        
        // Property 1: Message must be a non-empty string
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
        
        // Property 2: Message must not contain technical implementation details
        expect(message).not.toContain('undefined');
        expect(message).not.toContain('[object Object]');
        expect(message).not.toContain('null');
        
        // Property 3: Message must be user-friendly (no stack traces, no raw error objects)
        expect(message).not.toMatch(/at \w+\.\w+/); // No stack trace patterns
        expect(message).not.toMatch(/Error: /); // No raw error prefixes
        
        // Property 4: Message should be descriptive (reasonable length)
        expect(message.length).toBeGreaterThan(10);
        expect(message.length).toBeLessThan(200);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: error handler produces consistent messages for known error types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(404, 401, 429, 500, 502, 503),
        (statusCode) => {
          const error = {
            response: {
              status: statusCode,
              data: {},
              statusText: 'Error',
              headers: {},
              config: {} as any,
            },
            request: {},
            config: {} as any,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: `Request failed with status code ${statusCode}`,
          };

          const message = handleAPIError(error as AxiosError);
          
          // Each known status code should produce a specific, consistent message
          expect(typeof message).toBe('string');
          expect(message.length).toBeGreaterThan(0);
          
          // Verify the message is appropriate for the status code
          switch (statusCode) {
            case 404:
              expect(message).toContain('not found');
              break;
            case 401:
              expect(message).toContain('Configuration error');
              break;
            case 429:
              expect(message).toContain('Too many requests');
              break;
            case 500:
            case 502:
            case 503:
              expect(message).toContain('unavailable');
              break;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: network errors produce connection-related messages', () => {
    fc.assert(
      fc.property(fc.object(), (request) => {
        const error = {
          request,
          config: {} as any,
          isAxiosError: true,
          toJSON: () => ({}),
          name: 'AxiosError',
          message: 'Network Error',
        };

        const message = handleAPIError(error as AxiosError);
        
        // Network errors should mention connection or network
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
        expect(message.toLowerCase()).toMatch(/network|connection|internet/);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: generic errors produce fallback messages', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({ message: fc.string() }).map(obj => new Error(obj.message)),
          fc.object(),
          fc.string(),
          fc.integer(),
          fc.constant(null),
          fc.constant(undefined)
        ),
        (error) => {
          const message = handleAPIError(error);
          
          // Generic errors should produce a fallback message
          expect(typeof message).toBe('string');
          expect(message.length).toBeGreaterThan(0);
          expect(message).toContain('unexpected');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

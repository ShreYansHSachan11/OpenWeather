/**
 * Weather Slice
 * 
 * Redux Toolkit slice for managing weather data, forecast data, loading states, and errors.
 * Implements caching logic to minimize API calls.
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 12.1, 12.2, 12.3, 12.4**
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { WeatherState } from '../../../types/state.types';
import type { WeatherData, ForecastData } from '../../../types/weather.types';
import { fetchCurrentWeather, fetchForecast } from '../../../services/weatherApi/weatherApi';
import { isCacheValid } from '../../../utils/cache/cache';

/**
 * Initial state for weather slice
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 */
const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  loading: false,
  error: null,
  cache: {},
};

/**
 * Search weather async thunk
 * 
 * Fetches current weather and forecast for a city.
 * Checks cache first and returns cached data if valid (< 10 minutes old).
 * 
 * @param cityName - Name of the city to search for
 * @param options - Thunk API options
 * @returns Object containing weather and forecast data
 * 
 * **Validates: Requirements 2.5, 12.1, 12.2, 12.3**
 */
export const searchWeather = createAsyncThunk(
  'weather/searchWeather',
  async (cityName: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { weather: WeatherState };
      const normalizedCityName = cityName.toLowerCase().trim();
      
      // Check cache
      const cachedData = state.weather.cache[normalizedCityName];
      if (cachedData && isCacheValid(cachedData.timestamp)) {
        return {
          weather: cachedData.weather,
          forecast: cachedData.forecast,
          fromCache: true,
        };
      }
      
      // Fetch fresh data
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName),
      ]);
      
      return {
        weather,
        forecast,
        fromCache: false,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

/**
 * Refresh weather async thunk
 * 
 * Fetches current weather and forecast for a city, bypassing cache.
 * Used when user explicitly requests fresh data.
 * 
 * @param cityName - Name of the city to refresh weather for
 * @returns Object containing weather and forecast data
 * 
 * **Validates: Requirements 12.4**
 */
export const refreshWeather = createAsyncThunk(
  'weather/refreshWeather',
  async (cityName: string, { rejectWithValue }) => {
    try {
      // Always fetch fresh data, bypass cache
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName),
      ]);
      
      return {
        weather,
        forecast,
        fromCache: false,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

/**
 * Weather slice
 * 
 * Contains reducers for synchronous state updates and extraReducers for async thunks.
 * Implements cache logic in extraReducers.
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 12.1, 12.2, 12.3, 12.4**
 */
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    /**
     * Set current weather data
     * 
     * **Validates: Requirement 2.1**
     */
    setCurrentWeather: (state, action: PayloadAction<WeatherData>) => {
      state.currentWeather = action.payload;
    },
    
    /**
     * Set forecast data
     * 
     * **Validates: Requirement 2.2**
     */
    setForecast: (state, action: PayloadAction<ForecastData>) => {
      state.forecast = action.payload;
    },
    
    /**
     * Set loading state
     * 
     * **Validates: Requirement 2.3**
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    /**
     * Set error message
     * 
     * **Validates: Requirement 2.4**
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    /**
     * Clear error message
     * 
     * **Validates: Requirement 2.4**
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // searchWeather thunk handlers
    builder
      .addCase(searchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload.weather;
        state.forecast = action.payload.forecast;
        state.error = null;
        
        // Update cache with fresh data (not from cache)
        if (!action.payload.fromCache) {
          const normalizedCityName = action.payload.weather.cityName.toLowerCase().trim();
          state.cache[normalizedCityName] = {
            weather: action.payload.weather,
            forecast: action.payload.forecast,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(searchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch weather data';
      });
    
    // refreshWeather thunk handlers
    builder
      .addCase(refreshWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload.weather;
        state.forecast = action.payload.forecast;
        state.error = null;
        
        // Update cache with fresh data
        const normalizedCityName = action.payload.weather.cityName.toLowerCase().trim();
        state.cache[normalizedCityName] = {
          weather: action.payload.weather,
          forecast: action.payload.forecast,
          timestamp: Date.now(),
        };
      })
      .addCase(refreshWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to refresh weather data';
      });
  },
});

// Export actions
export const {
  setCurrentWeather,
  setForecast,
  setLoading,
  setError,
  clearError,
} = weatherSlice.actions;

// Export reducer
export default weatherSlice.reducer;

/**
 * Redux Store Usage Examples
 * 
 * This file demonstrates how to use the Redux store and typed hooks
 * in React components.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store';
import { searchWeather, refreshWeather } from './slices/weatherSlice/weatherSlice';
import { toggleTheme, addToSearchHistory } from './slices/uiSlice/uiSlice';
import {
  selectCurrentWeather,
  selectLoading,
  selectError,
} from './selectors/weatherSelectors';
import { selectTheme, selectIsDarkMode } from './selectors/uiSelectors';

/**
 * Example 1: Wrapping the app with Redux Provider
 */
export function AppWithRedux() {
  return (
    <Provider store={store}>
      <WeatherApp />
    </Provider>
  );
}

/**
 * Example 2: Using typed hooks in a component
 */
function WeatherApp() {
  // Use typed dispatch hook
  const dispatch = useAppDispatch();
  
  // Use typed selector hook with selector functions
  const currentWeather = useAppSelector(selectCurrentWeather);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const theme = useAppSelector(selectTheme);
  const isDarkMode = useAppSelector(selectIsDarkMode);
  
  // Or use inline selectors with full type safety
  const searchHistory = useAppSelector((state) => state.ui.searchHistory);
  
  const handleSearch = (cityName: string) => {
    // Dispatch async thunk with proper typing
    dispatch(searchWeather(cityName));
    
    // Add to search history
    dispatch(addToSearchHistory(cityName));
  };
  
  const handleRefresh = () => {
    if (currentWeather) {
      // Dispatch refresh action
      dispatch(refreshWeather(currentWeather.cityName));
    }
  };
  
  const handleToggleTheme = () => {
    // Dispatch synchronous action
    dispatch(toggleTheme());
  };
  
  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <button onClick={handleToggleTheme}>
        Toggle Theme (Current: {theme})
      </button>
      
      <SearchInput onSearch={handleSearch} />
      
      {loading && <div>Loading...</div>}
      
      {error && <div>Error: {error}</div>}
      
      {currentWeather && (
        <div>
          <h2>{currentWeather.cityName}</h2>
          <p>Temperature: {currentWeather.temperature}°C</p>
          <p>Condition: {currentWeather.condition}</p>
          <button onClick={handleRefresh}>Refresh</button>
        </div>
      )}
      
      {searchHistory.length > 0 && (
        <div>
          <h3>Recent Searches:</h3>
          <ul>
            {searchHistory.map((city) => (
              <li key={city} onClick={() => handleSearch(city)}>
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Simple search input component
 */
function SearchInput({ onSearch }: { onSearch: (city: string) => void }) {
  const [input, setInput] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter city name"
      />
      <button type="submit">Search</button>
    </form>
  );
}

/**
 * Example 4: Using store directly (outside React components)
 */
export function directStoreUsage() {
  // Get current state
  const state = store.getState();
  console.log('Current weather:', state.weather.currentWeather);
  console.log('Theme:', state.ui.theme);
  
  // Dispatch actions
  store.dispatch(searchWeather('London'));
  store.dispatch(toggleTheme());
  
  // Subscribe to state changes
  const unsubscribe = store.subscribe(() => {
    const newState = store.getState();
    console.log('State updated:', newState);
  });
  
  // Unsubscribe when done
  unsubscribe();
}

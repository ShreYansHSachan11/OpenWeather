import React from 'react';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { useAppSelector } from './state/store';
import { selectCurrentWeather, selectForecast, selectLoading, selectError } from './state/selectors/weatherSelectors';
import ThemeProvider from './components/ThemeProvider';
import Header from './components/Header/Header';
import SearchSection from './components/SearchSection';
import WeatherDisplay from './components/WeatherDisplay/WeatherDisplay';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { searchWeather } from './state/slices/weatherSlice/weatherSlice';
import './App.css';

/**
 * AppContent Component
 * Main application content with conditional rendering based on state
 * Requirements: 6.1, 6.2, 6.3, 6.4, 8.1
 */
const AppContent: React.FC = () => {
  const currentWeather = useAppSelector(selectCurrentWeather);
  const forecast = useAppSelector(selectForecast);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const handleRetry = () => {
    // Retry last search if there's an error
    if (error && currentWeather?.cityName) {
      store.dispatch(searchWeather(currentWeather.cityName));
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <SearchSection />
        <div className="app-content">
          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error} onRetry={handleRetry} />}
          {!loading && !error && <WeatherDisplay weather={currentWeather} forecast={forecast} />}
        </div>
      </main>
    </div>
  );
};

/**
 * App Component
 * Root component that provides Redux store and theme context
 * Requirements: 6.1, 6.2, 6.3, 6.4, 8.1
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;

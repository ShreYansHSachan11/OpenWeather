import React from 'react';
import SearchInput from '../SearchInput';
import SearchHistory from '../SearchHistory';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { searchWeather } from '../../state/slices/weatherSlice';
import { selectSearchHistory } from '../../state/selectors/uiSelectors';
import { selectLoading } from '../../state/selectors/weatherSelectors';
import { addToSearchHistory } from '../../state/slices/uiSlice';
import './SearchSection.css';

/**
 * SearchSection Component
 * Combines SearchInput and SearchHistory components
 * Connects to Redux store for search functionality and history
 * Requirements: 8.1
 */
const SearchSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchHistory = useAppSelector(selectSearchHistory);
  const isLoading = useAppSelector(selectLoading);

  const handleSearch = (cityName: string) => {
    dispatch(searchWeather(cityName));
    dispatch(addToSearchHistory(cityName));
  };

  const handleHistoryClick = (cityName: string) => {
    dispatch(searchWeather(cityName));
  };

  return (
    <section className="search-section" aria-label="Weather search">
      <SearchInput onSearch={handleSearch} isLoading={isLoading} />
      <SearchHistory history={searchHistory} onCityClick={handleHistoryClick} />
    </section>
  );
};

export default SearchSection;

import React from 'react';
import './SearchHistory.css';

/**
 * SearchHistory Component Props
 */
interface SearchHistoryProps {
  history: string[];
  onCityClick: (cityName: string) => void;
}

/**
 * SearchHistory Component
 * Displays recent city searches and enables quick re-search
 * Requirements: 10.4, 10.5
 */
const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onCityClick }) => {
  if (history.length === 0) {
    return null;
  }

  // Display in reverse chronological order (most recent first)
  const reversedHistory = [...history].reverse();

  return (
    <div className="search-history">
      <h3 className="search-history-title">Recent Searches</h3>
      <ul className="search-history-list" role="list">
        {reversedHistory.map((city, index) => (
          <li key={`${city}-${index}`} className="search-history-item">
            <button
              className="search-history-button"
              onClick={() => onCityClick(city)}
              aria-label={`Search for ${city} again`}
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;

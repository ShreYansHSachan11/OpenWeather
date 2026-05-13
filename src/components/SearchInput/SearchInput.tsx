import React, { useState, FormEvent } from 'react';
import './SearchInput.css';

/**
 * SearchInput Component Props
 */
interface SearchInputProps {
  onSearch: (cityName: string) => void;
  isLoading: boolean;
}

/**
 * SearchInput Component
 * Accepts and validates city name input for weather search
 * Requirements: 1.1, 1.2, 8.5, 8.6
 */
const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate non-empty input
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setValidationError('Please enter a city name.');
      return;
    }

    // Clear validation error and submit
    setValidationError('');
    onSearch(trimmedValue);
    setInputValue(''); // Clear input after successful search
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (validationError) {
      setValidationError(''); // Clear error as user types
    }
  };

  return (
    <form className="search-input-form" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          className={`search-input ${validationError ? 'search-input-error' : ''}`}
          placeholder="Enter city name..."
          value={inputValue}
          onChange={handleInputChange}
          disabled={isLoading}
          aria-label="City name"
          aria-invalid={!!validationError}
          aria-describedby={validationError ? 'search-error' : undefined}
        />
        <button
          type="submit"
          className="search-button"
          disabled={isLoading}
          aria-label="Search for weather"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {validationError && (
        <p id="search-error" className="search-error" role="alert">
          {validationError}
        </p>
      )}
    </form>
  );
};

export default SearchInput;

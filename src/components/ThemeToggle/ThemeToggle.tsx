import React from 'react';
import './ThemeToggle.css';

/**
 * ThemeToggle Component Props
 */
interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

/**
 * ThemeToggle Component
 * Provides a toggle control to switch between light and dark themes
 * Requirements: 11.1
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;

import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { selectIsDarkMode } from '../../state/selectors/uiSelectors';
import { toggleTheme } from '../../state/slices/uiSlice/uiSlice';
import './Header.css';

/**
 * Header Component
 * Displays application logo and theme toggle
 * Requirements: 8.1
 */
const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <span className="logo-icon" aria-hidden="true">🌤️</span>
          <h1 className="logo-text">Weather Dashboard</h1>
        </div>
        <ThemeToggle isDarkMode={isDarkMode} onToggle={handleToggleTheme} />
      </div>
    </header>
  );
};

export default Header;

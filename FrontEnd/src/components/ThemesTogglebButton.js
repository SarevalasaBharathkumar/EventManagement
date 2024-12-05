// src/components/ThemeToggleButton.js
import React from 'react';
import { useTheme } from '../ThemeContext';

const ThemeToggleButton = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeToggleButton;

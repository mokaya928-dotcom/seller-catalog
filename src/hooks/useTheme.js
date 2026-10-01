import { useState, useEffect } from 'react';
import { getAppTheme, setAppTheme, toggleAppTheme, THEMES } from '../services/themeService';

export function useTheme() {
  const [theme, setThemeState] = useState(getAppTheme);

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && e.detail.theme) {
        setThemeState(e.detail.theme);
      }
    };
    window.addEventListener('app_theme_changed', handleThemeChange);
    return () => window.removeEventListener('app_theme_changed', handleThemeChange);
  }, []);

  const changeTheme = (newTheme) => {
    const active = setAppTheme(newTheme);
    setThemeState(active);
  };

  const toggleTheme = () => {
    const active = toggleAppTheme();
    setThemeState(active);
  };

  return {
    theme,
    isAirbnb: theme === THEMES.AIRBNB,
    isApple: theme === THEMES.APPLE,
    setTheme: changeTheme,
    toggleTheme
  };
}

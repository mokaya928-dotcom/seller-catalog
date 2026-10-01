/**
 * Token-based Theme Switcher Service
 * Manages instant switching between Airbnb and Apple design systems.
 * Scopes CSS variables via document.documentElement.setAttribute('data-theme', theme).
 */

export const THEMES = {
  AIRBNB: 'airbnb',
  APPLE: 'apple'
};

export const THEME_STORAGE_KEY = 'bbk_active_theme';

/**
 * Get currently active theme ('airbnb' | 'apple')
 */
export function getAppTheme() {
  if (typeof window === 'undefined') return THEMES.AIRBNB;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === THEMES.APPLE || stored === THEMES.AIRBNB) {
    return stored;
  }
  const rootAttr = document.documentElement.getAttribute('data-theme');
  if (rootAttr === THEMES.APPLE || rootAttr === THEMES.AIRBNB) {
    return rootAttr;
  }
  return THEMES.AIRBNB;
}

/**
 * Set data-theme on root element to switch the whole UI's look instantly.
 * @param {'airbnb' | 'apple'} theme
 */
export function setAppTheme(theme) {
  const targetTheme = theme === THEMES.APPLE ? THEMES.APPLE : THEMES.AIRBNB;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', targetTheme);
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, targetTheme);
    } catch (e) {
      // ignore localStorage quota errors
    }
    window.dispatchEvent(new CustomEvent('app_theme_changed', { detail: { theme: targetTheme } }));
  }
  return targetTheme;
}

/**
 * Toggle between 'airbnb' and 'apple'
 */
export function toggleAppTheme() {
  const current = getAppTheme();
  const next = current === THEMES.AIRBNB ? THEMES.APPLE : THEMES.AIRBNB;
  return setAppTheme(next);
}

/**
 * Initialize theme at app startup
 */
export function initAppTheme() {
  const theme = getAppTheme();
  return setAppTheme(theme);
}

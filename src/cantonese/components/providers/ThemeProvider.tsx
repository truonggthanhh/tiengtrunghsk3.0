import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTheme as useSiteTheme } from 'next-themes';
import { ThemeCtx } from './ThemeProvider.shared';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, theme, forcedTheme, setTheme } = useSiteTheme();
  const [fallbackDark, setFallbackDark] = useState(() => {
    try { return localStorage.getItem('theme.dark') === '1'; } catch { return false; }
  });
  const shared = Boolean(setTheme);
  const dark = shared ? (forcedTheme ?? resolvedTheme ?? theme) === 'dark' : fallbackDark;
  useEffect(() => {
    if (shared) return;
    document.documentElement.classList.toggle('dark', fallbackDark);
    try { localStorage.setItem('theme.dark', fallbackDark ? '1' : '0'); } catch { /* Keep the current session preference. */ }
  }, [shared, fallbackDark]);
  const toggle = useCallback(() => {
    if (setTheme) setTheme(dark ? 'light' : 'dark');
    else setFallbackDark(value => !value);
  }, [setTheme, dark]);
  const value = useMemo(() => ({ dark, toggle }), [dark, toggle]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

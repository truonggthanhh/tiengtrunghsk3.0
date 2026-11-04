import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SettingsCtx } from './SettingsProvider.shared';

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(() => {
    try { return localStorage.getItem('settings.jyutping') !== '0'; } catch { return true; }
  });
  useEffect(() => { try { localStorage.setItem('settings.jyutping', show ? '1' : '0'); } catch { /* Storage can be disabled. */ } }, [show]);
  const toggleJyutping = useCallback(() => setShow(value => !value), []);
  const value = useMemo(() => ({ showJyutping: show, toggleJyutping }), [show, toggleJyutping]);
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

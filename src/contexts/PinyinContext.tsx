import { PinyinContext, usePinyin } from './PinyinContext.shared';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface PinyinContextType {
  showPinyin: boolean;
  togglePinyin: () => void;
}



export const PinyinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage on mount, default to true
  const [showPinyin, setShowPinyin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('showPinyin');
      return saved === 'false' ? false : true;
    } catch {
      return true;
    }
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    try { localStorage.setItem('showPinyin', JSON.stringify(showPinyin)); } catch { /* Storage may be disabled. */ }
  }, [showPinyin]);

  const togglePinyin = () => {
    setShowPinyin(prev => !prev);
  };

  return (
    <PinyinContext.Provider value={{ showPinyin, togglePinyin }}>
      {children}
    </PinyinContext.Provider>
  );
};

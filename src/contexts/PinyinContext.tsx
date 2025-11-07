import React, { createContext, useContext, useState, useEffect } from 'react';

interface PinyinContextType {
  showPinyin: boolean;
  togglePinyin: () => void;
}

const PinyinContext = createContext<PinyinContextType | undefined>(undefined);

export const PinyinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage on mount, default to true
  const [showPinyin, setShowPinyin] = useState<boolean>(() => {
    const saved = localStorage.getItem('showPinyin');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('showPinyin', JSON.stringify(showPinyin));
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

export const usePinyin = () => {
  const context = useContext(PinyinContext);
  if (context === undefined) {
    throw new Error('usePinyin must be used within a PinyinProvider');
  }
  return context;
};

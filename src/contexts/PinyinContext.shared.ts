import { createContext,useContext } from 'react';
interface PinyinContextType {
  showPinyin: boolean;
  togglePinyin: () => void;
}

export const PinyinContext = createContext<PinyinContextType | undefined>(undefined);

export const usePinyin = () => {
  const context = useContext(PinyinContext);
  if (context === undefined) {
    throw new Error('usePinyin must be used within a PinyinProvider');
  }
  return context;
};

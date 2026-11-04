import type { GamificationDashboard,UserProgress } from '@/types/gamification';
import { createContext,useContext } from 'react';
interface GamificationContextType {
  userProgress: UserProgress | null;
  dashboard: GamificationDashboard | null;
  isLoading: boolean;
  refreshProgress: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  addXP: (points: number) => Promise<void>;
}

export const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) throw new Error('useGamification must be used within a GamificationProvider');
  return context;
}

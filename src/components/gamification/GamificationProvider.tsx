import { GamificationContext, useGamification } from './GamificationProvider.shared';
/** Gamification state and rewards for the Mandarin Supabase project. */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { UserProgress, GamificationDashboard } from '@/types/gamification';
import { getGamificationDashboard, getUserProgress } from '@/lib/gamification/eventHandler';
import { calculateLevel } from '@/lib/gamification/xpRules';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GamificationContextType {
  userProgress: UserProgress | null;
  dashboard: GamificationDashboard | null;
  isLoading: boolean;
  refreshProgress: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  addXP: (points: number) => Promise<void>;
}



export function GamificationProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const activeUser = useRef(userId);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [dashboard, setDashboard] = useState<GamificationDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshDashboard = useCallback(async () => {
    const id = activeUser.current;
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getGamificationDashboard();
      // A request from the previous account must never populate the new account.
      if (activeUser.current !== id) return;
      setDashboard(data);
      setUserProgress(data?.user_progress ?? null);
    } catch (error) {
      console.error('Failed to fetch gamification dashboard:', error);
      if (activeUser.current === id) {
        setDashboard(null);
        setUserProgress(null);
      }
    } finally {
      if (activeUser.current === id) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let authChanged = false;
    const applyUser = (id: string | null) => {
      if (!mounted) return;
      activeUser.current = id;
      setUserId(id);
      setUserProgress(null);
      setDashboard(null);
      setIsLoading(Boolean(id));
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authChanged = true;
      // Token refreshes for the same user need not blank the dashboard.
      if (activeUser.current !== (session?.user.id ?? null)) applyUser(session?.user.id ?? null);
      else if (!session) setIsLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error('Failed to get gamification session:', error);
      if (!authChanged) applyUser(session?.user.id ?? null);
    }).catch(error => {
      console.error('Failed to get gamification session:', error);
      if (!authChanged) applyUser(null);
    });
    return () => { mounted = false; activeUser.current = null; subscription.unsubscribe(); };
  }, []);

  useEffect(() => { if (userId) void refreshDashboard(); }, [userId, refreshDashboard]);

  const addXP = useCallback(async (points: number) => {
    if (!Number.isSafeInteger(points) || points <= 0 || !activeUser.current) return;
    const id = activeUser.current;
    try {
      // Compare-and-swap prevents simultaneous rewards from overwriting each other.
      for (let attempt = 0; attempt < 5; attempt++) {
        const progress = await getUserProgress();
        if (!progress || activeUser.current !== id || progress.user_id !== id) return;
        const total = progress.total_xp + points;
        if (!Number.isSafeInteger(total)) throw new Error('Invalid XP total');
        const { data, error } = await supabase.from('user_progress')
          .update({ total_xp: total, current_level: calculateLevel(total) })
          .eq('user_id', id).eq('total_xp', progress.total_xp).select('*').maybeSingle();
        if (error) throw error;
        if (data) {
          if (activeUser.current === id) setUserProgress(data);
          await refreshDashboard();
          return;
        }
      }
      throw new Error('Progress changed; please retry');
    } catch (error) {
      console.error('Failed to award XP:', error);
      toast.error('Không thể lưu XP. Vui lòng thử lại.');
    }
  }, [refreshDashboard]);

  return <GamificationContext.Provider value={{ userProgress, dashboard, isLoading,
    refreshProgress: refreshDashboard, refreshDashboard, addXP }}>{children}</GamificationContext.Provider>;
}

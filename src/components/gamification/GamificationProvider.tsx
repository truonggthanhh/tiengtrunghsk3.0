/**
 * Gamification Context Provider
 * Manages gamification state across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProgress, GamificationDashboard } from '@/types/gamification';
import { getUserProgress, getGamificationDashboard } from '@/lib/gamification/eventHandler';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface GamificationContextType {
  userProgress: UserProgress | null;
  dashboard: GamificationDashboard | null;
  isLoading: boolean;
  refreshProgress: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [dashboard, setDashboard] = useState<GamificationDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    if (!session?.user) return;

    try {
      const progress = await getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
    }
  };

  const fetchDashboard = async () => {
    if (!session?.user) return;

    try {
      const dashboardData = await getGamificationDashboard();
      setDashboard(dashboardData);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Track session changes using supabase auth directly
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchProgress();
      fetchDashboard();
    } else {
      setUserProgress(null);
      setDashboard(null);
      setIsLoading(false);
    }
  }, [session?.user]);

  const value = {
    userProgress,
    dashboard,
    isLoading,
    refreshProgress: fetchProgress,
    refreshDashboard: fetchDashboard,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}

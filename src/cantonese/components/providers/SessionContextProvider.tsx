"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/cantonese/integrations/supabase/client';

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};

export default function SessionContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Xử lý OAuth callback - tự động detect tokens trong URL
    const handleOAuthCallback = async () => {
      try {
        // getSession() sẽ tự động xử lý tokens trong URL hash/query
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
        }

        setSession(session);

        // Nếu có session và URL có hash/query params, clean up URL
        if (session && (window.location.hash || window.location.search.includes('code='))) {
          // Clean URL sau khi process OAuth callback
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error('Error in OAuth callback handling:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();

    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'Session exists' : 'No session');
      setSession(session);
      setIsLoading(false);

      // Clean URL nếu event là SIGNED_IN và có OAuth params
      if (_event === 'SIGNED_IN' && (window.location.hash || window.location.search.includes('code='))) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}
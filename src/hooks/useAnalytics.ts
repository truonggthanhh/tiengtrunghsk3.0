import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PracticeSession {
  id: string;
  session_type: string;
  language: 'mandarin' | 'cantonese';
  level: string;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  duration_seconds?: number;
  started_at: string;
  completed_at?: string;
  metadata?: Record<string, any>;
}

export interface SessionAnswer {
  word_id: number;
  hanzi: string;
  pinyin?: string;
  jyutping?: string;
  correct_answer: string;
  user_answer?: string;
  is_correct: boolean;
  response_time_ms?: number;
}

export interface LearningStats {
  total_practice_time_seconds: number;
  total_sessions: number;
  total_questions_answered: number;
  total_correct_answers: number;
  overall_accuracy: number;
  mandarin_sessions: number;
  mandarin_accuracy: number;
  mandarin_words_learned: number;
  cantonese_sessions: number;
  cantonese_accuracy: number;
  cantonese_words_learned: number;
  avg_session_duration_seconds: number;
  last_practice_date?: string;
}

export interface AnalyticsChartData {
  date: string;
  sessions: number;
  accuracy: number;
  questions: number;
}

/**
 * Hook for tracking and analyzing learning progress
 * Provides comprehensive analytics for both Mandarin and Cantonese
 */
export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Start a new practice session
   */
  const startSession = useCallback(async (
    sessionType: string,
    language: 'mandarin' | 'cantonese',
    level: string,
    totalQuestions: number,
    metadata?: Record<string, any>
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: insertError } = await supabase
        .from('practice_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          language,
          level,
          total_questions: totalQuestions,
          correct_answers: 0, // Will be updated later
          accuracy: 0,
          started_at: new Date().toISOString(),
          metadata: metadata || {}
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      return data.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start session';
      setError(errorMessage);
      console.error('Error starting session:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Complete a practice session
   */
  const completeSession = useCallback(async (
    sessionId: string,
    correctAnswers: number,
    durationSeconds?: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data: session } = await supabase
        .from('practice_sessions')
        .select('total_questions')
        .eq('id', sessionId)
        .single();

      if (!session) throw new Error('Session not found');

      const accuracy = (correctAnswers / session.total_questions) * 100;

      const { error: updateError } = await supabase
        .from('practice_sessions')
        .update({
          correct_answers: correctAnswers,
          accuracy: Number(accuracy.toFixed(2)),
          duration_seconds: durationSeconds,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete session';
      setError(errorMessage);
      console.error('Error completing session:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Record an individual answer
   */
  const recordAnswer = useCallback(async (
    sessionId: string,
    answer: SessionAnswer,
    questionType: string
  ): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: insertError } = await supabase
        .from('session_answers')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          word_id: answer.word_id,
          hanzi: answer.hanzi,
          pinyin: answer.pinyin,
          jyutping: answer.jyutping,
          correct_answer: answer.correct_answer,
          user_answer: answer.user_answer,
          is_correct: answer.is_correct,
          response_time_ms: answer.response_time_ms,
          question_type: questionType
        });

      if (insertError) throw insertError;

      return true;
    } catch (err) {
      console.error('Error recording answer:', err);
      return false;
    }
  }, []);

  /**
   * Get user's learning statistics
   */
  const getLearningStats = useCallback(async (): Promise<LearningStats | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: queryError } = await supabase
        .from('user_learning_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      return data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Error fetching learning stats:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get recent practice sessions
   */
  const getRecentSessions = useCallback(async (
    limit: number = 10,
    language?: 'mandarin' | 'cantonese'
  ): Promise<PracticeSession[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sessions';
      setError(errorMessage);
      console.error('Error fetching recent sessions:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get analytics chart data for the past N days
   */
  const getChartData = useCallback(async (
    days: number = 30,
    language?: 'mandarin' | 'cantonese'
  ): Promise<AnalyticsChartData[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .not('completed_at', 'is', null);

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      // Group by date
      const grouped = (data || []).reduce((acc, session) => {
        const date = new Date(session.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            date,
            sessions: 0,
            totalQuestions: 0,
            correctAnswers: 0
          };
        }
        acc[date].sessions += 1;
        acc[date].totalQuestions += session.total_questions;
        acc[date].correctAnswers += session.correct_answers;
        return acc;
      }, {} as Record<string, any>);

      // Convert to array and calculate accuracy
      const chartData = Object.values(grouped).map((item: any) => ({
        date: item.date,
        sessions: item.sessions,
        accuracy: item.totalQuestions > 0
          ? Number(((item.correctAnswers / item.totalQuestions) * 100).toFixed(2))
          : 0,
        questions: item.totalQuestions
      }));

      return chartData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chart data';
      setError(errorMessage);
      console.error('Error fetching chart data:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get weak spots - words/categories with low accuracy
   */
  const getWeakSpots = useCallback(async (
    language?: 'mandarin' | 'cantonese',
    limit: number = 10
  ): Promise<Array<{ word_id: number; hanzi: string; accuracy: number; attempts: number }>> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('session_answers')
        .select('word_id, hanzi, is_correct')
        .eq('user_id', user.id);

      if (language) {
        // Need to join with sessions to filter by language
        // For now, we'll get all and filter after
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      // Group by word_id and calculate accuracy
      const wordStats = (data || []).reduce((acc, answer) => {
        if (!acc[answer.word_id]) {
          acc[answer.word_id] = {
            word_id: answer.word_id,
            hanzi: answer.hanzi,
            correct: 0,
            total: 0
          };
        }
        acc[answer.word_id].total += 1;
        if (answer.is_correct) {
          acc[answer.word_id].correct += 1;
        }
        return acc;
      }, {} as Record<number, any>);

      // Convert to array and calculate accuracy
      const weakSpots = Object.values(wordStats)
        .map((stat: any) => ({
          word_id: stat.word_id,
          hanzi: stat.hanzi,
          accuracy: (stat.correct / stat.total) * 100,
          attempts: stat.total
        }))
        .filter(spot => spot.attempts >= 3) // Only include words with at least 3 attempts
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, limit);

      return weakSpots;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weak spots';
      setError(errorMessage);
      console.error('Error fetching weak spots:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    startSession,
    completeSession,
    recordAnswer,
    getLearningStats,
    getRecentSessions,
    getChartData,
    getWeakSpots
  };
};

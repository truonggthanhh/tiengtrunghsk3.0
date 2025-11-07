import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { toast } from 'sonner';

export interface ProgressEntry {
  vocabularyId: string;
  isCorrect: boolean;
  exerciseType: string;
  level: string;
}

export const useProgressTracking = () => {
  const { session } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Record a single progress entry
   */
  const recordProgress = useCallback(async (entry: ProgressEntry) => {
    if (!session?.user?.id) {
      console.log('No user session, skipping progress tracking');
      return false;
    }

    setIsSaving(true);
    try {
      // Check if progress entry already exists
      const { data: existingProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('exercise_type', entry.exerciseType)
        .eq('level', entry.level)
        .eq('vocabulary_id', entry.vocabularyId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is fine
        throw fetchError;
      }

      if (existingProgress) {
        // Update existing progress
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            is_correct: entry.isCorrect,
            attempts: existingProgress.attempts + 1,
            last_practiced_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);

        if (updateError) throw updateError;
      } else {
        // Insert new progress
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: session.user.id,
            exercise_type: entry.exerciseType,
            level: entry.level,
            vocabulary_id: entry.vocabularyId,
            is_correct: entry.isCorrect,
            attempts: 1,
          });

        if (insertError) throw insertError;
      }

      // Update exercise stats
      await updateExerciseStats(entry);

      return true;
    } catch (error: any) {
      console.error('Error recording progress:', error);
      toast.error('Không thể lưu tiến độ', {
        description: error.message,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [session]);

  /**
   * Update aggregated exercise statistics
   */
  const updateExerciseStats = useCallback(async (entry: ProgressEntry) => {
    if (!session?.user?.id) return;

    try {
      // Fetch existing stats
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_exercise_stats')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('exercise_type', entry.exerciseType)
        .eq('level', entry.level)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingStats) {
        // Update existing stats
        const { error: updateError } = await supabase
          .from('user_exercise_stats')
          .update({
            total_attempts: existingStats.total_attempts + 1,
            correct_answers: entry.isCorrect
              ? existingStats.correct_answers + 1
              : existingStats.correct_answers,
            last_practiced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingStats.id);

        if (updateError) throw updateError;
      } else {
        // Insert new stats
        const { error: insertError } = await supabase
          .from('user_exercise_stats')
          .insert({
            user_id: session.user.id,
            exercise_type: entry.exerciseType,
            level: entry.level,
            total_attempts: 1,
            correct_answers: entry.isCorrect ? 1 : 0,
          });

        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error('Error updating exercise stats:', error);
    }
  }, [session]);

  /**
   * Get user progress for a specific exercise and level
   */
  const getProgress = useCallback(async (exerciseType: string, level: string) => {
    if (!session?.user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('exercise_type', exerciseType)
        .eq('level', level);

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching progress:', error);
      return null;
    }
  }, [session]);

  /**
   * Get exercise statistics
   */
  const getExerciseStats = useCallback(async (exerciseType: string, level: string) => {
    if (!session?.user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_exercise_stats')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('exercise_type', exerciseType)
        .eq('level', level)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching exercise stats:', error);
      return null;
    }
  }, [session]);

  /**
   * Get all user statistics
   */
  const getAllStats = useCallback(async () => {
    if (!session?.user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_exercise_stats')
        .select('*')
        .eq('user_id', session.user.id)
        .order('last_practiced_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching all stats:', error);
      return null;
    }
  }, [session]);

  return {
    recordProgress,
    getProgress,
    getExerciseStats,
    getAllStats,
    isSaving,
  };
};

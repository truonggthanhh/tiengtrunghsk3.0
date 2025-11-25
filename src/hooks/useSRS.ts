import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { VocabularyWord } from '@/data';

export interface SRSReviewData {
  word_id: number;
  hanzi: string;
  pinyin?: string;
  jyutping?: string;
  ease_factor: number;
  review_count: number;
  next_review_date: string;
}

export interface UpdateSRSParams {
  wordId: number;
  wordType: 'mandarin' | 'cantonese';
  level: string;
  hanzi: string;
  pinyin?: string;
  jyutping?: string;
  isCorrect: boolean;
  quality: number; // 0-5 rating (0=complete blackout, 5=perfect response)
}

/**
 * Hook for managing Spaced Repetition System (SRS) for vocabulary learning
 * Works for both Mandarin and Cantonese
 */
export const useSRS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get vocabulary words that are due for review
   */
  const getDueReviews = useCallback(async (
    wordType: 'mandarin' | 'cantonese',
    level: string,
    limit: number = 20
  ): Promise<SRSReviewData[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: rpcError } = await supabase.rpc('get_due_reviews', {
        p_user_id: user.id,
        p_word_type: wordType,
        p_level: level,
        p_limit: limit
      });

      if (rpcError) throw rpcError;

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch due reviews';
      setError(errorMessage);
      console.error('Error fetching due reviews:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update SRS data after a review
   */
  const updateReview = useCallback(async (params: UpdateSRSParams): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: rpcError } = await supabase.rpc('update_srs_review', {
        p_user_id: user.id,
        p_word_id: params.wordId,
        p_word_type: params.wordType,
        p_level: params.level,
        p_hanzi: params.hanzi,
        p_pinyin: params.pinyin || null,
        p_jyutping: params.jyutping || null,
        p_is_correct: params.isCorrect,
        p_quality: params.quality
      });

      if (rpcError) throw rpcError;

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update review';
      setError(errorMessage);
      console.error('Error updating SRS review:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all review data for a specific word type and level
   */
  const getReviewsByLevel = useCallback(async (
    wordType: 'mandarin' | 'cantonese',
    level: string
  ): Promise<SRSReviewData[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: queryError } = await supabase
        .from('vocabulary_reviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('word_type', wordType)
        .eq('level', level)
        .order('next_review_date', { ascending: true });

      if (queryError) throw queryError;

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(errorMessage);
      console.error('Error fetching reviews by level:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if a word has been reviewed before
   */
  const hasBeenReviewed = useCallback(async (
    wordId: number,
    wordType: 'mandarin' | 'cantonese',
    level: string
  ): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error: queryError } = await supabase
        .from('vocabulary_reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .eq('word_type', wordType)
        .eq('level', level)
        .single();

      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking review status:', err);
      return false;
    }
  }, []);

  /**
   * Calculate quality score based on correctness and other factors
   * Returns a value between 0-5 for the SM-2 algorithm
   */
  const calculateQuality = useCallback((
    isCorrect: boolean,
    responseTimeMs?: number,
    consecutiveCorrect?: number
  ): number => {
    if (!isCorrect) {
      return 0; // Complete blackout
    }

    // Base score for correct answer
    let quality = 4; // Default: correct with some difficulty

    // Adjust based on response time if provided
    if (responseTimeMs !== undefined) {
      if (responseTimeMs < 2000) {
        quality = 5; // Perfect - very fast
      } else if (responseTimeMs < 5000) {
        quality = 4; // Correct after hesitation
      } else {
        quality = 3; // Correct with difficulty
      }
    }

    // Adjust based on consecutive correct answers
    if (consecutiveCorrect !== undefined && consecutiveCorrect >= 3) {
      quality = Math.min(5, quality + 1);
    }

    return quality;
  }, []);

  /**
   * Mix SRS due reviews with new vocabulary
   * Prioritizes due reviews but includes new words for continuous learning
   */
  const getMixedVocabulary = useCallback(async (
    allVocabulary: VocabularyWord[],
    wordType: 'mandarin' | 'cantonese',
    level: string,
    totalCount: number
  ): Promise<VocabularyWord[]> => {
    // Get due reviews
    const dueReviews = await getDueReviews(wordType, level, Math.ceil(totalCount * 0.7));

    // Convert due reviews to VocabularyWord format
    const dueWords = allVocabulary.filter(word =>
      dueReviews.some(review => review.word_id === word.id)
    );

    // If we have enough due reviews, return them
    if (dueWords.length >= totalCount) {
      return dueWords.slice(0, totalCount);
    }

    // Otherwise, mix with new words
    const reviewedWordIds = new Set(dueReviews.map(r => r.word_id));
    const newWords = allVocabulary.filter(word => !reviewedWordIds.has(word.id));

    // Shuffle new words
    const shuffledNewWords = [...newWords].sort(() => Math.random() - 0.5);

    // Combine due reviews and new words
    const mixed = [...dueWords, ...shuffledNewWords].slice(0, totalCount);

    return mixed;
  }, [getDueReviews]);

  return {
    loading,
    error,
    getDueReviews,
    updateReview,
    getReviewsByLevel,
    hasBeenReviewed,
    calculateQuality,
    getMixedVocabulary
  };
};

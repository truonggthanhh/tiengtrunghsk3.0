/**
 * Gamification Integration Hook
 * Easy integration hook for quiz/lesson completion with XP tracking and animations
 */

import { useState, useCallback } from 'react';
import { recordLearningEvent } from '@/lib/gamification/eventHandler';
import type { LearningEvent } from '@/types/gamification';
import { useToast } from '@/hooks/use-toast';

interface GamificationResult {
  xp_earned: number;
  level_up: boolean;
  new_level?: number;
  new_badges?: any[];
}

interface UseGamificationIntegrationReturn {
  // State
  showXPAnimation: boolean;
  xpEarned: number;
  showLevelUpModal: boolean;
  levelUpData: { level: number; title?: string } | null;
  showBadgeNotification: boolean;
  unlockedBadge: any | null;

  // Actions
  trackQuizCompletion: (score: number, total: number, metadata?: any) => Promise<void>;
  trackLessonCompletion: (metadata?: any) => Promise<void>;
  trackPronunciationPractice: (metadata?: any) => Promise<void>;
  clearXPAnimation: () => void;
  clearLevelUpModal: () => void;
  clearBadgeNotification: () => void;

  // Loading state
  isRecording: boolean;
}

export function useGamificationIntegration(): UseGamificationIntegrationReturn {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);

  // XP Animation State
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // Level Up State
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number; title?: string } | null>(null);

  // Badge Unlock State
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any | null>(null);

  const processGamificationResult = useCallback((result: GamificationResult) => {
    // Show XP animation
    if (result.xp_earned > 0) {
      setXpEarned(result.xp_earned);
      setShowXPAnimation(true);
    }

    // Show level up modal
    if (result.level_up && result.new_level) {
      setLevelUpData({ level: result.new_level });
      setShowLevelUpModal(true);
    }

    // Show badge unlock notification
    if (result.new_badges && result.new_badges.length > 0) {
      setUnlockedBadge(result.new_badges[0]);
      setShowBadgeNotification(true);
    }
  }, []);

  const trackQuizCompletion = useCallback(async (score: number, total: number, metadata: any = {}) => {
    setIsRecording(true);
    try {
      const event: LearningEvent = {
        event_type: 'quiz_complete',
        metadata: { score, total, correct_count: score, total_count: total, ...metadata }
      };

      const result = await recordLearningEvent(event);

      processGamificationResult({
        xp_earned: result.xp_earned,
        level_up: result.level_up,
        new_level: result.level_after,
        new_badges: result.badges_unlocked
      });
    } catch (error) {
      console.error('Failed to track quiz completion:', error);
      // Don't show error to user - gamification is non-critical
    } finally {
      setIsRecording(false);
    }
  }, [processGamificationResult]);

  const trackLessonCompletion = useCallback(async (metadata: any = {}) => {
    setIsRecording(true);
    try {
      const event: LearningEvent = {
        event_type: 'lesson_complete',
        metadata
      };

      const result = await recordLearningEvent(event);

      processGamificationResult({
        xp_earned: result.xp_earned,
        level_up: result.level_up,
        new_level: result.level_after,
        new_badges: result.badges_unlocked
      });
    } catch (error) {
      console.error('Failed to track lesson completion:', error);
    } finally {
      setIsRecording(false);
    }
  }, [processGamificationResult]);

  const trackPronunciationPractice = useCallback(async (metadata: any = {}) => {
    setIsRecording(true);
    try {
      const event: LearningEvent = {
        event_type: 'pronunciation_practice',
        metadata
      };

      const result = await recordLearningEvent(event);

      processGamificationResult({
        xp_earned: result.xp_earned,
        level_up: result.level_up,
        new_level: result.level_after,
        new_badges: result.badges_unlocked
      });
    } catch (error) {
      console.error('Failed to track pronunciation practice:', error);
    } finally {
      setIsRecording(false);
    }
  }, [processGamificationResult]);

  const clearXPAnimation = useCallback(() => {
    setShowXPAnimation(false);
    setXpEarned(0);
  }, []);

  const clearLevelUpModal = useCallback(() => {
    setShowLevelUpModal(false);
    setLevelUpData(null);
  }, []);

  const clearBadgeNotification = useCallback(() => {
    setShowBadgeNotification(false);
    setUnlockedBadge(null);
  }, []);

  return {
    // State
    showXPAnimation,
    xpEarned,
    showLevelUpModal,
    levelUpData,
    showBadgeNotification,
    unlockedBadge,

    // Actions
    trackQuizCompletion,
    trackLessonCompletion,
    trackPronunciationPractice,
    clearXPAnimation,
    clearLevelUpModal,
    clearBadgeNotification,

    // Loading
    isRecording,
  };
}

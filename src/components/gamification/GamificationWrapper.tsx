/**
 * Gamification Wrapper Component
 * Wraps quiz/lesson pages to show gamification animations
 * Usage: <GamificationWrapper>{children}</GamificationWrapper>
 */

import { ReactNode } from 'react';
import { XPGainAnimation } from './XPGainAnimation';
import { LevelUpModal } from './LevelUpModal';
import { BadgeUnlockNotification } from './BadgeUnlockNotification';
import { useGamificationIntegration } from '@/hooks/useGamificationIntegration';

interface GamificationWrapperProps {
  children: ReactNode;
  onQuizComplete?: (score: number, total: number) => void;
  onLessonComplete?: () => void;
}

// Context to access gamification tracking from child components
import { createContext, useContext } from 'react';

interface GamificationContextValue {
  trackQuizCompletion: (score: number, total: number, metadata?: any) => Promise<void>;
  trackLessonCompletion: (metadata?: any) => Promise<void>;
  trackPronunciationPractice: (metadata?: any) => Promise<void>;
  isRecording: boolean;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function useGamificationTracking() {
  const context = useContext(GamificationContext);
  if (!context) {
    // Return no-op functions if not wrapped
    return {
      trackQuizCompletion: async () => {},
      trackLessonCompletion: async () => {},
      trackPronunciationPractice: async () => {},
      isRecording: false,
    };
  }
  return context;
}

export function GamificationWrapper({ children }: { children: ReactNode }) {
  const {
    showXPAnimation,
    xpEarned,
    showLevelUpModal,
    levelUpData,
    showBadgeNotification,
    unlockedBadge,
    trackQuizCompletion,
    trackLessonCompletion,
    trackPronunciationPractice,
    clearXPAnimation,
    clearLevelUpModal,
    clearBadgeNotification,
    isRecording,
  } = useGamificationIntegration();

  return (
    <GamificationContext.Provider
      value={{
        trackQuizCompletion,
        trackLessonCompletion,
        trackPronunciationPractice,
        isRecording,
      }}
    >
      {children}

      {/* XP Gain Animation */}
      {showXPAnimation && (
        <XPGainAnimation xp={xpEarned} onComplete={clearXPAnimation} />
      )}

      {/* Level Up Modal */}
      {showLevelUpModal && levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.level}
          levelTitle={levelUpData.title}
          onClose={clearLevelUpModal}
        />
      )}

      {/* Badge Unlock Notification */}
      {showBadgeNotification && unlockedBadge && (
        <BadgeUnlockNotification
          badge={unlockedBadge}
          onClose={clearBadgeNotification}
        />
      )}
    </GamificationContext.Provider>
  );
}

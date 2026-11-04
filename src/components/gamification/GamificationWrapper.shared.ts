import { createContext,ReactNode,useContext } from 'react';
interface GamificationWrapperProps {
  children: ReactNode;
  onQuizComplete?: (score: number, total: number) => void;
  onLessonComplete?: () => void;
}
interface GamificationContextValue {
  trackQuizCompletion: (score: number, total: number, metadata?: Record<string, unknown>) => Promise<void>;
  trackLessonCompletion: (metadata?: Record<string, unknown>) => Promise<void>;
  trackPronunciationPractice: (metadata?: Record<string, unknown>) => Promise<void>;
  isRecording: boolean;
}

export const GamificationContext = createContext<GamificationContextValue | null>(null);

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

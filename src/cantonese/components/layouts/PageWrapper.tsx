import type { ReactNode } from 'react';
import LearningHeader from '@/components/layout/LearningHeader';
import { useSettings } from '@/cantonese/components/providers/SettingsProvider.shared';

interface PageWrapperProps { children: ReactNode; showBackButton?: boolean; }
export default function PageWrapper({ children }: PageWrapperProps) {
  const { showJyutping, toggleJyutping } = useSettings();
  return <div className="learning-ui min-h-screen bg-background text-foreground" data-language="cantonese">
    <LearningHeader language="cantonese" pronunciation={showJyutping} onTogglePronunciation={toggleJyutping} />
    <div>{children}</div>
  </div>;
}

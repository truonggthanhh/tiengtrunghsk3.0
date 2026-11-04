import LearningHeader from '@/components/layout/LearningHeader';
import { usePinyin } from '@/contexts/PinyinContext.shared';

export default function Header() {
  const { showPinyin, togglePinyin } = usePinyin();
  return <LearningHeader language="mandarin" pronunciation={showPinyin} onTogglePronunciation={togglePinyin} />;
}

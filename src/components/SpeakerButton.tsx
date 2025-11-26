import React, { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SpeakerButtonProps {
  /** Text to speak */
  text: string;
  /** Language for TTS (default: zh-CN for Mandarin) */
  language?: string;
  /** Optional custom class name */
  className?: string;
  /** Speech rate (default: 0.8 - slightly slower for learning) */
  rate?: number;
}

/**
 * Speaker Button Component for Mandarin
 * Uses Web Speech API for text-to-speech
 */
const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  language = 'zh-CN',
  className,
  rate = 0.8
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent parent element clicks (e.g., flashcard flip)

    if (!('speechSynthesis' in window)) {
      toast.error('Trình duyệt không hỗ trợ Text-to-Speech', {
        description: 'Vui lòng sử dụng Chrome, Edge, hoặc Safari'
      });
      return;
    }

    if (isSpeaking) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('Speech synthesis error:', event);
        toast.error('Không thể phát âm', {
          description: 'Vui lòng thử lại'
        });
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      setIsSpeaking(false);
      toast.error('Lỗi phát âm');
    }
  }, [text, language, rate, isSpeaking]);

  return (
    <button
      onClick={handleClick}
      aria-label="Nghe phát âm"
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-full',
        'bg-white/20 hover:bg-white/30 transition-all',
        'focus:outline-none focus:ring-2 focus:ring-white/50',
        isSpeaking && 'bg-white/40',
        className
      )}
      title="Nghe phát âm (Mandarin)"
    >
      <Volume2 className={cn('h-5 w-5 text-white', isSpeaking && 'animate-pulse')} />
    </button>
  );
};

export default SpeakerButton;

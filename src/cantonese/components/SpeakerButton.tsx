"use client";

import React, { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SpeakerButtonProps {
  /** Text to speak */
  text: string;
  /** Voice name (optional, for future use) */
  voice?: string;
  /** Optional custom class name */
  className?: string;
  /** Speech rate (default: 0.8 - slightly slower for learning) */
  rate?: number;
}

/**
 * Speaker Button Component for Cantonese
 * Uses Web Speech API for text-to-speech
 * Language: zh-HK (Hong Kong Cantonese)
 */
const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  voice,
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
      utterance.lang = 'zh-HK'; // Hong Kong Cantonese
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
  }, [text, rate, isSpeaking]);

  return (
    <button
      onClick={handleClick}
      aria-label="Nghe phát âm"
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 rounded-full',
        'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
        isSpeaking && 'bg-black/15 dark:bg-white/25',
        className
      )}
      title="Nghe phát âm (Quảng Đông)"
      disabled={isSpeaking}
    >
      <Volume2 className={cn('h-4 w-4 text-ink dark:text-cream', isSpeaking && 'animate-pulse')} />
    </button>
  );
};

export default SpeakerButton;

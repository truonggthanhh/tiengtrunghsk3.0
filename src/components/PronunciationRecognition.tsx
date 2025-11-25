import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PronunciationRecognitionProps {
  /** The word/phrase to practice */
  text: string;
  /** Expected pronunciation (pinyin for Mandarin, jyutping for Cantonese) */
  expectedPronunciation: string;
  /** Language for speech recognition */
  language: 'zh-CN' | 'zh-HK'; // zh-CN for Mandarin, zh-HK for Cantonese
  /** Callback when recognition completes */
  onResult?: (result: {
    recognized: string;
    confidence: number;
    isCorrect: boolean;
  }) => void;
  /** Optional pronunciation guide */
  showPronunciation?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Pronunciation Recognition Component
 * Uses Web Speech API to recognize and score user pronunciation
 * Works for both Mandarin and Cantonese
 */
const PronunciationRecognition: React.FC<PronunciationRecognitionProps> = ({
  text,
  expectedPronunciation,
  language,
  onResult,
  showPronunciation = true,
  className
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if Speech Recognition is supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast.error('Trình duyệt không hỗ trợ nhận dạng giọng nói', {
        description: 'Vui lòng sử dụng Chrome hoặc Edge'
      });
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const confidenceScore = event.results[0][0].confidence * 100;

      setRecognizedText(transcript);
      setConfidence(confidenceScore);

      // Check if pronunciation matches
      const isCorrect = checkPronunciation(transcript, text);
      setResult(isCorrect ? 'correct' : 'incorrect');

      // Callback
      if (onResult) {
        onResult({
          recognized: transcript,
          confidence: confidenceScore,
          isCorrect
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'no-speech') {
        toast.error('Không nhận được âm thanh', {
          description: 'Vui lòng thử lại và nói to hơn'
        });
      } else if (event.error === 'audio-capture') {
        toast.error('Không thể truy cập microphone', {
          description: 'Vui lòng cho phép truy cập microphone'
        });
      } else {
        toast.error('Lỗi nhận dạng giọng nói', {
          description: event.error
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, text, onResult]);

  /**
   * Check if recognized text matches expected pronunciation
   * This is a basic implementation - can be improved with fuzzy matching
   */
  const checkPronunciation = (recognized: string, expected: string): boolean => {
    // Normalize both strings (remove spaces, punctuation, lowercase)
    const normalizeText = (str: string) =>
      str.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

    const normalizedRecognized = normalizeText(recognized);
    const normalizedExpected = normalizeText(expected);

    // Check if they match
    return normalizedRecognized === normalizedExpected;
  };

  /**
   * Start listening to user's pronunciation
   */
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;

    // Reset state
    setRecognizedText('');
    setConfidence(0);
    setResult(null);

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      toast.error('Không thể bắt đầu nhận dạng', {
        description: 'Vui lòng thử lại'
      });
    }
  }, [isSupported]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  /**
   * Play pronunciation using Text-to-Speech
   */
  const playPronunciation = useCallback(() => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8; // Slightly slower for learning
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Không thể phát âm', {
          description: 'Vui lòng thử lại'
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Trình duyệt không hỗ trợ Text-to-Speech');
    }
  }, [text, language]);

  if (!isSupported) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            <p>Tính năng nhận dạng giọng nói không được hỗ trợ trên trình duyệt này</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6 space-y-4">
        {/* Text to pronounce */}
        <div className="text-center space-y-2">
          <h3 className="text-4xl font-bold text-primary">{text}</h3>
          {showPronunciation && (
            <p className="text-lg text-muted-foreground">{expectedPronunciation}</p>
          )}
        </div>

        {/* Microphone button */}
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            variant={isListening ? 'destructive' : 'default'}
            onClick={isListening ? stopListening : startListening}
            className={cn(
              'h-16 w-16 rounded-full',
              isListening && 'animate-pulse'
            )}
            disabled={!isSupported}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={playPronunciation}
            disabled={isSpeaking}
            className="h-16 w-16 rounded-full"
            aria-label="Nghe phát âm"
          >
            <Volume2 className={cn('h-6 w-6', isSpeaking && 'animate-pulse')} />
          </Button>
        </div>

        {/* Instruction */}
        <p className="text-center text-sm text-muted-foreground">
          {isListening
            ? 'Đang nghe... Hãy đọc to từ trên'
            : 'Nhấn microphone và đọc to'}
        </p>

        {/* Results */}
        {recognizedText && (
          <div className="space-y-3 pt-4 border-t">
            {/* Recognized text */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Đã nhận dạng:</span>
              <span className="text-lg font-semibold">{recognizedText}</span>
            </div>

            {/* Confidence score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Độ chính xác:</span>
                <span className="font-semibold">{confidence.toFixed(1)}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>

            {/* Result indicator */}
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg',
              result === 'correct' && 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
              result === 'incorrect' && 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
            )}>
              {result === 'correct' ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Tuyệt vời! Phát âm chính xác! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Hãy thử lại! Nghe kỹ và luyện tập thêm.</span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PronunciationRecognition;

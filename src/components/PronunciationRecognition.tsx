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

  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Calculate Levenshtein distance between two strings
   * Used for pronunciation similarity scoring
   */
  const levenshteinDistance = useCallback((str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Calculate distances
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }, []);

  /**
   * Calculate pronunciation score based on string similarity
   * Returns a score from 0-100 based on how similar the recognized text is to expected
   */
  const calculatePronunciationScore = useCallback((recognized: string, expected: string): number => {
    // Normalize both strings
    const normalizeText = (str: string) =>
      str.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();

    const normalizedRecognized = normalizeText(recognized);
    const normalizedExpected = normalizeText(expected);

    // If exact match, return 100%
    if (normalizedRecognized === normalizedExpected) {
      return 100;
    }

    // If completely empty, return 0%
    if (!normalizedRecognized) {
      return 0;
    }

    // Calculate similarity using Levenshtein distance
    const distance = levenshteinDistance(normalizedRecognized, normalizedExpected);
    const maxLength = Math.max(normalizedRecognized.length, normalizedExpected.length);

    // Convert distance to similarity percentage
    // Similarity = (1 - distance/maxLength) * 100
    const similarity = ((maxLength - distance) / maxLength) * 100;

    // Apply bonus for getting characters in right positions
    let positionBonus = 0;
    const minLen = Math.min(normalizedRecognized.length, normalizedExpected.length);
    for (let i = 0; i < minLen; i++) {
      if (normalizedRecognized[i] === normalizedExpected[i]) {
        positionBonus += 5; // 5% bonus per correct position
      }
    }

    // Calculate final score (weighted average)
    let finalScore = similarity * 0.7 + Math.min(positionBonus, 30) * 0.3;

    // Ensure score is between 0 and 100
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Round to 1 decimal place
    return Math.round(finalScore * 10) / 10;
  }, [levenshteinDistance]);

  // Check if Speech Recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast.error('Trình duyệt không hỗ trợ nhận dạng giọng nói', {
        description: '⚠️ Vui lòng sử dụng Chrome hoặc Edge. Firefox/Safari không hỗ trợ đầy đủ.',
        duration: 10000
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

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      // Calculate pronunciation score based on similarity
      const pronunciationScore = calculatePronunciationScore(transcript, text);

      setRecognizedText(transcript);
      setConfidence(pronunciationScore); // Use pronunciation score instead of API confidence

      // Check if pronunciation is correct (>= 80%)
      const isCorrect = pronunciationScore >= 80;
      setResult(isCorrect ? 'correct' : 'incorrect');

      // Callback
      if (onResultRef.current) {
        onResultRef.current({
          recognized: transcript,
          confidence: pronunciationScore, // Return pronunciation score
          isCorrect
        });
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      // Provide detailed error messages based on error type
      switch (event.error) {
        case 'no-speech':
          toast.error('Không nhận được âm thanh', {
            description: '🎤 Vui lòng thử lại và nói to hơn. Đảm bảo microphone hoạt động tốt.'
          });
          break;
        case 'audio-capture':
          toast.error('Không thể truy cập microphone', {
            description: '⚠️ Vui lòng cho phép truy cập microphone trong cài đặt trình duyệt'
          });
          break;
        case 'not-allowed':
          toast.error('Quyền microphone bị từ chối', {
            description: '🔒 Vui lòng cấp quyền microphone cho trang web này'
          });
          break;
        case 'network':
          toast.error('Lỗi kết nối mạng', {
            description: '🌐 Kiểm tra kết nối internet của bạn và thử lại'
          });
          break;
        case 'aborted':
          toast.info('Đã dừng nhận dạng', {
            description: 'Bạn có thể thử lại bất cứ lúc nào'
          });
          break;
        case 'service-not-allowed':
          toast.error('Dịch vụ nhận dạng không khả dụng', {
            description: '❌ Trình duyệt không hỗ trợ hoặc dịch vụ bị chặn. Thử Chrome/Edge.'
          });
          break;
        default:
          toast.error('Lỗi nhận dạng giọng nói', {
            description: `⚠️ ${event.error || 'Lỗi không xác định'}. Vui lòng thử lại hoặc reload trang.`
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
  }, [language, text, calculatePronunciationScore]);

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
      <Card className={cn('w-full border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950', className)}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-300">
              <AlertCircle className="h-6 w-6" />
              <p className="font-semibold text-lg">Trình duyệt không hỗ trợ nhận dạng giọng nói</p>
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400 space-y-2">
              <p>📱 <strong>Trình duyệt được hỗ trợ:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>✅ Google Chrome (Desktop & Mobile)</li>
                <li>✅ Microsoft Edge (Desktop & Mobile)</li>
                <li>⚠️ Safari (iOS/macOS - hỗ trợ hạn chế)</li>
                <li>❌ Firefox (chưa hỗ trợ Web Speech API)</li>
              </ul>
              <p className="mt-3">💡 <strong>Khuyến nghị:</strong> Sử dụng Chrome hoặc Edge để có trải nghiệm tốt nhất!</p>
            </div>
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

            {/* Pronunciation score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Điểm phát âm:</span>
                <span className="font-semibold">{confidence.toFixed(1)}%</span>
              </div>
              <Progress value={confidence} className={cn(
                "h-2",
                confidence >= 80 && "bg-green-100 [&>div]:bg-green-600",
                confidence >= 60 && confidence < 80 && "bg-yellow-100 [&>div]:bg-yellow-600",
                confidence < 60 && "bg-red-100 [&>div]:bg-red-600"
              )} />
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

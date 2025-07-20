import React, { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { toast } from 'sonner';

interface HanziWriterWrapperProps {
  character: string;
  writerRef: React.MutableRefObject<HanziWriter | null>;
  onWriterLoaded: () => void;
  onWriterError: (errorMsg: string) => void;
}

const HanziWriterWrapper: React.FC<HanziWriterWrapperProps> = ({ character, writerRef, onWriterLoaded, onWriterError }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear previous instance
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
    writerRef.current = null;

    if (character && containerRef.current) {
      const writer = HanziWriter.create(containerRef.current, character, {
        width: 250,
        height: 250,
        padding: 5,
        showCharacter: false,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 500,
        showOutline: true,
        highlightOnComplete: true,
        // By removing charDataLoader, HanziWriter will use its default CDN fetching
        onLoadError: (err) => {
            console.error('HanziWriter load error:', err);
            const errorMessage = `Không thể tải dữ liệu cho chữ "${character}". Chữ này có thể không được hỗ trợ hoặc có lỗi mạng.`;
            toast.error("Lỗi tải dữ liệu", { description: errorMessage });
            onWriterError(errorMessage);
        }
      });

      writerRef.current = writer;

      writer.showCharacter().then(() => {
        onWriterLoaded();
        writer.animateCharacter();
      }).catch((err) => {
        // Error is already handled by onLoadError, but this is a fallback
        console.error('HanziWriter showCharacter error:', err);
        const errorMessage = `Lỗi hiển thị chữ "${character}".`;
        toast.error("Lỗi hiển thị", { description: errorMessage });
        onWriterError(errorMessage);
      });
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      writerRef.current = null;
    };
  }, [character, writerRef, onWriterLoaded, onWriterError]);

  return <div ref={containerRef} id="hanzi-writer-wrapper-container" />;
};

export default HanziWriterWrapper;
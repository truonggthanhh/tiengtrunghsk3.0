"use client";

import React, { useRef, useState } from "react";
import { Volume2, Loader2 } from "lucide-react"; // Import Loader2 for loading state
import { toast } from "sonner"; // For user feedback

type Props = { text: string; voice?: string; className?: string };

export default function SpeakerButton({ text, voice, className }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha (ví dụ: flashcard)
    if (loading) return; // Prevent multiple clicks while loading

    try {
      setLoading(true);
      const params = new URLSearchParams({ text, ...(voice ? { voice } : {}) });
      
      // Call the Supabase Edge Function
      const response = await fetch(`https://jhjpgdldjunkhdbtopbs.supabase.co/functions/v1/get-tts-audio?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Lỗi khi lấy âm thanh TTS.");
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = data.url;
      await audioRef.current.play();
      if (!data.cached) {
        toast.info("Đã tạo âm thanh mới!");
      }
    } catch (e: any) {
      console.error("Lỗi phát âm thanh:", e);
      toast.error(`Không phát được âm thanh: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Nghe phát âm"
      className={className || "inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"}
      disabled={loading}
      title="Nghe phát âm (Quảng Đông)"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-ink dark:text-cream" />
      ) : (
        <Volume2 className="h-4 w-4 text-ink dark:text-cream" />
      )}
    </button>
  );
}
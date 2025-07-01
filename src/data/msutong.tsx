import React from "react";
import { BookOpen, CheckSquare, Shuffle, FileQuestion, Mic, Puzzle, AudioLines, Bot } from "lucide-react";

export const exerciseTypes = [
  {
    slug: "flashcard",
    title: "Flashcard",
    description: "Ôn tập từ vựng qua thẻ ghi nhớ",
    icon: <BookOpen />,
    isAvailable: true,
  },
  {
    slug: "pinyin-choice",
    title: "Chọn phiên âm",
    description: "Chọn pinyin đúng cho chữ Hán",
    icon: <Mic />,
    isAvailable: true,
  },
  // Add other exercise types here as they are built
  // For now, let's keep them simple
];
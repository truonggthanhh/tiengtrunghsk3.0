import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import FlashcardPage from "./pages/FlashcardPage";
import PinyinChoicePage from "./pages/PinyinChoicePage";
import MeaningChoicePage from "./pages/MeaningChoicePage";
import FillInTheBlankPage from "./pages/FillInTheBlankPage";
import SentenceChoicePage from "./pages/SentenceChoicePage";
import SentenceScramblePage from "./pages/SentenceScramblePage";
import PronunciationPage from "./pages/PronunciationPage";
import AiTutorPage from "./pages/AiTutorPage";
import MsutongPage from "./pages/MsutongPage";
import MsutongFlashcardPage from "./pages/msutong/MsutongFlashcardPage";
import MsutongPinyinChoicePage from "./pages/msutong/MsutongPinyinChoicePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* HSK Routes */}
            <Route path="/hsk/:level/flashcard" element={<FlashcardPage />} />
            <Route path="/hsk/:level/pinyin-choice" element={<PinyinChoicePage />} />
            <Route path="/hsk/:level/meaning-choice" element={<MeaningChoicePage />} />
            <Route path="/hsk/:level/fill-in-the-blank" element={<FillInTheBlankPage />} />
            <Route path="/hsk/:level/sentence-choice" element={<SentenceChoicePage />} />
            <Route path="/hsk/:level/sentence-scramble" element={<SentenceScramblePage />} />
            <Route path="/hsk/:level/pronunciation" element={<PronunciationPage />} />
            <Route path="/hsk/:level/ai-tutor" element={<AiTutorPage />} />

            {/* Msutong Routes */}
            <Route path="/msutong" element={<MsutongPage />} />
            <Route path="/msutong/:book/:lesson/flashcard" element={<MsutongFlashcardPage />} />
            <Route path="/msutong/:book/:lesson/pinyin-choice" element={<MsutongPinyinChoicePage />} />
            {/* Add other Msutong exercise routes here as they are created */}

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;